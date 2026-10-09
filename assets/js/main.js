/**
 * STACKLY AGRICULTURE & FARMING - CORE JAVASCRIPT
 * Handles Loader, Sticky Nav, Mobile Menu & Scroll Lock, Dynamic Greetings,
 * 3D Tilt Animations, Scroll Reveal, Form Validations & UI Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initDynamicGreetings();
  initStickyNavbar();
  initActiveNav();
  initMobileNav();
  initScrollAnimations();
  initCardTilt();
  initFormValidations();
});

/* ==========================================================================
   1. FULL VIEWPORT PRELOADER
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('app-loader');
  if (!loader) return;

  const dismissLoader = () => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.remove();
    }, 550);
  };

  // Immediate dismissal when interactive, with safety fallback
  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader);
    setTimeout(dismissLoader, 1200); // safety fallback
  }
}

/* ==========================================================================
   2. DYNAMIC GREETING (Timezone & Duration of Day)
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

  // Format local time
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // Update top bar ticker if present
  const ticker = document.querySelector('.greeting-ticker');
  if (ticker) {
    ticker.innerHTML = `<span class="ticker-dot"></span> ${greeting} &bull; Farm Operations Active (${timeString} &bull; ${dateString})`;
  }

  // Update dashboard greetings if present
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
   3. STICKY NAVBAR & ACTIVE NAV ITEM HIGHLIGHTING
   ========================================================================== */
function initStickyNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-sticky');
      header.style.boxShadow = '0 6px 24px rgba(0,0,0,0.25)';
    } else {
      header.classList.remove('is-sticky');
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
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
      // If inside a dropdown, highlight parent nav-link too
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
   4. MOBILE NAVIGATION & BODY SCROLL LOCK
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!hamburger || !overlay) return;

  const toggleMenu = () => {
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('scroll-locked');
    } else {
      overlay.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('scroll-locked');
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close when clicking mobile dropdown triggers or links
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
   5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. 3D TILT EFFECT FOR CARDS
   ========================================================================== */
function initCardTilt() {
  // If user prefers reduced motion, disable tilt
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.tilt-card, .feature-card, .service-card, .kpi-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = -deltaY * 6; // max 6 deg
      const rotateY = deltaX * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   7. FORM VALIDATION UTILITIES & CONTACT FORM
   ========================================================================== */
function initFormValidations() {
  // Real-time digit blocking on name fields
  const nameInputs = document.querySelectorAll('#contactName, #signupFirstName, #signupLastName');
  nameInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[0-9]/g, '');
    });
  });

  // Real-time digit restriction and length clamp on phone fields
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
function showFieldError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  let errBox = input.parentNode.querySelector('.invalid-feedback');
  if (!errBox) {
    errBox = input.closest('.form-group')?.querySelector('.invalid-feedback');
  }
  if (errBox) {
    errBox.textContent = message;
    errBox.classList.add('show');
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
    errBox.classList.remove('show');
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
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

// Global expose
window.showToast = showToast;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;

