/* ═══════════════════════════════════════════════════════════
   AQ PORTFOLIO — MAIN JAVASCRIPT
   Custom Cursor · Page Loader · Scroll Reveal · Nav Scroll
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const counter = document.getElementById('loaderCounter');

  if (!loader) return;

  let progress = 0;
  const target = 100;
  const duration = 1400; // ms
  const interval = 20;   // ms per tick
  const steps = duration / interval;
  const increment = target / steps;

  // Ease in-out quad
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let tick = 0;

  const timer = setInterval(() => {
    tick++;
    const rawP = (tick / steps);
    progress = Math.min(easeInOutQuad(rawP) * 100, 100);

    bar.style.width = progress + '%';
    counter.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(timer);
      // Brief pause then hide loader
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        // Trigger reveals for elements already in view
        checkRevealElements();
      }, 300);
    }
  }, interval);

  // Lock scroll during load
  document.body.style.overflow = 'hidden';
})();

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isMoving = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth cursor ring follows with lag
  function animateCursor() {
    const ease = 0.12;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor state: hoverable elements
  const hoverables = document.querySelectorAll('a, button, .capability-card, .feature-pill, .project-image-wrap, .meta-item');
  
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });

  // Cursor state: text elements
  const textEls = document.querySelectorAll('h1, h2, h3, p');
  textEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-text'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-text'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    dot.style.opacity = '1';
  });
})();

/* ─────────────────────────────────────────
   NAVIGATION: scroll-state + hamburger menu
───────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Hamburger open/close
  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMobileNav);
    }

    // Close when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }
})();

/* ─────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
function checkRevealElements() {
  const revealEls = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

// Also call on DOMContentLoaded in case loader already ran
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure loader has started
  setTimeout(checkRevealElements, 1600);
});

/* ─────────────────────────────────────────
   PROJECT BG NUMBER — Parallax on scroll
───────────────────────────────────────── */
(function initParallax() {
  const bgNumbers = document.querySelectorAll('.project-bg-number');

  function onScroll() {
    bgNumbers.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      el.style.transform = `translateY(calc(-50% + ${progress * 40}px))`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────
   PROJECT CHAPTER — Tilt effect on mouse
───────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.project-image-wrap');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const img = card.querySelector('.project-img');
      if (img) {
        img.style.transform = `scale(1.04) rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.project-img');
      if (img) {
        img.style.transform = 'scale(1) rotateY(0) rotateX(0)';
        img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  });
})();

/* ─────────────────────────────────────────
   COUNTER-NUM — Count-up animation
───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const final = parseInt(el.textContent, 10);
        if (isNaN(final)) return;

        let current = 0;
        const duration = 900;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = final / steps;

        el.textContent = '00';

        const timer = setInterval(() => {
          current += increment;
          if (current >= final) {
            el.textContent = String(final).padStart(2, '0');
            clearInterval(timer);
          } else {
            el.textContent = String(Math.floor(current)).padStart(2, '0');
          }
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
})();

/* ─────────────────────────────────────────
   CAPABILITY CARDS — staggered entrance
───────────────────────────────────────── */
(function initCapabilityStagger() {
  const cards = document.querySelectorAll('.capability-card');
  cards.forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 0.07}s`);
  });
})();

/* ─────────────────────────────────────────
   SMOOTH ACTIVE NAV LINK
───────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));
})();

/* ─────────────────────────────────────────
   HERO GRAIN ANIMATION
───────────────────────────────────────── */
(function initGrainAnimation() {
  const noiseEls = document.querySelectorAll('.noise');
  if (!noiseEls.length) return;

  let frame = 0;
  function animateGrain() {
    frame++;
    if (frame % 3 === 0) {
      noiseEls.forEach(el => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        el.style.backgroundPosition = `${x}% ${y}%`;
      });
    }
    requestAnimationFrame(animateGrain);
  }
  animateGrain();
})();

/* ─────────────────────────────────────────
   PROJECT SHOWCASE TAB SWITCHER
───────────────────────────────────────── */
(function initShowcaseTabs() {
  function setupTabs(containerId, imgId, tagId) {
    const container = document.getElementById(containerId);
    const mainImg = document.getElementById(imgId);
    const mainTag = document.getElementById(tagId);

    if (!container || !mainImg) return;

    const tabs = container.querySelectorAll('.showcase-tab');

    tabs.forEach(tab => {
      const activate = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const imgSrc = tab.getAttribute('data-img');
        const tagText = tab.getAttribute('data-tag');

        if (imgSrc && mainImg.getAttribute('src') !== imgSrc) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = imgSrc;
            mainImg.style.opacity = '1';
          }, 120);
        }

        if (tagText && mainTag) {
          mainTag.textContent = tagText;
        }
      };

      tab.addEventListener('click', activate);
      tab.addEventListener('mouseenter', activate);
    });
  }

  // Padel Zone showcase tabs
  setupTabs('padel-tabs', 'padel-img', 'padel-img-tag');
  // Sweetest Chapter showcase tabs
  setupTabs('bakery-tabs', 'bakery-img', 'bakery-img-tag');
})();

/* ─────────────────────────────────────────
   FOOTER EMAIL: set real email address
───────────────────────────────────────── */
(function initEmailLink() {
  const emailLink = document.getElementById('contact-email-link');
  if (!emailLink) return;
  emailLink.href = 'mailto:abdulqaadirgaffoor01@gmail.com';
})();

/* ─────────────────────────────────────────
   FALLBACK: Ensure images load gracefully
───────────────────────────────────────── */
(function initImageFallback() {
  const projectImgs = document.querySelectorAll('.project-img');
  projectImgs.forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = 'var(--surface-2)';
      img.style.minHeight = '300px';
      img.alt = '';
    });
  });
})();

