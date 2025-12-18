# 리팩토링 체크리스트

이 문서는 inhabas.com-front 프로젝트의 리팩토링이 필요한 부분들을 정리한 문서입니다.

> 📚 **관련 문서**
>
> - [중간/낮은 우선순위 상세](./REFACTORING-DETAILS.md)
> - [장기 마이그레이션 계획](./REFACTORING-MIGRATION.md)
> - [테스트 전략](./REFACTORING-TESTING.md)

## 🔴 높은 우선순위

### 1. 중복된 URL 매핑 로직 추출

**문제점:**

- `BoardList.tsx`, `BoardDetail.tsx`, `BoardCreate.tsx`, `BoardSearch.tsx`에서 동일한 URL 매핑 로직이 반복됨
- 새로운 게시판 타입 추가 시 여러 파일을 수정해야 함

**현재 코드:**

```typescript
// 여러 파일에서 반복됨
let fetchUrl: string;
if (url === 'alpha') {
  fetchUrl = '/project/alpha';
} else if (url === 'beta') {
  fetchUrl = '/project/beta';
} else if (url === 'sponsor') {
  fetchUrl = '/scholarship/sponsor';
} else if (url === 'usage') {
  fetchUrl = '/scholarship/usage';
} else if (url === 'opensource') {
  fetchUrl = '/board/storage';
} else if (url === 'contest') {
  fetchUrl = '/contest/contest';
} else if (url === 'activity') {
  fetchUrl = '/contest/activity';
} else {
  fetchUrl = `/board/${url}`;
}
```

**리팩토링 방안:**

- `src/utils/boardUrlMapper.ts` 생성
- URL 매핑을 상수 객체로 관리
- 타입 안정성 확보 (enum 또는 union type 사용)

**예상 효과:**

- 코드 중복 제거 (4개 파일 → 1개 유틸)
- 유지보수성 향상
- 타입 안정성 개선

---

### 2. useFetch Hook 타입 안정성 개선

**문제점:**

- `any` 타입 과다 사용
- 반환 타입이 명확하지 않음
- 제네릭 미활용

**현재 코드:**

```typescript
const useFetch = (): [
  any, // ❌ any 타입
  (url: string, method: string, token?: string, sendData?: any, media?: boolean) => Promise<void>
] => {
  const [data, setData] = useState<any>(null); // ❌ any 타입
  // ...
};
```

**리팩토링 방안:**

- 제네릭 타입 도입: `useFetch<T>()`
- API 응답 타입 정의
- 에러 타입 정의

**예상 효과:**

- 타입 안정성 향상
- IDE 자동완성 개선
- 런타임 에러 감소

---

### 3. 에러 처리 로직 개선

**문제점:**

- `useFetch.tsx`에서 에러 처리 로직이 복잡하고 중복됨
- HTTP 상태 코드별 처리가 분산되어 있음
- 에러 메시지가 `alert`로만 표시됨

**현재 코드:**

```typescript
// 401 처리
if (errorResponse.status === 401) {
  navigate(-1);
}
// 403 처리
if (errorResponse.status === 403) {
  if (url === '/signUp') {
    navigate('/');
  } else {
    navigate(-1);
  }
}
// 404 처리
if (errorResponse.status === 404) {
  navigate('/notfound');
}
```

**리팩토링 방안:**

- 에러 핸들러 클래스/함수 분리
- HTTP 상태 코드별 처리 전략 패턴 적용
- Toast 알림 시스템 도입 (alert 대신)

**예상 효과:**

- 에러 처리 일관성 향상
- 사용자 경험 개선
- 코드 가독성 향상

---

## 📋 리팩토링 실행 계획

### Phase 1: 기반 작업 (1-2주)

1. ✅ URL 매핑 로직 추출
2. ✅ 타입 정의 강화
3. ✅ 상수 파일 생성

### Phase 2: 핵심 개선 (2-3주)

4. ✅ useFetch 타입 안정성 개선
5. ✅ 에러 처리 로직 개선
6. ✅ 환경변수 관리 개선

### Phase 3: 구조 개선 (2-3주)

7. ✅ 긴 컴포넌트 분리
8. ✅ Modal 컴포넌트 리팩토링
9. ✅ 폴더 구조 개선 (1단계: 명명 개선)
10. ✅ 스타일 컴포넌트 정리

### Phase 4: 마무리 (1주)

11. ✅ 주석 코드 제거
12. ✅ 테스트 작성 (자세한 내용은 [테스트 전략](./REFACTORING-TESTING.md) 참고)
13. ✅ 문서 업데이트

---

## 🎯 리팩토링 원칙

1. **점진적 개선**: 한 번에 모든 것을 바꾸지 않고 단계적으로 진행
2. **기능 유지**: 리팩토링 중에도 기존 기능이 정상 작동해야 함
3. **테스트 우선**: 리팩토링 전후 동작이 동일한지 확인
4. **타입 안정성**: `any` 타입을 최대한 제거하고 명확한 타입 정의
5. **코드 리뷰**: 리팩토링도 PR을 통해 리뷰 받기

---

## 📝 참고사항

- 리팩토링은 기능 추가와 분리하여 진행하는 것이 좋습니다
- 각 리팩토링은 작은 PR로 나누어 진행하는 것을 권장합니다
- 리팩토링 전후의 동작을 비교할 수 있도록 테스트 코드를 작성하는 것이 좋습니다
- 중간/낮은 우선순위 항목은 [REFACTORING-DETAILS.md](./REFACTORING-DETAILS.md) 참고
- 장기 마이그레이션 계획은 [REFACTORING-MIGRATION.md](./REFACTORING-MIGRATION.md) 참고
- 테스트 전략은 [REFACTORING-TESTING.md](./REFACTORING-TESTING.md) 참고
