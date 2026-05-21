# 리팩토링 체크리스트

이 문서는 inhabas.com-front 프로젝트의 리팩토링이 필요한 부분들을 우선순위별로 정리한 문서입니다.

> 📚 **관련 문서**
>
> - [장기 마이그레이션 계획](./MIGRATION.md)
> - [테스트 전략](./TESTING.md)

---

## ✅ 완료된 항목

- [x] **CRA → Vite 마이그레이션** - 빌드 도구 전환 완료
- [x] **폴더 구조 재설계** - feature 기반 구조로 전환 완료 (`components/`, `pages/`, `containers/` 분리)
- [x] **폴더명 소문자 통일** - 전체 폴더명 소문자로 변경 완료

---

## 🔴 높은 우선순위

### 0. 실제 버그 수정 ⚠️

#### 0-1. useEffect cleanup 오용 (버그)

`return` 문이 cleanup 함수를 반환해야 하는 위치에서 state setter를 **즉시 호출**하고 있어, 마운트될 때마다 상태가 초기화되는 버그가 있음.

```typescript
// ❌ src/components/common/CommentList.tsx
useEffect(() => {
    // ... 로직
    return setComment([]); // cleanup이 아니라 즉시 실행됨
}, [commentDeleteData, putComment]);

// ❌ src/pages/home/Main.tsx
useEffect(() => {
    // ...
    return setReload(false); // effect 실행마다 reload가 false로 초기화
}, [reload]);

// ✅ 올바른 형태
useEffect(() => {
    // ...
    return () => { setComment([]); };
}, [...]);
```

#### 0-2. state 직접 변이 (버그)

`setInfos` 없이 객체를 직접 변이하여 React 리렌더 트리거가 누락됨.

```typescript
// ❌ src/components/common/modal/ModalUpdateBankHistory.tsx L63-67
infos.income = modalContent.income;   // 직접 변이
infos.outcome = modalContent.outcome; // ← React는 변경을 감지하지 못함

// ❌ src/components/common/modal/ModalPostBankHistory.tsx L89-94
infos.dateUsed = selectedDate;
infos.content = inputContent;
// (setInfos 호출 없음)

// ✅ 올바른 형태
setInfos(prev => ({ ...prev, income: modalContent.income }));
```

#### 0-3. authFunctions 커스텀 훅 규칙 위반 (버그 가능성)

`GetRoleAuthorization`은 일반 함수처럼 10곳 이상에서 호출되지만 내부에 `useEffect`가 있어 **훅 규칙 위반**. `isNavigation`이 렌더마다 초기화되는 `let`이라 권한 체크 effect가 의도대로 동작하지 않을 수 있음.

```typescript
// ❌ src/functions/authFunctions.tsx
export const GetRoleAuthorization = (...) => { // 함수 이름이지만 훅
    let isNavigation = false; // 렌더마다 초기화 → effect 미동작
    useEffect(() => {
        if (!isNavigation) { navigate(...)  } // 항상 false
    }, [isNavigation]); // isNavigation 변경 감지 불가
};

// ✅ 리팩토링 방안
// useRoleAuthorization() 커스텀 훅으로 분리
// isNavigation → useRef()로 변경
```

---

### 1. TanStack Query 도입

**문제점:**

현재 서버 상태 관리를 `useFetch` + Recoil atom으로 직접 구현하고 있음. 서버에서 받아온 데이터(게시글 목록, 회계 내역 등)가 Recoil에 캐싱되어 클라이언트 UI 상태와 서버 상태가 혼재함.

```typescript
// 현재: useFetch로 데이터 받아서 Recoil에 저장
const [bankHistoryData, fetchBankHistoryData] = useFetch();
const [bankHistory, setBankHistory] = useRecoilState(bankHistoryInfo);

useEffect(() => {
    if (bankHistoryData) {
        setBankHistory(bankHistoryData); // 서버 데이터를 Recoil에 저장
    }
}, [bankHistoryData]);
```

