const js = require("@eslint/js");
const globals = require("globals");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: ["build/**", "dist/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: true,
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // 팀 결정: 위반이 많아 warn으로 낮춰 점진적으로 해소한다.
      // handoff/ESLINT-PRETTIER-HANDOFF.md 5절 참고.
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-array-index-key": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      // eslint-plugin-react-hooks v7의 recommended는 React Compiler 대비 규칙
      // (set-state-in-effect 79건, immutability 9건, purity 1건)까지 포함한다.
      // 이 저장소엔 처음 켜보는 규칙이라 위반량이 많아 일단 warn으로 낮춘다.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",

      // TS 파일에서 no-undef는 @types/react 같은 UMD 전역 타입(React.ChangeEvent 등)에
      // 오탐한다. 타입 미정의 여부는 TS 컴파일러가 더 정확히 잡아내므로 끈다.
      // (typescript-eslint 공식 권고: https://typescript-eslint.io/linting/troubleshooting/#i-am-using-a-rule-from-eslint-core-and-it-doesnt-work-correctly-with-typescript)
      "no-undef": "off",

      // `condition && doSomething()` / `condition ? a() : b()`를 문으로 쓰는
      // 관용구가 이미 코드베이스에 있다 (부수효과 목적, 대입/반환 아님).
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      // docs/STYLE-CONVENTION.md는 내부 import를
      // components/containers/pages/layout/routes → hooks/functions/recoil →
      // types → styles 4단계로 더 세분화하라고 적어 두었다. pathGroups로 그 4단계를
      // 강제해 봤지만 --fix가 한 번에 수렴하지 않고(재실행마다 순서가 바뀜) 오히려
      // 신뢰할 수 없는 규칙이 됐다. 대신 상대 경로 import는 전부 한 그룹으로 묶고
      // 알파벳순만 강제한다 — 세부 4단계 구분은 STYLE-CONVENTION.md의 컨벤션으로만
      // 남기고 기계적으로 강제하지 않는다.
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", ["internal", "parent", "sibling", "index"], "object", "type"],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-dom", group: "external", position: "before" },
            { pattern: "react-dom/**", group: "external", position: "before" },
            { pattern: "react-router-dom", group: "external", position: "before" },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  eslintConfigPrettier,
];
