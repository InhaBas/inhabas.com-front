# 장기 마이그레이션 계획

이 문서는 [메인 리팩토링 문서](./REFACTORING.md)의 장기 마이그레이션 계획을 담고 있습니다.

## 개요

이 문서는 현재 사용 중인 기술 스택(CRA, Recoil, styled-components)을 최신 기술로 마이그레이션하는 계획을 다룹니다.

> ⚠️ **주의**: 이 마이그레이션들은 **선택사항**이며, 현재 기술 스택이 정상 작동 중이므로 급하게 진행할 필요는 없습니다.

---

## 10. npm → pnpm 마이그레이션

**현재 상황:**

- **npm** 사용 중 (`package-lock.json` 존재)
- `package.json`에 `npm`이 dependencies에 포함되어 있음 (의도치 않은 것 같음)

**pnpm의 장점:**

- 🚀 **빠른 설치 속도**: npm/yarn보다 2-3배 빠름
- 💾 **디스크 공간 절약**: 하드 링크를 사용하여 중복 패키지 저장 방지
- 🔒 **엄격한 의존성 관리**: phantom dependencies 방지
- 📦 **작은 node_modules**: 심볼릭 링크로 효율적인 저장
- ✅ **npm/yarn과 호환**: 대부분의 npm 스크립트 그대로 사용 가능

**마이그레이션 난이도:** **매우 낮음** (거의 즉시 가능)

**장점:**

- 설치 속도 향상
- 디스크 공간 절약
- 더 엄격한 의존성 관리
- npm과 거의 동일한 사용법

**단점:**

- 팀원들이 pnpm을 설치해야 함
- CI/CD 파이프라인 수정 필요
- 일부 레거시 도구와 호환성 문제 가능 (거의 없음)

**마이그레이션 단계:**

#### 1단계: pnpm 설치

```bash
# npm으로 전역 설치
npm install -g pnpm

# 또는 Homebrew (macOS)
brew install pnpm

# 또는 curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### 2단계: 기존 lock 파일 제거 및 pnpm 설치

```bash
# 기존 lock 파일 제거
rm package-lock.json  # 또는 yarn.lock

# pnpm으로 의존성 설치
pnpm install
```

#### 3단계: `.npmrc` 설정 (선택사항)

**`.npmrc` 파일 생성:**

```
# 엄격한 peer dependencies 검사 비활성화 (필요시)
strict-peer-dependencies=false

# 또는 활성화 (권장)
strict-peer-dependencies=true
```

#### 4단계: `.gitignore` 확인

**`.gitignore`에 추가 (없는 경우):**

```
# pnpm
pnpm-lock.yaml
.pnpm-store/
```

#### 5단계: CI/CD 파이프라인 수정

**GitHub Actions 예시:**

```yaml
# 기존 (npm)
- uses: actions/setup-node@v2
  with:
    node-version: '18'
- run: npm ci
- run: npm run build

# 변경 (pnpm)
- uses: pnpm/action-setup@v2
  with:
    version: 8
- uses: actions/setup-node@v2
  with:
    node-version: '18'
    cache: 'pnpm'
- run: pnpm install --frozen-lockfile
- run: pnpm run build
```

**주의사항:**

1. **`package.json`에서 `npm` 의존성 제거**: `"npm": "^10.0.0"` 제거 (의도치 않은 것 같음)
2. **스크립트는 그대로 사용 가능**: `npm start` → `pnpm start` (동일)
3. **`pnpm-lock.yaml` 커밋**: `package-lock.json` 대신 `pnpm-lock.yaml` 커밋
4. **팀원 공지**: 모든 팀원이 pnpm 설치 필요

**예상 소요 시간:** **1일 이내** (매우 빠름)

**마이그레이션 체크리스트:**

- [ ] pnpm 설치
- [ ] `package-lock.json` 제거
- [ ] `pnpm install` 실행
- [ ] `.gitignore`에 `pnpm-lock.yaml` 확인 (일반적으로 커밋함)
- [ ] `package.json`에서 불필요한 `npm` 의존성 제거
- [ ] CI/CD 파이프라인 수정
- [ ] 팀원들에게 pnpm 설치 안내
- [ ] 빌드 및 테스트 확인

**권장 사항:**

- **매우 쉬운 마이그레이션**이므로 **우선순위 높게 고려** 권장
- npm과 거의 동일하게 사용 가능하여 리스크가 낮음
- 개발 경험 향상 (빠른 설치, 디스크 공간 절약)
- **CRA → Vite 마이그레이션과 함께 진행**하면 좋음

**참고 자료:**

- [pnpm 공식 문서](https://pnpm.io/)
- [pnpm vs npm vs yarn 비교](https://pnpm.io/feature-comparison)
- [pnpm GitHub Actions](https://github.com/pnpm/action-setup)

---

## 11. CRA → Vite 마이그레이션

**현재 상황:**

- **Create React App (CRA)** 기반 프로젝트
- `react-scripts: 5.0.1` 사용
- `package.json`에 `react-scripts start`, `react-scripts build` 스크립트 사용

**문제점:**

- CRA는 더 이상 활발히 유지보수되지 않음
- 빌드 속도가 느림 (Webpack 기반)
- 개발 서버 시작이 느림
- 번들 크기가 큼
- 커스터마이징이 어려움 (eject 필요)

**Vite의 장점:**

- ⚡ **매우 빠른 개발 서버**: HMR(Hot Module Replacement)이 즉시 반영
- 🚀 **빠른 빌드**: esbuild 기반으로 빌드 속도가 CRA보다 10-100배 빠름
- 📦 **작은 번들 크기**: Tree-shaking이 더 효율적
- 🔧 **쉬운 설정**: 설정 파일이 간단하고 명확함
- 🎯 **최신 표준**: ES modules, 최신 JavaScript 기능 지원

**마이그레이션 난이도:** **중간**

**장점:**

- 개발 경험(DX)이 크게 향상됨
- 빌드 시간 단축
- 최신 도구 사용 가능
- 커뮤니티 활성도 높음

**단점:**

- 일부 CRA 전용 설정을 수동으로 마이그레이션해야 함
- 환경변수 처리 방식이 다름 (`REACT_APP_` → `VITE_`)
- 일부 플러그인/설정이 다를 수 있음

**마이그레이션 단계:**

#### 1단계: Vite 설치 및 기본 설정

```bash
# Vite 및 플러그인 설치
npm install -D vite @vitejs/plugin-react