**문제:**
- 로딩/에러 상태 관리를 직접 구현해야 함
- 캐시 무효화 로직이 없어 `refetch` atom으로 수동 갱신
- 동일한 API를 여러 컴포넌트에서 중복 호출 가능성
- Recoil에 서버 상태와 UI 상태가 혼재

**리팩토링 방안:**

```typescript
// TanStack Query 적용 후
const { data: bankHistory, isLoading, error } = useQuery({
    queryKey: ['budget', 'histories', { year: selectedYear }],
    queryFn: () => fetchBankHistories({ year: selectedYear }),
});
```

**예상 효과:**
- 자동 캐싱 및 캐시 무효화
- 로딩/에러 상태 자동 관리
- 중복 요청 방지
- Recoil에서 서버 상태 제거 → Recoil은 순수 UI 상태만 관리

---

### 2. useFetch Hook 개선

**문제점:**

- `any` 타입 과다 사용
- `fetchWithToken`, `fetchWithoutToken` 중복 로직
- 주석 처리된 `console.log`가 다수 존재
- 단일 훅이 토큰 관리, 에러 처리, 데이터 fetching을 모두 담당

```typescript
const useFetch = (): [
    any, // ❌ any 타입
    (url: string, method: string, token?: string, sendData?: any, media?: boolean) => Promise<void>
] => {
    const [data, setData] = useState<any>(null); // ❌ any 타입
    // console.log("call refreshAccessToken"); ← 주석 처리된 로그들
    // console.log("try refresh");
    // ...
```

**리팩토링 방안:**

- 제네릭 타입 도입: `useFetch<T>()`
- `fetchWithToken` / `fetchWithoutToken` 통합
- 주석 처리된 코드 제거
- TanStack Query 도입 시 대부분 대체 가능

---

### 3. Recoil 상태 정리

**문제점:**

`backState.tsx`에 서버 상태와 UI 상태가 혼재하고, 네이밍이 불명확한 atom이 존재함.

```typescript
// ❌ 의미 불명확한 네이밍
export const _totalPageInfo = atom({ key: "_totalPageInfo", default: 0 });
export const __totalPageInfo = atom({ key: "__totalPageInfo", default: 0 });

// ❌ 서버 데이터를 Recoil로 관리 (TanStack Query로 이전 대상)
export const bankHistoryInfo = atom(...);
export const bankBalanceInfo = atom(...);
export const boardInfo = atom(...);
// ... 총 30개 이상의 atom
```

**리팩토링 방안:**

1. TanStack Query 도입 후 서버 상태 atom 제거
2. 남은 UI 상태 atom 네이밍 명확화 (`_totalPageInfo` → 삭제 또는 명확한 이름으로)
3. `backState.tsx` / `frontState.tsx` 분리 기준 재정의

> ⚠️ **참고:** Recoil은 현재 Meta에서 적극적으로 유지보수되지 않는 상태입니다. 장기적으로 Jotai 또는 Zustand로의 마이그레이션을 고려할 수 있습니다. ([MIGRATION.md](./MIGRATION.md) 참고)

---

### 4. Error Boundary 추가

**문제점:**

프로젝트 전체에 `ErrorBoundary`가 **0곳**. 컴포넌트에서 런타임 에러 발생 시 전체 앱이 화이트스크린이 됨. `useFetch`에서 404 → `navigate('/notfound')`만 처리할 뿐 JS 에러에 대한 복구 경로가 없음.

**리팩토링 방안:**

```typescript
// src/components/common/ErrorBoundary.tsx
import { ErrorBoundary } from 'react-error-boundary';

// App.tsx 또는 주요 라우트 단위에 적용
<ErrorBoundary fallback={<ErrorFallback />}>
    <Routes />
</ErrorBoundary>
```

- `react-error-boundary` 패키지 도입 (클래스 컴포넌트 직접 작성 불필요)
- route 단위 또는 feature 단위로 경계 설정

---

### 5. 에러 처리 로직 개선

