# 스타일 컨벤션

이 문서는 inhabas.com-front 프로젝트의 코드 스타일 규약을 설명합니다.

---

## 코드 포매터 / 린터

ESLint(`eslint.config.js`, flat config) + Prettier(`.prettierrc`)를 사용합니다.
설정 근거와 상세 옵션은 [ESLint + Prettier](./frontend/PRETTIER.md) 문서를
참고하세요.

- `npm run lint` — ESLint 검사
- `npm run format` — Prettier 전체 포매팅
- `npm run format:check` — 포매팅 위반 확인 (CI에서 실행)

PR을 올리기 전에 `npm run lint`와 `npm run format`을 실행하세요. 저장 시
자동 포매팅되도록 VSCode 확장을 설정하는 방법도
[ESLint + Prettier 문서](./frontend/PRETTIER.md#vscode-설정-팀원-공유)에 있습니다.

---

## 네이밍 컨벤션

### 파일 및 폴더

| 대상           | 규칙                                 | 예시                              |
| -------------- | ------------------------------------ | --------------------------------- |
| 폴더           | `kebab-case` 또는 `camelCase` 소문자 | `components/`, `myInfo/`          |
| 컴포넌트 파일  | `PascalCase.tsx`                     | `BoardDetail.tsx`                 |
| 훅 파일        | `camelCase.ts`                       | `useFetch.ts`                     |
| 유틸/타입 파일 | `camelCase.ts`                       | `dateFunction.ts`, `TypeBoard.ts` |

### 변수 및 함수

| 대상              | 규칙                                 | 예시                                |
| ----------------- | ------------------------------------ | ----------------------------------- |
| 변수, 함수        | `camelCase`                          | `fetchBoardData`, `currentPage`     |
| React 컴포넌트    | `PascalCase`                         | `BoardDetail`, `CommentList`        |
| 커스텀 훅         | `use` 접두사 + `PascalCase`          | `useFetch`, `useRoleAuthorization`  |
| 상수              | `UPPER_SNAKE_CASE`                   | `BOARD_URL_MAP`, `MODAL_COMPONENTS` |
| 타입 / 인터페이스 | `PascalCase`                         | `BoardInfo`, `PaginationProps`      |
| Recoil atom       | `camelCase` + `Info` / `Atom` 접미사 | `bankHistoryInfo`, `modalInfo`      |

---

## TypeScript

- `any` 타입 사용을 **지양**합니다. 불가피한 경우 주석으로 이유를 명시합니다.
- 타입 정의는 `src/types/` 폴더에 모아서 관리합니다.
- JSX가 없는 파일은 `.ts`, JSX가 있는 파일은 `.tsx`를 사용합니다.
- 함수의 반환 타입은 복잡한 경우 명시적으로 선언합니다.

```typescript
// ✅ 좋은 예
const fetchBoard = async (url: string): Promise<BoardInfo[]> => { ... };

// ❌ 지양
const fetchBoard = async (url: any): Promise<any> => { ... };
```

---

## React 컴포넌트

- 함수형 컴포넌트만 사용합니다. (클래스 컴포넌트 사용 금지)
- 컴포넌트 파일 하나에 하나의 컴포넌트를 원칙으로 합니다.
- Props 타입은 인라인 또는 별도 `interface`로 명시합니다.

```typescript
// ✅ Props 타입 명시
interface BoardCardProps {
    title: string;
    createdAt: string;
    isAuthor: boolean;
}

const BoardCard = ({ title, createdAt, isAuthor }: BoardCardProps) => {
    return <div>...</div>;
};
```

---

## import 순서

아래 순서로 그룹을 나누고, 그룹 사이에 빈 줄을 둡니다.

```typescript
// 1. React / 외부 라이브러리
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// 2. 내부 컴포넌트
import BoardCard from '../components/board/BoardCard';

// 3. 훅 / 유틸
import { useFetch } from '../hooks/useFetch';

// 4. 타입
import type { BoardInfo } from '../types/TypeBoard';

// 5. 스타일
import { Wrapper } from './BoardList.styles';
```

> 와일드카드(`*`) import는 사용하지 않습니다.

> ESLint의 `import/order`가 강제하는 건 "react 계열을 다른 외부 패키지보다
> 앞세우고, 나머지는 알파벳순" 까지입니다. 위 2~5번처럼 상대 경로 import를
> 세분화하는 건 컨벤션일 뿐 기계적으로 강제되지 않습니다 — 자동 정렬 규칙이
> 오히려 저장할 때마다 순서가 바뀌는 불안정한 규칙이 돼서 포기했습니다.
> 자세한 내용은 [ESLint + Prettier 문서](./frontend/PRETTIER.md#import-순서) 참고.

---

## 커밋 컨벤션 · 브랜치 네이밍

자세한 내용은 [커밋 컨벤션 문서](./COMMIT-CONVENTION.md)를 참고하세요.

**형식:** `<type>: <한국어 제목>`

주요 prefix: `feat`, `fix`, `design`, `refactor`, `docs`, `chore`, `style`, `test`, `ci`, `revert`

**브랜치 네이밍:**

```
feat/<기능명>      fix/<버그명>      refactor/<대상>
docs/<대상>        chore/<대상>      design/<대상>
```
