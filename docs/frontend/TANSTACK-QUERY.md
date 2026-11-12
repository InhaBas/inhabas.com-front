# TanStack Query 컨벤션

이 문서는 서버 데이터를 가져오고 바꾸는 코드가 따를 규칙을 정리한다. `useFetch`에서 TanStack Query로 전환하는 동안뿐 아니라 전환이 끝난 뒤에 짜는 새 코드도 이 규칙을 따른다.

> 📚 **관련 문서**: [마이그레이션 계획](./MIGRATION.md) (4번 항목: 후속 작업과 미확인 QA) | [ESLint + Prettier](./PRETTIER.md)

규칙마다 "왜"를 한두 줄로 붙였다. 규칙을 바꾸고 싶다면 먼저 그 이유가 아직 유효한지 확인한다.

---

## 한눈에 보기

```
src/
├── api/                    # HTTP만 안다. 쿼리·React·Recoil을 모른다
│   ├── client.ts           # request<T>(), ApiError
│   ├── token.ts            # access 토큰·failRefreshing 모듈 저장소
│   ├── auth.ts             # POST /token/refresh 등
│   ├── board.ts            # 백엔드 리소스(URL 접두사) 하나당 파일 하나
│   └── ...
└── queries/                # 캐시를 안다
    ├── queryClient.ts      # QueryClient 싱글턴, 전역 기본값, 전역 onError 연결
    ├── apiErrorEffects.ts  # handleApiError, refresh 흐름, navigate 등록
    ├── keepPreviousPage.ts # 페이지네이션 placeholder 헬퍼
    ├── board.ts            # boardQueries, boardMutations (src/api/board.ts와 1:1)
    └── ...
```

| 하고 싶은 것               | 쓰는 것                                                                |
| -------------------------- | ---------------------------------------------------------------------- |
| 조회                       | `useQuery(boardQueries.detail({ id }))`                                |
| 변경                       | `useMutation(boardMutations.update())` → `mutate(vars, { onSuccess })` |
| 변경 뒤 목록 갱신          | 뮤테이션 팩토리의 `onSuccess`에서 `invalidateQueries`                  |
| 에러 alert·이동·토큰 갱신  | 아무것도 하지 않는다. 공통 `handleApiError`가 맡는다                   |
| 첫 로딩 표시               | `if (!data) return <Loading />`                                        |
| 뮤테이션 중 중복 클릭 막기 | 트리거를 `mutation.isPending` 동안 disable                             |

---

## 1. API 레이어 (`src/api`)

### 1.1 fetch 래퍼

모든 요청은 `src/api/client.ts`의 `request<T>(path, { method = 'GET', auth = false, body })`를 거친다. axios는 쓰지 않는다.

- **본문**: `body instanceof FormData`면 그대로 보내고 `Content-Type`을 생략한다(multipart). 그 밖에는 `JSON.stringify`한다. 별도 `media` 플래그는 없다.
- **헤더**: `auth: false`면 JSON `Content-Type`만 붙인다. `auth: true`면 `Authorization: Bearer <토큰 저장소 값>`과 (FormData가 아니면) JSON `Content-Type`을 붙인다.
- **빈 본문 성공**: `status === 204 || content-length === '0' || body === null`이면 `null`을 반환한다. 반환 타입은 `Promise<null>`이다. `undefined`는 쓰지 않는다.
  - 왜: `queryFn`이 `undefined`를 반환하면 TanStack Query v5가 에러로 취급한다. 수정·삭제(204), 생성(201 빈 본문), `POST /signUp/answers`(200 빈 본문)가 여기에 해당한다. 201의 `Location` 헤더는 CORS 때문에 읽을 수 없으므로 노출하지 않는다.
- **응답 모양**: 응답을 그대로 반환한다. `{ ...result }`로 펼치지 않는다.
- **실패**: non-2xx면 본문을 `try`로 파싱해 `ApiError`를 던진다.

  ```ts
  class ApiError extends Error {
    httpStatus: number;
    body: { status?: number; code?: string; message?: string } | null; // 파싱 실패면 null
    auth: boolean; // 요청에 토큰을 실었는지
    path: string; // 쿼리스트링을 뺀 경로. 에러 분기에 쓴다
  }
  ```

  네트워크 오류는 감싸지 않고 원래 에러를 그대로 던진다.

