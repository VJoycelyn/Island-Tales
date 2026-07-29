/**
 * Caribbean Scribbles — Newsletter Subscription Handler
 *
 * Uses Formspree (https://formspree.io) to handle form submissions
 * from a static GitHub Pages site. When someone subscribes:
 *   1. Their details are sent to Formspree
 *   2. Formspree forwards the submission to your email
 *   3. You can connect Formspree to Mailchimp/beehiiv for automation
 *
 * SETUP: Replace FORMSPREE_ENDPOINT below with your own Formspree form URL.
 * Get one free at https://formspree.io — takes 2 minutes.
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Replace this with your Formspree endpoint after signing up at formspree.io
// Example: "https://formspree.io/f/xpwzabcd"
const FORMSPREE_ENDPOINT = "https://formspree.io/f/caribbeanscribbles";

// ─── FORM HANDLER ────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("subscribe-form");
  const successMsg = document.getElementById("subscribe-success");
  const errorMsg = document.getElementById("subscribe-error");
  const submitBtn = document.getElementById("submit-btn");
  const btnLabel = document.getElementById("btn-label");
  const btnSpinner = document.getElementById("btn-spinner");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector("#sub-name").value.trim();
    const email = form.querySelector("#sub-email").value.trim();
    const role = form.querySelector("#sub-role").value;

    // Basic validation
    if (!email || !isValidEmail(email)) {
      showFieldError(form.querySelector("#sub-email"), "Please enter a valid email address.");
      return;
    }

    // Show loading state
    setLoading(true);
    clearErrors();

    const payload = {
      name: name || "Friend",
      email: email,
      role: role || "General Book Lover",
      source: "GitHub Pages Newsfeed",
      _subject: "New Caribbean Scribbles Newsletter Subscriber",
      // Formspree honeypot field (leave empty to pass spam filter)
      _gotcha: ""
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success — show confirmation
        form.classList.add("hidden");
        successMsg.classList.remove("hidden");
        errorMsg.classList.add("hidden");

        // Track in localStorage to avoid duplicate submissions
        try { localStorage.setItem("csp_subscribed", "1"); } catch (_) {}
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      errorMsg.classList.remove("hidden");
    } finally {
      setLoading(false);
    }
  });

  // If already subscribed, show a gentle note
  try {
    if (localStorage.getItem("csp_subscribed")) {
      const note = document.createElement("p");
      note.style.cssText = "color:rgba(255,255,255,0.7);font-size:0.85rem;margin-bottom:0.5rem;";
      note.textContent = "✅ You're already subscribed — check your inbox for your latest pick!";
      form.insertBefore(note, form.firstChild);
    }
  } catch (_) {}

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnLabel.classList.toggle("hidden", loading);
    btnSpinner.classList.toggle("hidden", !loading);
  }

  function clearErrors() {
    form.querySelectorAll(".field-error").forEach(el => el.remove());
    form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    errorMsg.classList.add("hidden");
  }

  function showFieldError(input, message) {
    input.classList.add("input-error");
    const err = document.createElement("span");
    err.className = "field-error";
    err.style.cssText = "color:#ffb3b3;font-size:0.78rem;display:block;margin-top:-0.4rem;";
    err.textContent = message;
    input.insertAdjacentElement("afterend", err);
    input.focus();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
