# 리팩토링 상세 - 중간/낮은 우선순위

이 문서는 [메인 리팩토링 문서](./REFACTORING.md)의 중간 및 낮은 우선순위 항목들의 상세 내용을 담고 있습니다.

## 🟡 중간 우선순위

### 4. 긴 컴포넌트 분리

**문제점:**

- `BoardList.tsx` (236줄), `BoardDetail.tsx` (423줄) 등 컴포넌트가 과도하게 길음
- 단일 책임 원칙 위반

**리팩토링 방안:**

- 컴포넌트를 더 작은 단위로 분리
- Custom Hook으로 로직 분리
- Presentational/Container 패턴 적용

**예상 효과:**

- 코드 가독성 향상
- 재사용성 증가
- 테스트 용이성 향상

---

### 5. 하드코딩된 값들 상수화

**문제점:**

- 권한 체크 로직에 하드코딩된 문자열 배열
- 메뉴 ID 매핑이 하드코딩됨
- 매직 넘버 사용

**현재 코드:**

```typescript
// BoardList.tsx
if (['sponsor', 'usage', 'notice', 'executive'].includes(url) && isAuthorizedOverSecretary) {
  return true;
}

// BoardDetail.tsx
switch (pathName1) {
  case 'introduce':
    menuId = 1;
    break;
  case 'activity':
    menuId = 2;
  // ...
}
```

**리팩토링 방안:**

- 상수 파일 생성: `src/constants/boardTypes.ts`, `src/constants/menuIds.ts`
- Enum 또는 const 객체로 관리
- 타입 안정성 확보

**예상 효과:**

- 유지보수성 향상
- 오타 방지
- 타입 안정성 개선

---

### 6. 환경변수 관리 개선

**문제점:**

- `.env` 파일 하나로 개발/프로덕션 구분이 안 됨
- 환경변수 타입 체크 없음

**리팩토링 방안:**

- `.env.development`, `.env.production` 분리
- 환경변수 타입 정의 및 검증 함수 생성
- `src/config/env.ts` 생성

**예상 효과:**

- 환경별 설정 명확화
- 설정 오류 조기 발견
- 개발 환경 개선

---

## 🟢 낮은 우선순위

### 7. 주석 처리된 코드 제거

**문제점:**

- `useFetch.tsx`에 주석 처리된 `console.log` 다수
- 사용하지 않는 코드 존재

**리팩토링 방안:**

- 주석 처리된 코드 제거
- 필요시 로깅 라이브러리 도입 (예: `winston`, `pino`)

---

### 8. Modal 컴포넌트 리팩토링

**문제점:**

- `Modal.tsx`에서 조건부 렌더링이 복잡함
- 타입별 모달 컴포넌트 매핑이 하드코딩됨

**현재 코드:**

```typescript
{(modalType.type === "major" && <ModalMajor />) ||
    (modalType.type === "changeName" && <ModalChangeName />) ||
    // ... 많은 조건들
}
```

**리팩토링 방안:**

- 모달 타입별 컴포넌트 매핑 객체 생성
- Factory 패턴 적용

---

### 9. API 호출 패턴 통일

**문제점:**

- 일부 컴포넌트에서 `useFetch` 사용 방식이 일관되지 않음
- 토큰 필요 여부 판단 로직이 분산됨

**리팩토링 방안:**

- API 호출 래퍼 함수 생성
- 토큰 필요 여부를 URL 기반으로 자동 판단

---

### 10. 폴더 구조 개선

**문제점:**

1. **Components 폴더 구조의 혼란**

   - `Common/`, `Component/`, `Container/`, `Page/`로 나뉘어 있지만 구분 기준이 모호함
   - `Component/`와 `Page/`의 차이가 명확하지 않음
   - `Container/`는 Presentational/Container 패턴을 따르지만 일관성이 없음

2. **도메인별 파일 분산**

   - `Page/IBAS/`와 `Component/IBAS/`가 분리되어 있음
   - 같은 도메인(IBAS)의 관련 파일들이 여러 곳에 흩어져 있음
   - 도메인별 응집도가 낮음

3. **타입 파일 구조 불일치**

   - `Types/IBAS/` 하위에 일부 타입이 있고, 루트에도 타입이 있음
   - 일관성 부족

4. **유틸리티 파일 명명**

   - `Functions/`라는 이름이 모호함 (함수만 있는 게 아님)
   - `utils/` 또는 `helpers/`가 더 명확할 수 있음

5. **스타일 컴포넌트 위치**
   - `styles/assets/`에 컴포넌트들이 있는데, 스타일인지 컴포넌트인지 모호함

**현재 구조:**