- **부수효과 없음**: 래퍼와 엔드포인트 함수는 alert, navigate, refresh, 토큰 쓰기를 하지 않는다.
  - 왜: 부수효과가 한 곳(`handleApiError`)에만 있어야 화면마다 에러 경로를 QA하지 않아도 된다.

### 1.2 토큰 저장소

`src/api/token.ts`에 `getAccessToken / setAccessToken / subscribe`가 있고, 래퍼와 refresh 흐름은 이 저장소만 읽고 쓴다. `failRefreshing`도 같은 모양의 저장소를 갖는다.

- Recoil atom `tokenAccess`·`failRefreshing`은 atom `effects`로 저장소와 **양방향 동기화**한다(`onSet` → 저장소, 저장소 변경 → `setSelf`). 그래서 atom을 읽는 컴포넌트는 바뀌지 않는다.
  - 왜: `queryFn`과 refresh 흐름은 React 밖에서 돌아 atom을 직접 읽을 수 없다.
- 센티널 값 `'default'`(비로그인), `'signing'`(가입 중)은 그대로 쓴다.
- **토큰은 queryKey에 넣지 않는다.** 넣으면 토큰이 바뀔 때마다 모든 쿼리가 자동으로 다시 요청된다. 토큰 갱신 뒤 재요청은 5.2의 "실패한 쿼리만 다시 가져오기"가 맡는다.

### 1.3 엔드포인트 함수

- **파일 단위**: 백엔드 리소스(URL 접두사) 하나에 파일 하나다(`board.ts`, `comment.ts`, `budget.ts`, `member.ts`, `myInfo.ts`, `signUp.ts`, `scholarship.ts`, `policy.ts`, `auth.ts` …). 호출하는 화면 기준으로 나누지 않는다.
  - 왜: 같은 엔드포인트를 여러 화면이 부르는 경우가 많다(`/myInfo`, `/signUp/check`, `/signUp/schedule`, 각 상세의 조회·수정 화면 등).
- **함수 하나 = 엔드포인트 하나**. 이름은 `get/create/update/delete + 명사`다. URL 문자열은 `src/api` 밖으로 나가지 않는다.
- **`auth`는 함수 안에 고정한다.** 게시판처럼 게시판 종류(라우트)에 따라 토큰 사용이 달라지는 조회만 함수 인자로 `auth`를 받는다.
- **라우트 → API 경로 계산은 한 곳에 둔다.** 게시판 종류에서 API 기본 경로를 고르는 로직은 `board.ts`의 함수 하나에 둔다.
- **page 변환**: 화면과 queryKey의 page는 1부터 센다. 백엔드는 0부터 세므로 엔드포인트 함수에서 `page - 1`로 한 번만 바꾼다.
- **타입**: 반환 타입을 구체적으로 적는다. `src/api` 안에서는 `any`를 쓰지 않는다. 타입은 백엔드 DTO를 확인해 `src/types`의 도메인 파일에 두고, 맞는 타입이 있으면 재사용한다. zod 같은 런타임 검증은 넣지 않는다.

```ts
// src/api/comment.ts
export const getCommentList = ({ menuId, boardId }: CommentListParams, auth: boolean) =>
  request<Comment[]>(`/board/${menuId}/${boardId}/comments`, { auth });

export const deleteComment = (id: number) =>
  request<null>(`/comment/${id}`, { method: 'DELETE', auth: true });
```

---

## 2. 쿼리 정의 (`src/queries`)

### 2.1 파일과 객체

- `src/queries/<리소스>.ts`에 둔다. `src/api/<리소스>.ts`와 1:1이다.
  - 왜: feature 코드가 `components/containers/pages`로 흩어져 있고 공유 엔드포인트가 많아서, 백엔드 리소스 기준으로 한 곳에 모은다. `src/features` 구조는 도입하지 않는다.
