# 기여 가이드

이 문서는 inhabas.com-front 프로젝트에 기여하는 방법을 설명합니다.

> 📚 **관련 문서**: [스타일 컨벤션](./STYLE-CONVENTION.md) | [커밋 가이드](./COMMITER-INSTRUCTION.md)

---

## 브랜치 구조

```
upstream/main   ← 프로덕션 배포 브랜치
upstream/dev    ← 개발 통합 브랜치
origin/main     ← 내 fork의 main
origin/dev      ← 내 fork의 dev
origin/<작업 브랜치>
```

- 작업은 항상 `upstream/dev` 기준으로 새 브랜치를 만들어서 진행합니다.
- PR 대상은 `upstream/dev`입니다. (`main`에 직접 PR 금지)

---

## 기여 절차

### 1. 저장소 Fork 및 Clone

```bash
# upstream 등록 (최초 1회)
git remote add upstream https://github.com/InhaBas/inhabas.com-front.git

# upstream 최신 상태 가져오기
git fetch upstream
```

### 2. 작업 브랜치 만들기

항상 `upstream/dev`를 기준으로 브랜치를 생성합니다.

```bash
git checkout -b feat/board-search upstream/dev
```

브랜치 네이밍 규칙은 [스타일 컨벤션](./STYLE-CONVENTION.md#브랜치-네이밍)을 참고하세요.

### 3. 작업 및 커밋

```bash
git add .
git commit -m "feat: 게시판 검색 기능 추가"
```

커밋 메시지 규칙은 [스타일 컨벤션](./STYLE-CONVENTION.md#커밋-컨벤션)을 참고하세요.

### 4. Push 및 PR 생성

```bash
git push origin feat/board-search
```

GitHub에서 `origin/feat/board-search` → `upstream/dev`로 PR을 생성합니다.

- PR 제목은 커밋 컨벤션을 따릅니다.
- PR 본문에 변경 내용과 테스트 방법을 간략히 작성합니다.
- 코드 리뷰를 받고 승인이 나면 Merge합니다.

### 5. PR Merge 후 브랜치 삭제

```bash
# 로컬 브랜치 삭제
git branch -D feat/board-search

# 원격 브랜치 삭제
git push origin --delete feat/board-search
```

---

## upstream 최신 상태 동기화

작업 전 또는 충돌 발생 시 `upstream/dev`와 동기화합니다.

```bash
git fetch upstream
git rebase upstream/dev
```

> `merge` 대신 `rebase`를 권장합니다. 불필요한 Merge 커밋이 생기지 않아 히스토리가 깔끔하게 유지됩니다.

---

## PR 제출 전 체크리스트

- [ ] `upstream/dev` 기준으로 브랜치를 만들었는가
- [ ] 빌드가 정상적으로 되는가 (`npm run build`)
- [ ] ESLint 에러가 없는가
- [ ] 기존 기능이 정상 작동하는가
- [ ] [스타일 컨벤션](./STYLE-CONVENTION.md)을 준수하는가
- [ ] 불필요한 `console.log`나 주석 처리된 코드가 없는가
