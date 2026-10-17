# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository Created:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Live on GitHub (v1.0.3):**
  - **Direct Download Link:** [`https://github.com/LondonRose2/hopi/releases/download/v1.0.3/hopi.apk`](https://github.com/LondonRose2/hopi/releases/download/v1.0.3/hopi.apk) (10.25 MB).
  - **Release Page:** [`https://github.com/LondonRose2/hopi/releases/tag/v1.0.3`](https://github.com/LondonRose2/hopi/releases/tag/v1.0.3).
- **Features Included:**
  - **Native Android Alarm Alarms:** Scheduled via `AlarmManager` with exact alarm support, sound, vibration, and persistent wakefulness.
  - **Animated Speech Bubble on Floating Avatar:** Mochi speaks on the home screen with an oatmeal linen speech bubble (`mochi_speech_bubble`) when reminders trigger, and provides micro-affirmations when tapped.
  - **Android Push Notifications:** High-priority notification channel (`hopi_reminder_channel`) delivering heads-up alerts.
  - **Notification Permissions:** Automatic Android 13+ `POST_NOTIFICATIONS` runtime permission request on startup.
  - **Full Reminders Persistence:** State saved in `localStorage` and automatically synchronized with the native alarm scheduler on app launch, creation, completion, and deletion.
  - **Floating Mochi Companion:** Native Android `SYSTEM_ALERT_WINDOW` overlay service with draggable avatar, idle bouncing, and directional dragging.
  - **In-App Permission Request Banner:** Gentle onboarding card with 1-tap jump to Android's "Display over other apps" settings.
  - **3/4-Height Sheet Shell:** Today Reminders (3-5 items + Load More), front-layer confetti, inline/modal reminder editing, upcoming tasks sectioned by day, sleep mode (12 AM - 9 AM).
- **Test & Type Health:**
  - 38/38 unit tests passing in Vitest (`tests/domain.test.ts`).
  - Zero TypeScript errors (`npm.cmd run typecheck`).
  - Strict line budgets respected on all files (views <100 lines, components <200 lines, service <300 lines).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) fully up-to-date.

---

## 🔨 What we're working on
1. Installing the v1.0.3 APK on Android phone to verify push notifications and avatar speech bubbles at reminder time.
2. Collecting real-device feedback on speech bubble timing, vibration, and reminder check-offs.

---

## 💡 Why it matters
- Timely reminders with a friendly speech bubble directly on the home screen make wellness and routine tracking joyful and impossible to miss.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Android AlarmManager (`ReminderAlarmReceiver.java`)** | Schedules native alarms even when the app is minimized or the screen is turned off. |
| **Floating Avatar Speech Bubble (`showSpeechBubble`)** | Renders a styled speech bubble directly attached to the floating avatar on the phone home screen with smooth scale/fade animations. |
| **Heads-Up Push Notification** | Triggers Android notification with sound, vibration, and high importance channel so the user never misses a routine. |
| **Auto-Sync Hook (`useReminders.ts`)** | Bridges web state with native Android alarms; ensures alarms are always in sync even across app restarts. |
| **In-App Permission Prompt (`OverlayPermissionPrompt.tsx`)** | Explains clearly to the user why Hopi needs "Display over other apps" with a 1-tap button to the exact Android settings page. |
| **Lifecycle Resumption Hook (`useOverlayCompanion.ts`)** | Automatically detects when user enables permission and returns to the app, immediately activating the floating companion without manual toggles. |
| **Android 14+ FGS Type Specification** | Modern Android (API 34+) strictly requires `FOREGROUND_SERVICE_TYPE_SPECIAL_USE` when calling `startForeground()`. |
| **Floating Mochi Companion (`SYSTEM_ALERT_WINDOW`)** | Floats on home screen and over apps so Rachel has her gentle companion always present. |
| **High-Layer Confetti (`z-index: 99999`)** | Renders celebration burst in front of the modal and avatar for a deeply satisfying feel. |
| **Comforting Oatmeal Linen Palette** | Gentle `#FBF8F2` texture and soft cards avoid sterile white while remaining minimalist. |

---

## ⚠️ Known issues / tech debt
- Penguin avatar artwork to be integrated in future update once asset files are provided.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Install updated `v1.0.3` APK on Android phone, add a test reminder 1 minute in the future, and verify the speech bubble and push notification.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. Updated global kickoff & handoff skills to require living context files across all projects. |
| 2026-10-18 | Built full UI component suite: oatmeal linen tokens, Mochi sprite animator, z-99999 front canvas confetti celebration, decluttered Today view, date-sectioned Upcoming view, Routine edit modal, Settings view, and 3/4-height sheet shell in App.tsx. |
| 2026-10-18 | Added native Android FloatingMochiService and Capacitor plugin with SYSTEM_ALERT_WINDOW permission for home-screen overlay. Recompiled production APK (5.41 MB). 38/38 unit tests pass. |
| 2026-10-18 | Resolved avatar overlay crash on Android 14+ by supplying `FOREGROUND_SERVICE_TYPE_SPECIAL_USE` in `startForeground()`. Added `OverlayPermissionPrompt` and `useOverlayCompanion` for seamless 1-tap permission onboarding. |
| 2026-10-18 | Added push notifications and floating speech bubble to the home-screen companion avatar: integrated Android `AlarmManager`, `ReminderAlarmReceiver`, notification channel with sound & vibration, `mochi_speech_bubble` overlay layout with animated speech, and `useReminders` auto-sync hook. Tuned Gradle JVM memory with SerialGC for Windows environment. Built v1.0.3 APK (10.25 MB). |
