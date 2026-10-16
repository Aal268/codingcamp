# Requirements — To-Do List Life Dashboard

> **Status:** Draft — Awaiting Approval  
> **Version:** 1.0  
> **Date:** 2026-10-15

---

## 1. Project Overview

**To-Do List Life Dashboard** is a lightweight, client-side-only web application that helps users organize their daily activities. It runs entirely in the browser (no backend required) and can be opened directly via `index.html` or hosted on GitHub Pages.

---

## 2. Technical Constraints

| ID   | Constraint |
|------|-----------|
| TC-1 | Technology stack: **HTML**, **Vanilla CSS**, **Vanilla JavaScript** only. No frameworks (React, Vue, Angular, etc.). |
| TC-2 | All persistent data stored exclusively in the **browser's Local Storage API**. No server, no cookies, no IndexedDB. |
| TC-3 | Must run correctly on the latest versions of **Chrome, Firefox, Edge, and Safari** as a standalone file (`index.html`), deployable to **GitHub Pages**. |

---

## 3. File & Folder Structure

```
/
├── index.html
├── css/
│   └── style.css          # Single CSS file — no others allowed
├── js/
│   └── script.js          # Single JS file — no others allowed
├── README.md
└── .kiro/                 # Must remain intact — do not delete
```

**Code Quality Rules:**
- JavaScript sections delimited by comments: `// === GREETING ===`, `// === TIMER ===`, `// === TO-DO ===`, `// === QUICK LINKS ===`, `// === THEME ===`, `// === SETTINGS ===`, `// === HELPER: LOCAL STORAGE ===`
- All Local Storage reads wrapped in `try/catch` with safe fallback to defaults on empty or corrupt data.
- User input rendered exclusively via `element.textContent` (never `innerHTML`) to prevent XSS.
- Clean, readable code with comments where logic is non-obvious.

---

## 4. Non-Functional Requirements

| ID    | Requirement |
|-------|------------|
| NFR-1 | **Simplicity:** Clean, minimalist UI. No complex setup needed. No test files or testing frameworks. |
| NFR-2 | **Performance:** Fast initial load (no heavy libraries), responsive interactions with zero perceptible lag when adding/editing data. |
| NFR-3 | **Visual Design:** Clear visual hierarchy, readable typography, user-friendly layout. Aesthetically premium — not a plain MVP. |

---

## 5. Features & User Stories

### 5.1 Greeting (F-01) — *Required*

**Description:** The dashboard displays a personalized, time-aware greeting to welcome the user.

#### User Stories

| ID       | Story |
|----------|-------|
| US-01-1  | As a user, I want to see a greeting (Good Morning / Good Afternoon / Good Evening) based on the current time, so the dashboard feels context-aware. |
| US-01-2  | As a user, I want my name displayed in the greeting so the experience feels personal. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-01-1 | The greeting reads "Good Morning, [Name]!" between 05:00–11:59, "Good Afternoon, [Name]!" between 12:00–17:59, and "Good Evening, [Name]!" between 18:00–04:59. |
| AC-01-2 | The greeting updates automatically if left open across a time boundary (e.g., noon passes). |
| AC-01-3 | If no custom name is set, the greeting defaults to a placeholder (e.g., "Good Morning, Friend!"). |
| AC-01-4 | The current date (e.g., "Thursday, 15 October 2026") is displayed alongside the greeting. |
| AC-01-5 | The live clock (HH:MM:SS) is visible on the dashboard and updates every second. |

---

### 5.2 Focus Timer / Pomodoro (F-02) — *Required*

**Description:** A countdown timer to help users work in focused sessions using the Pomodoro technique.

#### User Stories

| ID       | Story |
|----------|-------|
| US-02-1  | As a user, I want to start a 25-minute focus countdown timer so I can work in concentrated blocks. |
| US-02-2  | As a user, I want to pause and resume the timer so I can handle unexpected interruptions. |
| US-02-3  | As a user, I want to reset the timer to its starting value so I can restart a session. |
| US-02-4  | As a user, I want to hear or see a notification when the timer reaches zero so I know my session is complete. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-02-1 | Timer displays time in **MM:SS** format. |
| AC-02-2 | Default duration is **25 minutes**. |
| AC-02-3 | Start/Pause button toggles correctly; timer continues from where it paused. |
| AC-02-4 | Reset button returns timer to the configured duration and stops the countdown. |
| AC-02-5 | When timer reaches 00:00, it stops automatically and provides a visual cue (e.g., color change or on-screen message). |
| AC-02-6 | Timer state (running/paused) is NOT required to persist across page reloads (pure in-memory is acceptable). |

---

### 5.3 To-Do List (F-03) — *Required*

**Description:** A task list allowing users to add, complete, and delete tasks.

#### User Stories

