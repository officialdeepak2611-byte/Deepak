/**
 * Shared components — header, footer, toast.
 * Include this script on every page BEFORE script.js.
 *
 * Usage:
 *   <div id="site-header"></div>   ← placeholder
 *   <div id="site-footer"></div>   ← placeholder
 *   <div id="site-toast"></div>    ← placeholder
 *   <script src="./components.js"></script>
 *   <script src="./script.js" defer></script>
 */

function renderHeader(activePage) {
  const pages = [
    { label: "Home", href: "index.html", key: "home" },
    { label: "Services", href: "services.html", key: "services" },
    { label: "About", href: "about.html", key: "about" },
    { label: "Why us", href: "why-us.html", key: "why-us" },
    { label: "Contact", href: "contact.html", key: "contact" },
  ];

  const navItems = pages
    .map(
      (p) =>
        `<li><a class="nav-link${p.key === activePage ? " is-active" : ""}" href="${p.href}">${p.label}</a></li>`
    )
    .join("\n            ");

  const html = `
    <header class="site-header" data-elevate>
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="ShieldSecure home">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-text">ShieldSecure</span>
        </a>

        <button
          class="nav-toggle"
          type="button"
          aria-label="Open menu"
          aria-controls="primary-nav"
          aria-expanded="false"
          data-nav-toggle
        >
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
        </button>

        <nav class="nav" aria-label="Primary">
          <ul id="primary-nav" class="nav-list" data-nav>
            ${navItems}
            <li class="nav-cta">
              <a class="btn btn-primary btn-sm" href="contact.html">Request a quote</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>`;

  const el = document.getElementById("site-header");
  if (el) el.innerHTML = html;
}

function renderFooter() {
  const html = `
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a class="brand footer-brand-link" href="index.html" aria-label="ShieldSecure home">
              <span class="brand-mark" aria-hidden="true"></span>
              <span class="brand-text">ShieldSecure</span>
            </a>
            <p class="muted footer-about">
              Premium security services with disciplined personnel, clear reporting, and 24/7 support.
            </p>

            <div class="footer-cta">
              <a class="btn btn-primary btn-sm" href="contact.html">Request a quote</a>
              <a class="btn btn-ghost btn-sm" href="tel:+10000000000">Call now</a>
            </div>

            <div class="social" aria-label="Social links">
              <a class="icon-btn" href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43v6.31ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a class="icon-btn" href="#" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18.9 3H21l-4.6 5.26L22 21h-4.7l-3.68-4.79L9.3 21H7.2l4.92-5.62L2 3h4.82l3.33 4.38L13.9 3h5ZM17.1 19.4h1.16L6.78 4.53H5.53L17.1 19.4Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a class="icon-btn" href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.87.24-1.46 1.5-1.46h1.7V5.1c-.3-.04-1.34-.13-2.54-.13-2.5 0-4.2 1.52-4.2 4.32V11H7.2v3h2.7v8h3.6Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          <nav class="footer-col" aria-label="Footer quick links">
            <p class="footer-title">Quick links</p>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="why-us.html">Why us</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </nav>

          <nav class="footer-col" aria-label="Footer services links">
            <p class="footer-title">Services</p>
            <ul class="footer-links">
              <li><a href="services.html">Manned guarding</a></li>
              <li><a href="services.html">CCTV monitoring</a></li>
              <li><a href="services.html">Access control</a></li>
              <li><a href="services.html">Rapid response</a></li>
            </ul>
          </nav>

          <div class="footer-col" aria-label="Footer contact details">
            <p class="footer-title">Contact</p>
            <ul class="footer-links">
              <li>
                <a href="tel:+916376000000">
                  <span class="footer-link-icon" aria-hidden="true">
                    <i class="fa fa-phone" aria-hidden="true"></i>
                  </span>
                  +91 6376000000
                </a>
              </li>
              <li>
                <a href="mailto:ops@shieldsecure.example">
                  <span class="footer-link-icon" aria-hidden="true">
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                  </span>
                  ops@shieldsecure.example
                </a>
              </li>
              <li>
                <span class="footer-link-icon" aria-hidden="true">
                  <i class="fa fa-map-marker" aria-hidden="true"></i>
                </span>
                Jaipur, Rajasthan, India
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="muted">
            © <span id="year"></span> ShieldSecure. All rights reserved.
          </p>
          <p class="muted footer-note">
            Built for reliability • 24/7 coverage • Clear reporting
          </p>
        </div>
      </div>
    </footer>`;

  const el = document.getElementById("site-footer");
  if (el) el.innerHTML = html;
}

function renderToast() {
  const el = document.getElementById("site-toast");
  if (el) {
    el.innerHTML = `<div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>`;
  }
}

/**
 * Call this at the top of every page's inline script:
 *   initPage("home")  |  initPage("services")  |  etc.
 */
function initPage(activePage) {
  renderHeader(activePage);
  renderFooter();
  renderToast();
}
