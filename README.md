# Dock badge

A [Herdr](https://herdr.dev) app mod: shows how many agents are blocked or done on the macOS Dock icon, with a slim bar at the bottom of the window. Click the bar to jump to the first agent that needs you.

![Dock badge](preview.png)

## Install

Copy the mod folder into your Herdr home:

```sh
cp -R mods/dock-badge ~/.config/herdr-app/mods/
```

Herdr docks it at the bottom of the window the first time it sees the folder. If you prefer to place it yourself, set `"place": "none"` in `mod.json` and add this block to your layout:

```json
{ "id": "dock-badge", "type": "block", "size": { "px": 22 }, "content": { "mod": "dock-badge" } }
```

Use one or the other, not both: a docked copy and a layout copy would run twice.

## What it counts

Agents with status `blocked` (waiting for an answer) and `done` (finished while you were away). A `done` agent becomes `idle` once you look at it, so the number drops on its own.

The Dock badge shows the total, up to `99+`. It is cleared when nothing is waiting.

## Notes

- The Dock badge is macOS only. On Linux and Windows the bar still works; `setBadge` is ignored by Herdr there.
- The badge is app-wide. Another mod calling `setBadge` will replace it; only the last call wins.
- The mod needs to be in the layout to run. Herdr has no headless mod copy yet.

## Recipe

[RECIPE.md](RECIPE.md) is the brief another agent can rebuild this mod from an empty folder.
