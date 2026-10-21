# Current Status — Hopi

_Last updated: 2026-10-22 · Repo: Local (`c:\Users\Rachel\Documents\apps\hopi`)_

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS:**
> At the start of every new session, you **MUST read both this file (`CURRENT_STATUS.md`) and [`AGENTS.md`](file:///c:/Users/Rachel/Documents/apps/hopi/AGENTS.md)** before writing any code or proposing modifications.
> - `AGENTS.md` contains the architectural boundaries, token file budgets, and technical invariants.
> - `CURRENT_STATUS.md` contains the active decisions, current state, and immediate next steps.

---

## 📍 Where we are
- **GitHub Repository:** [`https://github.com/LondonRose2/hopi`](https://github.com/LondonRose2/hopi) (tracked on `master`).
- **Release APK Built (v1.1.6):**
  - **Local Wi-Fi Browser Link (Mobile Chrome):** [`http://192.168.0.103:8088/`](http://192.168.0.103:8088/) or direct download at [`http://192.168.0.103:8088/hopi.apk`](http://192.168.0.103:8088/hopi.apk)
  - **Local File Path:** `release/hopi.apk` (11.99 MB, built today).
- **Features Included:**
  - **Long-Press Voice Recording (Seamless Finger Release):**
    - Responsive 320ms long-press trigger on floating avatar with haptic feedback.
    - Letting finger go keeps recording smoothly without needing to hold down while speaking.
    - Removed microphone button from the menu options to keep the UI clean.
    - Quick tap while recording stops/cancels gracefully.
  - **Floating Quick Menu Overhaul (No Box, Transparent Spacing, Exactly 3 Options):**
    - Removed enclosing rectangular container box (`quick_menu_bg`); spacing between buttons is completely transparent.
    - Increased button size to generous rounded pills (elevation, warm linen stroke, 14dp padding, 8dp vertical gap).
    - Exactly 3 pill options:
      1. `✅ [Urgent Task Title]` (e.g. `✅ Put up laundry`): Dynamic variable displaying the most urgent pending task for today with a green checkmark. Tapping it completes the task, speaks a cheer, triggers a celebratory wave, and immediately updates to the next urgent task or "✨ All tasks done!".
      2. `💧 Log Water`: 1-tap water logging with instant cheer speech bubble and TTS celebration.
      3. `📝 Add Task`: Opens Hopi directly to the task creation sheet.
  - **Two-Way Urgent Task Synchronization:**
    - Completing the urgent task on the floating overlay stores the ID in `pending_completed_tasks`.
    - Returning to the Hopi app automatically consumes completed tasks, marks them checked, triggers confetti bursts, and persists to storage.
    - Editing/completing tasks in Hopi immediately syncs the updated queue to the floating overlay.
  - **Pip (Penguin) Active Poses & Fixed Sleep Past Midnight:**
    - Added curious head-tilt (`pip_curious`) and wing wiggle / groom (`pip_groom`) to idle animation cycles on both Android overlay and React app.
    - Fixed sleep frames for Pip: `pip_sleep_4` (curled down tucked pose) as still frame and `pip_sleep_3` as soft slumber breath, eliminating head-bobbing.
    - Fixed rest hours past midnight (11 PM – 8 AM) so Pip stays soundly asleep.
  - **Test & Type Health:**
    - 82 passing tests in Vitest (`npm.cmd test`).
    - Zero TypeScript errors (`npm.cmd run build`).
    - Strict file budgets respected across all files (views <= 100 lines, components <= 200/300 lines, services <= 300 lines).

---

## 💡 Why it matters
- Eliminates friction for quick voice reminders (fast long press, release to speak) while providing instant 1-tap completion for the most urgent daily task directly from any Android home screen or app.
- Pip feels alive, expressive, and restful with proper sleep postures and organic daytime idle animations.

---

## ✅ Decisions made (and why)
| Decision | Why |
|---|---|
| **Transparent Container for Floating Menu** | Replaced the heavy card background with floating individual pill buttons separated by 8dp transparent space for a modern, uncluttered look. |
| **Two-Way Urgent Task Queue Sync** | Maintains the queue in SharedPreferences (`urgent_tasks_queue` & `pending_completed_tasks`) so the floating button updates immediately when completed from overlay, and automatically updates main app state on resume. |
| **Curled Sleeping Pose (`pip_sleep_4`) for Pip** | `pip_sleep_5` and `6` in the sprite sheet were standing poses; `pip_sleep_4` (height 59, y=24) is the curled tucked sleeping frame. |
| **320ms Long-Press with Persistent Recording** | Allows effortless 1-handed voice access without thumb strain from prolonged holding. |

---

## ⚠️ Known issues / tech debt
- None active.

---

## ➡️ Next step (proposed — Rachel to confirm)
1. Download the new `v1.1.6` APK directly from your phone browser at [`http://192.168.0.103:8088/hopi.apk`](http://192.168.0.103:8088/hopi.apk).
2. Tap the floating companion to test the transparent 3-button menu and tap `✅ [Urgent Task]` to see it complete and advance to your next task.
3. Test long-pressing the avatar for ~320ms, release your finger, speak a reminder, and watch it automatically parse and save.
4. Switch avatar to Pip in Settings to view the new curious head-tilt, wing wiggles, and curled-down midnight sleep.
