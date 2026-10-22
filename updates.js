(() => {
  "use strict";

  const SEEN_UPDATE_KEY = "neonChaosSeenUpdate";
  const updates = [
    {
      id: "leaderboard-layout-loading-update-2026-10-23",
      date: "23 October 2026",
      title: "Leaderboard Layout and Loading Update",
      changes: [
        "Expanded the leaderboard into a landscape layout, with monthly and all-time rankings side by side on larger screens.",
        "Improved leaderboard spacing and title styling, with responsive text and score rows for mobile screens.",
        "Added an animated loading indicator while scores are being fetched, plus retry controls and error details when loading fails.",
      ]
    },
    {
      id: "gems-revival-update-2026-10-17",
      date: "17 October 2026",
      title: "Gems and Revival Update",
      changes: [
        "Added gems from daily sets, Extreme achievements, and monthly leaderboard podiums.",
        "Spend gems to revive within five seconds after a run ends; each revive in the same run costs five more gems.",
        "Monthly leaderboard prizes are 50 gems for first, 30 for second, and 15 for third; monthly standings use your best score submitted that month.",
        "Gems are shown on the home stats card and are not displayed in the gameplay HUD.",
        "Fixed bug where roll challenges appear in daily set despite all rare roll skins are unlocked."
      ]
    },
    {
      id: "mobile-support-update-2026-10-14",
      date: "14 October 2026",
      title: "Mobile Support and Pause Restart Update",
      changes: [
        "Added touch drag steering and an on-screen button for equipped abilities.",
        "Improved the home screen layout for smaller screens and older Safari.",
        "Added a restart button to the pause screen.",
        "Fixed mobile HUD sizing and falling items resetting near the top."
      ]
    },
    {
      id: "pause-screen-update-2026-10-08",
      date: "8 October 2026",
      title: "Pause Screen Update",
      changes: [
        "Added a stylish PAUSED screen to go with the dimmed background."
      ]
    },
    {
      id: "leaderboard-feedback-update-2026-10-03",
      date: "3 October 2026",
      title: "Leaderboard Feedback Update",
      changes: [
        "The leaderboard button now stays visible on the home screen and during gameplay.",
        "A toast confirms when a new best score is successfully added to the leaderboard."
      ]
    },
    {
      id: "void-skin-update-2026-10-02",
      date: "2 October 2026",
      title: "Void Skin Ability and Rare Roll Update",
      changes: [
        "Void blasts now clear visible obstacles without affecting coins or power-ups.",
        "Updated rare skin roll chances: Void 0.3%, Celestial 0.2%, and Phantom 0.1%."
      ]
    },
    {
      id: "trail-shop-update-2026-10-01",
      date: "1 October 2026",
      title: "Trail Shop and Skin Shop Update",
      changes: [
        "Added the Trail Shop with Spark, Comet, and Orbit trails.",
        "Trail colours match your equipped skin, and trails follow you while moving.",
        "Reorganised the skin shop into three columns and renamed Lava Core to Lava Skin."
      ]
    },
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

    while (list.firstChild) list.removeChild(list.firstChild);
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
    overlay && overlay.classList.remove("show");
    overlay && overlay.setAttribute("aria-hidden", "true");
    button && button.focus();
  }

  function openUpdateLog() {
    if (!overlay) return;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    if (badge) badge.hidden = true;
    safeStorageSet(SEEN_UPDATE_KEY, latestUpdate.id);
    closeButton && closeButton.focus();
  }

  function initUpdateLog() {
    if (!button || !overlay || !latestUpdate) return;

    renderUpdates();
    const isUnread = safeStorageGet(SEEN_UPDATE_KEY) !== latestUpdate.id;
    if (badge) badge.hidden = !isUnread;

    button.addEventListener("click", openUpdateLog);
    closeButton && closeButton.addEventListener("click", closeUpdateLog);
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