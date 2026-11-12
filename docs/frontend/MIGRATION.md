# 마이그레이션 계획

이 문서는 inhabas.com-front 프로젝트의 기술 스택 마이그레이션 계획을 담고 있습니다.

> ⚠️ **주의**: 마이그레이션은 기능 개발과 병행하여 **점진적으로** 진행합니다. 급하게 전환할 필요는 없으며, 팀 일정과 리스크를 고려하여 결정합니다.

> 📚 **관련 문서**: [리팩토링 체크리스트](./CHECKLIST.md) | [테스트 전략](./TESTING.md) | [TanStack Query 컨벤션](./TANSTACK-QUERY.md)

---

## ✅ 완료된 마이그레이션

| 항목                             | 완료 시점              | 비고                                                                                  |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| **CRA → Vite**                   | 완료                   | `vite.config.ts`, `@vitejs/plugin-react` 적용                                         |
| **폴더 구조 재설계**             | 완료                   | feature 기반 구조 (`components/`, `pages/`, `containers/`)                            |
| **폴더명 소문자 통일**           | 완료                   | 전체 폴더명 소문자 변경                                                               |
| **환경변수 마이그레이션**        | 완료                   | `process.env.REACT_APP_*` → `import.meta.env.VITE_*`                                  |
| **TypeScript 4.9 → 5.9.3**       | 2026-09-28 (#652)      | `moduleResolution` 정합성 복구, `npm run typecheck` 추가                              |
| **useFetch → TanStack Query v5** | 2026-11-09 (#661–#674) | PR 12개, `useFetch`·서버 상태 atom·`axios` 제거. 규칙은 [컨벤션](./TANSTACK-QUERY.md) |

---

## 🔴 즉시 필요 (버그/오류)

### 1. `@types/react-router-dom` 버전 불일치 수정

**현재 상황:**

```json
// package.json - 버전 불일치
"react-router-dom": "^6.14.2",           // 실제 라이브러리: v6
"@types/react-router-dom": "^5.3.3",     // 타입 정의: v5 ← ⚠️ 불일치
```

React Router DOM v6은 자체 타입 정의를 포함하므로 별도 `@types` 패키지가 불필요. v5 타입을 사용하면 일부 API 타입이 잘못 추론될 수 있음.

**마이그레이션 방법:**

```bash
# v5 타입 제거 (v6에는 내장 타입이 있음)
npm uninstall @types/react-router-dom
```

**마이그레이션 난이도:** 매우 낮음  
**예상 소요 시간:** 10분

**체크리스트:**

- [ ] `@types/react-router-dom` 제거
- [ ] 타입 에러 없는지 확인

---

### 2. TypeScript 4.9 → 5.9.3 업그레이드 — ✅ 완료

2026-09-28 #652로 main에 병합했다(이슈 #627).

- TS 4.9.5가 `moduleResolution: "bundler"`를 인식하지 못해 `tsc --noEmit`이 설정 단계에서 실패하던 문제를 해결했다.
- 타입 검사용 `npm run typecheck` 스크립트를 추가했다.
- 타입 에러는 `ActivityDetail`의 효과 없는 styled prop 1곳만 고쳤다. 런타임 동작은 같다.

**남은 항목:**

- [ ] `tsconfig.json`의 `target: "ES2015"` → `"ES2020"` 이상 상향 검토

---

## 🟡 중간 우선순위

### 3. 절대 경로 alias (`@/`) 설정

**현재 상황:**

프로젝트 전체에서 상대 경로(`../../`)만 사용. tsconfig에 `paths` 설정 없음.

```typescript
// ❌ 현재 - 상대 경로 (10곳 이상에서 3단계 이상)
import { useFetch } from '../../../hooks/useFetch';
import { modalInfo } from '../../../recoil/frontState';

// ✅ 목표 - 절대 경로 alias
import { useFetch } from '@/hooks/useFetch';
import { modalInfo } from '@/recoil/frontState';
```

**마이그레이션 방법:**

#### 1단계: `vite.config.ts` 수정

```typescript
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 2단계: `tsconfig.json` 수정

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### 3단계: import 경로 일괄 변환

codemod 도구 또는 VSCode 전역 검색/교체로 점진적 변환.

**마이그레이션 난이도:** 낮음 (설정은 쉽고, import 교체는 반복 작업)  
**예상 소요 시간:** 1~2일

**체크리스트:**

- [ ] `vite.config.ts` alias 설정
- [ ] `tsconfig.json` paths 설정
- [ ] 기존 `../../` import 경로 `@/`로 변환
- [ ] 빌드 및 타입 에러 확인

---

### 4. TanStack Query 전환 후속 작업

전환 자체는 끝났다(위 "✅ 완료" 표). 규칙은 [TanStack Query 컨벤션](./TANSTACK-QUERY.md)에 있다. 아래는 전환 범위에서 일부러 뺀 일과 아직 확인하지 못한 QA다.

**후속 작업** (각각 별도 PR)

- [ ] 과도기 QueryClient 기본값 해제 (해제 조건은 컨벤션 문서 8절), `setQueryData`·낙관적 업데이트 검토
- [ ] 에러·인증 UX 개선: alert → 토스트, refresh 뒤 원 요청 재시도, 죽은 A007·401 분기 정리
- [ ] Suspense·ErrorBoundary와 에러 화면
- [ ] 자동 테스트 (Vitest, MSW, CI)

파일·이미지 blob 다운로드 4곳(Carousel, BoardDetail, ActivityDetail, ContestDetail의 직접 `fetch`)은 서버 상태가 아니라 전환 대상이 아니다.

**미확인 QA** (모두 상용 배포 후 읽기 확인까지만 했다)

| PR                       | 미확인                                                                  |
| ------------------------ | ----------------------------------------------------------------------- |
| 2 홈·소개 (#663)         | 에러 경로 5번(`code` 없는 500), 연혁 추가·수정·삭제, `Button :disabled` |
| 3 장학 (#664)            | 변경, 404/403                                                           |
| 4 인증·내정보 (#665)     | 모달 저장, signing                                                      |
| 5 가입·회칙 (#667)       | 가입 흐름 전체                                                          |
| 6 게시판 (#668)          | 글·댓글 변경                                                            |
| 7 활동·공모전 (#669)     | 작성·저장·삭제                                                          |
| 8 회계 내역 (#670)       | 총무 화면, 변경                                                         |
| 9 예산 신청 (#671)       | 상태 변경, 작성                                                         |
| 10 회원 관리 표 (#672)   | 뮤테이션, 체크박스, 이름 수정 요청 목록, 403                            |
| 11 회원 관리 기타 (#674) | `/staff/manage`, 지원서 내용, 일정 저장, 회칙 수정, 합격·불합격         |

---

> 💡 **참고:** `package.json`의 `dependencies`에 `"npm": "^10.0.0"`이 포함되어 있음 (의도치 않게 추가된 것으로 보임). pnpm 전환 여부와 무관하게 **이 항목은 삭제 필요**.

---

## 🟢 장기 검토 (선택사항)

### 6. Recoil → Jotai 마이그레이션

**현재 상황:**

Recoil 사용: 전체 74개 파일, 436곳. Recoil은 Meta에서 적극적으로 유지보수하지 않는 상태.

**옵션 비교:**

|                     | Jotai            | Zustand           |
| ------------------- | ---------------- | ----------------- |
| Recoil 유사성       | 높음 (atom 기반) | 낮음 (store 기반) |
| 마이그레이션 난이도 | 낮음             | 중간              |
| 번들 크기           | ~3KB             | ~1KB              |
| TypeScript 지원     | 우수             | 우수              |
| 커뮤니티            | 활발             | 매우 활발         |

TanStack Query 도입 후 서버 상태 atom이 제거되면 Recoil 의존도가 크게 줄어들어 마이그레이션 비용도 낮아짐. **TanStack Query 마이그레이션 완료 후** 진행 권장.

**마이그레이션 난이도:** 중간  
**예상 소요 시간:** 2~4주

**체크리스트:**

- [x] TanStack Query 마이그레이션 완료 후 진행
- [ ] atom 목록 정리 (UI 상태만 남긴 것 확인)
- [ ] Jotai로 점진적 전환
- [ ] Recoil 완전 제거

---

### 7. styled-components → 스타일링 전환 검토

**현재 상황:**

styled-components v6 사용 중: 44개 파일. 당장 큰 문제는 없으나 아래 이유로 장기적으로 전환을 검토할 만함.

**전환 고려 배경:**

- **런타임 오버헤드**: CSS-in-JS는 런타임에 스타일을 생성해 주입 → 성능에 영향
- **번들 크기**: styled-components 자체 번들이 포함됨
- **React Server Components 비호환**: 현재 프로젝트는 해당 없으나 장기적으로 고려

**옵션 비교:**

|                         | vanilla-extract | Panda CSS     | Tailwind CSS    | CSS Modules   | Emotion   |
| ----------------------- | --------------- | ------------- | --------------- | ------------- | --------- |
| **런타임 오버헤드**     | 없음 (제로)     | 없음 (제로)   | 없음 (제로)     | 없음 (제로)   | 있음      |
| **타입 안정성**         | 매우 우수       | 우수          | 클래스명 문자열 | 보통          | 보통      |
| **동적 스타일**         | `sprinkles` API | 레시피 시스템 | 클래스 조합     | CSS 변수 활용 | 우수      |
| **styled 문법 유사성**  | 낮음            | 낮음          | 낮음            | 낮음          | 높음      |
| **마이그레이션 난이도** | 높음            | 높음          | 높음            | 중간          | 낮음      |
| **학습 곡선**           | 있음            | 있음          | 있음            | 낮음          | 낮음      |
| **빌드 도구 통합**      | Vite 플러그인   | Vite 플러그인 | PostCSS         | 기본 지원     | 기본 지원 |

**옵션별 특징:**

#### 제로 런타임 계열 (성능 최우선)

**vanilla-extract**

- 빌드 타임에 CSS 파일을 생성, 런타임 오버헤드 0
- TypeScript로 스타일 작성 → 타입 안전성 최상
- `sprinkles`로 유틸리티 클래스 조합 가능 (Tailwind 역할)
- `recipes`로 컴포넌트 변형 관리 (styled-components의 `props` 대체)
- 러닝커브 있지만 현재 프로젝트 규모에 적합

**Panda CSS**

- vanilla-extract와 유사한 제로 런타임 CSS-in-JS
- JSX style props, recipes, patterns 지원
- Tailwind와 비슷한 유틸리티 시스템 + CSS-in-JS의 동적 스타일
- 비교적 신규 라이브러리 (2023년 등장)

#### 유틸리티 클래스 계열

**Tailwind CSS**

- 현재 가장 널리 사용되는 스타일링 방법
- 제로 런타임, 사용한 클래스만 번들에 포함
- 디자인 시스템 변수 관리 용이
- styled-components의 동적 스타일(`props => ...`)을 `clsx` 등으로 대체
- 기존 44개 파일 전면 재작성 필요

#### 보수적 전환

**CSS Modules**

- 순수 CSS 사용, 스코프 자동 격리
- 런타임 오버헤드 없음
- 동적 스타일은 CSS 변수 + clsx 조합
- 기존 styled-components 스타일 구조와 가장 유사한 파일 단위 관리

**Emotion**

- styled-components와 API 유사 → **마이그레이션 난이도 최저**
- 런타임 오버헤드는 여전히 존재
- styled-components 대비 번들 크기 소폭 감소
- 성능 개선 목적이라면 제로 런타임 옵션이 더 효과적

**현재 권고:**

실제 성능 측정 없이 마이그레이션을 진행할 필요는 없음. 전환 시 아래 기준으로 선택 권장:

- **성능 개선이 목적** → vanilla-extract 또는 Panda CSS
- **Tailwind 경험이 있는 팀** → Tailwind CSS
- **마이그레이션 비용 최소화** → CSS Modules
- **최소한의 변경만** → Emotion (하지만 런타임 오버헤드는 유지)

**마이그레이션 난이도:** 중간~~높음 (선택 옵션에 따라 다름)  
**예상 소요 시간:** CSS Modules 3~~4주 / Tailwind·vanilla-extract 6~8주

---

### 8. TypeScript strict mode 강화

**현재 상황:**

`tsconfig.json`에 `"strict": true`가 활성화되어 있으나, 코드베이스에 `any` 타입이 다수 존재 (약 50개 이상 파일, [CHECKLIST.md](./CHECKLIST.md) 2번 항목 참고).

**목표:**

```json
// tsconfig.json 추가 검토 옵션
{
  "compilerOptions": {
    "strict": true, // 현재 활성화
    "noImplicitReturns": true, // 검토
    "noUnusedLocals": true, // 검토
    "noUnusedParameters": true, // 검토
    "exactOptionalPropertyTypes": true // 검토 (영향 큼)
  }
}
```

**마이그레이션 전략:**

`any` 타입 제거 → `useFetch` 제네릭화 → strict 옵션 점진적 추가.

**마이그레이션 난이도:** 중간 (옵션 하나씩 추가하며 에러 수정)  
**예상 소요 시간:** 주당 1개 옵션 추가 기준 4~6주

---

## 마이그레이션 우선순위 요약

| 우선순위 | 항목                                   | 난이도    | 예상 기간 |
| -------- | -------------------------------------- | --------- | --------- |
| ✅ 완료  | CRA → Vite                             | -         | -         |
| ✅ 완료  | 환경변수 `REACT_APP_` → `VITE_`        | -         | -         |
| ✅ 완료  | TypeScript 5.9.3 업그레이드 (#652)     | -         | -         |
| 🔴 즉시  | `@types/react-router-dom` v5 타입 제거 | 매우 낮음 | 10분      |
| 🟡 중간  | 절대 경로 alias (`@/`) 설정            | 낮음      | 1~2일     |
| ✅ 완료  | useFetch → TanStack Query (#661–#674)  | -         | -         |
| 🟢 장기  | Recoil → Jotai                         | 중간      | 2~4주     |
| 🟢 장기  | styled-components → 제로 런타임 검토   | 중간~높음 | 3~8주     |
| 🟢 장기  | TypeScript strict 강화                 | 중간      | 4~6주     |

---

## 마이그레이션 원칙

**진행해야 하는 경우:**

- 실제 버그나 타입 오류가 발생하고 있음
- 유지보수가 어려워지고 있음
- 팀이 학습할 여유가 있음

**보류해야 하는 경우:**

- 단순히 "최신 기술"이라는 이유만으로
- 프로젝트가 안정적으로 작동 중
- 다른 우선순위 높은 작업이 많음
