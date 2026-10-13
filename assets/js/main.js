/**
 * STACKLY AGRICULTURE & FARMING - CORE JAVASCRIPT
 * Handles Loader, Sticky Nav, Mobile Menu & Scroll Lock, Dynamic Greetings,
 * Interactive 3D Tilt, Scroll Progress, Scroll Reveal, Form Validations & Universal Logo Router
 */

function onDOMReady(fn) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Immediately initialize preloader without waiting
initLoader();

onDOMReady(() => {
  initScrollProgressBar();
  initDynamicGreetings();
  initStickyNavbar();
  initActiveNav();
  initMobileNav();
  initScrollAnimations();
  initCardTilt();
  initUniversalLogoRedirect();
  initFormValidations();
  initBackToTop();
});

/* ==========================================================================
   1. FULL VIEWPORT PRELOADER
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('app-loader');
  if (!loader) return;

  const dismissLoader = () => {
    if (loader.classList.contains('fade-out')) return;
    loader.classList.add('fade-out');
    setTimeout(() => {
      try { loader.remove(); } catch (e) { loader.style.display = 'none'; }
    }, 400);
  };

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    dismissLoader();
  } else {
    document.addEventListener('DOMContentLoaded', dismissLoader);
  }

  window.addEventListener('load', dismissLoader);
  setTimeout(dismissLoader, 450); // Strict safety timeout
}

/* ==========================================================================
   2. TOP SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  let bar = document.getElementById('scroll-progress-bar');
  if (!bar && !document.body.classList.contains('page-fixed-404') && !document.body.classList.contains('page-auth-fixed')) {
    bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    document.body.appendChild(bar);
  }

  if (!bar) return;

  const updateProgress = () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const progress = (window.scrollY / scrollTotal) * 100;
      bar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   3. UNIVERSAL LOGO REDIRECT (ANY LOGO CLICK ALWAYS LEADS TO INDEX PAGE)
   ========================================================================== */
function initUniversalLogoRedirect() {
  document.addEventListener('click', (e) => {
    // Check if clicked element or its closest ancestor is a logo or logo container
    const isLogo = e.target.matches('img[src*="logoStackly"]') ||
                   e.target.closest('a.nav-brand, a.auth-brand-logo, .error-logo-link, .dash-brand-link, .loader-logo-wrap, a[aria-label*="Homepage"], a[aria-label*="Home"]');
    
    if (isLogo) {
      const isInsidePages = window.location.pathname.toLowerCase().includes('/pages/');
      const targetUrl = isInsidePages ? '../index.html' : 'index.html';
      
      const parentAnchor = e.target.closest('a');
      if (parentAnchor) {
        parentAnchor.setAttribute('href', targetUrl);
      } else {
        e.preventDefault();
        window.location.href = targetUrl;
      }
    }
  });
}

/* ==========================================================================
   4. DYNAMIC GREETING (Timezone & Duration of Day)
   ========================================================================== */
function initDynamicGreetings() {
  const now = new Date();
  const hours = now.getHours();
  let timeOfDay = 'Day';
  let greeting = 'Welcome';

  if (hours >= 4 && hours < 12) {
    timeOfDay = 'Morning';
    greeting = 'Good Morning';
  } else if (hours >= 12 && hours < 17) {
    timeOfDay = 'Afternoon';
    greeting = 'Good Afternoon';
  } else if (hours >= 17 && hours < 22) {
    timeOfDay = 'Evening';
    greeting = 'Good Evening';
  } else {
    timeOfDay = 'Night';
    greeting = 'Good Night';
  }

  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const dashGreeting = document.querySelector('.dash-greeting-text');
  if (dashGreeting) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const name = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || 'Agricultural Partner');
    dashGreeting.textContent = `${greeting}, ${name}!`;
  }

  const dashTimeInfo = document.querySelector('.dash-greeting-time');
  if (dashTimeInfo) {
    dashTimeInfo.textContent = `Local Time: ${timeString} | Agronomy Season: Active Harvest Cycle`;
  }
}

/* ==========================================================================
   5. STICKY NAVBAR & ACTIVE NAV ITEM HIGHLIGHTING
   ========================================================================== */