- 리소스마다 조회용 `xxxQueries` 객체 하나와 변경용 `xxxMutations` 객체 하나를 둔다(3절). 키 팩토리와 옵션 팩토리를 별도 객체로 나누지 않는다. 키 팩토리 라이브러리(`@lukemorales/query-key-factory` 등)는 쓰지 않는다.

### 2.2 키와 `queryOptions`

```ts
// src/queries/board.ts
export const boardQueries = {
  // 부분 무효화용 상위 키: as const 배열
  all: () => ['boards'] as const,
  lists: () => [...boardQueries.all(), 'list'] as const,
  details: () => [...boardQueries.all(), 'detail'] as const,

  // 실제 조회: queryOptions
  list: (params: BoardListParams) =>
    queryOptions({
      queryKey: [...boardQueries.lists(), params],
      queryFn: () => getBoardList(params),
      // 페이지를 넘기는 동안 이전 목록을 보여 주던 useFetch 동작을 보존한다 (6절)
      placeholderData: keepPreviousPage(params),
    }),
  detail: (params: BoardDetailParams) =>
    queryOptions({
      queryKey: [...boardQueries.details(), params],
      queryFn: () => getBoard(params),
    }),
};
```

- 키의 첫 요소는 리소스 이름 문자열이다. 계층은 `all → lists / details → list(params) / detail(params)`다.
- 파라미터는 **객체 하나**로 키 마지막에 넣는다. 목록이면 `{ page, size, ...필터 }`다(6절의 `keepPreviousPage`가 이 규약에 기댄다).
- 왜: 계층형 키여야 "게시판 목록 전부"처럼 좁은 범위로 무효화할 수 있다. `queryOptions`를 쓰면 key와 fn이 한 곳에서 타입으로 묶여, `useQuery`·`invalidateQueries`·`getQueryData`가 같은 정의를 공유한다.

### 2.3 옵션을 어디에 둘까

| 옵션                                                                       | 위치                                                              |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 전역 동작(`retry`, 재요청, `gcTime` 등)                                    | `queryClient.ts`의 `defaultOptions` (8절). 쿼리별로 바꾸지 않는다 |
| 데이터 자체의 성질(`staleTime` 등)                                         | `queryOptions` 팩토리 안                                          |
| 화면마다 다른 것(`enabled`, `select`, `placeholderData`, `refetchOnMount`) | 호출 쪽에서 펼쳐서 덮어쓴다                                       |

```tsx
const { data } = useQuery({ ...myInfoQueries.detail(), enabled: signupChecked });
```

- `setQueryDefaults`는 쓰지 않는다. 동작이 키 등록 순서에 숨기 때문이다.
- **재정의는 현재 동작을 보존하는 데 필요할 때만** 하고, 어떤 동작을 보존하는지 **이유 주석을 반드시 단다**. 요청을 줄이려는 `staleTime` 조정 같은 최적화는 하지 않는다(과도기 기본값을 풀 때 함께 검토한다).

### 2.4 사용 방식

- 컴포넌트에서 `useQuery(xxxQueries.…())`를 **직접** 호출한다. `useBoardDetailQuery` 같은 얇은 래퍼 훅은 만들지 않는다.
  - 왜: `queryOptions`가 이미 재사용 단위다. 래퍼 훅은 옵션 덮어쓰기와 `useQueries`·`prefetch` 재사용을 막는다.
- 여러 쿼리의 조합, 반복되는 `select`, 특수값 변환처럼 **공유할 로직이 있을 때만** `src/queries/<리소스>.ts` 안에 `use…` 훅을 둔다. 예: `useMyRole()`(4.2).

### 2.5 조회하지 않고 캐시만 구독하기

부모가 이미 조회한 데이터를 자식이 쓰는 경우, 자식이 같은 쿼리를 `useQuery`로 부르면 **요청이 하나 더 나간다**(`refetchOnMount: true`, `staleTime: 0`).

1. 부모-자식 관계면 **props로 넘긴다**.
2. props로 잇기 어려우면 같은 `queryOptions`로 `useQuery`를 부르되 `refetchOnMount: false`로 덮어쓰고 이유 주석을 단다.

