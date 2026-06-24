# ⏰ MessageScheduler — Vencord Plugin

> Schedule your Discord messages to be sent at a later time, directly from the chat bar.

![Vencord](https://img.shields.io/badge/Vencord-Plugin-7289DA?style=flat-square)
![License](https://img.shields.io/badge/License-GPL--3.0-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=flat-square)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Mac%20%7C%20Linux-lightgrey?style=flat-square)
![Stars](https://img.shields.io/github/stars/CodeFlowDevelopments/vencord-message-scheduler?style=flat-square&color=yellow)
![Issues](https://img.shields.io/github/issues/CodeFlowDevelopments/vencord-message-scheduler?style=flat-square&color=red)
---

## ✨ Features

- 🕐 Clock icon in the chat bar for quick access
- ⚡ Preset times: 5s, 30s, 5m, 10m, 30m, 1h, 2h, 1d, 1w, 1 month
- ⚙️ Custom time input (seconds, minutes, hours, days, months)
- 📋 View and cancel pending messages
- 🌐 Arabic & English language support

---

## 📦 Installation

### Requirements
- [Git](https://git-scm.com/download/win)
- [Node.js LTS](https://nodejs.org)
- pnpm — run in CMD: `npm install -g pnpm`

---

### Steps

**1 — Download Vencord source**

Go to `https://github.com/Vendicated/Vencord` and click **Code → Download ZIP**

Extract it to your Desktop.

**2 — Open CMD in the folder**

```bash
cd Desktop\Vencord-main
pnpm install --frozen-lockfile
```

**3 — Download the plugin**

Go to this repository and download `index.tsx` by clicking it then **Download raw file**.

**4 — Place the file**

Create a folder named `MessageScheduler` inside `src\plugins` and place `index.tsx` in it:

```
Vencord-main\src\plugins\MessageScheduler\index.tsx
```

**5 — Build and inject**

```bash
git init
git config --global user.email "any@email.com"
git config --global user.name "user"
git add .
git commit -m "init"
git remote add origin https://github.com/Vendicated/Vencord
pnpm build
pnpm inject
```

**6 — Enable the plugin**

Open Discord → `Settings` → `Plugins` → search for **MessageScheduler** → enable it ✅

---

## 🚀 Usage

1. Click the clock 🕐 icon in the chat bar
2. Type your message
3. Select a preset time or choose **Custom**
4. Click **Schedule Message**

---

## ⚙️ Settings

| Setting | Description |
|---------|-------------|
| Language | Switch between English and Arabic |

---

## 👤 Author

**hmood** — [CodeFlow Developments](https://github.com/CodeFlowDevelopments)

---

## 📄 License

GPL-3.0
