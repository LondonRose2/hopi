# Current Status — Hopi

_Last updated: 2026-10-19 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository Created:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **GitHub Repository Created:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Built (v1.0.7):**
  - **Local APK Path:** `release/hopi.apk` (10.32 MB).
  - **Direct Download / Release Page:** [`https://github.com/LondonRose2/hopi/releases/tag/v1.0.7`](https://github.com/LondonRose2/hopi/releases/tag/v1.0.7)
- **Features Included:**
  - **50+ Diverse Non-Repeating Companion Phrases:** Replaced the repetitive 4-phrase cycle with a rich catalog of over 50 varied phrases in `CompanionPhrases.java` and `phrases.ts`:
    - **Varied Water Reminders (14 phrases):** Warm, caring prompts to hydrate without feeling like robotic commands.
    - **Hydration Celebrations (5 phrases):** Joyful praise when water is recorded.
    - **Gentle Encouragements (12 phrases):** Kind, comforting reminders of progress and patience.
    - **Mindfulness & Calm Breathing (10 phrases):** Unclenching jaw, grounding, breathing exercises.
    - **Playful Companion Interactions (8 phrases):** Bunny hops, nose twitches, ear wiggles, and hugs.
    - **Time-of-Day Contextual Greetings (16 phrases):** Customized for Morning, Afternoon, Evening, and Night.
  - **Non-Repeating History Buffer (Size 12):** Prevents phrases from repeating sequentially or within recent interactions.
  - **Regular Gentle Hydration Check-ins:** Added a 35-minute periodic check-in in `FloatingMochiService`. If it has been >= 2 hours since drinking water, Mochi displays a gentle reminder bubble on the home screen overlay without being intrusive.
  - **Prevented Premature Alarms & Push Notifications:** Added past-timestamp guards in both TypeScript (`nativeOverlay.ts`) and Android Java (`FloatingMochiPlugin.java`).
  - **Dynamic Today Date Handling:** Replaced hardcoded date strings with `getTodayDateString()`.
  - **Fixed Non-Repeating Sleep Loop & Drag Direction Flip:** Isolated deep sleep loop to breathing frames 5 & 6, and touch delta to per-event coordinates.
- **Test & Type Health:**
  - 58 passing tests in Vitest (`npm.cmd test -- --run`).
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
