# Current Status — Hopi

_Last updated: 2026-10-22 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (tracked on `master`).
- **Release APK Built (v1.2.0):**
  - **Local Wi-Fi Browser Link (Mobile Chrome):** [`http://192.168.0.103:8088/`](http://192.168.0.103:8088/) or direct download at [`http://192.168.0.103:8088/hopi.apk`](http://192.168.0.103:8088/hopi.apk)
  - **Local File Path:** `release/hopi.apk` (12.10 MB, built today).
- **Features Included:**
  - **Habit Former & 3-Way Top Navigation (`Today` | `Habits` | `Upcoming`):**
    - Dedicated **Habits** tab for tracking and cultivating long-term daily routines.
    - **Default 60 Days:** Default journey length of 60 days to form lasting neurological habits.
    - **Target Days Input:** Quick-select preset pills (`7d`, `21d`, `30d`, `60d ✨`, `90d`) plus direct number keyboard input (`inputMode="numeric"`) for custom day counts (1–365).
    - **Flexible Cadence:** 2-way toggle between **Daily** and **Weekdays** (Mon–Fri).
    - **Reminder Alarm:** Native clock picker for daily reminder alarms via `AlarmManager`.
  - **Grace-Filled Inactivity Rule (Miss a Day vs Miss a Week):**
    - Missing 1 to 6 days incurs **no penalty**; accumulated progress is retained.
    - Missing 7 or more consecutive days (1 full week) resets the counter to 0 for a gentle, shame-free fresh start.
  - **Dynamic Visual Energy Tube & Color Progression:**
    - Capsule energy gauge showing progress percentage and color-shifting momentum:
      - 0%–24%: Soft Warm Terracotta (`#E07A5F`) — Seedling stage
      - 25%–49%: Golden Honey (`#F59E0B`) — Momentum stage
      - 50%–74%: Fresh Sage / Emerald (`#10B981`) — Growth stage
      - 75%–99%: Vibrant Cyan / Sapphire (`#06B6D4`) — Bloom stage
      - 100%: Radiant Gold Gradient & Trophy (`🏆`) — Goal Reached
  - **Sub-Avatar Micro Habit Indicator:**
    - Small pill beneath companion avatar (`🎯 3 of 60 days`) with glowing mini energy tube.
    - Can be toggled on/off in Settings.
  - **Hall of Achieved Habits:**
    - Collapsible celebration archive for completed habits with golden trophy badges (`🏆`).
  - **Companion Habit Affirmations & Adaptive Rotation:**
    - Included habit encouragement pool in phrase rotation when at least 1 habit is active; excluded when 0 habits exist.
    - When user misses > 2 days, re-engagement encouragements are prioritized (every 5th rotation).
  - **Settings Toggles (Hide Options):**
    - Toggle for "Habit Tracker on Avatar" (show/hide mini energy tube under companion).
    - Toggle for "Overdue Alert Dot" (show/hide terracotta dot on avatar).
  - **Microphone Voice Integration (Web + Android Overlay):**
    - Speech recognition for habits ("Add a new habit morning reading at 8am for 60 days", "Start a weekday habit yoga for 30 days at 7:30 am") in both TypeScript and Android Java (`VoiceParser.java`).
  - **Mochi & Snowdrop Slumber Posture Fix (No Bobbing/Looking Up):**
    - Resolved issue where Mochi and Snowdrop would look down into sleep for a few seconds and then look back up repeatedly.
    - Updated `FloatingMochiService.java` and `avatarFrames.ts` with authentic flat, grounded resting frames (`mochi_sleep_5`/`mochi_sleep_6` for Mochi; `snowdrop_sleep_4`/`snowdrop_sleep_3` for Snowdrop) and gentle 750ms breathing shifts.
  - **Test & Type Health:**
    - **102 passing tests** in Vitest (`npm.cmd test`).
    - **Zero TypeScript errors** (`npm.cmd run typecheck`).
    - Strict file budgets respected across all files (views <= 100 lines, components <= 200/300 lines, services <= 300 lines).

---

## 💡 Why it matters
- Fosters consistent, shame-free personal growth by balancing gentle grace (missing a day doesn't erase progress) with clear accountability (missing a full week provides a clean restart).
- Gives users full aesthetic control to hide or display the sub-avatar habit tracker and overdue alert dot.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **7-Day Inactivity Threshold** | Missed days (1–6) don't reset streaks to eliminate anxiety, but a full week of absence resets count to 0 for a clean reset. |
| **5-Stage Energy Tube** | Visual feedback shifts from earthy terracotta to radiant gold + trophy at 100% to maximize dopamine and consistency. |
| **Adaptive Phrase Rotation** | Encourages habit momentum only when active habits exist, and gently surfaces reassuring re-engagement phrases every 5 rotations when >2 days are missed. |
| **Modular Barrel Architecture** | Used `src/features/habits/index.ts` and `src/features/companion/index.ts` to keep `App.tsx` strictly under its 100-line ceiling (99 lines). |

---

## ⚠️ Known issues / tech debt
- None active.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Download `hopi.apk` (v1.2.0) from [`http://192.168.0.103:8088/hopi.apk`](http://192.168.0.103:8088/hopi.apk).
2. Tap the new **Habits** tab in Hopi to view the Habit Former interface and test forming a habit (e.g. 60 days, 30 days, or custom days).
3. Tap the 1-tap checkmark to check off today's habit and observe the energy tube fill up and the speech bubble cheer.
4. Test voice reminder: speak "Add a new habit daily reading at 8pm for 60 days".
5. In Settings, test toggling "Habit Tracker on Avatar" and "Overdue Alert Dot" to verify they hide and show smoothly.
