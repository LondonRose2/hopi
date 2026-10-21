# Current Status — Hopi

_Last updated: 2026-10-21 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Built (v1.1.4):**
  - **Local Wi-Fi Browser Link (Mobile Chrome):** [`http://192.168.0.103:8088/`](http://192.168.0.103:8088/) or direct download at [`http://192.168.0.103:8088/hopi.apk`](http://192.168.0.103:8088/hopi.apk)
  - **Local File Path:** `release/hopi.apk` (11.99 MB, built today).
- **Features Included:**
  - **Quick Action Menu on Tap (No Background App Auto-Opening):**
    - Single tap on floating companion displays a sleek 3-action floating menu (`💧 Log Water`, `📝 Add Task`, `🏠 Open Hopi`) with gentle scale-in animation and 6.5s auto-dismiss.
    - Eliminated background app auto-opening on tap.
    - Tapping `💧 Log Water` instantly logs water, triggers wave animation, and speaks companion celebration.
    - Tapping `📝 Add Task` deep-links directly into Hopi's task creation modal.
    - Tapping `🏠 Open Hopi` brings the main app to the foreground.
  - **Double Tap for Words of Encouragement & Waves:**
    - Double-tapping the floating avatar bypasses the quick menu, plays a joyful wave animation, and cycles through grounded wellness words of encouragement and scripture reflections via speech bubble & TTS.
  - **Proactive Overdue Task Alert Indicator:**
    - Terracotta alert dot badge on top-right of the avatar on both the Android home-screen floating overlay and in-app header.
    - Pure domain calculation (`isReminderOverdue` and `hasAnyOverdueReminders`) dynamically synchronizing status across web and native bridge.
    - Alarms triggering from `ReminderAlarmReceiver` activate companion speech bubbles and alert dot proactively.
  - **Daily Water Intake Counter & Midnight Auto-Reset:**
    - Live daily counter under avatar (`💧 4 / 8 glasses today`) with micro progress bar.
    - Quick-tap `+1 Glass` logs intake, resets companion thirst clock to 0.0h, and auto-completes overdue water reminders.
    - Day-by-day automatic rollover at midnight with full history preservation.
  - **Day-by-Day Hydration History & Goal Customization:**
    - Dedicated Settings card with customizable daily target (`6`, `8`, `10`, `12` glasses).
    - Past 7 days hydration log showing date, glasses, ounces, and goal achievement badges.
    - Quick +/- controls for adjusting today's count manually.
  - **Eliminated Idle "Hiccups" / Bouncing:**
    - Fixed canvas scaling to ground sprites at a constant bottom baseline so feet/body remain completely steady.
    - Calmed idle pacing to 4.5s–7.5s peaceful still rest with soft, natural eye blinks.
    - Matched calm resting pacing in Android floating overlay (`FloatingMochiService`).
  - **Custom Repeating Hourly Routines (`Every X hrs`):**
    - Configurable interval selector from 1 to 12 hours with automated due time advancement.
  - **Microphone Long-Press & Voice Recording Engine:**
    - Android 11+ package visibility declared via `<queries>` with `android.speech.RecognitionService`.
    - Proactive runtime `android.permission.RECORD_AUDIO` request handled smoothly via `FloatingMochiPlugin`.
    - 1-tap retry directly on speech bubble (`"Didn't catch that. Tap again to retry! 🐰"`).
  - **Three Selectable Companions:** Mochi (plush bunny), Pip (baby penguin), and Snowdrop (lop rabbit).
  - **Test & Type Health:**
    - 82 passing tests in Vitest (`npm.cmd test`).
    - Zero TypeScript errors (`npm.cmd run build`).
    - Strict line budgets respected on all files (views <= 100 lines, components <= 200/300 lines, services <= 300 lines).


---

## 💡 Why it matters
- Having multiple distinct companion options (Mochi, Pip, Snowdrop) lets users personalize their emotional connection and wellness experience while retaining all fluid animations and voice reminder features.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Extracted `avatarFrames.ts`** | Centralizes sprite sheet paths and frame boundary definitions for all 3 avatars while keeping `MochiAvatar.tsx` well under its 200-line budget (166 lines). |
| **Unified 3-Avatar Grid in `SettingsView.tsx`** | Clean, mobile-friendly 3-column selector with emoji, name, and subtitle that stays strictly under the 100-line orchestrator limit (98 lines). |
| **Generated Native Android Drawables for Pip & Snowdrop** | Preserved baseline y=84 anchoring and created 38 drawables per new avatar so the home-screen floating overlay animates seamlessly. |
| **Added `ACTION_UPDATE_AVATAR` to `FloatingMochiService`** | Allows the floating overlay to switch character instantaneously without needing an app restart. |

---

## ⚠️ Known issues / tech debt
- None active.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. In Hopi, tap "+" to create or edit a Daily Routine, choose "Every X hrs", and select your desired hours interval (e.g. 2h, 3h, or custom).
2. Check off the routine upon completing it and observe the next occurrence automatically scheduling for X hours later with full celebration and alarm setup.
3. Test voice command on floating companion: "Remind me every 2 hours to drink water" and verify automatic interval extraction.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-21 | Added 3-option quick menu on tap, double-tap reflections, and proactive overdue indicator: (1) Added 3-button quick menu (`💧 Log Water`, `📝 Add Task`, `🏠 Open Hopi`) with 6.5s auto-dismiss and stopped app auto-opening on tap; (2) Added double-tap trigger for grounded encouragement reflections and wave animation; (3) Added proactive overdue alert indicator badge (`mochiAlertDot` / terracotta dot) with `isReminderOverdue` pure domain logic and native sync bridge; (4) Added deep-link routing into task creation modal on `add_task`; (5) 82 unit tests passing; Built v1.1.4 APK. |
| 2026-10-19 | Added customizable hourly repeating routines: (1) Added `recurring: 'hourly'` and `repeatIntervalHours` (1-24h) to Reminder contracts; (2) Added interactive Cadence picker in `ReminderEditModal` with quick pills (1h, 2h, 3h, 4h, 6h, 8h) and custom number input; (3) Added `calculateNextHourlyOccurrence` pure domain recurrence engine in `recurrence.ts`; (4) Auto-schedules next occurrence upon completion with speech feedback and AlarmManager sync; (5) Added voice recognition ("Remind me every X hours to...") in TypeScript & Android `VoiceParser.java`. 72 unit tests passing. Built APK successfully. |
| 2026-10-19 | Connected companion avatar with interactive water intake inputs: (1) Added prominent `💧 I drank water` button and direct avatar tap-to-water hydration in-app; (2) Connected `useReminders` checklist completion directly to `useCompanionMood` state; (3) Added `isWaterIntakePhrase` intent recognition for voice ("I drank water") on floating overlay; (4) Enabled speech bubble single-tap water logging on overlay; (5) Synced native water timestamp across Android & web on resume. 66 unit tests passing. Built APK successfully. |
| 2026-10-19 | Added Pip (baby penguin) and Snowdrop (white lop bunny) companion avatars. Created dynamic frame definitions, generated 76 Android drawables, wired Settings selection, and added `ACTION_UPDATE_AVATAR` for instant overlay character switching. 65 unit tests passing. Built v1.1.0 APK. |
| 2026-10-19 | Fixed 3-second repeating sleep loop: Mochi now stays sleeping in a calm loop (frames 5 & 6) and only wakes up when moved or when morning arrives. Added pure domain hydration calculation and sad/sleepy states based on time without water. Built v1.0.5 APK (10.32 MB). 54 unit tests passing. |