# 기존 react-scripts 제거
npm uninstall react-scripts
```

#### 2단계: 설정 파일 생성

**`vite.config.ts` 생성:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
});
```

#### 3단계: `index.html` 수정

**`public/index.html` → `index.html` (루트로 이동):**

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IBAS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

#### 4단계: 환경변수 변경

**`.env` 파일 수정:**

```bash
# CRA 방식 (기존)
REACT_APP_API_URL=https://www.inhabas.com/api

# Vite 방식 (변경)
VITE_API_URL=https://www.inhabas.com/api
```

**코드에서 사용:**

```typescript
// CRA 방식 (기존)
process.env.REACT_APP_API_URL;

// Vite 방식 (변경)
import.meta.env.VITE_API_URL;
```

#### 5단계: `package.json` 스크립트 수정

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest" // 또는 기존 jest 유지
  }
}
```

#### 6단계: 타입 정의 추가

**`src/vite-env.d.ts` 생성:**

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BASE_URL: string;
  // ... 기타 환경변수
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**주의사항:**

1. **환경변수 접두사 변경**: `REACT_APP_` → `VITE_`
2. **환경변수 접근 방식**: `process.env` → `import.meta.env`
3. **public 폴더**: `public/` 폴더는 그대로 유지 (자동 처리)
4. **절대 경로**: `tsconfig.json`의 `paths` 설정 필요
5. **SVG/이미지 import**: Vite는 기본적으로 지원하지만 설정 확인 필요

**예상 소요 시간:** 1-2주

**마이그레이션 체크리스트:**

- [ ] Vite 설치 및 기본 설정
- [ ] `vite.config.ts` 생성
- [ ] `index.html` 루트로 이동 및 수정
- [ ] 환경변수 접두사 변경 (`REACT_APP_` → `VITE_`)
- [ ] 환경변수 접근 방식 변경 (`process.env` → `import.meta.env`)
- [ ] `package.json` 스크립트 수정
- [ ] 타입 정의 추가 (`vite-env.d.ts`)
- [ ] 절대 경로 설정 확인
- [ ] 빌드 테스트
- [ ] 배포 프로세스 확인

**권장 사항:**

- **CRA → Vite 마이그레이션은 비교적 쉬움** (다른 마이그레이션보다)
- 개발 경험 향상이 크므로 **우선순위를 높게 고려**해볼 만함
- 환경변수 변경만 주의하면 대부분 자동으로 작동
- 단계적으로 진행 가능 (새 브랜치에서 테스트 후 병합)

**참고 자료:**

- [Vite 공식 문서](https://vitejs.dev/)
- [CRA to Vite Migration Guide](https://github.com/vitejs/vite/discussions/3048)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)

---

## 12. Recoil → Zustand/Jotai 마이그레이션

**현재 상황:**

- Recoil 사용: **436개 매치, 74개 파일**
- Recoil은 Meta에서 개발했지만, 최근에는 Zustand, Jotai, Redux Toolkit 등이 더 인기

**문제점:**

- Recoil의 공식 지원이 약해지고 있음
- 커뮤니티 활성도가 상대적으로 낮음
- 번들 크기가 상대적으로 큼

**마이그레이션 옵션:**

#### 옵션 1: Zustand (권장)

- **장점:**
  - 매우 가벼움 (~1KB)
  - 간단한 API
  - TypeScript 지원 우수
  - Recoil보다 학습 곡선이 낮음
- **단점:**
  - Recoil의 atom 개념과 다름 (Context 기반)
- **마이그레이션 난이도:** 중간

#### 옵션 2: Jotai

- **장점:**
  - Recoil과 유사한 atom 기반 API
  - 마이그레이션이 상대적으로 쉬움
  - 가벼움
- **단점:**
  - 커뮤니티가 Zustand보다 작음
- **마이그레이션 난이도:** 낮음 (Recoil과 유사)

#### 옵션 3: React Context + useReducer

- **장점:**
  - 외부 라이브러리 불필요
  - React 내장 기능만 사용
- **단점:**
  - 성능 최적화가 필요할 수 있음
  - 복잡한 상태 관리에 부적합
- **마이그레이션 난이도:** 높음

**마이그레이션 전략:**

1. **점진적 마이그레이션**: 한 번에 모든 것을 바꾸지 않고, 새 기능부터 새 라이브러리 사용
2. **병행 운영**: Recoil과 새 라이브러리를 동시에 사용하며 점진적으로 전환
3. **마이그레이션 도구**: 자동 변환 스크립트 작성 (가능한 경우)

**예상 소요 시간:** 4-6주 (전체 마이그레이션)

**권장 사항:**

- **지금 당장 마이그레이션할 필요는 없음**
- Recoil이 여전히 작동하고 있으므로, 새로운 프로젝트나 큰 리팩토링 시점에 고려
- 팀의 학습 곡선과 프로젝트 일정을 고려하여 결정

---

## 13. styled-components → Tailwind CSS / CSS Modules 마이그레이션

**현재 상황:**

- styled-components 사용: **75개 매치, 44개 파일**
- styled-components는 여전히 사용되지만, Tailwind CSS가 최근 트렌드

**문제점:**

- 런타임 오버헤드 (CSS-in-JS)
- 번들 크기가 큼
- SSR 시 성능 이슈 가능성
- 최근 React Server Components와의 호환성 문제

**마이그레이션 옵션:**

#### 옵션 1: Tailwind CSS (권장)

- **장점:**
  - 매우 빠른 개발 속도
  - 작은 번들 크기 (사용한 클래스만 포함)
  - 유틸리티 퍼스트 접근
  - 커뮤니티 활성도 높음
- **단점:**
  - HTML 클래스명이 길어질 수 있음
  - 학습 곡선 (유틸리티 클래스 학습 필요)
- **마이그레이션 난이도:** 중간-높음

#### 옵션 2: CSS Modules

- **장점:**
  - 순수 CSS 사용
  - 스코프 격리 자동
  - 런타임 오버헤드 없음
- **단점:**
  - 동적 스타일링이 제한적
  - 테마 관리가 복잡할 수 있음
- **마이그레이션 난이도:** 중간

#### 옵션 3: Emotion (styled-components 대체)

- **장점:**
  - styled-components와 유사한 API
  - 더 작은 번들 크기
  - 더 나은 성능
- **단점:**
  - 여전히 CSS-in-JS (런타임 오버헤드)
- **마이그레이션 난이도:** 낮음 (API가 유사)

**마이그레이션 전략:**

1. **하이브리드 접근**: 새 컴포넌트는 Tailwind로, 기존은 유지
2. **점진적 전환**: 컴포넌트별로 하나씩 마이그레이션
3. **코드 변환 도구**: styled-components → Tailwind 변환 스크립트 활용

**예상 소요 시간:** 6-8주 (전체 마이그레이션)

**권장 사항:**

- **styled-components가 여전히 잘 작동하므로 급하게 마이그레이션할 필요는 없음**
- 새 프로젝트나 대규모 리팩토링 시점에 고려
- 팀의 선호도와 프로젝트 특성에 따라 결정
- 성능 문제가 실제로 발생하는지 먼저 측정

---

## 마이그레이션 우선순위 결정 기준

**마이그레이션을 고려해야 하는 경우:**

- ✅ 실제 성능 문제가 발생하고 있음
- ✅ 유지보수가 어려워지고 있음
- ✅ 새로운 기능 추가가 기술 부채로 인해 어려움
- ✅ 팀이 새로운 기술 스택을 학습할 여유가 있음
- ✅ 큰 리팩토링을 계획 중임

**마이그레이션을 보류해야 하는 경우:**

- ❌ 단순히 "최신 기술"이라는 이유만으로
- ❌ 프로젝트가 안정적으로 작동 중
- ❌ 팀의 학습 여유가 없음
- ❌ 다른 우선순위 높은 작업이 많음
- ❌ 마이그레이션 리스크가 높음

---

[← 메인 리팩토링 문서로 돌아가기](./REFACTORING.md)
