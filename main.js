/* ============================================================
   6–12 Tutoring — interactivity (vanilla JS, no dependencies)
   ============================================================ */

/* -------------------------------------------------------------
   1. CONFIG — paste your Google Apps Script Web App URL here.
   See README.md for the 5-minute setup. Leave as "" to run in
   "demo mode" (submissions are logged to the browser console and
   saved to a downloadable backup instead of a live Sheet).
   ------------------------------------------------------------- */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCXBbRYzeYn_pcEOM1XUREd72qIfN8F16-3O7HMis0JeNijmnfNFN7Z78JtxhW7Co/exec";

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNav();
  initMobileMenu();
  initReveal();
  initServiceCards();
  initForm();
});

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Sticky nav: add background once scrolled ---------- */
function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.add("hidden");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
  };
  const open = () => {
    menu.classList.remove("hidden");
    btn.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");
  };

  btn.addEventListener("click", () => {
    menu.classList.contains("hidden") ? open() : close();
  });

  // Close after tapping any link inside the menu
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---------- Scroll reveal via IntersectionObserver ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger for siblings revealed together
          setTimeout(() => entry.target.classList.add("in"), (i % 6) * 70);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Expandable service cards ---------- */
function initServiceCards() {
  document.querySelectorAll("[data-service]").forEach((card) => {
    const head = card.querySelector(".service-head");
    const body = card.querySelector(".service-body");
    if (!head || !body) return;

    head.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(isOpen));
      body.style.maxHeight = isOpen ? body.scrollHeight + "px" : null;
    });
  });

  // keep open card sized correctly on resize
  window.addEventListener("resize", () => {
    document.querySelectorAll("[data-service].is-open .service-body").forEach((b) => {
      b.style.maxHeight = b.scrollHeight + "px";
    });
  });
}

/* ---------- Contact form ---------- */
function initForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const btn = document.getElementById("submitBtn");
  const btnText = btn.querySelector(".btn-text");
  const spinner = btn.querySelector(".btn-spinner");

  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.style.color =
      type === "error" ? "#c0492f" : type === "success" ? "#566c43" : "";
  };

  // clear invalid styling as the user fixes fields
  form.addEventListener("input", (e) => {
    const t = e.target;
    t.classList?.remove("invalid");
    t.closest(".seg")?.classList.remove("invalid");
    if (t.name === "subjects") document.getElementById("subjects").classList.remove("invalid");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", "");

    // ---- Validate ----
    const data = collect(form);
    const errors = validate(form, data);
    if (errors) {
      setStatus("Please complete the highlighted fields.", "error");
      return;
    }

    // ---- Submit ----
    loading(true);
    try {
      if (GOOGLE_SCRIPT_URL) {
        const payload = new URLSearchParams();
        Object.entries(data).forEach(([k, v]) => payload.append(k, v));
        const res = await fetch(GOOGLE_SCRIPT_URL, { method: "POST", body: payload });
        if (!res.ok) throw new Error("Network response was not ok");
      } else {
        // Demo mode: no endpoint configured yet.
        demoSave(data);
      }
      form.reset();
      setStatus(
        GOOGLE_SCRIPT_URL
          ? "Thank you! Your message has been sent — I'll be in touch soon."
          : "Saved locally (demo mode). Add your Google Script URL in js/main.js to go live.",
        "success"
      );
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong sending the form. Please email me directly.", "error");
    } finally {
      loading(false);
    }
  });

  function loading(on) {
    btn.disabled = on;
    spinner.classList.toggle("hidden", !on);
    btnText.textContent = on ? "Sending…" : "Send message";
  }
}

/* gather all values into a flat object */
function collect(form) {
  const fd = new FormData(form);
  const subjects = fd.getAll("subjects").join(", ");
  return {
    timestamp: new Date().toLocaleString(),
    name: (fd.get("name") || "").toString().trim(),
    email: (fd.get("email") || "").toString().trim(),
    role: (fd.get("role") || "").toString(),
    grade: (fd.get("grade") || "").toString(),
    subjects,
    message: (fd.get("message") || "").toString().trim(),
  };
}

/* returns true if there are errors */
function validate(form, data) {
  let hasError = false;

  const flag = (el) => {
    hasError = true;
    el?.classList.add("invalid");
  };

  if (!data.name) flag(form.querySelector("#name"));
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    flag(form.querySelector("#email"));
  if (!data.role) flag(form.querySelector('[name="role"]')?.closest(".seg"));
  if (!data.grade) flag(form.querySelector('[name="grade"]')?.closest(".seg"));
  if (!data.subjects) {
    hasError = true;
    document.getElementById("subjects").classList.add("invalid");
  }

  return hasError;
}

/* Demo fallback: log + offer a downloadable record so no response is lost
   before the Google Sheet is connected. */
function demoSave(data) {
  console.log("[6–12 Tutoring] Form submission (demo mode):", data);
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (_) {
    /* download may be blocked in some embeds — console log still captured it */
  }
}
