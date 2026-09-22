# dsh-wsl-cal

> **语言：** **中文**（本页） · [English](./README.en.md)

日历只读：khal list / today。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-cal
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-cal
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `cal_status` | khal 是否可用 |
| `cal_today` | 今天日程 |
| `cal_list` | 未来 N 天 |

## 配置要点

`timeoutMs`

不创建/修改事件。自行配置 khal。

## License

MIT
