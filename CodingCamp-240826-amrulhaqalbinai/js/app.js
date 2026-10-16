(() => {
  "use strict";

  const STORAGE = {
    tasks: "daylight.tasks.v1",
    links: "daylight.links.v1",
    name: "daylight.name.v1",
    theme: "daylight.theme.v1",
    focusMinutes: "daylight.focusMinutes.v1"
  };
  const DEFAULT_LINKS = [
    { id: "google", title: "Google", url: "https://google.com", icon: "G" },
    { id: "youtube", title: "YouTube", url: "https://youtube.com", icon: "▶" },
    { id: "github", title: "GitHub", url: "https://github.com", icon: "⌘" }
  ];
  const $ = (selector) => document.querySelector(selector);
  const safeRead = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn(`Could not read ${key} from Local Storage.`, error);
      return fallback;
    }
  };
  const safeWrite = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Could not save ${key} to Local Storage.`, error);
      showToast("Could not save changes in this browser.");
      return false;
    }
  };
  const makeId = () => (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  let tasks = safeRead(STORAGE.tasks, []);
  let links = safeRead(STORAGE.links, null);
  let customName = safeRead(STORAGE.name, "");
  let theme = safeRead(STORAGE.theme, "light");
  let focusMinutes = Number(safeRead(STORAGE.focusMinutes, 25));
  if (!Array.isArray(tasks)) tasks = [];
  if (!Array.isArray(links)) links = DEFAULT_LINKS.map((item) => ({ ...item }));
  if (!Number.isFinite(focusMinutes) || focusMinutes < 1 || focusMinutes > 120) focusMinutes = 25;

  let remainingSeconds = focusMinutes * 60;
  let timerInterval = null;
  let toastTimeout = null;
  const CIRCUMFERENCE = 2 * Math.PI * 96;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 11 ? "Good morning" : hour < 15 ? "Good afternoon" : hour < 19 ? "Good evening" : "Good night";
    $("#greeting").innerHTML = `${greeting}<span class="wave">✳</span>`;
    if (customName) {
      $("#nameLabel").textContent = `That's you, ${customName}`;
      $("#greeting").innerHTML = `${greeting}, ${escapeHTML(customName)}<span class="wave">✳</span>`;
    } else {
      $("#nameLabel").textContent = "Personalize your greeting";
    }
    $("#clock").innerHTML = `${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now)}<span>:${String(now.getSeconds()).padStart(2, "0")}</span>`;
    $("#dateLine").textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
    $("#clockDate").textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    $("#year").textContent = now.getFullYear();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function renderTasks() {
    const list = $("#taskList");
    list.replaceChildren();
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    $("#taskCount").textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
    $("#taskProgressPercent").textContent = `${percent}%`;
    $("#taskProgressBar").style.width = `${percent}%`;
    $("#taskProgressText").textContent = total ? `${completed} OF ${total} COMPLETED` : "YOUR PROGRESS";
    $("#emptyState").classList.toggle("hidden", total > 0);
    $("#clearCompleted").classList.toggle("hidden", completed === 0);

    tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.completed ? " completed" : ""}`;
      const check = document.createElement("button");
      check.type = "button";
      check.className = "task-check";
      check.setAttribute("aria-label", task.completed ? `Mark ${task.text} as not done` : `Mark ${task.text} as done`);
      check.setAttribute("aria-pressed", String(task.completed));
      check.textContent = task.completed ? "✓" : "";
      check.addEventListener("click", () => {
        task.completed = !task.completed;
        persistTasks();
        renderTasks();
      });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const actions = document.createElement("div");
      actions.className = "task-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "small-action";
      edit.textContent = "✎";
      edit.title = "Edit task";
      edit.setAttribute("aria-label", `Edit ${task.text}`);
      edit.addEventListener("click", () => editTask(task.id));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action";
      remove.textContent = "×";
      remove.title = "Delete task";
      remove.setAttribute("aria-label", `Delete ${task.text}`);
      remove.addEventListener("click", () => {
        tasks = tasks.filter((entry) => entry.id !== task.id);
        persistTasks();
        renderTasks();
        showToast("Task deleted.");
      });
      actions.append(edit, remove);
      item.append(check, text, actions);
      list.append(item);
    });
  }

  function persistTasks() {
    safeWrite(STORAGE.tasks, tasks);
  }

  function normalizeTask(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  function taskExists(value, exceptId = null) {
    const normalized = value.toLocaleLowerCase();
    return tasks.some((task) => task.id !== exceptId && task.text.toLocaleLowerCase() === normalized);
  }

  $("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#taskInput");
    const message = $("#taskMessage");
    const text = normalizeTask(input.value);
    message.textContent = "";
    if (!text) {
      message.textContent = "Enter a task before adding it.";
      input.focus();
      return;
    }
    if (taskExists(text)) {
      message.textContent = "That task is already on your list.";
      input.focus();
      return;
    }
    tasks.unshift({ id: makeId(), text, completed: false, createdAt: Date.now() });
    persistTasks();
    renderTasks();
    input.value = "";
    input.focus();
    showToast("Task added. One step at a time.");
  });

  function editTask(id) {
    const task = tasks.find((entry) => entry.id === id);
    if (!task) return;
    const updated = window.prompt("Edit your task:", task.text);
    if (updated === null) return;
    const text = normalizeTask(updated);
    if (!text) {
      showToast("A task cannot be empty.");
      return;
    }
    if (taskExists(text, id)) {
      showToast("A task with that name already exists.");
      return;
    }
    task.text = text;
    persistTasks();
    renderTasks();
    showToast("Task updated.");
  }

  $("#clearCompleted").addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    persistTasks();
    renderTasks();
    showToast("Completed tasks cleared.");
  });

  function renderLinks() {
    const container = $("#quickLinks");
    container.replaceChildren();
    links.forEach((link) => {
      const anchor = document.createElement("a");
      anchor.className = "quick-link";
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.title = `Open ${link.title} in a new tab`;

      const avatar = document.createElement("span");
      avatar.className = "link-avatar";
      avatar.textContent = link.icon || link.title.charAt(0).toUpperCase();
      const name = document.createElement("span");
      name.className = "link-name";
      name.textContent = link.title;
      anchor.append(avatar, name);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "link-delete";
      remove.textContent = "×";
      remove.title = `Remove ${link.title}`;
      remove.setAttribute("aria-label", `Remove ${link.title}`);
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        links = links.filter((entry) => entry.id !== link.id);
        safeWrite(STORAGE.links, links);
        renderLinks();
        showToast("Quick link removed.");
      });
      anchor.append(remove);
      container.append(anchor);
    });
  }

  $("#openLinkForm").addEventListener("click", () => {
    $("#linkForm").classList.toggle("hidden");
    $("#linkMessage").textContent = "";
    if (!$("#linkForm").classList.contains("hidden")) $("#linkTitle").focus();
  });
  $("#cancelLink").addEventListener("click", () => {
    $("#linkForm").reset();
    $("#linkForm").classList.add("hidden");
    $("#linkMessage").textContent = "";
  });
  $("#linkForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = $("#linkTitle").value.trim().replace(/\s+/g, " ");
    let url;
    try {
      url = new URL($("#linkUrl").value.trim());
    } catch {
      $("#linkMessage").textContent = "Enter a valid website URL.";
      return;
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      $("#linkMessage").textContent = "Only HTTP and HTTPS links are supported.";
      return;
    }
    if (links.some((link) => link.title.toLowerCase() === title.toLowerCase() || link.url.toLowerCase() === url.href.toLowerCase())) {
      $("#linkMessage").textContent = "That name or URL is already saved.";
      return;
    }
    links.push({ id: makeId(), title, url: url.href, icon: title.charAt(0).toUpperCase() });
    safeWrite(STORAGE.links, links);
    renderLinks();
    $("#linkForm").reset();
    $("#linkForm").classList.add("hidden");
    showToast("Quick link saved.");
  });

  function applyTheme() {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    $("#themeToggle").setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    $("#themeToggle").title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }
  $("#themeToggle").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    safeWrite(STORAGE.theme, theme);
    applyTheme();
  });

  $("#editName").addEventListener("click", () => {
    $("#customName").value = customName;
    $("#nameDialog").showModal();
    $("#customName").focus();
  });
  $("#cancelName").addEventListener("click", () => $("#nameDialog").close());
  $("#nameForm").addEventListener("submit", (event) => {
    event.preventDefault();
    customName = $("#customName").value.trim().replace(/\s+/g, " ").slice(0, 40);
    safeWrite(STORAGE.name, customName);
    $("#nameDialog").close();
    updateClock();
    showToast(customName ? `Nice to see you, ${customName}.` : "Personal greeting cleared.");
  });

  function renderTimer() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    $("#timerDisplay").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    const progress = 1 - remainingSeconds / (focusMinutes * 60);
    $("#timerRing").style.strokeDasharray = String(CIRCUMFERENCE);
    $("#timerRing").style.strokeDashoffset = String(CIRCUMFERENCE * progress);
  }

  function stopTimerInterval() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  function startTimer() {
    if (timerInterval !== null) return;
    if (remainingSeconds <= 0) remainingSeconds = focusMinutes * 60;
    $("#timerLabel").textContent = "YOU'RE IN THE ZONE";
    $("#timerSubtitle").textContent = "FOCUS SESSION IN PROGRESS";
    $("#startTimer").innerHTML = "<span>▶</span> Resume focus";
    $("#stopTimer").disabled = false;
    timerInterval = setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      renderTimer();
      if (remainingSeconds === 0) {
        stopTimerInterval();
        $("#timerLabel").textContent = "SESSION COMPLETE";
        $("#timerSubtitle").textContent = "WELL DONE — TAKE A BREATH";
        $("#startTimer").innerHTML = "<span>▶</span> Start again";
        $("#stopTimer").disabled = true;
        showToast("Focus session complete. Take a short break!");
        try { if ("Notification" in window && Notification.permission === "granted") new Notification("Daylight", { body: "Focus session complete. Well done!" }); } catch {}
      }
    }, 1000);
  }
  $("#startTimer").addEventListener("click", startTimer);
  $("#stopTimer").addEventListener("click", () => {
    stopTimerInterval();
    $("#timerLabel").textContent = "SESSION PAUSED";
    $("#timerSubtitle").textContent = "PICK IT UP WHEN READY";
    $("#startTimer").innerHTML = "<span>▶</span> Resume focus";
    $("#stopTimer").disabled = true;
  });
  $("#resetTimer").addEventListener("click", () => {
    stopTimerInterval();
    remainingSeconds = focusMinutes * 60;
    $("#timerLabel").textContent = "READY WHEN YOU ARE";
    $("#timerSubtitle").textContent = "FOCUS SESSION";
    $("#startTimer").innerHTML = "<span>▶</span> Start focus";
    $("#stopTimer").disabled = true;
    renderTimer();
  });

  applyTheme();
  updateClock();
  setInterval(updateClock, 1000);
  renderTasks();
  renderLinks();
  renderTimer();
})();
