# Code organization and conventions

- `index.html`: page structure, accessible labels, and links to local assets.
- `css/style.css`: all visual styles and responsive breakpoints.
- `js/app.js`: clock, greeting, task CRUD, Local Storage, quick links, theme, and timer.
- Keep selectors and function names descriptive.
- Prefer DOM APIs and `textContent` for user-supplied text.
- Validate user input and show short, understandable feedback.
- Store versioned Local Storage keys under the `daylight.*.v1` namespace.
- Keep `.kiro/steering/` committed to the repository.
