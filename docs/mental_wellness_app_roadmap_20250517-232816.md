
# 🧠 Modular Mental Wellness App – Roadmap

> A modular, offline-first mental health app where each feature (Journal, Mood Tracker, Expense Manager, Book Reader, Planner/Vision Board) can be enabled or disabled per user. All modules use a unified backend, support secure local storage, and sync to the cloud when online.

---

## 🚀 PHASE 1 – CORE INFRASTRUCTURE (2–3 weeks)

- All modules are offline-first and sync to the backend when online
- Modular architecture: users can enable/disable features as needed
- Unified backend for all modules

| Task | Description | Priority |
|------|-------------|----------|
| 🔐 Authentication | Email-code-based, optional anonymous mode | High |
| 🧠 Modular Settings | Let users toggle features on/off | High |
| 💾 Local DB Setup | Use SQLite or WatermelonDB for offline-first | High |
| 🔌 Sync Engine | Connect local DB to backend (Supabase or custom) | High |
| 🌐 Network Status Handling | Detect offline/online & trigger sync | High |

---

## 📓 PHASE 2 – JOURNAL + MOOD TRACKER (3–4 weeks)

| Task | Description | Priority |
|------|-------------|----------|
| 📓 Add journal entries (text + tags) | Save offline, sync later | High |
| 🙂 Daily mood log | Emoji or scale input + notes | High |
| 📊 Mood trends (weekly, monthly) | Charts using mood data | Medium |
| 🔔 Reminders | Optional daily journal/mood reminders | Medium |

---

## 🧾 PHASE 3 – EXPENSE MANAGER (2–3 weeks)

| Task | Description | Priority |
|------|-------------|----------|
| 💰 Add expenses/income | By category, offline-first | High |
| 📊 Summary dashboard | Monthly spending + pie chart | Medium |
| 🧮 Budget goals | Set and track budgets | Medium |

---

## 📚 PHASE 4 – DAILY PLANNER + VISION BOARD (3–4 weeks)

| Task | Description | Priority |
|------|-------------|----------|
| 📆 Daily/weekly/monthly view | Tasks, events | High |
| 🧠 Year plan & vision board | Notes + images per category | Medium |
| 📤 Sync planner data | Same sync system as journal | High |

---

## 🧑‍⚕️ PHASE 5 – THERAPY + RESOURCES + AI (4–6 weeks)

| Task | Description | Priority |
|------|-------------|----------|
| 📅 Book consultation | Therapist directory + availability | High |
| 📞 In-app consultation | Via Meet link or video integration | Medium |
| 📘 Resources | Articles, audio, downloadable guides | Medium |
| 🤖 AI Assistant | Chat interface, basic mental health responses | Medium |
| 🧠 AI+Journal integration | Sentiment check, auto prompts | Stretch |

---

## 🧪 ONGOING – Testing & Deployment

| Task | Description |
|------|-------------|
| 🧪 Beta testing with friends/community |
| 🛠️ DevOps + backups |
| 🎯 Telemetry & analytics (opt-in only) |
| 📤 App builds via Expo or EAS |
| 🔐 User data privacy policies & opt-ins |

---

## ☁️ Supabase vs. VPS

### ✅ Supabase (Recommended for Now)
- Fast setup (Auth, DB, Storage, Realtime)
- Scalable and developer-friendly
- Easy export for migration
- Can move to VPS later

### 🖥️ VPS (Use Later)
- Full control, free scale
- Custom backend logic
- Requires setup, monitoring

---

## 💰 Pricing & Subscription – Planning Ahead

> Build with monetization in mind, even if starting free.

**Free Tier:**
- Access to Journal, Mood Tracker, Planner (basic)
- Offline-only mode
- Community resources

**Premium Tier:**
- Cloud sync & multi-device access
- AI Assistant & insights
- Book reader + advanced planner
- Therapy session booking & private resources

**Future Ideas:**
- Family or couple plan (shared vision boards or planner)
- “Pay What You Can” tier
- Therapist/institution license

---

## ✅ Next Steps

- [ ] Build Journal module with offline + sync
- [ ] Set up Supabase backend
- [ ] Create modular feature settings
- [ ] UI for enabling/disabling features
- [ ] Plan database schema for all modules

