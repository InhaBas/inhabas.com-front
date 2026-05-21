# Prettier 도입 검토

이 문서는 inhabas.com-front 프로젝트에 Prettier 도입을 검토하고, 실제 설정 방법을 안내합니다.

> 📚 **관련 문서**: [스타일 컨벤션](../STYLE-CONVENTION.md) | [마이그레이션 계획](./MIGRATION.md)

---

## 현재 상황

| 항목 | 상태 |
|------|------|
| Prettier | ❌ 미설치 |
| ESLint | ✅ `.eslintrc.json` 적용 중 |
| 포매팅 기준 | 팀원 IDE 설정에 따라 제각각 |

코드 포매팅이 팀원마다 달라 PR 리뷰 시 들여쓰기, 따옴표 등 스타일 차이가 노이즈로 섞이는 상황입니다.

---

## gts (Google TypeScript Style)에 대하여

기존 문서(`STYLE-CONVENTION.md`)에 "Prettier를 이용해서 구글 스타일 컨벤션 적용"이라고 명시되어 있었는데, 이는 Google이 공개한 **`gts` (Google TypeScript Style)** 도구를 가리킨 것으로 보입니다.

`gts`는 Google의 TypeScript 프로젝트에서 내부적으로 사용하는 ESLint + Prettier 번들입니다.

### gts 도입이 이 프로젝트에 적합하지 않은 이유

```
gts v7 (2025.12 기준)
├── ESLint flat config (eslint.config.js) 방식 사용
│   → 현재 .eslintrc.json (legacy format)과 형식 불일치
│   → ESLint 설정 전면 재작성 필요
└── Node.js / 서버 TypeScript에 최적화
    → React, JSX 관련 규칙 없음
    → plugin:react, plugin:react-hooks 별도 재설정 필요
```

**결론: gts 전체 도입 대비 실익이 없음.** Prettier 단독 도입으로 동일한 효과를 얻을 수 있습니다.

---

## 도입 방안: Prettier 단독 도입

### 설치

```bash
npm install -D prettier eslint-config-prettier
```

- `prettier`: 코드 포매터
- `eslint-config-prettier`: ESLint의 포매팅 관련 규칙을 비활성화해 Prettier와 충돌 방지

### `.prettierrc` 설정

아래는 권장 설정입니다. 팀 합의 후 결정합니다.

```json
{
    "singleQuote": true,
    "semi": true,
    "tabWidth": 4,
    "trailingComma": "es5",
    "printWidth": 100,
    "arrowParens": "avoid"
}
```

| 옵션 | 값 | 설명 |
|------|-----|------|
| `singleQuote` | `true` | 문자열에 작은따옴표 사용 |
| `semi` | `true` | 문장 끝 세미콜론 |
| `tabWidth` | `4` | 들여쓰기 4칸 (현재 코드베이스 스타일에 맞춤) |
| `trailingComma` | `"es5"` | ES5 유효한 위치에 후행 쉼표 |
| `printWidth` | `100` | 줄 최대 길이 |
| `arrowParens` | `"avoid"` | 화살표 함수 단일 인자 괄호 생략 (`x => x`) |

> ⚠️ `tabWidth: 4`는 현재 코드베이스의 4칸 들여쓰기를 반영한 것입니다. 2칸으로 전환하고 싶다면 별도로 팀 합의가 필요합니다.

### `.prettierignore` 설정

```
node_modules/
build/
dist/
public/
*.md
```

### `.eslintrc.json` 수정

`"prettier"`를 extends 마지막에 추가합니다. (순서 중요 — 다른 규칙을 덮어써야 함)

```json
{
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ]
}
```

### `package.json` 스크립트 추가

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "lint": "eslint src --ext .ts,.tsx",
        "format": "prettier --write src",
        "format:check": "prettier --check src"
    }
}
```

| 스크립트 | 용도 |
|---------|------|
| `npm run lint` | ESLint 검사 |
| `npm run format` | 전체 소스 자동 포매팅 |
| `npm run format:check` | 포매팅 위반 파일 확인 (CI용) |

---

## VSCode 설정 (팀원 공유)

팀원 모두가 저장 시 자동 포매팅되도록 `.vscode/settings.json`을 추가합니다.

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

VSCode Marketplace에서 **Prettier - Code formatter** (`esbenp.prettier-vscode`) 확장 설치가 필요합니다.

---

## 도입 절차

### Step 1: 팀 합의

`.prettierrc` 설정값 (특히 `singleQuote`, `tabWidth`)을 팀원과 합의합니다.

### Step 2: Prettier 도입 전용 PR

```bash
# 브랜치 생성
git checkout -b chore/add-prettier

# 패키지 설치 및 설정 파일 추가
npm install -D prettier eslint-config-prettier
# .prettierrc, .prettierignore 추가
# .eslintrc.json에 "prettier" 추가
# package.json 스크립트 추가

# 전체 코드 일괄 포매팅
npm run format

git add .
git commit -m "chore: Prettier 도입 및 전체 코드 포매팅 적용"
```

> ⚠️ **포매팅 변경과 기능 변경을 절대 같은 PR에 섞지 않습니다.** 리뷰어가 실제 코드 변경을 파악하기 어려워집니다.

### Step 3: CI에 포매팅 검사 추가 (선택)

GitHub Actions에 `format:check`를 추가하면 포매팅이 안 된 코드가 PR에 포함되는 것을 방지할 수 있습니다.

```yaml
- name: Format check
  run: npm run format:check
```

---

## 예상 소요 시간

| 작업 | 시간 |
|------|------|
| 설정 파일 작성 + 패키지 설치 | 30분 |
| 전체 파일 자동 포매팅 | 즉시 (`npm run format`) |
| 팀원 VSCode 설정 공유 | 10분 |
| **합계** | **약 1시간** |

---

## 도입 난이도: 매우 낮음 ✅
