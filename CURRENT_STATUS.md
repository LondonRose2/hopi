# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **Project Repository:** Initialized Git repository at `c:\Users\Rachel\Documents\apps\hopi`.
- **Framework & Tooling:** React 18 + Vite + TypeScript 5.7 + Tailwind CSS 3.4 + Lucide React + Vitest.
- **Build & Type Health:** `npm.cmd run typecheck` clean (0 errors), `npm.cmd run build` clean (production bundle generated in `dist/`).
- **Security Infrastructure:** Day-1 pre-commit security hook installed (`.git/hooks/pre-commit`), audit clean (0 findings), `--ignore-scripts` verified, `.gitignore` and `.env.example` protecting secrets.
- **Living Context:** `AGENTS.md` (with Table of Contents / Fast File Map), `CURRENT_STATUS.md` (living handoff), and `GEMINI.md` active.
- **Skills Setup:** Updated global skills (`project-kickoff-architect` and `handoff`) so all future greenfield projects mandate both context files.

---

## 🔨 What we're working on
1. Receiving user specification for Hopi's core domains (what problem it solves, key user journeys, data requirements).
2. Scaffolding feature modules and domain logic once requirements are specified.

---

## 💡 Why it matters
- Clear day-1 architecture, live context files, and verified builds prevent token waste, search fatigue, and context amnesia across long development cycles.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Vite + React + TypeScript + Tailwind CSS** | Proven stack from Travel app: fast compilation, zero server hosting friction, clean token styling. |
| **Living Context Architecture (`CURRENT_STATUS.md` + `AGENTS.md`)** | Ensures all future AI sessions maintain full context, know file locations via Table of Contents, and respect architectural boundaries. |
| **Day-1 Security Pre-Commit Hook** | Runs immutable security scanner on every commit to prevent secret leaks, insecure crypto, and RLS lapses. |
| **Token-Protected File Budgets** | Hard limits on pages (<100 lines), components (<200 lines), and stores (<250 lines) to prevent monolithic file bloat. |

---

## ⚠️ Known issues / tech debt
- Ready to receive Hopi feature requirements and domain models.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Provide the domain details / feature vision for Hopi (what features/tools to build).
2. Create domain directory structures (`src/features/...`, `src/domain/...`, `src/components/ui/...`) and feature cards.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Scaffolded React + Vite + Tailwind + Lucide base. Clean build & typecheck verified. Updated global kickoff & handoff skills to require living context files across all projects. |
