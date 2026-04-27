/* ============================================================
   Island Tales by Caribbean Scribbles — script.js
   Author : Venetta J. Smithen
   Purpose: All interactive behaviour for the Island Tales
            static site. No external dependencies required.

   Sections:
   1.  DOM-ready initialisation
   2.  Navigation — sticky scroll + active link + hamburger
   3.  Scroll-reveal animation (IntersectionObserver)
   4.  Back-to-top button
   5.  Gallery grid — dynamic card injection
   6.  Contact form — client-side validation + feedback
   7.  Footer year
   8.  Smooth-scroll for anchor links
   ============================================================ */


/* ============================================================
   1. DOM-READY INITIALISATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initBackToTop();
  initGallery();
  initContactForm();
  setFooterYear();
  initSmoothScroll();
});


/* ============================================================
   2. NAVIGATION
   Handles:
   - Sticky shadow on scroll
   - Hamburger menu toggle (mobile)
   - Active nav-link highlighting based on scroll position
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const menu      = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  if (!navbar || !toggle || !menu) return;

  /* --- Sticky shadow --- */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Hamburger toggle --- */
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close menu when a link is clicked (mobile) */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* --- Active link highlighting --- */
  function updateActiveLink() {
    let currentId = '';
    const scrollY = window.scrollY + 100; // offset for fixed navbar

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }

  // Run once on load
  updateActiveLink();
}


/* ============================================================
   3. SCROLL-REVEAL ANIMATION
   Uses IntersectionObserver to add .revealed class when
   elements with .reveal enter the viewport.
   ============================================================ */
function initScrollReveal() {
  // Add .reveal class to all section children that should animate
  const targets = document.querySelectorAll(
    '.about-card, .step-card, .feature-card, .gallery-card, ' +
    '.contact-item, .contact-form, .about-text, .about-cards'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay for grid children
    const delay = (i % 4) * 0.1;
    el.style.transitionDelay = `${delay}s`;
  });

  // Also reveal section headers
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
  });

  // Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ============================================================
   4. BACK-TO-TOP BUTTON
   Shows after scrolling 400px; smooth-scrolls to top on click.
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   5. GALLERY GRID — DYNAMIC CARD INJECTION
   Data-driven: add/edit themes here without touching HTML.
   ============================================================ */
const GALLERY_THEMES = [
  {
    emoji: '🗺️',
    title: 'History',
    count: '10 stories',
    bg: '#fff7ed',
    border: '#f97316',
    badge: 'NEW',
  },
  {
    emoji: '🌿',
    title: 'Nature & Wildlife',
    count: '4 stories',
    bg: '#f0fdf4',
    border: '#22c55e',
  },
  {
    emoji: '🧚',
    title: 'Folklore & Magic',
    count: '3 stories',
    bg: '#fdf4ff',
    border: '#a855f7',
  },
  {
    emoji: '⚓',
    title: 'Adventure',
    count: '3 stories',
    bg: '#eff6ff',
    border: '#3b82f6',
  },
  {
    emoji: '🎶',
    title: 'Culture & Music',
    count: '3 stories',
    bg: '#fff1f2',
    border: '#f43f5e',
  },
  {
    emoji: '🔬',
    title: 'Science & Discovery',
    count: '2 stories',
    bg: '#ecfeff',
    border: '#06b6d4',
  },
  {
    emoji: '🤝',
    title: 'Community',
    count: '2 stories',
    bg: '#fefce8',
    border: '#eab308',
  },
  {
    emoji: '🦁',
    title: 'Characters',
    count: 'Meet the heroes',
    bg: '#fff8f0',
    border: '#e8460a',
  },
];

function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  GALLERY_THEMES.forEach((theme, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${theme.title} — ${theme.count}`);
    card.style.cssText = `
      background: ${theme.bg};
      border: 2px solid ${theme.border};
    `;

    card.innerHTML = `
      <div class="gallery-card-inner">
        <span class="gallery-card-emoji" aria-hidden="true">${theme.emoji}</span>
        <p class="gallery-card-title">${theme.title}</p>
        <p class="gallery-card-count">${theme.count}</p>
        ${theme.badge ? `<span class="feature-tag">${theme.badge}</span>` : ''}
      </div>
    `;

    // Navigate to the live platform on click / Enter key
    const goToSite = () => {
      window.open('https://islandtales-oatbsxnq.manus.space/', '_blank', 'noopener');
    };

    card.addEventListener('click', goToSite);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSite();
      }
    });

    grid.appendChild(card);
  });
}


/* ============================================================
   6. CONTACT FORM — CLIENT-SIDE VALIDATION + FEEDBACK
   Note: This is a static site — no server-side submission.
   The form shows a friendly success message on valid submit.
   To connect a real backend, replace the submitForm() body
   with a fetch() call to your API endpoint.
   ============================================================ */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous status
    status.textContent = '';
    status.className = 'form-status';

    // Gather values
    const name    = form.contactName.value.trim();
    const email   = form.contactEmail.value.trim();
    const message = form.contactMessage.value.trim();

    // Basic validation
    if (!name) {
      showStatus('Please enter your name.', 'error');
      form.contactName.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      form.contactEmail.focus();
      return;
    }

    if (!message) {
      showStatus('Please write a message before sending.', 'error');
      form.contactMessage.focus();
      return;
    }

    /* --- Simulate submission (replace with real fetch() for production) ---
       Example:
       fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, email, message })
       })
       .then(r => r.json())
       .then(() => showSuccess())
       .catch(() => showStatus('Something went wrong. Please try again.', 'error'));
    -------------------------------------------------------------------- */
    simulateSubmit(name);
  });

  /* Simulate a short loading delay then show success */
  function simulateSubmit(name) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message 💌';
      showStatus(
        `Thank you, ${name}! 🌴 Your message has been received. We'll be in touch soon!`,
        'success'
      );
    }, 1200);
  }

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  }
}

/* Simple email format validator */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ============================================================
   7. FOOTER YEAR
   Automatically keeps the copyright year current.
   ============================================================ */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}


/* ============================================================
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   Offsets scroll position to account for the fixed navbar.
   ============================================================ */
function initSmoothScroll() {
  const NAVBAR_HEIGHT = 72; // px — matches navbar height in CSS

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
