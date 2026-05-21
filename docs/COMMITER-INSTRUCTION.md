# Merge 가이드

PR을 Merge할 때의 절차, 커밋 컨벤션, WIP 커밋 처리 방법을 설명합니다.

---

## 브랜치별 Merge 전략

| PR 경로 | 권장 방식 | 이유 |
|---------|----------|------|
| `feature → dev` | **Merge Commit** | 개별 커밋 히스토리 보존 |
| `dev → main` | **Merge Commit** | Squash 사용 시 커밋 중복 표시 문제 발생 |

> ⚠️ `dev → main`에서 Squash merge를 사용하면, 이후 `feature → dev` PR을 올릴 때 이미 main에 머지된 커밋들이 변경 사항으로 중복 표시되는 문제가 발생합니다. Merge Commit을 유지하면 이 문제를 방지할 수 있습니다.

---

## WIP 커밋 처리

`WIP: 임시 저장`, `fix: 오타`, `wip` 같은 커밋이 `main`에 그대로 남으면 히스토리가 지저분해집니다.  
이를 방지하기 위해 **PR을 올리기 전** 로컬에서 커밋을 정리합니다.

### 방법: `git rebase -i`로 커밋 정리 (PR 전)

```bash
# dev 기준으로 만든 브랜치에서, dev 이후 커밋을 정리
git rebase -i upstream/dev
```

에디터가 열리면 WIP 커밋을 정리합니다.

```
pick a1b2c3d feat: 게시판 목록 컴포넌트 추가
squash d4e5f6g WIP: 임시 저장               ← squash로 변경 (윗 커밋에 합치기)
squash g7h8i9j fix: 오타 수정               ← squash로 변경
pick j0k1l2m feat: 게시판 검색 기능 추가
```

> - `pick`: 커밋 유지
> - `squash` (또는 `s`): 바로 위 커밋에 합치기
> - `fixup` (또는 `f`): 합치되 커밋 메시지는 버리기 (WIP 메시지 제거 시 편리)

정리 후 force push:

```bash
git push origin feat/board-search --force-with-lease
```

> `--force-with-lease`: 다른 사람이 이미 push한 내용이 있으면 덮어쓰지 않아 안전합니다.

---

## Squash merge를 써도 되는 경우

WIP 커밋이 남아있는데 rebase 정리가 번거롭다면, **GitHub에서 Squash merge**를 사용하는 것도 괜찮습니다.

단, 아래 조건을 모두 만족할 때만 사용합니다.

| 조건 | 이유 |
|------|------|
| `feature → dev` PR일 것 | `dev → main`에서 Squash 사용 시 커밋 중복 문제 발생 |
| 브랜치의 커밋이 하나의 기능 단위일 것 | 여러 기능이 섞인 브랜치를 Squash하면 히스토리 추적이 어려워짐 |
| Squash 커밋 메시지를 명확하게 작성할 것 | 개별 커밋 메시지가 사라지므로 하나의 메시지가 변경 전체를 설명해야 함 |

```
# Squash merge 커밋 메시지 예시
feat: 게시판 목록 및 검색 기능 추가

- 게시판 목록 컴포넌트 구현
- 키워드 검색 필터 추가
- 페이지네이션 연동

resolves: #72
```

---

## Merge 절차 (Merge Commit 기준)

### 1. Merge 방식 선택

PR 하단에서 **Create a merge commit** 을 선택합니다.

![select merge commit](images/commiter-instruction01-select-merge-commit.png)

### 2. Merge pull request 선택

![select merge pull request](images/commitor-instruction02-select-merge-pull-request.png)

### 3. 커밋 제목 · 본문 수정 후 Confirm merge

![modify title and body](images/commitor-instruction03-modify-title-body.png)

Merge 커밋 메시지 형식:

```
[feat/#67] 대댓글 UI 추가

- 대댓글 컴포넌트 생성
- 댓글 컴포넌트에 대댓글 연결

resolves: #67
see also: #56, #49
```

| 항목 | 내용 |
|------|------|
| 제목 | `[브랜치명] 작업 요약` |
| 본문 | 변경 사항을 `-` 목록으로 나열 |
| footer | `resolves: #이슈번호` (관련 이슈가 있는 경우) |

---

## 요약

```
작업 중 WIP 커밋 발생
        ↓
PR 올리기 전 git rebase -i 로 정리  ← 권장
        ↓
feature → dev  :  Merge Commit
        ↓
dev → main     :  Merge Commit  (Squash 사용 금지)
```

- Merge 권한이 있는 Maintainer만 Merge를 진행합니다.
