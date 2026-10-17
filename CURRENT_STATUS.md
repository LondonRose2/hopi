# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository Created:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Live on GitHub (v1.0.4):**
  - **Direct Download Link:** [`https://github.com/LondonRose2/hopi/releases/download/v1.0.4/hopi.apk`](https://github.com/LondonRose2/hopi/releases/download/v1.0.4/hopi.apk) (10.26 MB).
  - **Release Page:** [`https://github.com/LondonRose2/hopi/releases/tag/v1.0.4`](https://github.com/LondonRose2/hopi/releases/tag/v1.0.4).
- **Features Included:**
  - **Native Clock Selector:** Input triggers the native Android clock/time picker dialog directly with 1 tap.
  - **Task vs Routine Separation:** Explicit toggle in modal; Today's view places Tasks at the top and Daily Routines at the bottom.
  - **Prioritized by Time Due:** Both Tasks and Routines are chronologically sorted by due time (earliest first).
  - **Initial 6-Item Limit & Load More:** Shows up to 6 pending items across tasks and routines, with a clean "Load more" button for subsequent items.
  - **Rich Icon Palette (39 emojis):** Expanded categories for Wellness, Daily Tasks, and Spiritual/Calm in an easy-to-tap grid.
  - **Updated "Add Item" Copy:** Modernized wording throughout modal, buttons, and placeholders.
  - **Native Android Alarm Alarms:** Scheduled via `AlarmManager` with exact alarm support, sound, vibration, and persistent wakefulness.
  - **Animated Speech Bubble on Floating Avatar:** Mochi speaks on the home screen with an oatmeal linen speech bubble (`mochi_speech_bubble`) when reminders trigger, and provides micro-affirmations when tapped.
  - **Android Push Notifications:** High-priority notification channel (`hopi_reminder_channel`) delivering heads-up alerts.
  - **Notification Permissions:** Automatic Android 13+ `POST_NOTIFICATIONS` runtime permission request on startup.
  - **Full Reminders Persistence:** State saved in `localStorage` and automatically synchronized with native alarms.
- **Test & Type Health:**
  - Zero TypeScript errors (`npm.cmd run typecheck` / `npm.cmd run build`).
  - Strict line budgets respected on all files (views <100 lines, components <200 lines, service <300 lines).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) fully up-to-date.

---

## 🔨 What we're working on
1. Installing the v1.0.4 APK on Android phone to verify the native clock selector, 39-icon grid, Task vs Routine separation, and due-time prioritization.
2. Collecting real-device feedback on speech bubbles and reminder alarms.

---

## 💡 Why it matters
- Clear separation between one-time Tasks and recurring Routines with due-time prioritization prevents cognitive overwhelm while ensuring nothing slips through the cracks.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Native Clock Selector (`<input type="time" />`)** | Opens native Android clock hands and digital time selector with 1 tap for quick, error-free time setting. |
| **Tasks on Top, Routines at the Bottom** | Rachel requested tasks first and daily routines at the bottom to focus immediately on one-time todos while keeping habits anchored. |
| **Chronological Due-Time Prioritization** | Both tasks and routines are sorted by time due so the most urgent item is always visible at a glance. |
| **6-Item Initial Display with Load More** | Keeps the sheet calm and decluttered, displaying 6 items maximum initially while allowing easy expansion. |
| **Expanded 39-Icon Grid** | Provides diverse emojis across wellness, household chores, work, and spiritual moments. |
| **"Add Item" Universal Terminology** | Neutral and friendly naming that gracefully accommodates both tasks and recurring routines. |
| **Extracted Subcomponents (`TodayEmptyState`, `CompletedRemindersSection`)** | Strictly respects the 100-line budget for views while maintaining modular readability. |

---

## ⚠️ Known issues / tech debt
- Penguin avatar artwork to be integrated in future update once asset files are provided.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Install updated `v1.0.4` APK on Android phone and test adding an item with the native clock selector and new icons.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. Updated global kickoff & handoff skills to require living context files across all projects. |
| 2026-10-18 | Built full UI component suite: oatmeal linen tokens, Mochi sprite animator, z-99999 front canvas confetti celebration, decluttered Today view, date-sectioned Upcoming view, Routine edit modal, Settings view, and 3/4-height sheet shell in App.tsx. |
| 2026-10-18 | Added native Android FloatingMochiService and Capacitor plugin with SYSTEM_ALERT_WINDOW permission for home-screen overlay. Recompiled production APK (5.41 MB). |
| 2026-10-18 | Resolved avatar overlay crash on Android 14+ by supplying `FOREGROUND_SERVICE_TYPE_SPECIAL_USE` in `startForeground()`. Added `OverlayPermissionPrompt` and `useOverlayCompanion` for seamless 1-tap permission onboarding. |
| 2026-10-18 | Added push notifications and floating speech bubble to the home-screen companion avatar: integrated Android `AlarmManager`, `ReminderAlarmReceiver`, notification channel with sound & vibration, `mochi_speech_bubble` overlay layout with animated speech, and `useReminders` auto-sync hook. Built v1.0.3 APK (10.25 MB). |
| 2026-10-18 | Implemented native clock selector (`showPicker()`), expanded 39-icon grid, Task vs Routine toggle, "Add Item" universal naming, Today's view separation (Tasks on top, Routines at bottom, both prioritized by due time, 6 item initial limit + load more). Extracted TodayEmptyState and CompletedRemindersSection subcomponents. Built v1.0.4 APK (10.26 MB). |
