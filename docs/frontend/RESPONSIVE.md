# 반응형 디자인 가이드

이 문서는 inhabas.com-front 프로젝트에 모바일·태블릿 반응형을 구축하는 방법을 설명합니다.

> 📚 **관련 문서**: [리팩토링 체크리스트](./CHECKLIST.md) | [마이그레이션 계획](./MIGRATION.md)

---

## 현재 상태

### 있는 것

| 항목 | 내용 |
|------|------|
| viewport meta | `index.html`에 `width=device-width, initial-scale=1` 적용됨 |
| `FlexDiv` + `flex-wrap` | 레이아웃 기본 단위, wrap 속성 있음 |
| `Container` 80% 폭 | 유일한 유동 래퍼 |
| Honor 슬라이더 | react-slick `responsive` (1024px, 1440px 분기) |

### 없는 것

| 항목 | 영향 |
|------|------|
| `@media` 쿼리 | **전체 코드베이스 0건** — 반응형 미적용 상태 |
| `theme.ts` breakpoints | 브레이크포인트 상수 없음 |
| 모바일 네비게이션 | 햄버거 버튼, 드로어 없음 |
| 상대 단위 타이포 | `rem`/`clamp` 거의 없고 전부 `px` |
| CSS Grid | 미사용 |

### 주요 고정값 (변경 필요)

| px 값 | 사용처 |
|-------|--------|
| `1170px` | 헤더 내부 콘텐츠 최대 너비 |
| `800px` | `DetailContainer` (상세 페이지) |
| `423px` | 서브페이지 헤더 높이 |
| `360px` | 활동·강의 카드 너비 |
| `350px` | 메인 로고, 푸터 컬럼 |
| `263px` | 게시판·강의 사이드 네비 |

> **현재는 1170px 기준 데스크톱 단일 레이아웃**입니다. 768px 이하 모바일에서 가로 스크롤 또는 레이아웃 깨짐이 발생합니다.

---

## 브레이크포인트 전략

### 기준 브레이크포인트

```
mobile  : ~ 767px
tablet  : 768px ~ 1023px
desktop : 1024px ~ 1279px
wide    : 1280px ~          (현재 기준 화면, 1170px 콘텐츠 폭)
```

**모바일 퍼스트 vs 데스크톱 퍼스트**

현재 코드베이스가 데스크톱 기준으로 작성되어 있으므로, 신규 컴포넌트는 **모바일 퍼스트**로 작성하고, 기존 컴포넌트 수정 시에는 **데스크톱 퍼스트**로 `max-width` 조건에서 줄여나가는 방식을 혼용합니다.

---

## Step 1: theme.ts에 breakpoints 추가 (인프라 구축)

`src/styles/theme.ts`에 breakpoints와 media helper를 추가합니다.

```typescript
// src/styles/theme.ts

export const breakpoints = {
    mobile: '767px',
    tablet: '1023px',
    desktop: '1279px',
} as const;

// styled-components 내에서 사용하는 media helper
export const media = {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (max-width: ${breakpoints.tablet})`,
    desktop: `@media (max-width: ${breakpoints.desktop})`,
    tabletOnly: `@media (min-width: 768px) and (max-width: ${breakpoints.tablet})`,
} as const;

export const theme: DefaultTheme = {
    color,
    fontSize,
    breakpoints,
    media,
};
```

`DefaultTheme` 타입 파일(`src/types/styled.d.ts`)도 함께 업데이트합니다.

```typescript
// src/types/styled.d.ts
import 'styled-components';
import { theme } from '../styles/theme';

type Theme = typeof theme;

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}
```

### 사용 예시

```typescript
import styled from 'styled-components';
import { media } from '../../styles/theme';

const Wrapper = styled.div`
    width: 1170px;

    ${media.tablet} {
        width: 100%;
        padding: 0 24px;
    }

    ${media.mobile} {
        padding: 0 16px;
    }
`;
```

---

## Step 2: HeaderNav 반응형 (최우선)

HeaderNav는 모든 페이지에 고정되는 가장 중요한 컴포넌트입니다.

### 현재 구조 문제

```typescript
// 현재 — 1170px 고정 폭, 모바일 메뉴 없음
<FlexDiv width="1170px" $maxWidth="1170px">
    <Logo width="200px" />
    <NavLinks />   {/* 드롭다운 포함 긴 메뉴 */}
