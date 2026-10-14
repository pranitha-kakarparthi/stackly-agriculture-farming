/**
 * STACKLY AGRICULTURE & FARMING - DASHBOARD ENGINE
 * Provides Independent Role Data, Session Management, Logout,
 * Interactive Action Redirections to 404, and Mobile Drawer Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  verifySession();
  initDashboardUser();
  initSignOut();
  initDashboardActions();
  initDashboardMobileMenu();
  initDashboardSidebarCollapse();
});

/* ==========================================================================
   1. SESSION VERIFICATION
   ========================================================================== */
function verifySession() {
  const loginStatus = localStorage.getItem('loginStatus');
  const currentUser = localStorage.getItem('currentUser');

  if (!loginStatus || loginStatus !== 'true' || !currentUser) {
    // Redirect to login if unauthenticated
    window.location.href = 'sign-in.html';
    return;
  }
}

/* ==========================================================================
   2. POPULATE DASHBOARD USER PROFILE & DYNAMIC TIME
   ========================================================================== */
function initDashboardUser() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const role = localStorage.getItem('role') || user.role || 'Farm Manager';

  // Update DOM Elements
  const nameElements = document.querySelectorAll('.dash-user-name');
  nameElements.forEach(el => {
    el.textContent = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || 'User');
  });

  const roleElements = document.querySelectorAll('.dash-user-role');
  roleElements.forEach(el => {
    el.textContent = role;
  });

  const emailElements = document.querySelectorAll('.dash-user-email');
  emailElements.forEach(el => {
    el.textContent = user.email || 'user@stacklyfarm.com';
  });

  const avatarElements = document.querySelectorAll('.dash-user-avatar');
  avatarElements.forEach(el => {
    if (user.avatar) {
      el.src = user.avatar;
    } else {
      el.src = role === 'Farm Manager' ? '../assets/images/farm-manager-david-chen.webp' : '../assets/images/produce-buyer-dashboard-avatar.webp';
    }
  });

  const lastLoginEl = document.querySelector('.dash-last-login');
  if (lastLoginEl) {
    const d = user.lastLogin ? new Date(user.lastLogin) : new Date();
    lastLoginEl.textContent = `Last Session: ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

/* ==========================================================================
   3. SIGN OUT HANDLER
   ========================================================================== */
function initSignOut() {
  const signOutButtons = document.querySelectorAll('.btn-sign-out');
  signOutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear session state
      localStorage.removeItem('loginStatus');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('role');

      if (window.showToast) {
        window.showToast('You have been logged out securely.', 'info');
      }

      setTimeout(() => {
        window.location.href = 'sign-in.html';
      }, 500);
    });
  });
}

/* ==========================================================================
   4. DASHBOARD ACTION BUTTONS & CONTENT LINKS REDIRECTION TO 404
   ========================================================================== */
function initDashboardActions() {
  // Ensure every link in dashboard content redirects to 404 page
  const contentLinks = document.querySelectorAll('.dashboard-content-body a, .dash-content-body a');
  contentLinks.forEach(link => {
    link.setAttribute('href', '../404.html');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../404.html';
    });
  });

  // Ensure every action button in dashboard content redirects to 404 page
  const actionBtns = document.querySelectorAll(
    '.dash-action-btn, .btn-action-404, .dashboard-content-body button:not(.btn-sign-out):not(.dash-sidebar-collapse-btn), .dash-content-body button:not(.btn-sign-out):not(.dash-sidebar-collapse-btn)'
  );
  actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../404.html';
    });
  });
}

/* ==========================================================================
   6. SIDEBAR COLLAPSE TOGGLE (DESKTOP & MOBILE RESPONSIVE)
   ========================================================================== */
function handleSidebarCollapse() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  const isDrawerOpen = sidebar.classList.contains('mobile-open');
  const isMobileViewport = window.innerWidth <= 992;

  if (isDrawerOpen || isMobileViewport) {
    // If mobile drawer is open or on mobile screen, close/collapse the drawer
    if (window.closeDashboardDrawer) {
      window.closeDashboardDrawer();
    } else {
      sidebar.classList.remove('mobile-open');
      const backdrop = document.querySelector('.dash-sidebar-backdrop');
      const toggleBtn = document.querySelector('.dash-mobile-sidebar-toggle');
      if (toggleBtn) {
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
      if (backdrop) backdrop.classList.remove('active');
      document.documentElement.classList.remove('dash-menu-open');
      document.body.classList.remove('dash-menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
    }
  } else {
    // On desktop, toggle between wide (280px) and compact (82px) modes
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');

    // Update button text and labels
    const collapseBtns = document.querySelectorAll('.dash-sidebar-collapse-btn, .sidebar-collapse-btn');
    collapseBtns.forEach(btn => {
      const label = btn.querySelector('.collapse-label');
      const icon = btn.querySelector('.collapse-icon');
      if (isCollapsed) {
        btn.setAttribute('aria-label', 'Expand Side Menu');
        btn.setAttribute('title', 'Expand Menu');
        if (label) label.textContent = 'Expand';
        if (icon) icon.textContent = '▶';
      } else {
        btn.setAttribute('aria-label', 'Collapse Side Menu');
        btn.setAttribute('title', 'Collapse Menu');
        if (label) label.textContent = 'Collapse';
        if (icon) icon.textContent = '✕';
      }
    });
  }
}

function initDashboardSidebarCollapse() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  // Restore saved state from localStorage ONLY on desktop (>992px)
  if (window.innerWidth > 992) {
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState === 'true') {
      sidebar.classList.add('collapsed');
      const collapseBtns = document.querySelectorAll('.dash-sidebar-collapse-btn, .sidebar-collapse-btn');
      collapseBtns.forEach(btn => {
        const label = btn.querySelector('.collapse-label');
        const icon = btn.querySelector('.collapse-icon');
        btn.setAttribute('aria-label', 'Expand Side Menu');
        btn.setAttribute('title', 'Expand Menu');
        if (label) label.textContent = 'Expand';
        if (icon) icon.textContent = '▶';
      });
    }
  }

  // Delegated click listener ensures collapse buttons always respond
  document.addEventListener('click', (e) => {
    const collapseBtn = e.target.closest('.dash-sidebar-collapse-btn, .sidebar-collapse-btn');
    if (collapseBtn) {
      e.preventDefault();
      e.stopPropagation();
      handleSidebarCollapse();
    }
  });

  // Window resize listener
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      if (window.closeDashboardDrawer) {
        window.closeDashboardDrawer();
      }
      const savedState = localStorage.getItem('sidebar_collapsed');
      if (savedState === 'true') {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    } else {
      sidebar.classList.remove('collapsed');
    }
  });
}

/* ==========================================================================
   7. MOBILE DASHBOARD SIDEBAR TOGGLE & BULLETPROOF STICKY BACKGROUND
   ========================================================================== */
function initDashboardMobileMenu() {
  const toggleBtn = document.querySelector('.dash-mobile-sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  // Create or retrieve backdrop element
  let backdrop = document.querySelector('.dash-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'dash-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  let savedScrollY = 0;

  const openDrawer = () => {
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop;
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('mobile-open');
    if (toggleBtn) {
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    backdrop.classList.add('active');
    document.documentElement.classList.add('dash-menu-open');
    document.body.classList.add('dash-menu-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  const closeDrawer = () => {
    sidebar.classList.remove('mobile-open');
    if (toggleBtn) {
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    backdrop.classList.remove('active');
    document.documentElement.classList.remove('dash-menu-open');
    document.body.classList.remove('dash-menu-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
  };

  // Expose globally
  window.closeDashboardDrawer = closeDrawer;
  window.openDashboardDrawer = openDrawer;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (sidebar.classList.contains('mobile-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  // Close when tapping backdrop
  backdrop.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeDrawer();
    }
  });

  // Close when tapping navigation link on mobile
  const navLinks = sidebar.querySelectorAll('.dash-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeDrawer();
      }
    });
  });
}