function initStickyNavbar() {
  const header = document.querySelector('.site-header, .main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('is-scrolled');
      header.style.backgroundColor = 'rgba(9, 30, 19, 0.96)';
      header.style.boxShadow = '0 8px 24px -4px rgba(9, 30, 19, 0.45)';
    } else {
      header.classList.remove('is-scrolled');
      header.style.backgroundColor = 'rgba(9, 30, 19, 0.92)';
      header.style.boxShadow = '0 4px 20px -2px rgba(9, 30, 19, 0.35)';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

function initActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-dropdown-sublink');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.substring(href.lastIndexOf('/') + 1);

    if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.dropdown-menu');
      if (parentDropdown) {
        const parentLink = parentDropdown.previousElementSibling;
        if (parentLink && parentLink.classList.contains('nav-link')) {
          parentLink.classList.add('active');
        }
      }
    }
  });
}

/* ==========================================================================
   6. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!hamburger || !overlay) return;

  const toggleMenu = () => {
    const isOpen = overlay.classList.contains('is-active');
    if (isOpen) {
      overlay.classList.remove('is-active');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('is-active');
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileDropdownTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const list = btn.nextElementSibling;
      if (list && list.classList.contains('mobile-dropdown-list')) {
        list.classList.toggle('open');
      }
    });
  });
}

/* ==========================================================================
   7. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. INTERACTIVE 3D TILT EFFECT FOR CARDS
   ========================================================================== */
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltCards = document.querySelectorAll(
    '[data-tilt], [data-tilt-subtle], .feature-card, .service-card, .produce-card, .team-member-card, .testimonial-card, .pricing-card, .error-card-glass, .auth-card-testimonial, .dash-metric-card'
  );

  tiltCards.forEach(card => {
    const isSubtle = card.hasAttribute('data-tilt-subtle');
    const maxDegree = isSubtle ? 3.5 : 7.0;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = -deltaY * maxDegree;
      const rotateY = deltaX * maxDegree;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   9. FORM VALIDATION UTILITIES & CONTACT FORM
   ========================================================================== */
function initFormValidations() {
  // Real-time digit blocking on name fields (Names must not contain any digits)
  const nameInputs = document.querySelectorAll('#contactName, #signupFirstName, #signupLastName');
  nameInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[0-9]/g, '');
    });
  });

  // Real-time digit restriction and length clamp to exact 10 digits on phone fields
  const phoneInputs = document.querySelectorAll('#contactPhone, #signupPhone');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  });

  // Live character counter for message textareas
  const textareas = document.querySelectorAll('textarea[data-max-chars]');
  textareas.forEach(ta => {
    const max = parseInt(ta.getAttribute('data-max-chars'), 10) || 500;
    const counter = document.getElementById(ta.id + '-counter');
    const updateCount = () => {
      const len = ta.value.length;
      if (counter) {
        counter.textContent = `${len} / ${max} characters`;
      }
    };
    ta.addEventListener('input', updateCount);
    updateCount();
  });

  // Dedicated Contact Form handling: Upon clicking submit immediately reset and redirect to 404
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
}

function handleContactFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  form.reset();
  const counter = document.getElementById('contactMessage-counter');
  if (counter) counter.textContent = '0 / 500 characters';
  
  // Determine relative path to 404.html
  const isInsidePages = window.location.pathname.toLowerCase().includes('/pages/');
  window.location.href = isInsidePages ? '../404.html' : '404.html';
}

function showFieldError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  let errBox = input.parentNode.querySelector('.invalid-feedback');
  if (!errBox) {
    errBox = input.closest('.form-group')?.querySelector('.invalid-feedback');
  }
  if (errBox) {
    errBox.textContent = message;
    errBox.style.display = 'block';
  }
}

function clearFieldError(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  let errBox = input.parentNode.querySelector('.invalid-feedback');
  if (!errBox) {
    errBox = input.closest('.form-group')?.querySelector('.invalid-feedback');
  }
  if (errBox) {
    errBox.textContent = '';
    errBox.style.display = 'none';
  }
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span>${type === 'error' ? '⚠️' : '✅'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  let btn = document.getElementById('back-to-top');

  // Fallback: If button does not already exist in DOM, create and mount it
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'back-to-top';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.title = 'Back to top';
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`;
    document.body.appendChild(btn);
  }

  const toggleVisibility = () => {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPos > 240) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  document.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (document.documentElement.scrollTop > 0) {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (document.body.scrollTop > 0) {
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Global expose
window.showToast = showToast;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.initBackToTop = initBackToTop;
