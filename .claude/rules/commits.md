# 커밋 메시지 규칙

커밋·PR·Merge 메시지 규칙은 이 파일에만 둔다. 다른 문서가 형식이나 type 목록을 다시 설명하고 있으면 이 파일로 합치고 그쪽에서 지운다.

## 형식

```
<type>: <한국어 제목>

<본문 (선택)>

<footer (선택)>
```

```
feat: 게시판 키워드 검색 기능 추가

- 검색어 입력 후 엔터 키로도 검색 가능하게 수정
- 검색 결과 없을 시 안내 문구 표시

resolves: #561
```

## type

| type       | 쓰는 경우                              |
| ---------- | -------------------------------------- |
| `feat`     | 새로운 기능 추가                       |
| `fix`      | 버그 수정                              |
| `design`   | UI · 스타일 변경 (기능 변경 없음)      |
| `refactor` | 코드 구조 개선 (기능 변경 없음)        |
| `docs`     | 문서 추가 · 수정                       |
| `chore`    | 빌드 설정, 패키지, 환경 변경           |
| `style`    | 포매팅, 세미콜론 등 코드 스타일만 변경 |
| `test`     | 테스트 추가 · 수정                     |
| `ci`       | GitHub Actions · CI/CD 설정 변경       |
| `revert`   | 이전 커밋 되돌리기                     |

주석 추가·제거는 `chore` 또는 `refactor`로 쓴다.

## 제목

- 한국어로 쓴다.
- 50자 이내로 쓴다.
- 마침표 없이 끝낸다.
- 명령형 어투로 쓴다. (`추가`, `수정`, `제거`, `개선`)
- type은 소문자 전체 이름을 쓴다. (`feat` — `Feat`·`feature`가 아니다)

완료 기준:

```bash
git log -1 --format=%s | grep -qE '^(feat|fix|design|refactor|docs|chore|style|test|ci|revert): .+[^.]$'
```

## 본문 (선택)

- 제목 아래 빈 줄 하나를 띄우고 쓴다.
- **무엇을**, **왜** 바꿨는지 쓴다.
- 각 항목은 `-`로 시작한다.

## footer (선택)

```
resolves: #561          # 이슈 자동 닫기
see also: #559, #557    # 관련 이슈 참고
```

이슈 번호는 footer로만 연결한다. 히스토리에 남아 있는 `[feat/#67] feat: 대댓글 UI 추가` 형식은 구 컨벤션이다.

## WIP 커밋

작업 중에는 `WIP: 회원 테이블 UI 작업 중` 같은 임시 커밋을 써도 된다. PR을 올리기 전에 squash해서 정리한다.

```bash
git rebase -i upstream/main
```

에디터에서 각 커밋 앞의 키워드를 바꾼다.

- `pick`: 커밋 유지
- `squash`: 바로 위 커밋에 합치고 메시지도 합치기
- `fixup`: 합치되 메시지는 버리기 (WIP 메시지 제거에 편하다)

정리하면 히스토리가 바뀌므로 force push한다.

```bash
git push origin <branch> --force-with-lease
```

`--force-with-lease`는 다른 사람이 이미 push한 내용이 있으면 덮어쓰지 않는다.

## PR 제목

커밋 제목과 같은 형식으로 쓴다.

## Merge 커밋

- 제목: GitHub 기본값 `Merge pull request #<번호> from <소유자>/<브랜치>`를 그대로 둔다.
- 본문 첫 줄: 위 커밋 형식의 `<type>: 제목`.

```
Merge pull request #643 from haewonwon/feat/573-recruitment-schedule-notice

feat: 신입부원 모집 일정 메인 안내 추가

- 메인 배너에 모집 일정 컴포넌트 추가
- 모집 기간이 아닐 때 안내 문구 표시

resolves: #573
```
