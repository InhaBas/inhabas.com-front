# 브랜치 규칙

브랜치에 관한 규칙은 이 파일에만 둔다. 다른 문서가 네이밍·분기 기준·PR 대상을 다시 설명하고 있으면 이 파일로 합치고 그쪽에서 지운다.

## 브랜치 구조

| 브랜치          | 역할                                                     |
| --------------- | -------------------------------------------------------- |
| `upstream/main` | 유일한 운영 브랜치. 작업 브랜치의 분기 기준이자 PR 대상. |
| `origin/*`      | 내 fork. push는 여기로 한다.                             |

`dev` 브랜치는 테스트 서버와 함께 운영을 중단했다. 분기 기준과 PR 대상은 모두 `upstream/main`이다.

최초 1회: `git remote add upstream https://github.com/InhaBas/inhabas.com-front.git`

## 브랜치 만들기

파일을 수정하기 전에 브랜치를 먼저 만든다.

```bash
git fetch upstream
git checkout -b <type>/<slug> upstream/main
```

- `<type>`: `feat` `fix` `design` `refactor` `docs` `chore` `style` `test` `ci` `revert`
- `<slug>`: 영어 kebab-case 2~4 단어.

예: `fix/bank-balance-display`, `chore/typescript-5.9`

완료 기준:

```bash
git rev-parse --abbrev-ref HEAD | grep -qE '^(feat|fix|design|refactor|docs|chore|style|test|ci|revert)/[a-z0-9]+([-.][a-z0-9]+)*$'
git merge-base --is-ancestor upstream/main HEAD
```

## 동기화

```bash
git fetch upstream
git rebase upstream/main
```

merge 대신 rebase를 쓴다. 불필요한 머지 커밋이 남지 않는다.

## PR과 정리

```bash
git push origin <branch>
gh pr create --repo InhaBas/inhabas.com-front --base main
```

머지는 머지 권한이 있는 메인테이너만 하고, **Merge Commit**으로 개별 커밋 히스토리를 보존한다. Squash merge는 브랜치의 커밋이 하나의 기능 단위이고, 그 하나의 메시지가 변경 전체를 설명할 때만 쓴다.

머지 후 브랜치를 지운다.

```bash
git branch -D <branch>
git push origin --delete <branch>
```
