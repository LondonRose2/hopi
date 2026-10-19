# Current Status — Hopi

_Last updated: 2026-10-19 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Built (v1.1.2):**
  - **Local Wi-Fi Browser Link (Mobile Chrome):** [`http://192.168.0.103:8088/`](http://192.168.0.103:8088/) or direct download at [`http://192.168.0.103:8088/hopi.apk`](http://192.168.0.103:8088/hopi.apk)
  - **GitHub Direct Download Link:** [`https://github.com/LondonRose2/hopi/releases/download/v1.1.2/hopi.apk`](https://github.com/LondonRose2/hopi/releases/download/v1.1.2/hopi.apk)
  - **GitHub Release Page:** [`https://github.com/LondonRose2/hopi/releases/tag/v1.1.2`](https://github.com/LondonRose2/hopi/releases/tag/v1.1.2)
  - **Local File Path:** `release/hopi.apk` (12.01 MB, built today).
- **Features Included:**
  - **Hydration Logging & Companion Happiness Sync:**
    - Dedicated "💧 I drank water" button in the companion card.
    - Direct tap on the thirsty/sad avatar or bubble immediately logs hydration, displays wave animation, and plays joyous celebration.
    - Two-way hydration sync between React app and Android native floating service (`FloatingMochiService`).
  - **Custom Repeating Hourly Routines (`Every X hrs`):**
    - Configurable interval selector from 1 to 12 hours.
    - Canonical next-occurrence calculation in `src/domain/reminders/recurrence.ts` automatically advances due time by `intervalHours` upon check-off.
    - Natural language voice parser supports phrases like "take vitamins every 4 hours".
  - **Microphone Long-Press & Voice Recording Engine:**
    - Android 11+ package visibility declared via `<queries>` with `android.speech.RecognitionService`.
    - Proactive runtime `android.permission.RECORD_AUDIO` request handled smoothly via `FloatingMochiPlugin` and `useOverlayCompanion`.
    - Helpful speech bubble guidance if microphone permission is not yet granted ("Mic permission needed! Tap here to open Hopi 🎙️").
    - Tapping "tap to retry" or "Mic ready" in the speech bubble directly restarts voice listening.
    - Clean recognizer reset and error handling for `ERROR_RECOGNIZER_BUSY`, `ERROR_INSUFFICIENT_PERMISSIONS`, and network timeouts.
  - **Organic, Non-Repetitive Idle & Blinking Engine:**
    - Replaced rapid 900ms linear frame cycling with natural resting posture (2.4s–5.2s peaceful still rest).
    - Varied realistic actions: single blinks (70ms/130ms), occasional double-blinks (20%), curious head tilts (10%), and sweet nose/paw grooming (10%).
  - **Authentic Flat Sleeping & Breathing Slumber:**
    - Replaced sitting head-bobbing in Snowdrop and Pip with true flat slumber frames (lying flat, chin on paws, eyes closed peacefully for 3.0s–5.4s, followed by gentle ~750ms breathing shift).
  - **Grounded Hop & Walk Pacing:**
    - Calibrated dragging motion to 140ms per frame for a graceful, bouncy hop rather than frantic cycling.
  - **Three Selectable Companions:** Mochi (plush bunny), Pip (baby penguin), and Snowdrop (lop rabbit).
    - Full animation state support across all 3 characters: `idle` (blinking), `walk` (hop/waddle), `wave`, `cheer` (jump), `sleep` (organic breathing loop), and `sad` (drooping/thirsty).
    - Native home screen floating companion overlay (`FloatingMochiService`) dynamically switches drawables and name immediately upon selection.
  - **Mature, Grounded Companion Tone:** Dignified adult wellness encouragement, grounding reflections, and realistic hydration prompts.
  - **Voice Reminder System (Long-Press to Record, Double-Tap to Finish):** Offline intent classification for Tasks vs Routines, conversational clarification loop via `TextToSpeech`.
  - **Dynamic Avatar Naming:** All phrases, service notifications, and UI status strings use dynamic avatar name formatting (`getCompanionName()` / `%s` / `{name}`).
  - **Hourly Midnight Sleep Reminders:** Proactive gentle rest reminders between 12:00 AM and 8:00 AM when screen is active.
- **Test & Type Health:**
  - 72 passing tests in Vitest (`npm.cmd test`).
  - Zero TypeScript errors (`npm.cmd run build`).
  - Strict line budgets respected on all files (views <= 100 lines, components <= 200/300 lines, services <= 300 lines).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) fully up-to-date.

---

## 🔨 What we're working on
1. Verifying companion switching between Mochi, Pip, and Snowdrop in-app and on the floating home screen overlay.

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
| 2026-10-19 | Added customizable hourly repeating routines: (1) Added `recurring: 'hourly'` and `repeatIntervalHours` (1-24h) to Reminder contracts; (2) Added interactive Cadence picker in `ReminderEditModal` with quick pills (1h, 2h, 3h, 4h, 6h, 8h) and custom number input; (3) Added `calculateNextHourlyOccurrence` pure domain recurrence engine in `recurrence.ts`; (4) Auto-schedules next occurrence upon completion with speech feedback and AlarmManager sync; (5) Added voice recognition ("Remind me every X hours to...") in TypeScript & Android `VoiceParser.java`. 72 unit tests passing. Built APK successfully. |
| 2026-10-19 | Connected companion avatar with interactive water intake inputs: (1) Added prominent `💧 I drank water` button and direct avatar tap-to-water hydration in-app; (2) Connected `useReminders` checklist completion directly to `useCompanionMood` state; (3) Added `isWaterIntakePhrase` intent recognition for voice ("I drank water") on floating overlay; (4) Enabled speech bubble single-tap water logging on overlay; (5) Synced native water timestamp across Android & web on resume. 66 unit tests passing. Built APK successfully. |
| 2026-10-19 | Added Pip (baby penguin) and Snowdrop (white lop bunny) companion avatars. Created dynamic frame definitions, generated 76 Android drawables, wired Settings selection, and added `ACTION_UPDATE_AVATAR` for instant overlay character switching. 65 unit tests passing. Built v1.1.0 APK. |
| 2026-10-19 | Fixed 3-second repeating sleep loop: Mochi now stays sleeping in a calm loop (frames 5 & 6) and only wakes up when moved or when morning arrives. Added pure domain hydration calculation and sad/sleepy states based on time without water. Built v1.0.5 APK (10.32 MB). 54 unit tests passing. |