```tsx
// HeaderNav가 조회한 /myInfo를 구독만 한다. 여기서 다시 요청하지 않던 동작을 보존한다
const { data } = useQuery({ ...myInfoQueries.detail(), refetchOnMount: false });
```

### 2.6 실패를 알리지 않는 조회

에러 alert를 띄우지 않고 조용히 무시해야 하는 조회(예: 메인의 모집 일정 공지)는 `queryFn` 안에서 에러를 잡아 `null`을 반환한다. 쿼리가 에러 상태가 되지 않으므로 `handleApiError`가 불리지 않는다. `meta`로 전역 처리를 끄는 방식은 쓰지 않는다. 같은 엔드포인트의 일반 조회와 캐시를 나누도록 키 끝에 용도(`'notice'` 등)를 붙이고, 이유 주석을 단다.

---

## 3. 뮤테이션과 무효화

### 3.1 `xxxMutations`

```ts
// src/queries/comment.ts
export const commentMutations = {
  delete: () =>
    mutationOptions({
      mutationFn: ({ id }: { id: number; boardId: number; menuId: number }) => deleteComment(id),
      onSuccess: (_data, { menuId, boardId }) => {
        // Promise를 반환하지 않는다 (3.3)
        queryClient.invalidateQueries({
          queryKey: commentQueries.list({ menuId, boardId }).queryKey,
        });
      },
    }),
};
```

- `src/queries/<리소스>.ts`에 `xxxQueries`와 짝을 이루는 `xxxMutations`를 두고, 그 안에 `mutationOptions` 팩토리를 둔다.
- 무효화는 팩토리의 `onSuccess`에서 `src/queries/queryClient.ts` 싱글턴으로 한다.
- 컴포넌트는 `useMutation(xxxMutations.delete())`로 부른다. 래퍼 훅은 만들지 않는다.
- `MutationCache.onSuccess` + `meta.invalidates` 같은 전역 무효화는 쓰지 않는다. 무효화 대상이 뮤테이션 정의에 보여야 한다. 전역 캐시 콜백은 에러 처리(5절) 전용이다.

### 3.2 무엇을 무효화할까

- **변경 결과를 보여 주는 쿼리만, 그 쿼리를 덮는 가장 좁은 키로** 무효화한다. 예: 댓글 삭제 → `commentQueries.list({ menuId, boardId })`, 회칙 수정 → 회칙 조회 전부.
- 리소스를 넘는 관계도 그 뮤테이션의 `onSuccess`에 적는다. 예: 신입 회원 승인 → 재학생 목록, 졸업 처리 ↔ 재학생·졸업생 목록.
- 리소스 전체(`all`)를 습관적으로 무효화하지 않는다. 한 화면에 같은 리소스 쿼리가 여럿 떠 있으면 요청이 늘어난다.
- **`invalidateQueries`만 쓴다.** `setQueryData`·낙관적 업데이트는 과도기 기본값을 풀 때까지 쓰지 않는다.
  - 왜: `gcTime: 0`이라 관찰자 없는 쿼리에 넣은 데이터는 곧바로 사라지고, 엔드포인트마다 응답 모양을 맞추는 비용이 크다.

### 3.3 UI 부수효과는 `mutate` 쪽에

```tsx
const deleteMutation = useMutation(commentMutations.delete());

const handleDelete = (id: number) => {
  if (deleteMutation.isPending) return;
  deleteMutation.mutate(
    { id, menuId, boardId },
    {
      onSuccess: () => {
        alert('댓글이 삭제되었습니다.');
      },
    },
  );
};
```

- alert, 모달 닫기, navigate, `setPage(1)` 같은 UI 부수효과는 **호출 쪽 `mutate(vars, { onSuccess })`**에 둔다.
- 팩토리의 `onSuccess`는 무효화 Promise를 **반환하지 않는다.** 반환하면 재조회가 끝날 때까지 호출 쪽 콜백이 늦게 불려 alert가 늦게 뜬다. 반환하지 않으면 "성공 → alert → 재조회 반영" 순서가 된다.
- **뮤테이션은 펼쳐서 덮어쓰지 않는다.** `useMutation({ ...xxxMutations.update(), onSuccess })`는 금지다. 팩토리의 `onSuccess`(무효화)가 사라진다.
  - 조회(2.3)는 펼쳐서 덮어쓰는 것이 기본이고, 뮤테이션은 반대다. 헷갈리기 쉬우니 리뷰에서 확인한다.
