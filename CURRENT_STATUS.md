# Current Status — Hopi

_Last updated: 2026-10-18 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **Project Repository:** Initialized Git repository at `c:\Users\Rachel\Documents\apps\hopi`.
- **Security Infrastructure:** Day-1 security pre-commit hook installed (`.git/hooks/pre-commit`), `.gitignore`, and `.env.example` in place.
- **Skills Setup:** Updated global skills (`project-kickoff-architect` and `handoff`) to enforce `CURRENT_STATUS.md` and `AGENTS.md` (Table of Contents) across all new projects.
- **Project Phase:** Kickoff & Specification stage. Ready to clarify project requirements, app type, and tech stack.

---

## 🔨 What we're working on
1. Clarifying project purpose, target audience, core feature pillars, and tech stack preference for Hopi.
2. Scaffolding project code structure, dependencies, and domain entrypoints based on user choice.

---

## 💡 Why it matters
- Clear day-1 architecture and living context prevent token waste, search fatigue, and context amnesia across long development cycles.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Living Context Architecture (`CURRENT_STATUS.md` + `AGENTS.md`)** | Ensures all future AI sessions maintain full context, know file locations via Table of Contents, and respect architectural boundaries. |
| **Day-1 Security Pre-Commit Hook** | Runs immutable security scanner on every commit to prevent secret leaks, insecure crypto, and RLS lapses. |

---

## ⚠️ Known issues / tech debt
- Pending project specifications from user (app concept, features, tech stack).

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Confirm Hopi application concept, core features, and preferred framework (e.g., React + Vite + Tailwind, Next.js, or React Native / Expo).
2. Scaffold dependencies and domain directory tree.

---

## 🗒️ History & Learnings
| Date | What happened & What did we learn |
|---|---|
| 2026-10-18 | Initialized git repository. Installed pre-commit security gate. Created `AGENTS.md`, `CURRENT_STATUS.md`, `GEMINI.md`, and updated global kickoff & handoff skills. |
