# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository Created:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Live on GitHub (v1.0.2):**
  - **Direct Download Link:** [`https://github.com/LondonRose2/hopi/releases/download/v1.0.2/hopi.apk`](https://github.com/LondonRose2/hopi/releases/download/v1.0.2/hopi.apk) (10.44 MB).
  - **Release Page:** [`https://github.com/LondonRose2/hopi/releases/tag/v1.0.2`](https://github.com/LondonRose2/hopi/releases/tag/v1.0.2).
- **Features Included:**
  - Floating Mochi Companion with native Android `SYSTEM_ALERT_WINDOW` overlay service.
  - In-app Permission Request Banner (`OverlayPermissionPrompt.tsx`) with 1-tap jump to Android's "Display over other apps" settings.
  - Automatic overlay start on app launch and automatic resumption when returning to Hopi from Android settings (`useOverlayCompanion.ts`).
  - Android 14+ (API 34+) compatibility with `ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE` in `startForeground()` and `START_STICKY` service lifecycle.
  - 3/4-height sheet shell, Today Reminders (3-5 items + Load More), front-layer confetti, inline/modal reminder editing, upcoming tasks sectioned by day, sleep mode (12 AM - 9 AM).
- **Test & Type Health:**
  - 38/38 unit tests passing in Vitest (`tests/domain.test.ts`).
  - Zero TypeScript errors (`npm.cmd run typecheck`).
  - Strict line budgets respected on all files (views <100 lines, components <200 lines).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) fully up-to-date.

---

## 🔨 What we're working on
1. Installing the updated APK on Android phone to verify the in-app permission banner and the floating home-screen avatar.
2. Collecting real-device feedback on Mochi's sprite animations, home-screen overlay, reminder editing, and confetti celebrations.

---

## 💡 Why it matters
- A gentle, decluttered companion with Mochi provides comforting, non-stressful wellness and spiritual encouragement.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **In-App Permission Prompt (`OverlayPermissionPrompt.tsx`)** | Explains clearly to the user why Hopi needs "Display over other apps" with a 1-tap button to the exact Android settings page. |
| **Lifecycle Resumption Hook (`useOverlayCompanion.ts`)** | Automatically detects when user enables permission and returns to the app, immediately activating the floating companion without manual toggles. |
| **Android 14+ FGS Type Specification** | Modern Android (API 34+) strictly requires `FOREGROUND_SERVICE_TYPE_SPECIAL_USE` when calling `startForeground()`; fixes silent crash on newer Android phones. |
| **Floating Mochi Companion (`SYSTEM_ALERT_WINDOW`)** | Floats on home screen and over apps so Rachel has her gentle companion always present. |
| **3/4-Height Modal Sheet** | Opens when tapping Mochi; keeps the phone context visible while managing tasks. |
| **Decluttered Today View (3–5 items max)** | Eliminates visual anxiety; remaining items accessible via clean "Load More" button. |
| **Date-Sectioned Upcoming Screen** | Keeps future items separated from today, organized with thin minimalist day dividers (`Thu, Jan 30`). |
| **Inline & Modal Reminder Editing** | Allows quick 1-tap editing of title, time, and emoji without tedious navigation. |
| **High-Layer Confetti (`z-index: 99999`)** | Renders celebration burst in front of the modal and avatar for a deeply satisfying feel. |
| **Sleep Mode (12:00 AM – 9:00 AM)** | Mochi flops down to sleep, silences daytime notifications, protecting rest hours. |
| **Comforting Oatmeal Linen Palette** | Gentle `#FBF8F2` texture and soft cards avoid sterile white while remaining minimalist. |

---

## ⚠️ Known issues / tech debt
- Penguin avatar artwork to be integrated in future update once asset files are provided.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Install updated `hopi-debug.apk` on Android phone, test 1-tap permission prompt, and confirm Mochi floating on screen.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. Updated global kickoff & handoff skills to require living context files across all projects. |
| 2026-10-18 | Design Specialist built full UI component suite: oatmeal linen tokens, Mochi sprite animator (idle, wave, sleep, cheer), z-99999 front canvas confetti celebration, decluttered Today view (<100 lines), date-sectioned Upcoming view (<100 lines), Routine edit modal (<200 lines), Settings view (<100 lines), and 3/4-height sheet shell in App.tsx (<100 lines). |
| 2026-10-18 | Added native Android FloatingMochiService and Capacitor plugin with SYSTEM_ALERT_WINDOW permission for home-screen overlay. Recompiled production APK (5.41 MB). 38/38 unit tests pass. |
| 2026-10-18 | Resolved avatar overlay crash on Android 14+ by supplying `FOREGROUND_SERVICE_TYPE_SPECIAL_USE` in `startForeground()`. Added `OverlayPermissionPrompt` and `useOverlayCompanion` for seamless 1-tap permission onboarding and automatic start upon returning from settings. Clean Gradle assembleDebug build (10.14 MB). |