</FlexDiv>
```

### 목표 구조

```
데스크톱 (1024px~): 현재와 동일 — 로고 + 가로 네비
태블릿 (768~1023px): 로고 + 핵심 메뉴만 표시 + 더보기 버튼
모바일 (~767px): 로고 + 햄버거 버튼 → 드로어 메뉴
```

### 구현 방향

```typescript
// 1. 모바일용 햄버거 버튼 추가
const HamburgerButton = styled.button`
    display: none;

    ${media.mobile} {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: none;
        border: none;
        cursor: pointer;
    }
`;

// 2. 데스크톱 메뉴는 모바일에서 숨기기
const NavMenu = styled.nav`
    display: flex;

    ${media.mobile} {
        display: none;
    }
`;

// 3. 드로어 (모바일 전용 슬라이드 메뉴)
const Drawer = styled.div<{ $isOpen: boolean }>`
    display: none;

    ${media.mobile} {
        display: block;
        position: fixed;
        top: 73px;
        left: 0;
        width: 100%;
        height: calc(100vh - 73px);
        background: white;
        transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
        transition: transform 0.3s ease;
        overflow-y: auto;
        z-index: 999;
    }
`;
```

---

## Step 3: 게시판 2열 레이아웃

### 현재 구조 문제

```
[사이드 네비 263px] | [게시판 테이블 나머지]
```

좁은 화면에서 두 열이 함께 들어가지 않아 가로 스크롤 발생.

### 목표 구조

```
데스크톱: 사이드 네비 + 테이블 (2열)
태블릿:  사이드 네비 접기 버튼 + 테이블 (1열)
모바일:  탭 형태 메뉴 + 테이블 (1열)
```

### 구현 방향

```typescript
// BoardLayout — flex-direction 변경
const BoardLayout = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;

    ${media.tablet} {
        flex-direction: column;
    }
`;

// 사이드 네비 — 태블릿에서 접기/펼치기
const SideNav = styled.div<{ $isCollapsed: boolean }>`
    width: 263px;
    flex-shrink: 0;

    ${media.tablet} {
        width: 100%;
        display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
    }
`;

// 모바일 — 가로 스크롤 탭으로 전환
const MobileNavTabs = styled.div`
    display: none;

    ${media.mobile} {
        display: flex;
        overflow-x: auto;
        gap: 8px;
        padding: 8px 0;
        -webkit-overflow-scrolling: touch;
    }
`;
```

---

## Step 4: 테이블 반응형

`NavigateTable`과 각 도메인 테이블은 `widthList`로 컬럼 너비를 px 배열로 고정합니다.

```typescript
// 현재 — 총 합계가 700px+ 고정
const widthList = [45, 0, 450, 120, 120];
```

### 전략 A: 가로 스크롤 (구현 빠름)

```typescript
const TableWrapper = styled.div`
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    ${media.mobile} {
        font-size: 13px;
    }
`;
```

모바일에서도 테이블 구조를 유지하되 가로로 스크롤합니다. 구현이 빠르고 기존 테이블 코드 변경이 최소화됩니다.

### 전략 B: 카드 뷰로 전환 (UX 우수)

```typescript
// 모바일에서 테이블 행 → 카드로 변환
const TableRow = styled.tr`
    ${media.mobile} {
        display: block;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 12px;
        padding: 12px;
    }
`;

const TableCell = styled.td<{ $label: string }>`
    ${media.mobile} {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;

        &::before {
            content: attr(data-label);
            font-weight: bold;
            margin-right: 8px;
        }
    }
`;
```

> 테이블 행이 많고 컬럼이 중요한 관리자 테이블은 **전략 A**, 일반 게시판 목록은 **전략 B**를 권장합니다.

---

## Step 5: 컨테이너 및 공통 컴포넌트

### Container / DetailContainer

```typescript
// src/styles/assets/Div.ts 수정

export const Container = styled.div`
    width: 80%;
    max-width: 1170px;
    margin: 0 auto;

    ${media.tablet} {
        width: 90%;
    }

    ${media.mobile} {
        width: 100%;
        padding: 0 16px;
    }
`;

export const DetailContainer = styled.div`
    width: 800px;
    margin: 0 auto;

    ${media.tablet} {
        width: 90%;
    }

    ${media.mobile} {
        width: 100%;
        padding: 0 16px;
    }
`;
```

### 카드 컴포넌트 (ActivityCard, LectureCard)

