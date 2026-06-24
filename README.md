# ⏰ MessageScheduler — Vencord Plugin

![Vencord](https://img.shields.io/badge/Vencord-Plugin-7289DA?style=flat-square)
![License](https://img.shields.io/badge/License-GPL--3.0-green?style=flat-square)
![Author](https://img.shields.io/badge/Author-hmood-blue?style=flat-square)
![Version](https://img.shields.io/badge/Version-2.0.0-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Stars](https://img.shields.io/github/stars/CodeFlowDevelopments/vencord-message-scheduler?style=flat-square)
![Issues](https://img.shields.io/github/issues/CodeFlowDevelopments/vencord-message-scheduler?style=flat-square)

---

<div dir="ltr">

## ✨ Features

- 🕐 Clock icon in the chat bar for quick access
- ⚡ Preset times: 5s, 30s, 5m, 10m, 30m, 1h, 2h, 1d, 1w, 1 month
- 📅 Schedule by exact date and time
- ⚙️ Custom time input (seconds, minutes, hours, days, months)
- 🔁 Repeat messages (set count or repeat forever)
- 🎲 Random messages — add a pool and send randomly each time
- 📢 Send to any channel in the server
- 💾 Save messages for reuse later
- 🔍 Search through pending messages
- ✏️ Edit a pending message without cancelling it
- 📤 Export / Import your data as JSON
- 🔔 Notification 1 minute before sending
- 🌐 Arabic & English language support

</div>

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

## 📦 Installation / التثبيت

<details>
<summary>English</summary>

### Requirements
- [Git](https://git-scm.com/download/win)
- [Node.js LTS](https://nodejs.org)
- pnpm — run in CMD: `npm install -g pnpm`

### Steps

**1 — Download Vencord source**

Go to `https://github.com/Vendicated/Vencord` → **Code → Download ZIP** → Extract to Desktop

**2 — Open CMD in the folder**
```bash
cd Desktop\Vencord-main
pnpm install --frozen-lockfile
```

**3 — Place the plugin file**

Download `index.tsx` and place it here:
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

**5 — Enable**

Discord → `Settings` → `Plugins` → search **MessageScheduler** → enable ✅

</details>

<details>
<summary>العربية</summary>

### المتطلبات
- [Git](https://git-scm.com/download/win)
- [Node.js LTS](https://nodejs.org)
- pnpm — شغل في CMD: `npm install -g pnpm`

### الخطوات

**1 — حمل Vencord من المصدر**

روح لـ `https://github.com/Vendicated/Vencord` ← **Code → Download ZIP** ← فك الضغط على سطح المكتب

**2 — افتح CMD في المجلد**
```bash
cd Desktop\Vencord-main
pnpm install --frozen-lockfile
```

**3 — حط ملف البلوجن**

حمل `index.tsx` وحطه هنا:
```
Vencord-main\src\plugins\MessageScheduler\index.tsx
```
> اصنع مجلد اسمه `MessageScheduler` داخل `src\plugins`

**4 — ابنِ وثبّت**
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

**5 — فعّل البلوجن**

Discord ← `Settings` ← `Plugins` ← ابحث عن **MessageScheduler** ← فعّله ✅

</details>

---

## 🚀 Usage / طريقة الاستخدام

| # | English | العربية |
|---|---------|---------|
| 1 | Click the clock 🕐 icon in the chat bar | اضغط أيقونة الساعة 🕐 في الـ chatbar |
| 2 | Type your message | اكتب رسالتك |
| 3 | Select preset time, exact date, or custom | اختر وقت جاهز، تاريخ محدد، أو مخصص |
| 4 | Enable repeat or random if needed | فعّل التكرار أو العشوائية إذا تبي |
| 5 | Click Schedule Message | اضغط جدولة الرسالة |

---

## 📋 Tabs / التبويبات

| Tab | English | العربية |
|-----|---------|---------|
| Schedule | Create a new scheduled message | إنشاء رسالة مجدولة جديدة |
| Saved | Your saved message templates | رسائلك المحفوظة |
| Queue | All pending messages with search & edit | كل الرسائل المنتظرة مع بحث وتعديل |

---

## ⚙️ Settings / الإعدادات

| Setting | Description | الوصف |
|---------|-------------|-------|
| Language | Switch between English and Arabic | تغيير اللغة بين العربية والإنجليزية |

---

## 👤 Author / المطور

**hmood** — [CodeFlow Developments](https://github.com/CodeFlowDevelopments)

---

## 🐛 Issues / المشاكل

Found a bug? / لقيت مشكلة؟ [Open an issue](https://github.com/CodeFlowDevelopments/vencord-message-scheduler/issues)

---

## 📄 License

GPL-3.0
