# 테스트 전략

이 문서는 [메인 리팩토링 문서](./REFACTORING.md)의 테스트 작성 전략을 담고 있습니다.

## 현재 상황

- ✅ 테스트 라이브러리 설치됨: `@testing-library/react`, `@testing-library/jest-dom`
- ✅ `setupTests.ts` 파일 존재
- ❌ 실제 테스트 파일 없음 (0개)
- ✅ `package.json`에 test 스크립트 존재

## 테스트 작성 우선순위

### 🔴 1순위: 유틸리티 함수 테스트 (Unit Test)

**대상:**

- `src/Functions/dateFunction.tsx`
- `src/Functions/convertLabelFunctions.tsx`
- `src/utils/boardUrlMapper.ts` (리팩토링 후 생성 예정)

**이유:**

- 순수 함수라서 테스트가 쉬움
- 의존성이 없어서 Mock 불필요
- 비즈니스 로직의 핵심
- 버그 발생 시 영향도가 큼

**예시:**

```typescript
// src/Functions/__tests__/dateFunction.test.ts
import { DateFunction } from '../dateFunction';

describe('DateFunction', () => {
  const { formatDateDay, formatDateMinute, formatDateT } = DateFunction();

  describe('formatDateDay', () => {
    it('날짜를 YYYY-MM-DD 형식으로 변환해야 함', () => {
      const result = formatDateDay({ date: '2024-12-19T10:30:00' });
      expect(result).toBe('2024-12-19');
    });
  });
});
```

**예상 소요 시간:** 1주

---

### 🟡 2순위: Custom Hook 테스트

**대상:**

- `src/Hooks/useFetch.tsx`

**이유:**

- 여러 컴포넌트에서 사용되는 핵심 Hook
- 복잡한 로직 (토큰 갱신, 에러 처리 등)
- 버그 발생 시 전체 앱에 영향

**주의사항:**

- Recoil, React Router 의존성 Mock 필요
- `@testing-library/react-hooks` 또는 `renderHook` 사용

**예시:**

```typescript
// src/Hooks/__tests__/useFetch.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import useFetch from '../useFetch';

describe('useFetch', () => {
  it('GET 요청이 성공하면 데이터를 반환해야 함', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      })
    );

    const { result } = renderHook(() => useFetch(), {
      wrapper: RecoilRoot,
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ data: 'test' });
    });
  });
});
```

**예상 소요 시간:** 1-2주

---

### 🟢 3순위: 공통 컴포넌트 테스트 (Component Test)

**대상:**

- `src/Components/Common/Loading.tsx`
- `src/Components/Common/Button.tsx` (스타일 컴포넌트)
- `src/Components/Common/Modal/Modal.tsx`
- `src/Components/Common/Dropdown.tsx`

**이유:**

- 여러 곳에서 재사용되는 컴포넌트
- 상대적으로 테스트가 쉬움
- UI 버그 조기 발견

**주의사항:**

- Recoil, React Router 의존성 Mock 필요
- 사용자 인터랙션 테스트 (`@testing-library/user-event`)

**예시:**

