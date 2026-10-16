# Daylight — To-Do List Life Dashboard

A responsive, client-side life dashboard built with **HTML, CSS, and Vanilla JavaScript** for the RevoU Coding Camp mini project.

## Features

### Required MVP
- Live local time, date, and time-based greeting
- Pomodoro focus timer (25 minutes by default) with start, pause/stop, and reset controls
- To-do list: add, edit, complete, delete, progress indicator, and clear completed tasks
- Customizable quick links that open in a new tab
- Tasks and quick links persist in browser Local Storage

### Selected challenges (3)
1. **Light / Dark mode** — persisted between visits
2. **Custom name in greeting** — edit the greeting name
3. **Prevent duplicate tasks** — duplicate task names are checked case-insensitively

## Project structure

```text
CodingCamp-240826-amrulhaqalbinai/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .kiro/
│   └── steering/
│       ├── product.md
│       ├── tech.md
│       └── structure.md
└── README.md
```

The project intentionally contains **one CSS file** in `css/` and **one JavaScript file** in `js/`. No framework or backend is used.

## Run locally

1. Extract the project ZIP.
2. Open `index.html` in a modern browser.
3. Add tasks or links; data is saved locally in that browser.

No package installation or build step is required. A local static server (such as VS Code Live Server) is optional.

## Publish with GitHub Pages

1. Create a GitHub repository named `CodingCamp-240826-amrulhaqalbinai` (the batch started on 24 August 2026).
2. Copy the project contents into the repository. Keep the `.kiro/` directory; if using GitHub Desktop, make sure hidden files are included.
3. Commit and push the files to the repository's `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
6. Wait for GitHub Pages to finish publishing. Verify the published URL and test the dashboard on desktop and mobile.

## Submission checklist

- [ ] AWS Builder ID from Kiro
- [ ] GitHub repository URL
- [ ] Published GitHub Pages URL
- [ ] `.kiro/` directory committed to GitHub
- [ ] Test tasks, edit/delete, Local Storage persistence, timer, theme toggle, name editing, and quick links

> The source code is prepared locally. You still need to push it to your own GitHub account, publish it through GitHub Pages, and submit the actual Builder ID and URLs through the RevoU form.
