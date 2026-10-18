# Current Status — Hopi

_Last updated: 2026-10-19 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository Created:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Built (v1.0.5):**
  - **Local APK Path:** `release/hopi.apk` (10.32 MB).
- **Features Included:**
  - **Fixed Non-Repeating Sleep Loop:** Mochi transitions once into sleep (frames 0 to 5) and remains peacefully sleeping in a gentle breathing cycle between frames 5 & 6 (850ms interval). Frame 7 (sudden pop-up) is completely excluded from the sleep loop.
  - **Movement & Morning Wake Behavior:** Mochi stays sleeping all night until moved (dragged across screen) or morning arrives (post-rest hours after 8:00 AM). Moving Mochi wakes it up into walking/idle for a responsive session (15-minute wakefulness window before resting again if undisturbed).
  - **Dynamic Hydration Calculation Across the Day:** Pure domain calculation (`calculateHydrationStatus`) tracking time elapsed since last water intake:
    - `< 2.5 hours`: Fully hydrated, joyful and energetic (`idle` / playful `wave`).
    - `2.5 to 4.0 hours` (or overdue water reminder): Mildly dehydrated (`sad` animation with drooping ears and longing eyes).
    - `>= 4.0 hours`: Deep dehydration / fatigue (`sleep` animation from lack of energy).
  - **Interactive Hydration Action:** 1-tap `💧 Drink` action in the header and tap-to-drink on Mochi or checking off water reminders immediately rehydrates Mochi, triggers celebratory confetti and cheer animation, and updates native overlay state with speech bubble: *"Ah, refreshing! Thank you for hydrating! 💧✨"*.
  - **Contextual Speech Encouragements:** Tapping Mochi speaks contextually depending on whether it's resting at night, feeling thirsty, or exhausted.
- **Test & Type Health:**
  - 54 passing tests in Vitest (`npm.cmd test -- --run`).
  - Zero TypeScript errors (`npm.cmd run typecheck` / `npm.cmd run build`).
  - Strict line budgets respected on all files (views <100 lines, components <200 lines, services <300 lines).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) fully up-to-date.

---

## 🔨 What we're working on
1. Verifying Mochi's persistent sleep and movement-triggered wake on Android device.
2. Observing Mochi's sad and sleepy reactions as hydration changes throughout the day.

---

## 💡 Why it matters
- Having Mochi stay asleep calmly at night without popping up every 3 seconds provides a peaceful, realistic companion experience. Dynamic dehydration creates an intuitive emotional connection to daily wellness habits.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Separated Sleep Intro & Deep Sleep Loop (Frames 5 & 6)** | Prevents Mochi from cycling back to standing up every 3 seconds. Once asleep, Mochi alternates only between breathing frames at 850ms. |
| **Wake on Move (`ACTION_MOVE`) & Morning (> 8 AM)** | Lets Rachel wake Mochi anytime by moving it, while naturally waking Mochi in the morning. |
| **3-Tier Hydration Domain Calculation** | Provides predictable biological rhythm: <2.5h happy, 2.5-4h sad (thirsty), >=4h sleepy (dehydrated). |
| **Integrated 1-Tap `💧 Drink` & Reminder Check-off** | Allows immediate hydration feedback both in-app and in the floating overlay service. |
| **Extracted `useCompanionMood` Hook** | Kept `App.tsx` strictly under 100 lines (84 lines) and encapsulated mood state cleanly. |

---

## ⚠️ Known issues / tech debt
- Penguin avatar artwork to be integrated in future update once asset files are provided.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Install updated `v1.0.5` APK on Android phone and verify Mochi stays asleep peacefully and wakes when moved.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. |
| 2026-10-18 | Built full UI component suite: oatmeal linen tokens, Mochi sprite animator, z-99999 front canvas confetti celebration, decluttered Today view, date-sectioned Upcoming view, Routine edit modal, Settings view, and 3/4-height sheet shell in App.tsx. |
| 2026-10-18 | Added native Android FloatingMochiService and Capacitor plugin with SYSTEM_ALERT_WINDOW permission for home-screen overlay. |
| 2026-10-18 | Resolved avatar overlay crash on Android 14+ by supplying `FOREGROUND_SERVICE_TYPE_SPECIAL_USE` in `startForeground()`. Added `OverlayPermissionPrompt` and `useOverlayCompanion`. |
| 2026-10-18 | Added push notifications and floating speech bubble to the home-screen companion avatar: integrated Android `AlarmManager`, `ReminderAlarmReceiver`, notification channel with sound & vibration, `mochi_speech_bubble` overlay layout with animated speech, and `useReminders` auto-sync hook. Built v1.0.3 APK. |
| 2026-10-18 | Implemented native clock selector (`showPicker()`), expanded 39-icon grid, Task vs Routine toggle, "Add Item" universal naming, Today's view separation. Built v1.0.4 APK. |
| 2026-10-19 | Fixed 3-second repeating sleep loop: Mochi now stays sleeping in a calm loop (frames 5 & 6) and only wakes up when moved or when morning arrives. Added pure domain hydration calculation and sad/sleepy states based on time without water. Built v1.0.5 APK (10.32 MB). 54 unit tests passing. |
