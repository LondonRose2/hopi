# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **Project Repository:** Git initialized at `c:\Users\Rachel\Documents\apps\hopi` (local commits, not pushed to remote).
- **Framework & Foundation:** React 18 + Vite + TypeScript + Tailwind CSS + Lucide React.
- **Android APK Pipeline Ready:** Capacitor and Gradle toolchain verified (ready to produce release APK once app is built).
- **Context System:** [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md) (with Table of Contents) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md) active.

---

## 🔨 What we're working on
1. Implementing Phase 1 based on the approved [Hopi Phase 1 Specification](file:///C:/Users/Rachel/.gemini/antigravity/brain/cc76b2cc-449b-4a63-b681-672d35945795/hopi-phase-1-spec.md).
2. Dispatching design and domain/QA agents.

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
1. Dispatch `designer-agent` to implement the calming aesthetic tokens, Mochi sprite animator, 3/4-height sheet shell, and front-layer confetti.
2. Dispatch `domain-qa-agent` to build the pure domain logic (sleep scheduler, date grouping, edit schemas) with full test coverage.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. Updated global kickoff & handoff skills to require living context files across all projects. |
