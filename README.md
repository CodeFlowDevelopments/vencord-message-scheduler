# ⏰ MessageScheduler — Vencord Plugin

> Schedule your Discord messages to be sent at a later time, directly from the chat bar.

![Vencord](https://img.shields.io/badge/Vencord-Plugin-7289DA?style=flat-square)
![License](https://img.shields.io/badge/License-GPL--3.0-green?style=flat-square)
![Author](https://img.shields.io/badge/Author-hmood-blue?style=flat-square)
![Version](https://img.shields.io/badge/Version-2.0.0-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Stars](https://img.shields.io/github/stars/CodeFlowDevelopments/vencord-message-scheduler?style=flat-square)
![Issues](https://img.shields.io/github/issues/CodeFlowDevelopments/vencord-message-scheduler?style=flat-square)

---

## ✨ Features

- 🕐 Clock icon in the chat bar for quick access
- ⚡ Preset times: 5s, 30s, 5m, 10m, 30m, 1h, 2h, 1d, 1w, 1 month
- 📅 Schedule by exact date and time
- ⚙️ Custom time input (seconds, minutes, hours, days, months)
- 🔁 Repeat messages (set count or repeat forever)
- 🎲 Random messages — add a pool and send randomly each time
- 📢 Send to any channel in the server, not just the current one
- 💾 Save messages for reuse later
- 🔍 Search through pending messages
- ✏️ Edit a pending message without cancelling it
- 📤 Export your scheduled data as JSON
- 📥 Import data from a backup file
- 🔔 Notification 1 minute before a message is sent
- 🌐 Arabic & English language support

---

---

<div dir="rtl">

## ✨ المميزات

- 🕐 أيقونة ساعة في الـ chatbar للوصول السريع
- ⚡ أوقات جاهزة: 5ث، 30ث، 5د، 10د، 30د، 1س، 2س، 1ي، 1أ، شهر
- 📅 جدولة بتاريخ وساعة محددة
- ⚙️ وقت مخصص (ثواني / دقائق / ساعات / أيام / شهور)
- 🔁 تكرار الرسالة (حدد عدد المرات أو للأبد)
- 🎲 رسائل عشوائية — أضف قائمة ويختار منها تلقائياً
- 📢 إرسال لأي قناة في السيرفر
- 💾 حفظ الرسائل للاستخدام لاحقاً
- 🔍 بحث في الرسائل المنتظرة
- ✏️ تعديل رسالة منتظرة بدون إلغاء
- 📤 تصدير واستيراد البيانات كـ JSON
- 🔔 إشعار قبل الإرسال بدقيقة
- 🌐 دعم العربية والإنجليزية

</div>

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

Download `index.tsx` from this repository and place it here:

```
Vencord-main\src\plugins\MessageScheduler\index.tsx
```

> Create a folder named `MessageScheduler` inside `src\plugins`

**4 — Build and inject**

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

**5 — Enable the plugin**

Open Discord → `Settings` → `Plugins` → search **MessageScheduler** → enable ✅

---

## 🚀 Usage

1. Click the clock 🕐 icon in the chat bar
2. Type your message
3. Select a preset time, exact date, or custom duration
4. Optionally enable repeat or random messages
5. Click **Schedule Message**

---

## 📋 Tabs

| Tab | Description |
|-----|-------------|
| Schedule | Create a new scheduled message |
| Saved | Your saved message templates |
| Queue | All pending messages with search and edit |

---

## ⚙️ Settings

| Setting | Description |
|---------|-------------|
| Language | Switch between English and Arabic |

---

## 📤 Import / Export

- Click **Export Data** to save all your scheduled and saved messages as a `.json` file
- Click **Import Data** to restore from a backup file

---

## 👤 Author

**vNeRf** 
[CodeFlow Developments](https://github.com/CodeFlowDevelopments) — [CodeFlow Dis](https://discord.gg/FAfg8qkkXh) — [Guns.Lol](https://guns.lol/97uc)

---

## 🐛 Issues

Found a bug? [Open an issue](https://github.com/CodeFlowDevelopments/vencord-message-scheduler/issues)

---

## 📄 License

GPL-3.0