**문제점:**

에러 처리가 `useFetch` 내부에 분산되어 있고 `alert`로만 표시됨. 에러 코드(`A005`, `A006`, `A007`)가 매직 스트링으로 하드코딩.

```typescript
// useFetch.tsx - 에러 처리가 여러 곳에 중복
if (errorResponse.status === 401) { navigate(-1); }
if (errorResponse.status === 403) { ... }
if (errorResponse.status === 404) { navigate('/notfound'); }

// 매직 스트링 에러 코드
if (errorResponse.code === "A005") { ... }
alertInfos({ code: errorResponse.code, msg: errorResponse.message }); // alert 사용
```

**리팩토링 방안:**

- HTTP 상태 코드별 에러 핸들러 분리 (`src/utils/errorHandler.ts`)
- 에러 코드 상수화 (`src/constants/errorCodes.ts`)
- `alert` 대신 Toast 알림 시스템 도입 (예: `react-toastify`)
- TanStack Query의 `onError` 콜백으로 통합

---

### 6. 중복된 URL 매핑 로직 추출

**문제점:**

`BoardList.tsx`, `BoardDetail.tsx`, `BoardCreate.tsx`, `BoardSearch.tsx`에서 동일한 URL 매핑 로직이 반복됨.

```typescript
// 여러 파일에서 반복되는 패턴
if (url === 'alpha') fetchUrl = '/project/alpha';
else if (url === 'beta') fetchUrl = '/project/beta';
else if (url === 'sponsor') fetchUrl = '/scholarship/sponsor';
// ...
```

**리팩토링 방안:**

```typescript
// src/constants/boardUrlMap.ts
export const BOARD_URL_MAP: Record<string, string> = {
    alpha: '/project/alpha',
    beta: '/project/beta',
    sponsor: '/scholarship/sponsor',
    // ...
} as const;
```

---

## 🟡 중간 우선순위

### 6. 하드코딩된 값 상수화

**문제점:**

권한 체크, 메뉴 ID 등 매직 스트링/넘버가 여러 파일에 산재.

```typescript
// BoardList.tsx
if (['sponsor', 'usage', 'notice', 'executive'].includes(url) && isAuthorizedOverSecretary) { ... }

// BoardDetail.tsx
switch (pathName1) {
    case 'introduce': menuId = 1; break;
    case 'activity': menuId = 2; break;
    // ...
}
```

**리팩토링 방안:**

- `src/constants/boardTypes.ts`
- `src/constants/menuIds.ts`
- `src/constants/permissions.ts`

---

### 7. Modal 컴포넌트 리팩토링

**문제점:**

`Modal.tsx`에서 타입별 조건부 렌더링이 15개 이상 나열됨.

```typescript
// Modal.tsx - 조건부 렌더링 15개 나열
{(modalType.type === "major" && <ModalMajor />) ||
    (modalType.type === "changeName" && <ModalChangeName />) ||
    (modalType.type === "changeNumber" && <ModalChangeNumber />) ||
    // ... 12개 더
}
```

**리팩토링 방안:**

```typescript
// 컴포넌트 매핑 Record로 관리
const MODAL_COMPONENTS: Record<string, React.ComponentType> = {
    major: ModalMajor,
    changeName: ModalChangeName,
    // ...
};

const ModalComponent = MODAL_COMPONENTS[modalType.type];
return ModalComponent ? <ModalComponent /> : null;
```

---

### 8. 긴 컴포넌트 분리

**문제점:**

단일 파일이 너무 많은 역할을 담당. 150줄 초과 파일 목록:

