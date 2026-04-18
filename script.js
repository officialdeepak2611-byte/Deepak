const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

function setHeaderElevation() {
  const header = qs("[data-elevate]");
  if (!header) return;
  header.classList.toggle("is-elevated", window.scrollY > 6);
}

function setupMobileNav() {
  const toggle = qs("[data-nav-toggle]");
  const navList = qs("[data-nav]");
  if (!toggle || !navList) return;

  const close = () => {
    navList.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  const open = () => {
    navList.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const isOpen = navList.classList.contains("is-open");
    if (isOpen) close();
    else open();
  };

  toggle.addEventListener("click", toggleMenu);
  toggle.addEventListener("touchstart", toggleMenu, { passive: false });

  // Close on nav click (mobile) with slight delay to ensure navigation fires
  qsa("a", navList).forEach((a) => {
    a.addEventListener("click", () => {
      setTimeout(close, 150);
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!navList.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (navList.contains(target) || toggle.contains(target)) return;
    close();
  });
  
  document.addEventListener("touchstart", (e) => {
    if (!navList.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (navList.contains(target) || toggle.contains(target)) return;
    close();
  }, { passive: true });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!navList.classList.contains("is-open")) return;
    close();
    toggle.focus();
  });
}

function setupSmoothScroll() {
  const header = qs(".site-header");
  const headerOffset = () => (header ? header.getBoundingClientRect().height : 0) + 10;

  qsa("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });

      if (history && "pushState" in history) history.pushState(null, "", `#${id}`);
    });
  });
}

function showToast(message) {
  const toast = qs("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

function isValidEmail(v) {
  const value = String(v || "").trim();
  // Simple, pragmatic check for basic websites (not RFC-complete)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function setupContactForm() {
  const form = qs("#contact-form");
  if (!form) return;

  const fields = {
    name: {
      input: qs("#name", form),
      help: qs("#name-help", form),
      validate: (v) => (String(v || "").trim().length >= 2 ? "" : "Please enter your full name."),
    },
    email: {
      input: qs("#email", form),
      help: qs("#email-help", form),
      validate: (v) => (isValidEmail(v) ? "" : "Please enter a valid email address."),
    },
    service: {
      input: qs("#service", form),
      help: qs("#service-help", form),
      validate: (v) => (String(v || "").trim() ? "" : "Please choose a service."),
    },
    message: {
      input: qs("#message", form),
      help: qs("#message-help", form),
      validate: (v) =>
        String(v || "").trim().length >= 10 ? "" : "Please add a short message (10+ characters).",
    },
  };

  const setFieldState = (key, error) => {
    const { input, help } = fields[key];
    if (!input || !help) return true;

    const wrapper = input.closest(".field");
    if (wrapper) wrapper.classList.toggle("is-invalid", Boolean(error));

    help.textContent = error || "";
    help.classList.toggle("is-error", Boolean(error));
    return !error;
  };

  const validateField = (key) => {
    const { input, validate } = fields[key];
    if (!input) return true;
    return setFieldState(key, validate(input.value));
  };

  const validateAll = () => Object.keys(fields).every((k) => validateField(k));

  Object.keys(fields).forEach((k) => {
    const input = fields[k].input;
    if (!input) return;
    input.addEventListener("blur", () => validateField(k));
    input.addEventListener("input", () => {
      const wrapper = input.closest(".field");
      if (wrapper?.classList.contains("is-invalid")) validateField(k);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAll()) {
      const firstInvalid = qs(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea", form);
      firstInvalid?.focus();
      showToast("Please fix the highlighted fields.");
      return;
    }

    // Demo behavior (no backend). Replace with a fetch() to your server if needed.
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Contact form submission:", data);

    form.reset();
    Object.keys(fields).forEach((k) => setFieldState(k, ""));
    showToast("Thanks! Your message has been sent.");
  });
}

function setupYear() {
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupMessageField() {
  const message = qs("#message");
  if (!message) return;

  // Ensures placeholder/height even if browser cache shows stale DOM.
  message.setAttribute("rows", "3");
  message.placeholder = "Example: Warehouse night patrols (starting next month).";
  message.style.minHeight = "88px";
}

function setupRevealAnimations() {
  const prefersReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targets = [
    ...qsa(".hero-copy > *"),
    ...qsa(".hero-card"),
    ...qsa(".page-header > .container > *"),
    ...qsa(".section-head > *"),
    ...qsa(".cards .card"),
    ...qsa(".about-card"),
    ...qsa(".about-bullets li"),
    ...qsa(".about-visual"),
    ...qsa(".checks .check"),
    ...qsa(".panel"),
    ...qsa(".form"),
    ...qsa(".contact-card"),
    ...qsa(".testimonial"),
    ...qsa(".cta-banner-inner"),
    ...qsa(".value-card"),
    ...qsa(".service-detail"),
    ...qsa(".metric"),
    ...qsa(".faq-item"),
    ...qsa(".footer-top > *"),
    ...qsa(".footer-bottom > *"),
  ];

  const uniq = [...new Set(targets)].filter(Boolean);
  if (uniq.length === 0) return;

  if (prefersReduced || typeof IntersectionObserver === "undefined") {
    uniq.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Add base class and small stagger
  uniq.forEach((el, i) => {
    el.classList.add("reveal");
    const delay = (i % 4) + 1;
    el.setAttribute("data-delay", String(delay));
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { root: null, threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  uniq.forEach((el) => io.observe(el));
}

window.addEventListener("scroll", setHeaderElevation, { passive: true });

function setupFAQ() {
  const questions = qsa(".faq-question");
  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      
      // Close all other FAQs
      questions.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
        }
      });
      
      // Toggle current FAQ
      btn.setAttribute("aria-expanded", !isExpanded);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupYear();
  setHeaderElevation();
  setupMobileNav();
  setupSmoothScroll();
  setupContactForm();
  setupMessageField();
  setupRevealAnimations();
  setupFAQ();
});