```typescript
// 현재: width="360px" 고정
// 목표: 화면 크기에 따라 자동 조절

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;

    ${media.mobile} {
        grid-template-columns: 1fr;
    }
`;
```

---

## Step 6: 모달

모달 컴포넌트들은 높이가 `450px`~`600px`로 고정되어 있어 모바일 화면에서 잘립니다.

```typescript
// 현재
const ModalInner = styled.div`
    width: 600px;
    height: 500px;
`;

// 수정
const ModalInner = styled.div`
    width: 600px;
    max-height: 90vh;
    overflow-y: auto;

    ${media.tablet} {
        width: 90vw;
    }

    ${media.mobile} {
        width: 100vw;
        max-height: 85vh;
        border-radius: 16px 16px 0 0;
        position: fixed;
        bottom: 0;
        left: 0;
    }
`;
```

모바일에서는 **바텀 시트(Bottom Sheet)** 형태로 전환하면 UX가 자연스럽습니다.

---

## 작업 우선순위

### Phase 1: 인프라 구축 (1~2일)

- [ ] `theme.ts`에 `breakpoints`, `media` helper 추가
- [ ] `DefaultTheme` 타입 업데이트
- [ ] `Container`, `DetailContainer` 반응형화
- [ ] `index.html` viewport meta 확인

### Phase 2: 헤더 · 네비게이션 (3~5일)

- [ ] `HeaderNav` — 모바일 햄버거 버튼 추가
- [ ] Drawer 컴포넌트 신규 작성
- [ ] `HeaderTitle` — 높이·폰트 축소
- [ ] `Bottom` (푸터) — 세로 스택 전환

### Phase 3: 게시판 · 강의 레이아웃 (3~5일)

- [ ] 사이드 네비(`BoardNavigate`, `RoomNavigate`) 접기/펼치기 또는 탭 전환
- [ ] `BoardList`, `LectureDetail` 2열 → 1열 전환
- [ ] `NavigateTable` 가로 스크롤 래퍼 추가 (전략 A 우선)

### Phase 4: 페이지별 수정 (5~7일)

- [ ] `Main` — 로고 크기·배경 반응형
- [ ] `Introduce` — 섹션별 레이아웃 조정
- [ ] `Login`, `Signup` — 좌/우 분할 → 단열 전환
- [ ] `Activity`, `Scholarship` — 카드 그리드 전환
- [ ] `Honor` — 슬라이더 breakpoints 세분화

### Phase 5: 모달 · 테이블 세부 조정 (3~4일)

- [ ] 모달 컴포넌트 `max-height`, 모바일 바텀 시트 전환
- [ ] 관리자 테이블(`MyUserTable` 등) 가로 스크롤 또는 카드뷰
- [ ] 회계 테이블(`BankTable`, `BankSupportTable`) 조정
- [ ] 폰트 크기 `rem`/`clamp` 전환 검토

---

## 테스트 체크리스트

반응형 작업 후 아래 환경에서 검증합니다.

| 환경 | 해상도 |
|------|--------|
| 모바일 (iPhone SE) | 375 × 667 |
| 모바일 (iPhone 14) | 390 × 844 |
| 태블릿 (iPad) | 768 × 1024 |
| 태블릿 가로 (iPad) | 1024 × 768 |
| 데스크톱 | 1280 × 800 이상 |

**Chrome DevTools** → Toggle Device Toolbar (`Ctrl+Shift+M` / `Cmd+Shift+M`)로 빠르게 확인 가능합니다.

---

## 주의사항

1. **기존 데스크톱 레이아웃을 유지하면서 점진적으로 추가합니다.** 모바일 스타일은 `@media` 안에만 작성해 데스크톱에 영향을 주지 않습니다.
2. **테이블의 `widthList` px 배열은 단기적으로 가로 스크롤 래퍼로 감싸는 것이 가장 안전합니다.** 컬럼 폭 자체를 변경하면 테이블 정렬이 깨질 수 있습니다.
3. **모바일 터치 이벤트**: 현재 `onClick`만 사용 중이므로 추가 작업 없이 터치에서도 동작합니다. 단, hover 스타일은 모바일에서 적용되지 않으므로 항상 `active`/`focus` 스타일도 함께 정의합니다.
4. **`HeaderNav`의 scroll 이벤트**는 이미 구현되어 있으니 모바일 드로어 열림 상태에서 스크롤 잠금(`overflow: hidden on body`)을 함께 처리해야 합니다.