| 줄 수 | 파일 |
|------|------|
| 529 | `pages/scholarship/Scholarship.tsx` |
| 475 | `pages/home/Introduce.tsx` |
| 470 | `components/common/HeaderNav.tsx` |
| 458 | `pages/activity/ContestCreate.tsx` |
| 457 | `pages/budget/BankSupportDetail.tsx` |
| 394 | `pages/member/Signup.tsx` |
| 390 | `components/common/modal/ModalUpdateBankHistory.tsx` |
| 389 | `pages/board/BoardDetail.tsx` |
| 377 | `components/common/DragNDrop.tsx` |
| 369 | `components/myInfo/MyUserTable.tsx` / `MyGraduateUserTable.tsx` |
| 334 | `components/common/CommentList.tsx` |
| 285 | `pages/lecture/LectureDetail.tsx` |
| 271 | `containers/myInfo/MyInfoContainer.tsx` |

**리팩토링 방안:**

- 로직을 Custom Hook으로 분리
- 렌더링 부분을 하위 컴포넌트로 분리
- TanStack Query 도입 시 data fetching 로직 제거로 자연스럽게 축소
- `MyUserTable`, `MyGraduateUserTable`, `MyNewUserTable`은 공통 테이블 컴포넌트로 통합

---

### 9. 파일 다운로드 공통 유틸 추출

**문제점:**

`fetch → blob → createElement('a') → click` 패턴이 3개 파일에 중복.

```typescript
// ❌ 동일 로직이 3곳에 중복
// pages/board/BoardDetail.tsx L190-208
// pages/activity/ActivityDetail.tsx L44-62
// pages/activity/ContestDetail.tsx L114-132
const onClickFileLink = useCallback(async (fileUrl: string, fileName: string) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}, []);
```

**리팩토링 방안:**

```typescript
// src/utils/fileDownload.ts
export const downloadFile = async (fileUrl: string, fileName: string) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};
```

---

### 10. BoardRoute 반복 패턴 개선

**문제점:**

`routes/BoardRoute.tsx`에서 게시판별 `<Route>` 선언이 70줄 이상 반복.

```typescript
// ❌ 보일러플레이트 반복 (~70줄)
<Route path="notice" element={<BoardList />} />
<Route path="notice/:boardId" element={<BoardDetail />} />
<Route path="free" element={<BoardList />} />
<Route path="free/:boardId" element={<BoardDetail />} />
// ...
```

**리팩토링 방안:**

```typescript
// 게시판 경로 배열 + map으로 축약
const BOARD_ROUTES = ['notice', 'free', 'question', 'suggest', ...] as const;

{BOARD_ROUTES.map(path => (
    <React.Fragment key={path}>
        <Route path={path} element={<BoardList />} />
        <Route path={`${path}/:boardId`} element={<BoardDetail />} />
    </React.Fragment>
))}
```

---

### 11. Recoil atom 파일 분리

**문제점:**

`backState.tsx`에 서버 상태 관련 atom 30개 이상이 하나의 파일에 집중(225줄). `frontState.tsx`도 유사.

**리팩토링 방안:**

```
src/recoil/
  backState.tsx       → feature별로 분리
  frontState.tsx
    ↓
  atoms/
    budgetAtoms.ts
    boardAtoms.ts
    memberAtoms.ts
    uiAtoms.ts        (모달, 페이지네이션 등 UI 상태)
```

TanStack Query 도입 후 서버 상태 atom 제거 시 함께 진행 권장.

---

### 12. React.memo / useMemo / useCallback 최적화

**문제점:**

프로젝트 전체에서 `React.memo` 사용이 **0건**. 테이블, 모달, 헤더 등 무거운 컴포넌트가 부모 렌더마다 재생성됨.

**주요 대상:**

- `HeaderNav.tsx` (470줄, scroll 이벤트 리스너 포함)
- `CommentList.tsx` (재귀적 렌더)
- `Pagination.tsx`
- `DragNDrop.tsx`
- `MyUserTable` / `MyGraduateUserTable` / `MyNewUserTable`
- 모달 폼 컴포넌트들

**리팩토링 방안:**

```typescript
// 무거운 자식 컴포넌트에 memo 적용
export const Pagination = React.memo(({ ... }: PaginationProps) => {
    // ...
});

// 콜백 함수는 useCallback
const handlePageChange = useCallback((page: number) => {
    // ...
}, [fetchUrl, size]);
```

