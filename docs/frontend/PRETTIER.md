# ESLint + Prettier

이 문서는 inhabas.com-front 프로젝트의 ESLint · Prettier 설정을 설명합니다.

> 📚 **관련 문서**: [스타일 컨벤션](../STYLE-CONVENTION.md) | [마이그레이션 계획](./MIGRATION.md)

---

## 현재 상황

| 항목     | 상태                                      |
| -------- | ----------------------------------------- |
| ESLint   | ✅ `eslint.config.js` (flat config)       |
| Prettier | ✅ `.prettierrc`                          |
| CI       | ✅ PR마다 `npm run lint` / `format:check` |

과거 `.eslintrc.json`(legacy 포맷)이 `eslint@10`과 조합되어 있었는데, ESLint
v9부터 legacy config를 지원하지 않아 **실제로는 한 번도 실행되지 않은 상태**로
방치돼 있었다. `package.json`에 `lint` 스크립트도 없었고 CI도 `build`만 돌려서
아무도 눈치채지 못했다. flat config(`eslint.config.js`)로 이관하며 문제를 해결했다.

---

## gts (Google TypeScript Style)에 대하여

과거 문서가 "Prettier를 이용해서 구글 스타일 컨벤션 적용"이라고 적어 두었던
것은 Google의 `gts` 도구를 가리킨 것으로 보이나, `gts`는 Node.js/서버 TypeScript에
최적화되어 있어 React/JSX 규칙(`plugin:react`, `plugin:react-hooks`)을 별도로
얹어야 한다. ESLint/Prettier를 각자 직접 설정하는 지금 방식과 실익 차이가 없어
채택하지 않았다.

---

## 패키지

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-import \
  eslint-import-resolver-typescript @eslint/js @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks globals
