# 라우팅 구조

이 문서는 inhabas.com-front 프로젝트의 라우팅 구조와 권한별 접근 제한을 설명합니다.

> 📚 **관련 문서**: [리팩토링 체크리스트](./CHECKLIST.md) | [마이그레이션 계획](./MIGRATION.md)

---

## 수정 예정 사항

### Layout Route 책임 분리

현재 `HeaderNavLayout.tsx`와 `HeaderTitleLayout.tsx`는 레이아웃 구성과 라우팅 처리를 함께 담당하고 있다. Layout 파일의 책임을 레이아웃 구성으로 제한하고, 라우팅 관련 코드는 `routes/` 폴더에서 관리하도록 분리한다.

**목표 구조:**

```
src/
├── App.tsx
├── layout/
│   ├── HeaderNavLayout.tsx     # 레이아웃 구성만 담당 (Routes 제거)
│   └── HeaderTitleLayout.tsx   # 레이아웃 구성만 담당 (Routes 제거)
└── routes/
    ├── HeaderNavRoute.tsx      # HeaderNavLayout 하위 라우트 (신규)
    ├── HeaderTitleRoute.tsx    # HeaderTitleLayout 하위 라우트 (신규)
    ├── MainRoute.tsx
    ├── BoardRoute.tsx
    └── LectureRoute.tsx
```

**수정 대상 파일:**

- `layout/HeaderNavLayout.tsx` — `<Routes>`, `<Route>` 코드를 `HeaderNavRoute.tsx`로 이동
- `layout/HeaderTitleLayout.tsx` — `<Routes>`, `<Route>` 코드를 `HeaderTitleRoute.tsx`로 이동
- `routes/HeaderNavRoute.tsx` — 신규 생성
- `routes/HeaderTitleRoute.tsx` — 신규 생성

---

### 삭제 예정 라우트

홈페이지 개편으로 아래 게시판들이 삭제될 예정. `BoardRoute.tsx`와 이 문서에서 함께 제거한다.

| 게시판 | 삭제 경로 |
|-------|----------|
| 공모전 | `/board/contest`, `/board/contest/detail/:id`, `/board/contest/create`, `/board/contest/update/:id` |
| 질문 | `/board/question`, `/board/question/detail/:id`, `/board/question/create`, `/board/question/update/:id` |
| 자유 | `/board/free`, `/board/free/detail/:id`, `/board/free/create`, `/board/free/update/:id` |
| 건의 | `/board/suggest`, `/board/suggest/detail/:id`, `/board/suggest/create`, `/board/suggest/update/:id` |
| 임원 | `/board/executive`, `/board/executive/detail/:id`, `/board/executive/create`, `/board/executive/update/:id` |

---

## 권한 체계

### 사용자 역할

| 역할 | 코드 | 설명 |
|------|------|------|
| 회장 | `CHIEF` | 최고 권한 |
| 부회장 | `VICE_CHIEF` | 부회장 권한 |
| 운영팀 | `EXECUTIVES` | 운영팀 권한 |
| 총무 | `SECRETARY` | 총무 권한 |
| 활동회원 | `BASIC` | 일반 활동회원 |
| 비활동회원 | `DEACTIVATED` | 비활동 회원 (졸업생 포함) |
| 미승인 회원 | `NOT_APPROVED` | 승인 대기 중 |
| 회원가입 중 | `SIGNING_UP` | 소셜로그인 직후 |

### 권한 레벨

| 레벨 | 포함 역할 |
|------|----------|
| `OverVice` | 회장, 부회장 |
| `OverExecutives` | 회장, 부회장, 운영팀 |
| `OverSecretary` | 회장, 부회장, 운영팀, 총무 |
| `OverBasic` | 회장, 부회장, 운영팀, 총무, 활동회원 |
| `OverDeactivate` | 모든 승인된 회원 (비활동회원 포함) |

---

## 라우팅 구조

### 1. 최상위 라우트 (`App.tsx`)

`HeaderNav`가 필요 없는 페이지는 `App.tsx`에서 직접 처리한다.

#### 인증 불필요 (공개)

```
/login                    # 로그인
/login/process            # 로그인 처리 (OAuth 콜백)
/signup                   # 회원가입
/signup/question          # 회원가입 추가 질문
/rule/:id                 # 규정 페이지
/notfound                 # 404
```

#### 인증 필요

```
/*                        # HeaderNavLayout 하위로 위임
```

---

### 2. 네비게이션 헤더 라우트 (`HeaderNavRoute.tsx`) — 수정 예정

> 현재는 `HeaderNavLayout.tsx` 내부에 라우트가 포함되어 있음. 분리 작업 후 이 파일로 이동.

```
/                         # 메인 페이지
/introduce                # 동아리 소개
/honor                    # 명예의 전당
/myInfo                   # 내 정보
/scholarship              # 장학금
/*                        # HeaderTitleLayout 하위로 위임
```

---

### 3. 제목 헤더 라우트 (`HeaderTitleRoute.tsx`) — 수정 예정

> 현재는 `HeaderTitleLayout.tsx` 내부에 라우트가 포함되어 있음. 분리 작업 후 이 파일로 이동.

```
/*                        # MainRoute
/board/*                  # BoardRoute
/lecture/*                # LectureRoute
```

#### 관리자 전용

