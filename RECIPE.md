# Dock badge

A one-line status bar for the Herdr desktop app that also puts the number of agents waiting for you on the macOS Dock icon.

![Dock badge](preview.png)

## What you see

A 22 px bar along the bottom of the window, full width, `theme().chrome` background with a 1 px top border in `theme().border`.

- A 6 px round dot on the left: `theme().blocked` while any agent is blocked, `theme().done` when only done agents remain, `theme().dim` when nothing is waiting.
- Text in 11.8 px:
  - both kinds waiting: `2 need you · 1 done`
  - only blocked: `2 need you`
  - only done: `1 done`
  - nothing waiting: `All agents clear`, in `theme().dim`
- On the right, in `theme().dim`, `Click to go to the first one`, only while something is waiting.
- On macOS, the Dock icon carries the same total as a red badge (numbers above 99 show `99+`). Nothing waiting clears it.

## How it behaves

- `agents()` is live data. Any agent status change redraws the bar and, when the total changed, calls `setBadge`.
- The count is `blocked` agents first, then `done` agents. `done` means finished while the person was not looking; it becomes `idle` once viewed, so the count falls without any interaction with this mod.
- Clicking the bar while something is waiting runs `agent.focus` with the first waiting agent's `address` (blocked first, then done). With nothing waiting the bar has no click handler.
- The Dock badge is app-wide: the last `setBadge` call wins. The mod only calls it when its own number changes, and passes `null` to clear.
- During `herdr-app check`, `checking()` is true, so `setBadge` is skipped and the check does not touch a running window's badge.

## Built from

- `mods/dock-badge/main.js`: a `View` with only `render()`. Reads `agents()` and `theme()`, uses `checking()`, `run()` and `setBadge()` from `herdr`.
- `mods/dock-badge/mod.json`: `{"place":"bottom","size":22,"title":"Dock badge"}`.
- GUI parts: `h_flex` from `gpui-base`, `div` from `gpui-kit`; no timers, tasks, `exec`, `hc`, network or file reads.
- Commands: `agent.focus` (click). No keys.json entry is needed.

## Watch out

- Herdr starts a mod copy only when its block is shown, and a docked copy stops when the block is removed. There is no headless copy yet. Removing the block stops the Dock badge updates.
- Installing the folder auto-docks one copy at the bottom. Adding a second block for the same mod makes two copies, each calling `setBadge`; keep one.
- `setBadge` exists from Herdr 0.1.16. An older app fails to load the mod.
- The Dock badge is macOS only; other platforms ignore `setBadge` and show only the bar.
- The badge counts both `blocked` and `done` as waiting. If only blocked agents should count, change the `waiting` array in `main.js`.
- Herdr's pane-level status for a space is the most urgent agent; this mod counts agents, not spaces.

## Done when

- `herdr-app check mods/dock-badge` prints `check passed`.
- After install, a 22 px bar shows at the bottom of the window and the Dock icon shows a number when an agent is blocked or done.
- With two blocked agents, the bar reads `2 need you` and the Dock badge reads `2`.
- Clicking the bar selects the first blocked agent's space, tab and pane.
- Answering both agents makes the bar read `All agents clear` and clears the Dock badge.
- Quitting and reopening Herdr restores the badge once the mod renders again.
