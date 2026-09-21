/* =========================================================
   UPFINITY — CONTACT FORM (Netlify Forms, no third-party service)
   Submits in place via fetch() to Netlify's built-in form
   handler (the same platform this site is hosted on — not an
   external form API like Formspree/EmailJS). The visitor gets
   a single click and an inline success/fail message; nothing
   opens their email app and nothing leaves the page.

   One-time setup required in the Netlify dashboard (not code):
   Site settings -> Forms -> Form notifications -> Add notification
   -> Email notification -> upfinity.team@gmail.com
   ========================================================= */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var note = document.getElementById("form-note");
  var submitBtn = form.querySelector(".submit-btn");
  var defaultBtnLabel = submitBtn ? submitBtn.textContent : "Get a Quote";

  function encode(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  }

  function setNote(message, state) {
    if (!note) return;
    note.textContent = message;
    note.classList.remove("form-note-success", "form-note-error");
    if (state) note.classList.add("form-note-" + state);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot: if a bot filled this hidden field, silently drop the submit.
    var honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) return;

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = value;
    });

    var checked = form.querySelectorAll(".services-checkboxes input[type=checkbox]:checked");
    payload.services = Array.prototype.map
      .call(checked, function (cb) { return cb.parentElement.textContent.trim(); })
      .join(", ");

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    setNote("Sending your details…");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Bad response");
        form.reset();
        setNote("Thanks! Your details have been sent — we'll get back to you shortly.", "success");
      })
      .catch(function () {
        setNote("Something went wrong sending your details. Please try again or email us directly.", "error");
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnLabel;
        }
      });
  });
})();
