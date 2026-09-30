(() => {
  "use strict";

  const SEEN_UPDATE_KEY = "neonChaosSeenUpdate";
  const updates = [
    {
      id: "gameplay-update-2026-09",
      date: "30 September 2026",
      title: "Update Log and Leaderboard Update",
      changes: [
        "Added a global leaderboard with player names and migration of existing best scores.",
        "Added this update log and its new-update badge."
      ]
    }
  ];

  const button = document.getElementById("update-log-btn");
  const badge = document.getElementById("update-log-badge");
  const overlay = document.getElementById("update-log-overlay");
  const closeButton = document.getElementById("update-log-close-btn");
  const list = document.getElementById("update-log-list");
  const latestUpdate = updates[0];

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // The update log still works when browser storage is unavailable.
    }
  }

  function renderUpdates() {
    if (!list) return;

    list.replaceChildren();
    updates.forEach((update) => {
      const entry = document.createElement("article");
      entry.className = "update-log-entry";

      const date = document.createElement("p");
      date.className = "update-log-date";
      date.textContent = update.date;

      const title = document.createElement("h4");
      title.textContent = update.title;

      const changes = document.createElement("ul");
      update.changes.forEach((change) => {
        const item = document.createElement("li");
        item.textContent = change;
        changes.appendChild(item);
      });

      entry.append(date, title, changes);
      list.appendChild(entry);
    });
  }

  function closeUpdateLog() {
    overlay?.classList.remove("show");
    overlay?.setAttribute("aria-hidden", "true");
    button?.focus();
  }

  function openUpdateLog() {
    if (!overlay) return;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    if (badge) badge.hidden = true;
    safeStorageSet(SEEN_UPDATE_KEY, latestUpdate.id);
    closeButton?.focus();
  }

  function initUpdateLog() {
    if (!button || !overlay || !latestUpdate) return;

    renderUpdates();
    const isUnread = safeStorageGet(SEEN_UPDATE_KEY) !== latestUpdate.id;
    if (badge) badge.hidden = !isUnread;

    button.addEventListener("click", openUpdateLog);
    closeButton?.addEventListener("click", closeUpdateLog);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeUpdateLog();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("show")) {
        closeUpdateLog();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUpdateLog, { once: true });
  } else {
    initUpdateLog();
  }
})();