# Project Guidelines & Agent Instructions — Hopi

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`AGENTS.md`) and [`CURRENT_STATUS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/CURRENT_STATUS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 1. Development Server & Environment
- When running commands on Windows in PowerShell, use `npm.cmd` instead of `npm`.
- All `npm.cmd install` commands must include `--ignore-scripts`.
- Always verify dependencies before installation using `node ~/.gemini/config/scripts/verify-deps.js --package <name>`.
- Development servers should bind to `--host 0.0.0.0` to enable mobile and multi-device LAN testing.

---

## 2. Table of Contents & Fast File Map
To minimize exploration searches and save tokens, use this direct file map:

```
hopi/
  AGENTS.md             # Project guidelines, file budgets, architecture & Table of Contents
  CURRENT_STATUS.md     # Living handoff: status, active tasks, decisions & next steps
  GEMINI.md             # Quick-reference orientation pointers for Gemini/Antigravity
  .gitignore            # Git exclusion rules (build outputs, env files, node_modules)
  .env.example          # Safe environment template (no real secrets)
  package.json          # Vite + React + TypeScript + Tailwind + Vitest dependencies
  vite.config.ts        # Vite configuration with 0.0.0.0 host binding
  tsconfig.json         # Strict TypeScript compiler options
  tailwind.config.js    # Mobile-first palette tokens and responsive utilities
  postcss.config.js     # PostCSS Tailwind and Autoprefixer plugins
  index.html            # Mobile-first shell, viewport-fit=cover & web app tags
  src/
    main.tsx            # React root mount (<20 lines)
    app/
      App.tsx           # 3/4-height sheet shell & companion header (<100 lines)
    styles/
      index.css         # Tailwind base and safe-area utilities
      tokens.css        # Oatmeal/rice linen palette, tokens & safe padding
    features/
      companion/
        MochiAvatar.tsx             # Sprite animator (idle, wave, sleep, cheer, sad) (<200 lines)
        avatarFrames.ts             # Dynamic sprite sheets & frame configs (Mochi, Pip, Snowdrop) (<150 lines)
        OverlayPermissionPrompt.tsx # Gentle permission onboarding card (<100 lines)
        HydrationWaterPill.tsx      # Daily water counter, goal tracker & quick-log (<100 lines)
        useOverlayCompanion.ts      # Permission state & auto-sync hook (<100 lines)
        useCompanionMood.ts         # Companion mood, hydration & sleep state orchestrator (<200 lines)
      reminders/
        types.ts            # Reminder domain contracts & sample routines
        useReminders.ts     # Persistence, reminder scheduling & water intake (<200 lines)
        components/
          ConfettiCelebration.tsx # Front-layer canvas burst (z-99999) (<200 lines)
          ReminderItem.tsx        # Pill card row with 1-tap check-off (<200 lines)
          TodayRemindersView.tsx        # Tasks (top) & Routines (bottom) prioritized by due time (<100 lines)
          TodayEmptyState.tsx           # Peaceful all-done placeholder (<50 lines)
          CompletedRemindersSection.tsx # Collapsible completed items list (<50 lines)
          UpcomingTasksView.tsx         # Date-sectioned forward agenda (<100 lines)
          ReminderEditModal.tsx         # Native clock picker, task vs routine toggle & emoji grid (<200 lines)
      settings/
        types.ts        # Companion preferences & sleep schedule contracts
        components/
          SettingsView.tsx            # Sleep schedule & companion preferences (<150 lines)
          HydrationHistorySection.tsx # 7-day hydration history list & target goal (<150 lines)
    domain/
      companion/
        phrases.ts      # 50+ diverse non-repeating phrases & selector engine (<150 lines)
      reminders/        # Pure domain calculations (schemas, grouping, sleep schedule, hydration, waterTracker, recurrence)
    services/
      nativeOverlay.ts  # Bridge to Android native floating overlay & alarms (<100 lines)
  android/
    app/src/main/java/com/hopi/app/
      CompanionPhrases.java      # Android native phrase catalog & history buffer
      VoiceParser.java           # Native voice parser & intent extractor
      FloatingMochiService.java  # Android WindowManager overlay service (drags on home screen)
      FloatingMochiPlugin.java   # Capacitor bridge for overlay & reminder alarms
      ReminderAlarmReceiver.java # Android Alarm Receiver for push notifications & speech bubbles
  tests/
    domain.test.ts      # Unit tests for domain calculations & invariants
```
*Note: As new features and directories are added, agents are required to register them here.*

---

## 3. Core Architectural & Security Invariants

### 1. Token Protection & Strict File Budgets
- **Pages / Views**: Maximum **100 lines**. Pages are top-level orchestrators; they wire hooks to subcomponents and must never contain dense inline UI layouts or multi-step logic.
- **Components**: Soft ceiling **200 lines**, hard ceiling **300 lines**. Extract subviews into local subfolders as soon as a component exceeds 200 lines.
- **Contexts & Stores**: Maximum **250 lines**. Split massive state files into domain-focused sub-contexts or custom hooks.

### 2. Single Source of Truth for Domain Logic
- Never write core domain calculations or business logic directly inside JSX/view components.
- Keep calculations in canonical pure functions or custom hooks with dedicated unit tests.

### 3. Day-1 Security & Package Policy
- The pre-commit security hook in `.git/hooks/pre-commit` is immutable.
- All external inputs at network/API boundaries must be validated with schema validation (e.g. Zod).
- Use `crypto.randomUUID()` or `crypto.getRandomValues()` for unique IDs and tokens; never use `Math.random()`.