| ID       | Story |
|----------|-------|
| US-03-1  | As a user, I want to add a new task by typing in an input field and pressing Enter or clicking "Add", so I can quickly log what I need to do. |
| US-03-2  | As a user, I want to mark a task as complete so I can track my progress. |
| US-03-3  | As a user, I want to delete a task so I can remove items I no longer need. |
| US-03-4  | As a user, I want my tasks to persist after I close and reopen the browser so I don't lose my list. |
| US-03-5  | As a user, I want to see how many tasks are pending so I can gauge my workload at a glance. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-03-1 | Pressing **Enter** in the input field or clicking the **Add** button creates a new task. |
| AC-03-2 | Empty or whitespace-only input is rejected; no blank tasks are created. |
| AC-03-3 | Clicking a task's checkbox (or the task itself) toggles its **completed** state (visual strikethrough or muted style). |
| AC-03-4 | A **Delete** button/icon on each task removes it from the list. |
| AC-03-5 | All tasks (text + completed state) are **saved to Local Storage** and restored on page load. |
| AC-03-6 | A counter displays the number of **incomplete tasks** (e.g., "3 tasks remaining"). |
| AC-03-7 | Input is rendered via `textContent` — HTML injection must have no effect. |

---

### 5.4 Quick Links (F-04) — *Required*

**Description:** A customizable panel of bookmarks to frequently visited websites.

#### User Stories

| ID       | Story |
|----------|-------|
| US-04-1  | As a user, I want to add a quick link (name + URL) so I can reach my favourite websites from the dashboard. |
| US-04-2  | As a user, I want to open a quick link in a new browser tab so my dashboard remains open. |
| US-04-3  | As a user, I want to delete a quick link I no longer need. |
| US-04-4  | As a user, I want my quick links to persist after closing the browser so I don't have to re-add them. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-04-1 | User can input a **label** and a **URL** to add a link. |
| AC-04-2 | Clicking a link opens the URL in a **new tab** (`target="_blank"`, `rel="noopener noreferrer"`). |
| AC-04-3 | Each link has a **Delete** button to remove it from the list. |
| AC-04-4 | Links are stored in **Local Storage** and restored on page load. |
| AC-04-5 | Empty label or URL is rejected; no blank links are created. |
| AC-04-6 | URLs without a scheme (e.g., `example.com`) are automatically prefixed with `https://`. |
| AC-04-7 | Link labels are rendered via `textContent` to prevent XSS. |

---

### 5.5 Light / Dark Mode (F-05) — *Challenge Feature*

**Description:** Users can switch between a light theme and a dark theme, with their preference saved.

#### User Stories

| ID       | Story |
|----------|-------|
| US-05-1  | As a user, I want to toggle between light and dark mode so I can choose the visual style that suits my environment. |
| US-05-2  | As a user, I want the app to remember my theme preference so I don't have to re-select it every visit. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-05-1 | A toggle button/icon switches between light and dark themes instantly (no page reload). |
| AC-05-2 | Theme preference is saved to **Local Storage** and applied on the next page load before any visual flash. |
| AC-05-3 | Both themes provide sufficient contrast and readable typography. |
| AC-05-4 | The toggle icon or label clearly reflects the **current active theme**. |

---

### 5.6 Custom Name in Greeting (F-06) — *Challenge Feature*

**Description:** Users can personalise the greeting by entering their name.

#### User Stories

| ID       | Story |
|----------|-------|
| US-06-1  | As a user, I want to set my name so the greeting addresses me personally. |
| US-06-2  | As a user, I want my name to persist so I only need to set it once. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-06-1 | An input field (or modal/inline edit) allows the user to enter their name. |
| AC-06-2 | The name is saved to **Local Storage** and loaded immediately on the next visit. |
| AC-06-3 | The greeting is updated in real-time (or on save/confirm) when a name is entered. |
| AC-06-4 | An empty name input reverts to the default placeholder (e.g., "Friend"). |
| AC-06-5 | Name is rendered via `textContent` — no HTML injection possible. |

---

### 5.7 Custom Pomodoro Duration (F-07) — *Challenge Feature*

**Description:** Users can change the default Pomodoro timer duration to suit their workflow.

#### User Stories

| ID       | Story |
|----------|-------|
| US-07-1  | As a user, I want to set a custom timer duration (in minutes) so the Pomodoro fits my personal focus style. |
| US-07-2  | As a user, I want my custom duration to persist across sessions so I don't need to set it each time. |

#### Acceptance Criteria

| ID      | Criterion |
|---------|----------|
| AC-07-1 | A settings input (number field) allows the user to enter a duration in **whole minutes**. |
| AC-07-2 | Valid range is **1–120 minutes**; values outside this range are rejected with a user-facing message. |
| AC-07-3 | On save, the timer resets to the new duration immediately. |
| AC-07-4 | The custom duration is saved to **Local Storage** and loaded on the next page visit. |
| AC-07-5 | While the timer is actively running, changing the duration does not interrupt the current session (change takes effect on next Reset/Start). |

---

## 6. Feature Summary Table

| ID    | Feature                  | Category  | Priority |
|-------|--------------------------|-----------|----------|
| F-01  | Greeting + Live Clock    | Required  | High     |
| F-02  | Focus Timer (Pomodoro)   | Required  | High     |
| F-03  | To-Do List               | Required  | High     |
| F-04  | Quick Links              | Required  | High     |
| F-05  | Light / Dark Mode        | Challenge | Medium   |
| F-06  | Custom Name in Greeting  | Challenge | Medium   |
| F-07  | Custom Pomodoro Duration | Challenge | Medium   |

---

## 7. Out of Scope

- User authentication or accounts
- Cloud sync or any backend/API
- Push notifications or service workers
- Mobile native app wrapper
- Multiple theme options beyond light/dark
- Drag-and-drop task reordering (may be added later)
- Unit tests, integration tests, or any testing framework

---

*End of requirements.md — v1.0*