- 이동·재조회는 **성공한 뒤**에만 한다. 결과를 기다리지 않고 이동하거나 reload하지 않는다.
- 연속 성공도 `onSuccess`가 매번 불린다. 204 응답을 감지하려고 값을 바꾸는 우회는 필요 없다.

---

## 4. 서버 상태와 Recoil

### 4.1 서버 데이터는 atom에 넣지 않는다

- 쿼리 결과를 `useEffect(..., [data])`로 atom에 복사하지 않는다. 서버 데이터는 쿼리 캐시에만 있다.
  - 왜: 복사하면 캐시와 atom 두 곳이 진실이 되어 무효화가 atom까지 닿지 않는다.
- **예외: 폼 초기값.** 사용자가 편집할 값(`selectedFile`, `fileIdList`, 로컬 폼 state)에 상세 조회 결과를 초기값으로 복사하는 것은 허용한다. 이것은 "서버 상태 복사"가 아니라 편집을 시작하는 시점의 스냅샷이다.
- 공통 파일 업로드 컴포넌트(DragNDrop)의 기존 파일 미리보기는 `initialFiles` prop으로 받아 마운트할 때 그린다.

### 4.2 남는 atom

| 종류            | atom                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 클라이언트 인증 | `tokenAccess`, `failRefreshing`, `userEmail`, `userImage`                                                                              |
| UI·폼           | `menuId`(경로에서 계산), `contestOrder`(queryKey에 넣는 필터), `selectedFile`, `fileIdList`, 체크박스·모달·캐러셀 atom, `lectureRoom*` |
| 신호            | `relogin`(가입 완료 뒤 reload)                                                                                                         |
| 제목 덮어쓰기   | `headerTitleInfo` — 페이지가 직접 정한 제목만 담는다. HeaderTitle은 이 값이 있으면 쓰고, 없으면 메뉴 상세 쿼리 값을 쓴다               |

**role**은 atom이 아니라 `useMyRole()`로 얻는다. `/signUp/check` → `/myInfo` 쿼리 조합(`enabled`)에서 role을 꺼내며, 특수값을 그대로 돌려준다.

| 상태               | 반환값                                               |
| ------------------ | ---------------------------------------------------- |
| 아직 불러오지 않음 | `''` (라우트 가드는 `role !== ''`일 때까지 기다린다) |
| 로그아웃한 뒤      | `'logout'`                                           |
| 그 밖              | 서버 role                                            |

로그아웃하면 `/myInfo` 쿼리를 `removeQueries`한다.

---

## 5. 인증·에러 처리

### 5.1 한 곳에서 처리한다

`src/queries/queryClient.ts`에서 `QueryCache`와 `MutationCache`의 `onError`에 공통 `handleApiError(error)`를 연결한다. **호출 지점에서는 에러를 처리하지 않는다.** 쿼리별 `meta`로 에러 동작을 바꾸지도 않는다.

분기 기준은 본문의 `status`다(백엔드에서 HTTP 상태와 항상 같다).

| 조건                                      | 동작                                                            |
| ----------------------------------------- | --------------------------------------------------------------- |
| `ApiError`가 아님(네트워크 오류 등)       | 아무것도 하지 않는다(`console.error`)                           |
| `body === null`(본문 파싱 실패)           | 아무것도 하지 않는다                                            |
| `auth` && code ∈ {`A005`, `A006`, `A007`} | 5.2의 refresh 흐름. alert 없음                                  |
| 그 밖                                     | alert `웹 팀에 문의해주세요. \n${code} : ${message}`            |
| └ `auth` && status 401                    | `navigate(-1)`                                                  |
| └ `auth` && status 403                    | `path === '/signUp'`이면 `navigate('/')`, 아니면 `navigate(-1)` |
| └ status 404 (`auth`와 무관)              | `navigate('/notfound')`                                         |

