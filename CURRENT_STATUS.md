# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **Phase 1 Feature Complete & APK Generated:**
  - Production Android APK compiled successfully: [`c:\Users\Rachel\Documents\apps\hopi\release\hopi-debug.apk`](file:///c:/Users/Rachel/Documents/apps/hopi/release/hopi-debug.apk) (5.12 MB).
- **Test & Type Health:**
  - 38/38 unit tests passing in Vitest (`tests/domain.test.ts`).
  - Zero TypeScript errors (`npm.cmd run typecheck`).
  - Strict line budgets respected on all files (views <100 lines, components <200 lines).
- **Git Status:** Committed locally with immutable pre-commit security gate passed. (Not pushed to remote).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) fully up-to-date.

---

## 🔨 What we're working on
1. Mobile installation and testing of `hopi-debug.apk` on Android device.
2. Collecting real-device feedback on Mochi's sprite animations, reminder editing, and confetti celebrations.

---

## 💡 Why it matters
- A gentle, decluttered companion with Mochi provides comforting, non-stressful wellness and spiritual encouragement.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
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
1. Complete domain/QA test suite and sync with Capacitor Android build.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. Updated global kickoff & handoff skills to require living context files across all projects. |
| 2026-10-18 | Design Specialist built full UI component suite: oatmeal linen tokens, Mochi sprite animator (idle, wave, sleep, cheer), z-99999 front canvas confetti celebration, decluttered Today view (<100 lines), date-sectioned Upcoming view (<100 lines), Routine edit modal (<200 lines), Settings view (<100 lines), and 3/4-height sheet shell in App.tsx (<100 lines). |
