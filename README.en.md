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

## License

MIT