> ⚠️ 성능 프로파일링 없이 과도한 메모이제이션은 오히려 역효과. React DevTools Profiler로 실제 병목 확인 후 적용 권장.

---

### 13. functions → utils 폴더명 변경

**문제점:**

`src/functions/`라는 이름이 모호함. 유틸리티 함수 폴더의 일반적인 컨벤션은 `utils/`.

**리팩토링 방안:**

```
src/functions/ → src/utils/
```

---

### 14. 환경변수 관리 개선

**문제점:**

`.env` 파일 하나로 개발/프로덕션 구분 불가, 타입 체크 없음.

**리팩토링 방안:**

- `.env.development`, `.env.production` 분리
- `src/config/env.ts` 생성 후 타입 안전한 환경변수 접근

---

## 🟢 낮은 우선순위

### 15. 주석 처리된 코드 제거

**문제점:**

여러 파일에 걸쳐 불필요한 주석 코드가 산재.

```typescript
// useFetch.tsx (10개 이상)
// console.log("call refreshAccessToken");
// console.log("try refresh");

// pages/member/Signup.tsx
// if (postData === "noContents") { ... }

// index.tsx
// <React.StrictMode>

// styles/theme.ts
// export default theme;
```

**주요 대상 파일:** `hooks/useFetch.tsx`, `pages/member/Signup.tsx`, `pages/member/SignupQuestion.tsx`, `pages/budget/BankSupportCreate.tsx`, `components/lecture/LectureCard.tsx`, `index.tsx`, `styles/theme.ts`, `layout/HeaderNavLayout.tsx`, `pages/home/Main.tsx`

---

### 16. 스타일 컴포넌트 중복 제거

**문제점:**

`HorizonScrollDiv` 등 유사한 스타일 컴포넌트가 여러 파일에 중복 정의됨.

**리팩토링 방안:**

공통 스타일 컴포넌트를 `src/styles/components/`로 통합.

---

### 17. 타입 파일 구조 정리

**문제점:**

타입 파일이 일관성 없이 분산되고, JSX가 없는 파일이 `.tsx` 확장자를 사용함.

```
src/types/TypeBank.tsx      ← tsx인데 타입만 있음
src/types/TypeBoard.tsx     ← writerId?: 2 (리터럴 타입 오류 추정)
src/types/TypeCommon.tsx
src/types/ibas/TypeIBAS.tsx
src/functions/dateFunction.tsx          ← .ts로 변경 대상
src/functions/convertLabelFunctions.tsx ← .ts로 변경 대상
src/recoil/backState.tsx                ← .ts로 변경 대상
src/recoil/frontState.tsx               ← .ts로 변경 대상
src/components/common/ScrollToTop.tsx   ← return null, JSX 없음
```

**리팩토링 방안:**

- 확장자 `.ts`로 통일 (타입만 있는 파일은 `.tsx` 불필요)
- `TypeBoard.tsx`의 `writerId?: 2` → `writerId?: number` 수정
- feature 폴더 내부로 이동 고려 (TanStack Query 도입 시 함께 진행)

---

### 18. 네이밍 오타 및 불일치 수정

**문제점:**

변수명·파일명에 오타가 존재하여 코드 가독성 저하.

| 위치 | 오타 | 올바른 이름 |
|------|------|------------|
| `pages/myInfo/MyInfo.tsx` | `setclicked` | `setClicked` |
| `containers/myInfo/MyInfoContainer.tsx` | `setMoalInfo` | `setModalInfo` |
| 파일명 | `MyStaffRuleContainter.tsx` | `MyStaffRuleContainer.tsx` |
| `pages/member/Signup.tsx` | `setSelecteMajor` | `setSelectedMajor` |
| `recoil/backState.tsx` | `_totalPageInfo`, `__totalPageInfo` | 의미 있는 이름으로 변경 |
| `recoil/frontState.tsx` | `String[]` | `string[]` (래퍼 타입 금지) |