```typescript
// src/Components/Common/__tests__/Loading.test.tsx
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('로딩 스피너를 렌더링해야 함', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

**예상 소요 시간:** 2주

---

### 🔵 4순위: 페이지 컴포넌트 테스트 (Integration Test)

**대상:**

- `src/Components/Page/Board/BoardList.tsx`
- `src/Components/Page/Member/Login.tsx`
- `src/Components/Page/IBAS/Main.tsx`

**이유:**

- 사용자 플로우의 핵심
- 복잡한 로직과 상태 관리
- 통합 테스트로 전체 동작 확인

**주의사항:**

- 많은 의존성 Mock 필요 (API, Recoil, Router 등)
- 테스트 작성 비용이 높음
- 핵심 기능 위주로 작성

**예상 소요 시간:** 3-4주

---

### ⚪ 5순위: E2E 테스트 (선택사항)

**대상:**

- 주요 사용자 플로우 (로그인, 게시글 작성 등)

**도구:**

- Playwright
- Cypress

**이유:**

- 실제 사용자 시나리오 테스트
- 브라우저 환경에서의 동작 확인

**주의사항:**

- 설정 및 유지보수 비용이 높음
- CI/CD 파이프라인 구축 필요
- 우선순위 낮음 (선택사항)

**예상 소요 시간:** 2-3주 (설정 포함)

---

## 테스트 작성 전략

### 1. 점진적 접근

**단계별 진행:**

1. **1단계**: 유틸리티 함수 테스트 (1주)
2. **2단계**: Custom Hook 테스트 (1-2주)
3. **3단계**: 공통 컴포넌트 테스트 (2주)
4. **4단계**: 페이지 컴포넌트 테스트 (3-4주)

**원칙:**

- 한 번에 모든 것을 테스트하려고 하지 않기
- 새로 작성하는 코드부터 테스트 추가
- 리팩토링하는 부분에 테스트 추가

---

### 2. 테스트 커버리지 목표

**현실적인 목표:**

- **1년 목표**: 60-70% 커버리지
- **우선순위 높은 파일**: 80% 이상
- **유틸리티 함수**: 90% 이상

**주의:**

- 커버리지 100%를 목표로 하지 않기
- 의미 있는 테스트에 집중
- 유지보수 비용 고려

---

### 3. 테스트 파일 구조

```
src/
├── Functions/
│   ├── __tests__/
│   │   ├── dateFunction.test.ts
│   │   └── convertLabelFunctions.test.ts
│   └── dateFunction.tsx
├── Hooks/
│   ├── __tests__/
│   │   └── useFetch.test.tsx
│   └── useFetch.tsx
└── Components/
    └── Common/
        ├── __tests__/
        │   └── Loading.test.tsx
        └── Loading.tsx
```

**또는:**

```
src/
├── Functions/
│   ├── dateFunction.tsx
│   └── dateFunction.test.ts  # 같은 폴더에 배치
```

**권장:** 같은 폴더에 배치 (`.test.ts` 파일)

---

### 4. 테스트 작성 가이드라인

**AAA 패턴 사용:**

```typescript
describe('함수명', () => {
  it('해야 할 일', () => {
    // Arrange (준비)
    const input = 'test';

    // Act (실행)
    const result = functionToTest(input);

    // Assert (검증)
    expect(result).toBe('expected');
  });
});
```

**테스트 네이밍:**

- `describe`: 테스트할 함수/컴포넌트명
- `it`: "해야 할 일"을 명확하게 작성
- 예: `it('날짜를 YYYY-MM-DD 형식으로 변환해야 함')`

**Mock 사용 원칙:**

- 외부 의존성만 Mock
- 순수 함수는 Mock 하지 않기
- Mock은 최소한으로 사용

---

### 5. CI/CD 통합

**GitHub Actions 예시:**

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test -- --coverage
```

**권장:**

- PR 생성 시 자동 테스트 실행
- 커버리지 리포트 생성
- 테스트 실패 시 PR 머지 차단

---

## 테스트 작성 체크리스트

**유틸리티 함수:**

- [ ] 정상 케이스 테스트
- [ ] 엣지 케이스 테스트 (null, undefined, 빈 문자열 등)
- [ ] 에러 케이스 테스트

**Custom Hook:**

- [ ] 초기 상태 테스트
- [ ] 상태 변경 테스트
- [ ] 에러 처리 테스트
- [ ] 사이드 이펙트 테스트

**컴포넌트:**

- [ ] 렌더링 테스트
- [ ] 사용자 인터랙션 테스트
- [ ] Props 변경 테스트
- [ ] 조건부 렌더링 테스트

---

## 예상 소요 시간 및 리소스

**전체 테스트 작성:**

- **1순위 (유틸리티)**: 1주
- **2순위 (Hook)**: 1-2주
- **3순위 (컴포넌트)**: 2주
- **4순위 (페이지)**: 3-4주
- **총 예상 시간**: 7-9주

**권장 접근:**

- 새 기능 개발 시 테스트 함께 작성
- 리팩토링 시 기존 테스트 보완
- 점진적으로 커버리지 확대

---

## 참고 자료

- [React Testing Library 공식 문서](https://testing-library.com/react)
- [Jest 공식 문서](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

[← 메인 리팩토링 문서로 돌아가기](./REFACTORING.md)

