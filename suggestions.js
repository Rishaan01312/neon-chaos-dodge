(() => {
  "use strict";

  const API_URL = "https://script.google.com/macros/s/AKfycbzO_S-oYwLN0CZshwnTYysttfM0pfGACijbFHc_KRb6fa2lVYG5_NHkaz6ejHer3sYY/exec";
  const INSTALL_ID_KEY = "neonChaosSuggestionInstallId";
  const LAST_SUBMISSION_KEY = "neonChaosSuggestionLastSubmittedAt";
  const SUBMISSION_COOLDOWN_MS = 60 * 1000;
  const MAX_MESSAGE_LENGTH = 600;

  const overlay = document.getElementById("suggestion-overlay");
  const form = document.getElementById("suggestion-form");
  const category = document.getElementById("suggestion-category");
  const message = document.getElementById("suggestion-message");
  const characterCount = document.getElementById("suggestion-character-count");
  const status = document.getElementById("suggestion-status");
  const submitButton = document.getElementById("suggestion-submit-btn");

  function getInstallId() {
    let installId = localStorage.getItem(INSTALL_ID_KEY);
    if (installId && /^[a-f0-9]{32}$/.test(installId)) return installId;

    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      installId = window.crypto.randomUUID().replace(/-/g, "").toLowerCase();
    } else if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      installId = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
        .map(value => value.toString(16).padStart(2, "0"))
        .join("");
    } else {
      installId = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    }

    localStorage.setItem(INSTALL_ID_KEY, installId);
    return installId;
  }

  function openSuggestionForm() {
    if (!overlay) return;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    message && message.focus();
  }

  function closeSuggestionForm() {
    if (!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.getElementById("suggestion-open-btn")?.focus();
  }

  function setStatus(text, state = "") {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("is-error", state === "error");
    status.classList.toggle("is-success", state === "success");
  }

  function updateCharacterCount() {
    if (characterCount && message) {
      characterCount.textContent = `${message.value.length} / ${MAX_MESSAGE_LENGTH}`;
    }
  }

  async function submitSuggestion(event) {
    event.preventDefault();
    if (!form || !category || !message || !submitButton) return;

    const suggestion = message.value.trim();
    if (suggestion.length < 10) {
      setStatus("Please add a little more detail (at least 10 characters).", "error");
      message.focus();
      return;
    }
    if (suggestion.length > MAX_MESSAGE_LENGTH) {
      setStatus("Your suggestion is too long. Please shorten it and try again.", "error");
      return;
    }
    if (!API_URL) {
      setStatus("The suggestion box is not connected yet. Please try again later.", "error");
      return;
    }

    const lastSubmittedAt = Number(localStorage.getItem(LAST_SUBMISSION_KEY) || "0");
    const waitMs = SUBMISSION_COOLDOWN_MS - (Date.now() - lastSubmittedAt);
    if (waitMs > 0) {
      const waitSeconds = Math.ceil(waitMs / 1000);
      setStatus(`Please wait ${waitSeconds} seconds before sending another suggestion.`, "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setStatus("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          category: category.value,
          message: suggestion,
          installId: getInstallId()
        })
      });
      if (!response.ok) {
        throw new Error(`Suggestion submission failed with status ${response.status}.`);
      }

      const result = await response.json();
      if (!result || result.ok !== true) {
        throw new Error(result && typeof result.message === "string"
          ? result.message
          : "The suggestion could not be submitted.");
      }

      localStorage.setItem(LAST_SUBMISSION_KEY, String(Date.now()));
      form.reset();
      updateCharacterCount();
      setStatus("Thanks! Your suggestion has been sent.", "success");
    } catch (error) {
      console.error("Suggestion submission failed:", error);
      setStatus("Couldn’t send your suggestion. Check your connection and try again.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Suggestion";
    }
  }

  document.getElementById("suggestion-open-btn")?.addEventListener("click", openSuggestionForm);
  document.getElementById("suggestion-close-btn")?.addEventListener("click", closeSuggestionForm);
  overlay?.addEventListener("click", event => {
    if (event.target === overlay) closeSuggestionForm();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay?.classList.contains("show")) {
      closeSuggestionForm();
    }
  });
  message?.addEventListener("input", updateCharacterCount);
  form?.addEventListener("submit", submitSuggestion);
  if (!API_URL) {
    setStatus("Suggestion sending is being set up. Please try again later.");
  }
})();
