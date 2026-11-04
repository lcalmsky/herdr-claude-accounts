# Claude Accounts

A [Herdr](https://herdr.dev) mod for running Claude Code as more than one account. A small chip in the window's head names the account the focused Claude Code agent runs under; clicking it lists every account with its signed-in email and recorded 5h/7d usage, opens one in a new tab, resumes the current session as another account, or makes a new one. The same work is available as `cca`, a shell command you can use over SSH from a phone.

It is meant for switching between distinct accounts such as work and a side project; each provider's terms apply to how you use them.

![Claude Accounts: the account chip and its popup](preview.png)

An account is one Claude Code config dir. `default` is `~/.claude` (run with `CLAUDE_CONFIG_DIR` unset); every `~/.claude-accounts/<name>/` is another, with its own login. Settings, skills, hooks and session history are shared through symlinks, so `claude -c` and `claude --resume` see the same conversations in every account.

## Add it

Paste this into an agent running in Herdr:

```
Read ~/.config/herdr-app/AGENTS.md, then add this mod: https://github.com/lcalmsky/herdr-claude-accounts
```

The mod is `none`-placed, so it does nothing until a layout places the chip or you press its key. Copy `mods/claude-accounts/` to `~/.config/herdr-app/mods/claude-accounts/`, merge `keys.json` into yours (`ctrl-shift-a`), and put the chip in a head block (150 px is roomy):

```json
{ "id": "accounts", "type": "block", "size": { "px": 150 }, "window_drag": true,
  "content": { "mod": "claude-accounts", "props": { "role": "chip" } } }
```

With no chip in the layout, `ctrl-shift-a` still opens the accounts popup.

The CLI is the same folder's `cca`:

```sh
ln -s ~/.config/herdr-app/mods/claude-accounts/cca ~/.local/bin/cca
```

### Reading accounts

```sh
cca                      # or: cca ls
cca work -c              # continue this folder's latest conversation as work
cca home --resume <id>   # resume a particular session as home
cca add staging          # create ~/.claude-accounts/staging, then cca staging to log in
cca share staging        # link the shared history into an account made before sharing existed
cca share --dry-run old  # what share would do, without changing anything
```

`cca ls` prints a marker on the account of the current shell, the name, email, 5h and 7d usage (`↻HH:MM` is the reset time once a window is nearly spent), and the account with the most 5h headroom. It fits about 60 columns and colours only a terminal.

## Before adding it

The mod runs programs and reads files outside its own folder:

- every 30 s, and when the focused agent changes, it runs `cca --porcelain <pid>`. That reads the focused Claude process's environment with `ps -E -ww -p <pid> -o command=` for its `CLAUDE_CONFIG_DIR`, reads the signed-in email from `~/.claude.json` and `~/.claude-accounts/*/.claude.json`, reads usage files under `${XDG_STATE_HOME:-$HOME/.local/state}/herdr-tower/usage/`, and reads `$HOME/.claude/sessions/<pid>.json` for the focused session's `sessionId` and `cwd`;
- choosing an account runs `claude` in a new tab with `CLAUDE_CONFIG_DIR` set to that folder (for `default`, unset);
- **Add account** creates `~/.claude-accounts/<name>/` and symlinks everything in `~/.claude` into it except the login and per-process state, so settings, `CLAUDE.md`, skills and hooks are shared. It also creates `projects`, `sessions`, `history.jsonl` and the other shared history entries under `~/.claude` when missing, and links them;
- **share** merges an existing account's real history entries into `~/.claude` (`cp -Rn`; `history.jsonl` appended), moves the account's copy aside to `<entry>.pre-share-<epoch>`, then links it. It never deletes and never overwrites anything in `~/.claude`.

It makes no network calls and never reads `.credentials.json` or the keychain. `cca` is the only shell code: the mod executes it and parses its tab-separated output.

### Usage (optional)

Claude Code hands its rate limits only to the status line command, so the popup can show them only if `usage-tap.sh` runs in front of your status line in `~/.claude/settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "sh $HOME/.config/herdr-app/mods/claude-accounts/usage-tap.sh node ${CLAUDE_CONFIG_DIR:-$HOME/.claude}/hud/hud-with-peers.mjs"
}
```

Keep your own command after the tap path unchanged. The tap passes the same input through, writes `${XDG_STATE_HOME:-$HOME/.local/state}/herdr-tower/usage/<account>.json` when `node` is available, prints nothing of its own and never breaks the status line.

### Over SSH

`cca` works over SSH, but a macOS login started from SSH has a locked keychain. If `cca <name>` starts Claude Code as not logged in although that account's `.claude.json` names an email, unlock the keychain in that session first:

```sh
security unlock-keychain
```

## License

MIT. The bundled Nunito font is under the SIL Open Font License 1.1 (`mods/claude-accounts/fonts/OFL.txt`). `RECIPE.md` is the brief to build the mod from scratch.
