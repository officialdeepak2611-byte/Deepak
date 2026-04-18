/* ═══════════════════════════════════════════════════════════════
   SMOOTH-SCROLL.JS — Premium Ultra-Smooth Scroll Engine
   Features:
   • Lenis-style momentum smooth scroll (overrides native)
   • Scroll progress bar in header
   • Parallax floating elements
   • Enhanced stagger reveal animations
   • Smooth counter animation for numbers
   • Magnetic hover effect on buttons & cards
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── Respect reduced motion preference ─── */
  const prefersReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  /* ══════════════════════════════════════════
     1. LENIS-STYLE ULTRA SMOOTH SCROLL
     ══════════════════════════════════════════ */
  class SmoothScroller {
    constructor() {
      this.targetScroll = window.scrollY;
      this.currentScroll = window.scrollY;
      this.ease = 0.08; // Lower = smoother/slower
      this.running = true;
      this.velocity = 0;
      this.isScrolling = false;
      this.scrollTimeout = null;
      this.raf = null;

      this._bindEvents();
      this._animate();
    }

    _bindEvents() {
      // Override default scroll behavior
      document.documentElement.style.scrollBehavior = "auto";

      window.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          this.targetScroll += e.deltaY;
          this.targetScroll = Math.max(
            0,
            Math.min(
              this.targetScroll,
              document.documentElement.scrollHeight - window.innerHeight
            )
          );
          this._setScrolling();
        },
        { passive: false }
      );

      // Touch support
      let touchStart = 0;
      let touchStartScroll = 0;

      window.addEventListener(
        "touchstart",
        (e) => {
          touchStart = e.touches[0].clientY;
          touchStartScroll = this.targetScroll;
        },
        { passive: true }
      );

      window.addEventListener(
        "touchmove",
        (e) => {
          const diff = touchStart - e.touches[0].clientY;
          this.targetScroll = touchStartScroll + diff;
          this.targetScroll = Math.max(
            0,
            Math.min(
              this.targetScroll,
              document.documentElement.scrollHeight - window.innerHeight
            )
          );
          this._setScrolling();
        },
        { passive: true }
      );

      // Key/programmatic scrolls
      window.addEventListener("scroll", () => {
        if (!this.isScrolling) {
          this.targetScroll = window.scrollY;
          this.currentScroll = window.scrollY;
        }
      });

      // Handle resizing
      window.addEventListener("resize", () => {
        this.targetScroll = Math.min(
          this.targetScroll,
          document.documentElement.scrollHeight - window.innerHeight
        );
      });
    }

    _setScrolling() {
      this.isScrolling = true;
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 150);
    }

    _animate() {
      const diff = this.targetScroll - this.currentScroll;
      this.velocity = diff * this.ease;
      this.currentScroll += this.velocity;

      // Snap when close enough
      if (Math.abs(diff) < 0.5) {
        this.currentScroll = this.targetScroll;
      }

      window.scrollTo(0, this.currentScroll);

      // Dispatch custom event for parallax etc.
      window.dispatchEvent(
        new CustomEvent("smoothscroll", {
          detail: {
            scroll: this.currentScroll,
            velocity: this.velocity,
            progress:
              this.currentScroll /
              (document.documentElement.scrollHeight - window.innerHeight),
          },
        })
      );

      this.raf = requestAnimationFrame(() => this._animate());
    }

    scrollTo(target, duration = 1200) {
      const y =
        typeof target === "number"
          ? target
          : target.getBoundingClientRect().top + window.scrollY;

      const headerH =
        (document.querySelector(".site-header")?.getBoundingClientRect()
          .height || 0) + 10;

      this.targetScroll = Math.max(0, y - headerH);
    }

    destroy() {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  /* ══════════════════════════════════════════
     2. SCROLL PROGRESS BAR
     ══════════════════════════════════════════ */
  function createProgressBar() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress-bar";
    bar.setAttribute("aria-hidden", "true");

    const fill = document.createElement("div");
    fill.className = "scroll-progress-fill";
    bar.appendChild(fill);

    const header = document.querySelector(".site-header");
    if (header) {
      header.appendChild(bar);
    } else {
      document.body.prepend(bar);
    }

    window.addEventListener("smoothscroll", (e) => {
      const progress = e.detail.progress;
      fill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    });

    return bar;
  }

  /* ══════════════════════════════════════════
     3. PARALLAX ELEMENTS
     ══════════════════════════════════════════ */
  function setupParallax() {
    const parallaxItems = [
      { selector: ".hero-bg", speed: 0.25, type: "translate" },
      { selector: ".hero-copy", speed: -0.08, type: "translate" },
      { selector: ".hero-card", speed: -0.04, type: "translate" },
      {
        selector: ".page-header::before",
        speed: 0.15,
        type: "translate",
        target: ".page-header",
      },
    ];

    const elements = [];
    parallaxItems.forEach((item) => {
      const el = document.querySelector(item.target || item.selector);
      if (el) elements.push({ el, ...item });
    });

    if (elements.length === 0) return;

    window.addEventListener("smoothscroll", (e) => {
      const scroll = e.detail.scroll;

      elements.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const offset = (center - windowCenter) * item.speed;

        if (item.type === "translate") {
          item.el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     4. ENHANCED SCROLL-REVEAL WITH STAGGER
     ══════════════════════════════════════════ */
  function enhanceRevealAnimations() {
    // Add directional reveal classes to sections
    const sections = document.querySelectorAll(".section, .section-alt, .cta-banner");

    sections.forEach((section, index) => {
      // Alternate direction for visual variety
      const direction = index % 2 === 0 ? "left" : "right";
      const sectionHead = section.querySelector(".section-head");
      if (sectionHead) {
        sectionHead.setAttribute("data-reveal-dir", direction);
      }
    });

    // Stagger grid children beautifully
    const grids = document.querySelectorAll(
      ".cards, .testimonials-grid, .values-grid, .about-metrics, .about-cards"
    );

    grids.forEach((grid) => {
      const children = Array.from(grid.children);
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
      });
    });

    // Add tilt on scroll for cards
    const cards = document.querySelectorAll(
      ".card, .testimonial, .value-card, .metric, .stat"
    );

    let lastScroll = 0;
    window.addEventListener("smoothscroll", (e) => {
      const velocity = e.detail.velocity;
      const tilt = Math.max(-2, Math.min(2, velocity * 0.03));

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Only apply to visible cards
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.style.transform = `perspective(1000px) rotateX(${tilt}deg) translateY(${card.matches(":hover") ? "-3px" : "0px"})`;
        }
      });

      lastScroll = e.detail.scroll;
    });
  }

  /* ══════════════════════════════════════════
     5. ANIMATED NUMBER COUNTER
     ══════════════════════════════════════════ */
  function setupCounterAnimations() {
    const counters = document.querySelectorAll(
      ".stat dd, .metric-n"
    );

    if (counters.length === 0) return;

    const observerOptions = { threshold: 0.5 };

    const animateValue = (el, start, end, duration, suffix, prefix) => {
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out-expo curve for snappy feel
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * eased);

        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = el.getAttribute("data-original");
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.getAttribute("data-counted")) return;

        entry.target.setAttribute("data-counted", "true");

        const original = entry.target.textContent.trim();
        entry.target.setAttribute("data-original", original);

        // Extract number from text like "500+", "98.7%", "< 10 min", "4.9/5", "24/7"
        const match = original.match(/([\d.]+)/);
        if (!match) return;

        const num = parseFloat(match[1]);
        if (isNaN(num) || num === 0) return;

        const prefix = original.substring(0, original.indexOf(match[1]));
        const suffix = original.substring(
          original.indexOf(match[1]) + match[1].length
        );

        // Use integer animation for whole numbers, skip decimals
        const isInteger = Number.isInteger(num) && num > 1;

        if (isInteger) {
          entry.target.textContent = prefix + "0" + suffix;
          animateValue(entry.target, 0, num, 1800, suffix, prefix);
        }

        observer.unobserve(entry.target);
      });
    }, observerOptions);

    counters.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════════
     6. MAGNETIC HOVER EFFECT
     ══════════════════════════════════════════ */
  function setupMagneticHover() {
    const magneticElements = document.querySelectorAll(
      ".btn, .icon-btn, .brand"
    );

    magneticElements.forEach((el) => {
      el.style.transition =
        el.style.transition +
        ", transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.15;

        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ══════════════════════════════════════════
     7. SMOOTH ANCHOR OVERRIDE
     ══════════════════════════════════════════ */
  function overrideSmoothAnchors(scroller) {
    document.querySelectorAll("a[href^='#']").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        scroller.scrollTo(target);

        if (history && "pushState" in history)
          history.pushState(null, "", `#${id}`);
      });
    });
  }

  /* ══════════════════════════════════════════
     8. SCROLL-VELOCITY HEADER EFFECT
     ══════════════════════════════════════════ */
  function setupHeaderScrollEffect() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScroll = 0;
    let isHidden = false;

    window.addEventListener("smoothscroll", (e) => {
      const scroll = e.detail.scroll;
      const velocity = e.detail.velocity;

      // Show/hide header on scroll direction
      if (scroll > 200 && velocity > 2 && !isHidden) {
        header.style.transform = "translateY(-100%)";
        header.style.transition = "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";
        isHidden = true;
      } else if ((velocity < -0.5 || scroll < 100) && isHidden) {
        header.style.transform = "translateY(0)";
        isHidden = false;
      }

      // Glassmorphism intensity based on scroll
      const blur = Math.min(20, 14 + scroll * 0.01);
      const bg = Math.min(0.85, 0.55 + scroll * 0.0005);
      header.style.backdropFilter = `blur(${blur}px)`;
      header.style.background = `rgba(7, 10, 18, ${bg})`;

      lastScroll = scroll;
    });
  }

  /* ══════════════════════════════════════════
     9. TILT CARD EFFECT ON MOUSE
     ══════════════════════════════════════════ */
  function setupCardTilt() {
    const cards = document.querySelectorAll(
      ".hero-card, .cta-banner-inner, .contact-card, .panel, .about-visual"
    );

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale3d(1.01, 1.01, 1.01)`;
        card.style.transition = "transform 100ms ease-out";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(800px) rotateY(0) rotateX(0) scale3d(1, 1, 1)";
        card.style.transition = "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      });
    });
  }

  /* ══════════════════════════════════════════
     10. FLOATING PARTICLES BACKGROUND
     ══════════════════════════════════════════ */
  function createFloatingParticles() {
    const hero = document.querySelector(".hero, .page-header");
    if (!hero) return;

    const canvas = document.createElement("canvas");
    canvas.className = "particles-canvas";
    canvas.setAttribute("aria-hidden", "true");
    hero.style.position = "relative";
    hero.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < Math.min(count, 60); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 209, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79, 209, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
  }

  /* ══════════════════════════════════════════
     INIT — Orchestrate everything
     ══════════════════════════════════════════ */
  function init() {
    // Only enable smooth scroller on non-touch desktop
    let scroller = null;
    const isDesktop = window.innerWidth > 900 && !("ontouchstart" in window);

    if (isDesktop) {
      scroller = new SmoothScroller();
      overrideSmoothAnchors(scroller);
      setupHeaderScrollEffect();
    }

    createProgressBar();
    setupParallax();
    enhanceRevealAnimations();
    setupCounterAnimations();
    setupMagneticHover();
    setupCardTilt();
    createFloatingParticles();
  }

  // Wait for DOM + other scripts
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      requestAnimationFrame(init)
    );
  } else {
    requestAnimationFrame(init);
  }
})();
