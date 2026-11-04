# herdr-claude-accounts 작업 규칙

## 배포는 main 에 push 하는 것으로 끝난다

- herdr.dev 갤러리는 GitHub release 나 태그를 보지 않는다. 공개 저장소에 `herdr-mod` 토픽이 붙어 있으면 기본 브랜치(`main`)를 읽어 한 시간 안에 반영한다 (`~/.config/herdr-app/AGENTS.md` 의 "To share one" 절).
- 갤러리가 읽는 파일은 `RECIPE.md` 와 `preview.png`, 그리고 `mods/claude-accounts/` 의 실파일이다. 이 셋이 서로 어긋나지 않게 한 커밋에서 같이 고친다.
- 저장소 토픽과 공개 설정은 건드리지 않는다.

## mod 를 고칠 때마다 같이 할 일

1. **`RECIPE.md` 갱신.** 크기·색·동작이 바뀌었으면 해당 줄을 실파일 기준으로 고친다. 다른 에이전트가 이 문서만 보고 같은 것을 다시 만들 수 있어야 한다.
2. **`art/preview.html` 갱신.** 샘플 데이터로 칩과 팝업을 재현한 사본이다. mod 의 크기·색·배치 변경을 같은 값으로 옮긴다.
3. **`preview.png` 재생성.** 아래 명령으로 만든다. 결과는 2400×1440 PNG 다.
   ```sh
   npm i --no-save --prefix /tmp/cca-render playwright-core
   NODE_PATH=/tmp/cca-render/node_modules node art/render.mjs
   ```
   Google Chrome 이 필요하다. 렌더한 PNG 를 열어 바뀐 부분을 눈으로 확인한다.
4. **설치본 동기화.** 내 Herdr 에서 바로 보려면 `mods/claude-accounts/` 를 `~/.config/herdr-app/mods/claude-accounts/` 로 복사한다. 설치본은 심볼릭 링크가 아니라 복사본이다.
5. **`cca` 수정은 한 곳에서만.** 셸 로직의 유일한 구현은 `mods/claude-accounts/cca` 다. `main.js` 에 같은 로직을 다시 쓰지 않는다.
6. **README 의 권한 고지 확인.** mod 가 새로 `exec`·`hc`·네트워크·폴더 밖 파일 읽기·`~/.claude` 쓰기를 하게 됐으면 README 의 "Before adding it" 목록에 적는다.

## control-tower 와의 동기화

- 이 저장소가 `claude-accounts` mod 의 정본이다. control-tower 레이아웃이 이 mod 를 싣기 때문에, `mods/claude-accounts/` 를 바꾸면 같은 푸시에서 `~/git-repo/herdr-control-tower/mods/claude-accounts/` 로도 복사한다.
- 두 사본의 `main.js`, `mod.json`, `cca`, `usage-tap.sh` 는 항상 같아야 한다.

## 라이선스

- 코드와 문서는 MIT (`LICENSE`, 저작자 `lcalmsky`).
- `mods/claude-accounts/fonts/` 의 Nunito 는 SIL Open Font License 1.1 이다 (`OFL.txt`). 폰트를 바꾸면 이 파일도 같이 넣는다.
