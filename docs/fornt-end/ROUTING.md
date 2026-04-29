# 라우팅 구조 문서

## 개요

이 문서는 inhabas.com-front 프로젝트의 라우팅 구조와 권한별 접근 제한을 설명합니다.

## 권한 체계

### 사용자 역할 (User Roles)

1. **회장** (`CHIEF`) - 최고 권한
2. **부회장** (`VICE_CHIEF`) - 부회장 권한
3. **운영팀** (`EXECUTIVES`) - 운영팀 권한
4. **총무** (`SECRETARY`) - 총무 권한
5. **활동회원** (`BASIC`) - 일반 활동회원
6. **비활동회원** (`DEACTIVATED`) - 비활동 회원 (졸업생 포함)
7. **미승인 회원** (`NOT_APPROVED`) - 승인 대기 중
8. **회원가입 중** (`SIGNING_UP`) - 소셜로그인 직후

### 권한 레벨

- `OverVice`: 회장, 부회장
- `OverExecutives`: 회장, 부회장, 운영팀
- `OverSecretary`: 회장, 부회장, 운영팀, 총무
- `OverBasic`: 회장, 부회장, 운영팀, 총무, 활동회원
- `OverDeactivate`: 모든 승인된 회원 (비활동회원 포함)

## 라우팅 구조

### 1. 최상위 라우트 (App.tsx)

#### 인증이 필요 없는 페이지

```
/login                    # 로그인 페이지
/login/process            # 로그인 처리 페이지
/signup                   # 회원가입 페이지
/signup/question          # 회원가입 질문 페이지
/rule/:id                 # 규칙 페이지
/notfound                 # 404 페이지
```

#### 인증이 필요한 페이지 (HeaderNavLayout)

```
/*                       # 모든 인증된 페이지
```

### 2. 메인 네비게이션 라우트 (HeaderNavLayout.tsx)

```
/                         # 메인 페이지
/introduce                # 소개 페이지
/honor                    # 명예 페이지
/myInfo                   # 내 정보 페이지
/scholarship              # 장학금 페이지
/*                        # 기타 모든 페이지 (HeaderTitleLayout으로 위임)
```

### 3. 제목 헤더 라우트 (HeaderTitleLayout.tsx)

```
/*                        # 메인 라우트 (MainRoute)
/board/*                  # 게시판 라우트 (BoardRoute)
/lecture/*                # 강의 라우트 (LectureRoute)
```

#### 관리자 전용 라우트

```
/staff/member             # 회원 관리 (OverSecretary 권한 필요)
/staff/member/newStudents # 신입생 관리
/staff/member/application/:id # 신청서 관리
/staff/member/students    # 재학생 관리
/staff/member/graduateStudents # 졸업생 관리
/staff/manage             # 직원 관리 (OverVice 권한 필요)
```

### 4. 메인 라우트 (MainRoute.tsx)

```
/activity                 # 활동 목록
/activity/detail          # 활동 상세
/activity/detail/:id      # 특정 활동 상세
/activity/create          # 활동 생성
/activity/update/:id      # 활동 수정
```

#### 은행 관련 라우트 (OverDeactivate 권한 필요)

```
/bank                     # 은행 관리
/bank/support             # 지원금 관리
/bank/support/detail/:id  # 지원금 상세
/bank/support/create      # 지원금 생성
/bank/support/update/:id  # 지원금 수정
```

### 5. 게시판 라우트 (BoardRoute.tsx)

#### 비활동회원 이상 접근 가능

```
/board/opensource         # 오픈소스 게시판
/board/opensource/detail/:id # 오픈소스 상세
/board/opensource/create  # 오픈소스 작성
/board/opensource/update/:id # 오픈소스 수정

/board/sponsor            # 후원 게시판
/board/sponsor/detail/:id # 후원 상세
/board/sponsor/create     # 후원 작성
/board/sponsor/update/:id # 후원 수정

/board/usage              # 이용안내 게시판
/board/usage/detail/:id   # 이용안내 상세
/board/usage/create       # 이용안내 작성
/board/usage/update/:id   # 이용안내 수정

/board/contest            # 공모전 게시판
/board/contest/detail/:id # 공모전 상세
/board/contest/create     # 공모전 작성
/board/contest/update/:id # 공모전 수정

/board/activity           # 활동 게시판
/board/activity/detail/:id # 활동 상세
/board/activity/create    # 활동 작성
/board/activity/update/:id # 활동 수정
```