- 백엔드에서 실제로 오는 토큰 무효 코드는 `A005`·`A006`(401)이고, `A007`과 status 401 분기는 사실상 도달하지 않는다. 옛 `useFetch`와 똑같이 두었으며, 정리는 에러 UX 개선 때 한다.
- 권한 부족·비로그인은 대부분 403 `M002` 하나로 온다.
- `code`가 없는 Spring 기본 500 본문은 `undefined : undefined` alert가 뜬다. 옛 동작 그대로다.
- `QueryCache.onError`는 쿼리당 한 번 불리므로, 같은 쿼리를 여러 컴포넌트가 구독해도 alert는 한 번이다.

### 5.2 토큰 갱신(refresh)

비로그인 사용자도 `Bearer default`를 보낸다. 그래서 새로고침하면 `/signUp/check`가 A005를 받고, refresh 쿠키(`ibas_refresh`)로 새 토큰을 받아 로그인이 복원된다. **refresh는 사실상 페이지 로드 때 로그인을 복원하는 경로다.**

- **single-flight**: 진행 중인 refresh 프라미스를 모듈 변수에 두고, 동시에 들어온 A005/A006이 함께 기다린다.
- **성공**: 토큰 저장소에 새 토큰을 넣고, `invalidateQueries({ type: 'active', predicate })`로 **A005/A006으로 실패한 활성 쿼리만** 다시 가져온다. 이미 성공한 쿼리와 실패한 뮤테이션은 다시 보내지 않는다.
- **실패**(non-2xx, 파싱 실패, 네트워크 오류 모두): `failRefreshing = true`, 토큰 `'default'`. alert·navigate는 하지 않는다. 로그인 유도는 `App.tsx`의 `failRefreshing` effect가 맡는다.
- refresh 요청 함수(`POST /token/refresh`, 본문 `{ refreshToken }`)는 `src/api/auth.ts`에, 흐름은 `src/queries/apiErrorEffects.ts`에 둔다.
- 컴포넌트 effect에 `access`를 의존성으로 넣어 토큰이 바뀌면 다시 요청하는 패턴은 쓰지 않는다. 위의 "실패한 쿼리만 다시 가져오기"가 그 역할을 한다.
- 알려진 위험: 새 토큰으로도 A005가 오면 refresh → 무효화가 반복될 수 있다. 백엔드상 일어나기 어려워 막지 않는다.

### 5.3 라우터 밖에서 navigate

`<BrowserRouter>` 안에 렌더링하지 않는 `NavigationBridge` 컴포넌트를 두고, `useNavigate()` 결과를 `apiErrorEffects.ts`의 모듈 변수에 등록한다. 등록 전이면 이동을 건너뛴다. 데이터 라우터(`createBrowserRouter`)로 바꾸지 않는다. `QueryClientProvider`와 `NavigationBridge`는 앱 최상단에 함께 둔다.

---

## 6. 페이지네이션

- **page의 주인은 부모 컴포넌트의 `useState(1)`이다.** URL 검색 파라미터에 넣지 않는다. 새로고침·뒤로가기하면 1페이지로 돌아가고, 페이지를 넘겨도 히스토리가 쌓이지 않는다.
- **`Pagination`은 조회를 모르는 순수 UI다.** props는 `currentPage`, `totalPage`, `onPageChange` 세 개다.
- `totalPage`는 쿼리 결과의 `pageInfo.totalPages`에서 바로 읽는다. atom이나 로컬 state에 담지 않는다.
- 목록 queryKey의 마지막 요소는 `{ page, size, ...필터 }`다. 예: `['boards', 'list', { board, page, size, search }]`. 목록마다 size는 고정값 하나다.
- **page만 바뀔 때만 이전 목록을 유지한다.** 목록 `queryOptions`에 `placeholderData: keepPreviousPage(params)`를 이유 주석과 함께 지정한다.

  ```ts
  // src/queries/keepPreviousPage.ts (모양)
  // v5 placeholderData(prev, prevQuery)의 두 번째 인자로 이전 queryKey를 받아,
  // page를 뺀 파라미터가 지금 파라미터와 같을 때만 이전 데이터를 placeholder로 쓴다
  export const keepPreviousPage =
    <P extends { page: number }>(params: P) =>
    <T>(prev: T | undefined, prevQuery?: { queryKey: readonly unknown[] }) => {
      if (!prevQuery) return undefined;
      const prevParams = prevQuery.queryKey[prevQuery.queryKey.length - 1] as P;
      return isSameExceptPage(prevParams, params) ? prev : undefined;
    };
  ```

  게시판·정렬·필터·검색어가 바뀌면 pending이 되어 `<Loading />`이 보이고, 페이지만 넘기면 이전 목록과 이전 `totalPages`가 유지된다.
  - 왜: 공식 `keepPreviousData`를 쓰면 게시판을 바꿀 때 이전 게시판 목록이 잠깐 보인다. UX를 바꾸려면 이 한 줄만 교체하면 된다.

