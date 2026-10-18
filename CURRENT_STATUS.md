# Current Status — Hopi

_Last updated: 2026-10-19 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (pushed & tracked on `master`).
- **Release APK Built (v1.1.0):**
  - **Local APK Path:** `release/hopi.apk` (11.85 MB).
- **Features Included:**
  - **Three Companion Avatars (Mochi, Pip, Snowdrop):**
    - 🐰 **Mochi**: The classic plush cream bunny with gentle stitching and floppy ears.
    - 🐧 **Pip**: The realistic fluffy baby penguin with soft downy feathers.
    - 🐇 **Snowdrop**: The realistic fluffy white bunny with gentle lop ears.
    - Full animation state support across all 3 characters: `idle` (blinking), `walk` (hop/waddle), `wave`, `cheer` (jump), `sleep` (organic breathing loop), and `sad` (drooping/thirsty).
    - Native home screen floating companion overlay (`FloatingMochiService`) dynamically switches drawables and name immediately upon selection.
  - **Mature, Grounded Companion Tone:** Dignified adult wellness encouragement, grounding reflections, and realistic hydration prompts.
  - **Voice Reminder System (Long-Press to Record, Double-Tap to Finish):** Offline intent classification for Tasks vs Routines, conversational clarification loop via `TextToSpeech`.
  - **Dynamic Avatar Naming:** All phrases, service notifications, and UI status strings use dynamic avatar name formatting (`getCompanionName()` / `%s` / `{name}`).
  - **Organic, Non-Robotic Sleep Animation:** Peaceful still slumber for 2.8s–5.2s with soft breathing for ~0.7s at natural, randomized intervals.
  - **Hourly Midnight Sleep Reminders:** Proactive gentle rest reminders between 12:00 AM and 8:00 AM when screen is active.
- **Test & Type Health:**
  - 65 passing tests in Vitest (`npm.cmd test`).
  - Zero TypeScript errors (`npm.cmd run typecheck` & `npm.cmd run build`).
  - Strict line budgets respected on all files (views <100 lines, components <200 lines, services <300 lines).
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
1. Launch Hopi, open Settings (⚙️), and switch between Mochi, Pip, and Snowdrop to observe both in-app and floating overlay animations.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-19 | Added Pip (baby penguin) and Snowdrop (white lop bunny) companion avatars. Created dynamic frame definitions, generated 76 Android drawables, wired Settings selection, and added `ACTION_UPDATE_AVATAR` for instant overlay character switching. 65 unit tests passing. Built v1.1.0 APK. |
| 2026-10-19 | Fixed 3-second repeating sleep loop: Mochi now stays sleeping in a calm loop (frames 5 & 6) and only wakes up when moved or when morning arrives. Added pure domain hydration calculation and sad/sleepy states based on time without water. Built v1.0.5 APK (10.32 MB). 54 unit tests passing. |