| 경로 | 설명 | 필요 권한 |
|------|------|----------|
| `/staff/member` | 회원 관리 | `OverSecretary` |
| `/staff/member/newStudents` | 신입생 관리 | `OverSecretary` |
| `/staff/member/application/:id` | 신청서 상세 | `OverSecretary` |
| `/staff/member/students` | 재학생 관리 | `OverSecretary` |
| `/staff/member/graduateStudents` | 졸업생 관리 | `OverSecretary` |
| `/staff/manage` | 임원 관리 | `OverVice` |

---

### 4. 메인 라우트 (`MainRoute.tsx`)

#### 활동 (공개)

```
/activity                 # 활동 목록
/activity/detail          # 활동 상세 (목록)
/activity/detail/:id      # 활동 상세
/activity/create          # 활동 생성
/activity/update/:id      # 활동 수정
```

#### 은행 · 예산 (`OverDeactivate` 이상)

```
/bank                     # 회계 내역
/bank/support             # 지원금 목록
/bank/support/detail/:id  # 지원금 상세
/bank/support/create      # 지원금 신청
/bank/support/update/:id  # 지원금 수정
```

---

### 5. 게시판 라우트 (`BoardRoute.tsx`)

각 게시판은 아래 4개의 경로 패턴을 공유한다.

```
/board/{type}             # 목록
/board/{type}/detail/:id  # 상세
/board/{type}/create      # 작성
/board/{type}/update/:id  # 수정
```

#### 비로그인 접근 가능

| `{type}` | 게시판 |
|----------|-------|
| `opensource` | 오픈소스 게시판 |
| `sponsor` | 후원 게시판 |
| `usage` | 이용안내 |
| `activity` | 활동 게시판 |

#### `OverDeactivate` (비활동회원 이상)

| `{type}` | 게시판 |
|----------|-------|
| `notice` | 공지사항 |

#### `OverBasic` (활동회원 이상)

| `{type}` | 게시판 |
|----------|-------|
| `alpha` | 알파 프로젝트 |
| `beta` | 베타 프로젝트 |

#### 삭제 예정

| `{type}` | 게시판 | 삭제 사유 |
|----------|-------|----------|
| ~~`contest`~~ | 공모전 | 홈페이지 개편 |
| ~~`free`~~ | 자유게시판 | 홈페이지 개편 |
| ~~`question`~~ | 질문게시판 | 홈페이지 개편 |
| ~~`suggest`~~ | 건의게시판 | 홈페이지 개편 |
| ~~`executive`~~ | 임원 게시판 | 홈페이지 개편 |

---

### 6. 강의 라우트 (`LectureRoute.tsx`)

```
/lecture/                 # 강의 목록
/lecture/detail           # 강의 상세
/lecture/create           # 강의 생성
/lecture/room             # 강의실 목록
/lecture/room/announce    # 강의실 공지
/lecture/room/detail      # 강의실 상세
/lecture/room/create      # 강의실 생성
```

---

## 비로그인 접근 가능 경로 요약

```
/login
/signup
/signup/question
/introduce
/activity
/activity/detail
/board/opensource
/board/opensource/detail/:id
/board/sponsor
/board/sponsor/detail/:id
/board/usage
/board/usage/detail/:id
/board/activity
/board/activity/detail/:id
```

> ⚠️ 비로그인 상태에서 **작성(create) · 수정(update)** 경로는 접근 불가.

---

## 라우팅 파일 구조

### 현재

```
src/
├── App.tsx
├── layout/
│   ├── HeaderNavLayout.tsx     # 레이아웃 + 라우트 혼재 ← 분리 필요
│   └── HeaderTitleLayout.tsx   # 레이아웃 + 라우트 혼재 ← 분리 필요
└── routes/
    ├── MainRoute.tsx
    ├── BoardRoute.tsx
    └── LectureRoute.tsx
```

### 목표 (Layout Route 분리 후)

```
src/
├── App.tsx
├── layout/
│   ├── HeaderNavLayout.tsx     # 레이아웃 UI만 담당
│   └── HeaderTitleLayout.tsx   # 레이아웃 UI만 담당
└── routes/
    ├── HeaderNavRoute.tsx      # 신규 — HeaderNavLayout 하위 라우트
    ├── HeaderTitleRoute.tsx    # 신규 — HeaderTitleLayout 하위 라우트
    ├── MainRoute.tsx
    ├── BoardRoute.tsx
    └── LectureRoute.tsx
```

---

## 주의사항

1. **권한 검사**: 각 라우트는 `GetRoleAuthorization` 함수를 통해 권한을 검사한다. ([CHECKLIST.md](./CHECKLIST.md) 참고 — 커스텀 훅 분리 예정)
2. **로그인 상태 확인**: `failRefreshing` Recoil 상태로 토큰 갱신 실패 여부 확인.
3. **자동 리다이렉트**: 권한이 없는 페이지 접근 시 이전 페이지(`navigate(-1)`)로 리다이렉트.
4. **동적 라우트**: `:id` 파라미터는 게시글 ID를 의미.

---

## 업데이트 이력

| 날짜 | 내용 |
|------|------|
| 2024-12-19 | 초기 라우팅 문서 작성 |
| 2026-05-19 | 문서 구조 개편, Layout Route 분리 계획 추가, 삭제 예정 라우트 표기 |