- **1페이지 복귀는 부모가 명시적으로 `setPage(1)`을 부른다.** page가 아닌 파라미터(게시판·정렬·연도·상태)가 바뀔 때, 검색을 실행할 때, 목록을 바꾸는 뮤테이션의 `mutate(..., { onSuccess })`에서 부른다. `totalPage` 변화를 감시하는 effect는 두지 않는다.
- **검색어는 queryKey 파라미터다.** 제출된 검색어를 부모 state로 두고, 검색 컴포넌트는 `onSearch(term)`만 부른다. 검색 결과를 atom으로 목록에 밀어 넣지 않는다. 페이지를 넘겨도 검색은 유지된다.

---

## 7. 로딩·에러 UI

- **첫 조회는 `data`가 없으면 `<Loading />`을 그린다.** 판정은 `isPending`이 아니라 `!data`다.

  ```tsx
  const { data } = useQuery(boardQueries.detail({ board, id }));
  if (!data) return <Loading />;
  // 여기부터 data는 좁혀져 있으므로 옵셔널 체이닝이 필요 없다
  ```

  - 에러가 나면 `data`가 없으므로 스피너가 계속 보인다. alert·이동은 `handleApiError`가 한다. **에러 화면은 따로 그리지 않는다.**
  - `isPending`으로 판정하면 에러일 때 `data === undefined`인 채로 본문이 그려진다.
  - 분기 아래에 hook이 있으면 early return 대신 JSX 삼항을 쓴다.
  - 원래 로딩 표시가 없던 화면에 스피너를 새로 넣지 않는다.

- **뮤테이션 중에는 본문을 가리지 않는다.** 콘텐츠는 그대로 두고, 트리거한 요소만 `mutation.isPending` 동안 막는다. 재조회가 끝나면 데이터가 조용히 바뀐다.
  - `<button>`(공통 `Button` 포함)은 `disabled={mutation.isPending}`. 공통 `Button`에는 `&:disabled` 스타일(`cursor: not-allowed`, `opacity: 0.5`, hover 배경 없음)이 있다.
  - `<button>`이 아닌 트리거는 핸들러 맨 앞에 `if (mutation.isPending) return;`를 두고, pending 동안 `$pointer`를 끈다. 마크업을 `<button>`으로 바꾸지는 않는다.
  - 버튼 안 스피너나 "처리 중" 문구는 넣지 않는다.
- **공통 로딩 컴포넌트나 헬퍼는 만들지 않는다.** 규칙이 한 줄이고, `<Loading />`을 감싸는 레이아웃이 화면마다 다르다.
- **Suspense·`useSuspenseQuery`·ErrorBoundary는 쓰지 않는다.** 에러를 throw해 에러 화면이 필요해지고, 여러 쿼리가 워터폴이 되며, `placeholderData`(`keepPreviousPage`)를 지원하지 않는다. 에러 UX 개선 때 함께 검토한다.

---

## 8. QueryClient 기본값과 해제 조건

`src/queries/queryClient.ts`의 모듈 싱글턴이다. refresh 흐름이 React 밖에서 `invalidateQueries`를 불러야 하므로 싱글턴으로 둔다.