---

### 19. 접근성(a11y) 개선

**문제점:**

접근성 속성이 프로젝트 전체에 걸쳐 거의 없음.

- **`alt` 없는 `<img>`**: `<Img>` 컴포넌트 90곳 중 대부분 `alt` 없음 (`Loading.tsx`, `MyInfo.tsx`, `BoardDetail.tsx` 등)
- **클릭 가능한 `<div>`**: `onClick` + 커서 포인터 패턴 30곳 이상 — `role="button"`, `tabIndex`, 키보드 이벤트 없음
- **`aria-*` 속성**: 프로젝트 전체 **0건**
- **모달**: `aria-modal`, focus trap 없음
- **폼 라벨**: `htmlFor` / `id` 연결 누락

**리팩토링 방안:**

```typescript
// ❌ 현재
<Img src={profileImg} />
<Div $pointer onClick={handleClick}>메뉴</Div>

// ✅ 개선
<Img src={profileImg} alt="프로필 이미지" />
<button type="button" onClick={handleClick}>메뉴</button>
// 또는
<Div role="button" tabIndex={0} onClick={handleClick}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
    메뉴
</Div>
```

---

## 📋 리팩토링 실행 계획

### Phase 0: 버그 수정 (즉시)

1. [ ] `CommentList.tsx`, `Main.tsx` useEffect cleanup 오용 수정
2. [ ] `ModalUpdateBankHistory.tsx`, `ModalPostBankHistory.tsx` state 직접 변이 수정
3. [ ] `authFunctions.tsx` `GetRoleAuthorization` → `useRoleAuthorization` 훅으로 분리

### Phase 1: 기반 작업

4. [ ] URL 매핑 상수화 (`boardUrlMap.ts`)
5. [ ] 하드코딩된 값 상수 파일로 추출 (`roles.ts`, `menuIds.ts`, `errorCodes.ts`)
6. [ ] 주석 처리된 코드 제거
7. [ ] 네이밍 오타 수정 (`setMoalInfo` 등)
8. [ ] 타입 파일 확장자 `.tsx` → `.ts` 변경

### Phase 2: 핵심 개선

9. [ ] Error Boundary 추가
10. [ ] TanStack Query 도입
11. [ ] Recoil 서버 상태 → TanStack Query로 이전
12. [ ] 에러 처리 로직 개선 (Toast 알림, `errorHandler.ts`)

### Phase 3: 구조 개선

13. [ ] useFetch 제네릭화 또는 TanStack Query로 대체
14. [ ] Modal 컴포넌트 리팩토링 (Record 매핑)
15. [ ] 파일 다운로드 공통 유틸 추출 (`utils/fileDownload.ts`)
16. [ ] BoardRoute 반복 패턴 config map으로 개선
17. [ ] 긴 컴포넌트 분리 (Custom Hook, 하위 컴포넌트)
18. [ ] `functions/` → `utils/` 폴더명 변경
19. [ ] Recoil atom 파일 feature별 분리

### Phase 4: 마무리

20. [ ] React.memo / useCallback 성능 최적화 (프로파일링 후)
21. [ ] 타입 파일 구조 정리 (feature 폴더 이동)
22. [ ] 스타일 컴포넌트 중복 제거
23. [ ] 접근성(a11y) 개선 (alt, aria, 버튼 시맨틱)
24. [ ] 테스트 작성 ([테스트 전략](./TESTING.md) 참고)
25. [ ] 문서 업데이트

---

## 🎯 리팩토링 원칙

1. **점진적 개선**: 한 번에 모든 것을 바꾸지 않고 단계적으로 진행
2. **기능 유지**: 리팩토링 중에도 기존 기능이 정상 작동해야 함
3. **작은 PR**: 각 리팩토링은 작은 PR로 나누어 진행
4. **타입 안정성**: `any` 타입을 최대한 제거하고 명확한 타입 정의
5. **코드 리뷰**: 리팩토링도 PR을 통해 리뷰 받기
