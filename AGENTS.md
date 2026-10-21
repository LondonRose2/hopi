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
      habits/
        useHabits.ts                # Persistence, alarms & habit progress orchestrator (<150 lines)
        components/
          HabitsView.tsx            # Top orchestrator for Habits tab (<100 lines)
          HabitCard.tsx             # Active habit card with glowing energy tube & checkmark (<150 lines)
          AchievedHabitsSection.tsx # Trophy hall for completed habits (<100 lines)
          HabitEditModal.tsx        # Creation modal with 7/21/30/60/90 presets & number pad (<250 lines)
          HabitEnergyPill.tsx       # Sub-avatar micro habit energy tube (<50 lines)
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
          ReminderEditModal.tsx         # Native clock picker, task vs routine toggle & voice fill (<300 lines)
          EmojiGrid.tsx                 # Fast icon selector grid (<50 lines)
      settings/
        types.ts        # Companion preferences & sleep schedule contracts
        components/
          SettingsView.tsx            # Sleep schedule & companion preferences (<150 lines)
          HydrationHistorySection.tsx # 7-day hydration history list & target goal (<150 lines)
    domain/
      companion/
        phrases.ts      # 60+ diverse non-repeating phrases, habit encouragements & selector engine (<200 lines)
      habits/           # Pure habit domain calculations (types, streak grace, 7-day reset, energy colors)
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

## 3. Feature-to-File Quick Lookup Matrix
Before searching or exploring, consult this index to jump directly to the exact file:

| Feature / System | Primary Files | Key Functions & Responsibilities |
|---|---|---|
| **Floating Overlay & Dragging** | [`FloatingMochiService.java`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/java/com/hopi/app/FloatingMochiService.java) | `initOverlay()`, `setupTouchListener()`, WindowManager layout |
| **Floating Menu Layout & Styling** | [`floating_mochi_layout.xml`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/res/layout/floating_mochi_layout.xml), [`quick_menu_btn_bg.xml`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/res/drawable/quick_menu_btn_bg.xml) | 3 pill buttons (`btn_menu_urgent_task`, `btn_menu_water`, `btn_menu_task`) |
| **Long-Press & Voice Recording** | [`FloatingMochiService.java`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/java/com/hopi/app/FloatingMochiService.java) | `startVoiceListening()`, 320ms `longPressRunnable`, finger-release keep-listening |
| **Voice Intent Parsing (NLP)** | [`VoiceParser.java`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/java/com/hopi/app/VoiceParser.java), [`voiceParser.ts`](file:///c:/Users/Rachel/Documents/apps/hopi/src/domain/reminders/voiceParser.ts) | `parse()`, `isWaterIntakePhrase()`, time/date/recurrence extraction |
| **Urgent Task Two-Way Sync** | [`FloatingMochiPlugin.java`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/java/com/hopi/app/FloatingMochiPlugin.java), [`nativeOverlay.ts`](file:///c:/Users/Rachel/Documents/apps/hopi/src/services/nativeOverlay.ts), [`useReminders.ts`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/reminders/useReminders.ts) | `syncUrgentTasks()`, `getPendingCompletedTasks()`, 1-tap complete & celebrate |
| **Companion Sprites & Animations** | [`avatarFrames.ts`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/companion/avatarFrames.ts), [`MochiAvatar.tsx`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/companion/MochiAvatar.tsx) | `MOCHI_FRAMES`, `PIP_FRAMES`, `SNOWDROP_FRAMES`, idle sequencer (blinks, curious, groom) |
| **Sleep Schedule & Rest Hours** | [`sleepSchedule.ts`](file:///c:/Users/Rachel/Documents/apps/hopi/src/domain/reminders/sleepSchedule.ts), [`FloatingMochiService.java`](file:///c:/Users/Rachel/Documents/apps/hopi/android/app/src/main/java/com/hopi/app/FloatingMochiService.java) | `isQuietHours()`, `isRestHours()` (11 PM - 8 AM), curled sleep posture |
| **Hydration Pill & Tracking** | [`HydrationWaterPill.tsx`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/companion/HydrationWaterPill.tsx), [`useCompanionMood.ts`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/companion/useCompanionMood.ts) | `recordWater()`, `dailyWaterGoal`, thirst hours, midnight rollover |
| **Today & Upcoming Views** | [`TodayRemindersView.tsx`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/reminders/components/TodayRemindersView.tsx), [`UpcomingTasksView.tsx`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/reminders/components/UpcomingTasksView.tsx) | Checklist items, routine vs task sections, confetti cheer trigger |
| **Settings & Companion Selection** | [`SettingsView.tsx`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/settings/components/SettingsView.tsx), [`HydrationHistorySection.tsx`](file:///c:/Users/Rachel/Documents/apps/hopi/src/features/settings/components/HydrationHistorySection.tsx) | Avatar switch (Mochi, Pip, Snowdrop), target goal, 7-day history |


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