```
src/
├── Components/
│   ├── Common/          # 공통 컴포넌트
│   ├── Component/       # ??? (Page와의 차이 불명확)
│   ├── Container/       # Container 컴포넌트 (일부만)
│   └── Page/            # 페이지 컴포넌트
├── Functions/           # 유틸리티 함수들
├── Types/               # 타입 정의 (일부는 IBAS/ 하위)
└── styles/
    └── assets/          # 스타일 컴포넌트들
```

**리팩토링 방안:**

#### 옵션 1: Feature-based 구조 (권장)

도메인/기능별로 파일을 그룹화:

```
src/
├── features/                    # 기능별 모듈
│   ├── board/
│   │   ├── components/          # Board 관련 컴포넌트
│   │   ├── pages/               # Board 페이지
│   │   ├── hooks/               # Board 관련 hooks
│   │   ├── types/               # Board 타입
│   │   └── utils/               # Board 유틸리티
│   ├── ibas/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── lecture/
│   └── auth/
├── shared/                      # 공통 모듈
│   ├── components/              # 공통 컴포넌트
│   ├── hooks/                   # 공통 hooks
│   ├── utils/                   # 공통 유틸리티
│   ├── types/                   # 공통 타입
│   └── styles/                  # 공통 스타일
├── layouts/                     # 레이아웃
└── routes/                      # 라우팅
```

**장점:**

- 도메인별 응집도 향상
- 기능 추가/수정 시 관련 파일을 한 곳에서 찾을 수 있음
- 코드 탐색이 쉬움

**단점:**

- 마이그레이션 비용이 큼
- 기존 구조와 완전히 다름

#### 옵션 2: 개선된 계층 구조 (점진적 마이그레이션)

현재 구조를 유지하면서 개선:

```
src/
├── components/                   # 모든 컴포넌트
│   ├── ui/                      # 재사용 가능한 UI 컴포넌트
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── features/                # 기능별 컴포넌트
│   │   ├── board/
│   │   ├── ibas/
│   │   └── lecture/
│   └── layouts/                 # 레이아웃 컴포넌트
├── pages/                       # 페이지 컴포넌트
│   ├── board/
│   ├── ibas/
│   └── lecture/
├── hooks/                       # 모든 hooks
├── utils/                       # Functions → utils로 변경
├── types/                       # 모든 타입 (도메인별 폴더)
│   ├── board.ts
│   ├── ibas/
│   └── common.ts
└── styles/                      # 스타일
    ├── components/              # 스타일 컴포넌트
    ├── theme.ts
    └── global.ts
```

**장점:**

- 현재 구조와 유사하여 마이그레이션 비용이 낮음
- 점진적으로 개선 가능
- 명확한 구분

**단점:**

- 여전히 계층 구조 (도메인별 응집도는 낮음)

#### 옵션 3: 하이브리드 구조 (실용적)

중요한 부분만 개선:

```
src/
├── components/
│   ├── ui/                      # 공통 UI 컴포넌트
│   ├── features/                # 기능별 컴포넌트
│   └── layouts/                 # 레이아웃
├── pages/                       # 페이지만 분리
├── hooks/                       # hooks 통합
├── utils/                       # Functions → utils
├── types/                       # 타입 통합
└── styles/                      # 스타일
```

**리팩토링 전략:**

1. **1단계: 명명 개선**

   - `Functions/` → `utils/`
   - `styles/assets/` → `styles/components/`

2. **2단계: 컴포넌트 통합**

   - `Component/`, `Container/`, `Page/`의 구분 명확화
   - 또는 `components/` 하나로 통합

3. **3단계: 도메인별 그룹화**

   - 같은 도메인의 파일들을 가까이 배치
   - 예: `components/board/`, `pages/board/`, `types/board.ts`

4. **4단계: Feature-based 구조로 전환** (선택사항)
   - 큰 리팩토링 시점에 고려

**예상 소요 시간:**

- 옵션 2 (개선된 계층 구조): 2-3주
- 옵션 1 (Feature-based): 4-6주

**권장 사항:**

- **옵션 2 (개선된 계층 구조)**를 권장
- 현재 구조와 유사하여 마이그레이션 비용이 낮음
- 점진적으로 개선 가능
- 팀의 학습 곡선이 낮음

---

### 11. 스타일 컴포넌트 중복 제거

**문제점:**

- 유사한 스타일 컴포넌트가 여러 파일에 중복 정의됨
- 예: `HorizonScrollDiv`가 여러 파일에 존재

**리팩토링 방안:**

- 공통 스타일 컴포넌트를 `src/styles/components/`로 이동
- 재사용 가능한 스타일 컴포넌트 라이브러리화

---

[← 메인 리팩토링 문서로 돌아가기](./REFACTORING.md)

