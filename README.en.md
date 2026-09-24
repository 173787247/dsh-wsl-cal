# dsh-wsl-cal

> **Languages:** [中文（首页）](./README.md) · **English** (this file)

Read-only khal calendar list.

| | |
|---|---|
| Version | **0.1.0** |
| Kit | Optional companion to [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit); not in `install.sh` |

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-cal
```

Batch link (optional): `bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## Tools

| Tool | Role |
|------|------|
| `cal_status` | khal on PATH |
| `cal_today` | today |
| `cal_list` | next N days |

## Config

`timeoutMs`

No create/modify. Configure khal yourself.

## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-cal` **0.1.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.1.7-alpha.2`**) — single source of truth for the suite |
| **Kit set** | optional (not in `install.sh` / `KIT_SET=daily` by default) |

## License

MIT