#### 활동회원 이상 접근 가능

```
/board/alpha              # 알파 게시판
/board/alpha/detail/:id   # 알파 상세
/board/alpha/create       # 알파 작성
/board/alpha/update/:id   # 알파 수정

/board/beta               # 베타 게시판
/board/beta/detail/:id    # 베타 상세
/board/beta/create        # 베타 작성
/board/beta/update/:id    # 베타 수정
```

#### 비활동회원 이상 접근 가능 (내부 게시판)

```
/board/notice             # 공지사항
/board/notice/detail/:id  # 공지사항 상세
/board/notice/create      # 공지사항 작성
/board/notice/update/:id  # 공지사항 수정

/board/free               # 자유게시판
/board/free/detail/:id    # 자유게시판 상세
/board/free/create        # 자유게시판 작성
/board/free/update/:id    # 자유게시판 수정

/board/question           # 질문게시판
/board/question/detail/:id # 질문게시판 상세
/board/question/create    # 질문게시판 작성
/board/question/update/:id # 질문게시판 수정

/board/suggest            # 건의게시판
/board/suggest/detail/:id # 건의게시판 상세
/board/suggest/create     # 건의게시판 작성
/board/suggest/update/:id # 건의게시판 수정
```

#### 총무 이상 접근 가능

```
/board/executive          # 임원 게시판
/board/executive/detail/:id # 임원 게시판 상세
/board/executive/create   # 임원 게시판 작성
/board/executive/update/:id # 임원 게시판 수정
```

### 6. 강의 라우트 (LectureRoute.tsx)

```
/lecture/                 # 강의 목록
/lecture/detail           # 강의 상세
/lecture/create           # 강의 생성
/lecture/room             # 강의실 목록
/lecture/room/announce    # 강의실 공지
/lecture/room/detail      # 강의실 상세
/lecture/room/create      # 강의실 생성
```

## 로그인 없이 접근 가능한 페이지

다음 페이지들은 로그인 없이도 접근할 수 있습니다:

- `/board/opensource`
- `/board/sponsor`
- `/board/usage`
- `/board/contest`
- `/board/activity`
- `/activity`
- `/activity/detail`
- `/introduce`
- `/login`
- `/signup`
- `/signup/question`

## 권한별 접근 가능한 기능

### 회장/부회장 (OverVice)

- 모든 페이지 접근 가능
- 직원 관리 (`/staff/manage`)

### 운영팀 (OverExecutives)

- 회장/부회장 권한 + 운영팀 전용 기능

### 총무 (OverSecretary)

- 운영팀 권한 + 회원 관리 기능
- 회원 관리 (`/staff/member/*`)
- 임원 게시판 관리

### 활동회원 (OverBasic)

- 일반 회원 기능
- 알파/베타 게시판 작성 권한
- 은행 관련 기능

### 비활동회원 (OverDeactivate)

- 읽기 전용 대부분 기능
- 공개 게시판만 접근 가능

## 라우팅 파일 구조

```
src/
├── App.tsx                    # 최상위 라우팅
├── Layout/
│   ├── HeaderNavLayout.tsx    # 네비게이션 헤더가 있는 레이아웃
│   └── HeaderTitleLayout.tsx  # 제목 헤더가 있는 레이아웃
└── Routes/
    ├── MainRoute.tsx          # 메인 라우트
    ├── BoardRoute.tsx         # 게시판 라우트
    └── LectureRoute.tsx       # 강의 라우트
```

## 주의사항

1. **권한 검사**: 각 라우트는 `GetRoleAuthorization` 함수를 통해 권한을 검사합니다.
2. **로그인 상태**: `failRefreshing` 상태를 통해 로그인 여부를 확인합니다.
3. **자동 리다이렉트**: 권한이 없는 페이지 접근 시 이전 페이지로 자동 리다이렉트됩니다.
4. **동적 라우트**: `:id` 파라미터를 사용하는 동적 라우트들이 있습니다.

## 업데이트 이력

- 2024-12-19: 초기 라우팅 문서 작성
