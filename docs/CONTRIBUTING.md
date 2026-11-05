# 기여 가이드

이 문서는 inhabas.com-front 프로젝트에 기여하는 방법을 설명합니다.

> 📚 **관련 문서**: [브랜치 규칙](../.claude/rules/branching.md) | [스타일 컨벤션](./STYLE-CONVENTION.md) | [커밋 메시지 규칙](../.claude/rules/commits.md)

브랜치 규칙은 [브랜치 규칙](../.claude/rules/branching.md), 커밋·PR·Merge 메시지 규칙은 [커밋 메시지 규칙](../.claude/rules/commits.md) 한 곳에서 관리합니다.

---

## 기여 절차

### 1. 저장소 Fork 및 Clone

GitHub에서 `InhaBas/inhabas.com-front`를 fork한 뒤 clone합니다.

### 2. 작업 브랜치 만들기

[브랜치 규칙](../.claude/rules/branching.md)을 따릅니다.

### 3. 작업 및 커밋

```bash
git add .
git commit -m "feat: 게시판 검색 기능 추가"
```

커밋 메시지 규칙은 [커밋 메시지 규칙](../.claude/rules/commits.md)을 참고하세요.

### 4. PR 생성

- PR 본문에 변경 내용과 테스트 방법을 간략히 작성합니다.
- 코드 리뷰를 받고 승인이 나면 Merge합니다.

---

## PR 제출 전 체크리스트

- [ ] [브랜치 규칙](../.claude/rules/branching.md)을 지켰는가
- [ ] 빌드가 정상적으로 되는가 (`npm run build`)
- [ ] ESLint 에러가 없는가 (`npm run lint`)
- [ ] Prettier 포매팅이 적용되었는가 (`npm run format`)
- [ ] 기존 기능이 정상 작동하는가
- [ ] [스타일 컨벤션](./STYLE-CONVENTION.md)을 준수하는가
- [ ] 불필요한 `console.log`나 주석 처리된 코드가 없는가