```

`eslint`는 **9.x 최신판에 고정**돼 있다. `eslint@10`은 `eslint-plugin-react`가
아직 지원하지 않는 내부 API 변경(`context.getFilename()` 제거 등)이 있어 켜는
즉시 크래시한다. 다른 플러그인(`react-hooks`, `@typescript-eslint`, `import`)은
모두 9.x/10.x를 함께 지원하므로, `eslint-plugin-react`가 10.x를 지원하기 전까지는
9.x에 고정해 둔다.

## `eslint.config.js` (flat config)

- `js.configs.recommended` + `@typescript-eslint`의 `recommended` + `eslint-plugin-react`의
  `recommended`/`jsx-runtime` + `eslint-plugin-react-hooks`의 `recommended`를 기반으로 한다.
- `eslint-config-prettier`를 배열 마지막에 둬서 포매팅 관련 규칙과 충돌하지 않게 한다.
- `no-undef`는 TS 파일에서 끈다. `@types/react`가 선언하는 UMD 전역 타입
  (`React.ChangeEvent` 등)을 오탐하기 때문 — 타입 미정의 여부는 TS 컴파일러가 더
  정확히 잡아낸다.
- `@typescript-eslint/no-unused-expressions`는 `allowShortCircuit` /
  `allowTernary`를 켠다. `condition && doSomething()` 형태의 부수효과 관용구가
  이미 코드베이스에 있기 때문.
- 아래 규칙은 도입 시점에 위반량이 많아 **warn**으로 낮춰 점진적으로 해소한다.
  - `react-hooks/exhaustive-deps`
  - `react-hooks/set-state-in-effect` / `react-hooks/immutability` / `react-hooks/purity`
    (eslint-plugin-react-hooks v7의 React Compiler 대비 신규 규칙)
  - `@typescript-eslint/no-explicit-any`
  - `react/no-array-index-key`
  - `@typescript-eslint/no-unused-vars`
- `import/order`로 import 정렬을 강제한다. 아래 [import 순서](#import-순서) 참고.

## `.prettierrc` (팀 결정값)

```json
{
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "semi": true
}
```

| 옵션             | 값      | 설명                     |
| ---------------- | ------- | ------------------------ |
| `tabWidth`       | `2`     | 들여쓰기 2칸             |
| `printWidth`     | `100`   | 줄 최대 길이             |
| `singleQuote`    | `true`  | 문자열에 작은따옴표 사용 |
| `jsxSingleQuote` | `false` | JSX 속성은 큰따옴표 유지 |
| `semi`           | `true`  | 문장 끝 세미콜론         |

명시하지 않은 옵션(`trailingComma`, `arrowParens` 등)은 Prettier 기본값을 따른다.

> 이전 초안은 `tabWidth: 4`, `arrowParens: "avoid"`, `trailingComma: "es5"`를
> 권고했으나 팀 논의로 **위 값으로 대체**됐다. 특히 `tabWidth: 4`는 폐기됐다 —
> 코드베이스가 4칸이었던 건 Prettier 도입 전 상태였을 뿐, 팀은 2칸으로 가기로
> 결정했다. 첫 포맷 커밋에서 4칸→2칸, 큰따옴표→작은따옴표가 거의 전 파일에서
> 한 번에 뒤집힌 이유다.

## import 순서

[스타일 컨벤션](../STYLE-CONVENTION.md#import-순서)이 정한 5그룹 규약 중
`react`/`react-dom`/`react-router-dom`을 다른 외부 패키지보다 앞세우고 나머지는
알파벳순으로 정렬하는 부분만 `import/order`로 강제한다.

`components/containers/pages/layout/routes` → `hooks/functions/recoil` →
`types` → `styles` 로 상대 경로 import를 4단계 더 세분화하라는 컨벤션은
**기계적으로 강제하지 않는다.** `pathGroups`로 시도해봤으나 `--fix`가 한 번에
수렴하지 않고 재실행마다 순서가 바뀌는(팀원이 저장할 때마다 diff가 흔들리는)
불안정한 규칙이 됐다. 대신 상대 경로 import는 전부 한 그룹으로 묶고 알파벳순만
강제한다 — 4단계 구분은 컨벤션 문서로만 남기고 리뷰로 지킨다.
(자세한 이유는 `eslint.config.js`의 `import/order` 주석 참고)

## `.prettierignore`

```
build/
dist/
node_modules/
public/
coverage/
package-lock.json
```

Markdown, HTML, YAML은 **의도적으로 제외하지 않았다.** `docs/**`, `index.html`,
`.github/workflows/*.yml`도 포매팅 대상이다. styled-components 템플릿 리터럴 안의
CSS도 함께 포맷된다.

---

## 스크립트

| 스크립트               | 용도                                         |
| ---------------------- | -------------------------------------------- |
| `npm run lint`         | ESLint 검사 (`eslint src`)                   |
| `npm run lint:fix`     | ESLint 자동 수정                             |
| `npm run format`       | 전체 파일 자동 포매팅 (`prettier --write .`) |
| `npm run format:check` | 포매팅 위반 파일 확인 (CI용)                 |

CI(`.github/workflows/ci.yml`)는 PR마다 `lint` → `format:check` → `build` 순으로
돈다. `lint`는 ESLint **error**가 있을 때만 실패한다 (warn 규칙은 통과) —
위 warn 목록을 점진적으로 줄여 나가는 동안 PR이 막히지 않게 하기 위함이다.

---

## VSCode 설정 (팀원 공유)

워크스페이스 설정은 저장소의 [`.vscode/settings.json`](../../.vscode/settings.json)에
커밋돼 있어 저장소를 열면 자동으로 적용된다. 이 파일은 **어떤 도구로 포맷할지**만
정한다. 들여쓰기 같은 포맷 규칙은 `.prettierrc`, 린트 규칙은 `eslint.config.js`가
기준이므로 여기에 중복해 적지 않는다.

- 저장 시 Prettier로 포맷하고, ESLint 자동 수정(`import/order` 정렬 포함)을 적용한다.
- 포매터를 전역뿐 아니라 **언어별로도** Prettier로 지정한다. VSCode에서는 언어별
  설정이 범위와 상관없이 일반 설정보다 우선하므로, 개인 설정에 언어별로 다른
  포매터가 지정돼 있으면 전역 지정만으로는 덮어쓸 수 없기 때문이다.
- 언어 목록은 CI의 `format:check`가 검사하는 범위(JS/TS, JSON, CSS, HTML, Markdown,
  YAML)와 맞춘다. 검사 대상 확장자가 늘어나면 이 목록에도 추가한다.

VSCode Marketplace에서 **ESLint** (`dbaeumer.vscode-eslint`)와
**Prettier - Code formatter** (`esbenp.prettier-vscode`) 확장 설치가 필요하다.