아래 6개는 옛 `useFetch` 동작(재시도 없음, 포커스·재연결 시 재요청 없음, 매번 새로 요청, 오프라인에서도 요청, 응답마다 새 객체)을 보존하는 **과도기 값**이다. 전환 중에는 쿼리별로 바꾸지 않는다. 푸는 작업은 전환이 끝난 뒤 UX 개선으로 따로 하고, **각 값 옆 주석에 해제 조건을 적는다.**

| 옵션                                            | 과도기 값  | 풀어도 되는 조건                                                                                                |
| ----------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `queries.retry`                                 | `false`    | 에러 alert가 재시도만큼 늦게 뜨는 것을 받아들이는 UX 개선 작업에서                                              |
| `queries.refetchOnWindowFocus`                  | `false`    | 탭 복귀 시 재요청을 받아들이는 UX 개선 작업에서                                                                 |
| `queries.refetchOnReconnect`                    | `false`    | 재연결 시 재요청을 받아들이는 UX 개선 작업에서                                                                  |
| `queries.networkMode` / `mutations.networkMode` | `'always'` | 오프라인 UX(요청 보류·표시)를 정할 때                                                                           |
| `queries.gcTime`                                | `0`        | 재진입 시 캐시된 이전 데이터를 먼저 보여 주는 것을 UX로 받아들일 때. `setQueryData`·낙관적 업데이트도 이때 검토 |
| `queries.structuralSharing`                     | `false`    | 폼 초기값 effect(4.1)가 데이터가 다시 들어와도 편집 중인 폼을 덮어쓰지 않도록 가드되어 있을 때                  |

- `staleTime: 0`, `refetchOnMount: true`, `throwOnError: false`, 뮤테이션 `retry: 0`은 라이브러리 기본값이 곧 옛 동작이라 적지 않는다.
- `retry: false`여도 새로고침 직후의 인증 쿼리는 5.2의 refresh 후 무효화로 복구된다. 재시도와 역할이 겹치지 않는다.
- `structuralSharing: false`인 이유: `true`면 같은 응답이 다시 와도 `data` 참조가 그대로라서 `[data]`에 걸린 effect가 다시 돌지 않는다.

```ts
// src/queries/queryClient.ts (모양)
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleApiError }),
  mutationCache: new MutationCache({ onError: handleApiError }),
  defaultOptions: {
    queries: {
      retry: false, // 해제 조건: ...
      refetchOnWindowFocus: false, // 해제 조건: ...
      refetchOnReconnect: false, // 해제 조건: ...
      networkMode: 'always', // 해제 조건: ...
      gcTime: 0, // 해제 조건: ...
      structuralSharing: false, // 해제 조건: ...
    },
    mutations: {
      networkMode: 'always', // 해제 조건: ...
    },
  },
});
```

**Devtools**: `@tanstack/react-query-devtools`를 devDependency로 두고 `{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}`로 넣는다. 빌드 시점 치환으로 프로덕션 번들에서 확실히 빠지게 하려는 것이다.

---

## 9. 버전과 린트

- `@tanstack/react-query`와 devtools는 최신 5.x를 캐럿 범위로 쓴다. TypeScript 5.6 이상이 전제다(현재 5.9.3). TanStack Query v5의 공식 지원 범위와 린트 플러그인 요구 조건이 TS 5.6 이상이다.
- `@tanstack/eslint-plugin-query`의 **recommended 프리셋**을 그대로 켠다. `exhaustive-deps`(queryKey에 `queryFn`이 쓰는 값이 빠졌는지) 등이 여기에 들어 있다.

---

## 참고

- 기본값: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- queryKey: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- `queryOptions`: https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- 무효화: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation · https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
- 페이지네이션·`placeholderData`: https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
- network mode: https://tanstack.com/query/latest/docs/framework/react/guides/network-mode
- Devtools: https://tanstack.com/query/latest/docs/framework/react/devtools
- ESLint 플러그인: https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
- TypeScript: https://tanstack.com/query/latest/docs/framework/react/typescript
- 메인테이너 글: https://tkdodo.eu/blog/effective-react-query-keys · https://tkdodo.eu/blog/the-query-options-api · https://tkdodo.eu/blog/creating-query-abstractions · https://tkdodo.eu/blog/mastering-mutations-in-react-query
