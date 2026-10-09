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
   4. DASHBOARD ACTION BUTTONS REDIRECTION TO 404
   ========================================================================== */
function initDashboardActions() {
  const actionBtns = document.querySelectorAll('.dash-action-btn, .btn-action-404');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../404.html';
    });
  });
}

/* ==========================================================================
   5. MOBILE DASHBOARD SIDEBAR TOGGLE
   ========================================================================== */
function initDashboardMobileMenu() {
  const toggleBtn = document.querySelector('.dash-mobile-sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    if (sidebar.classList.contains('mobile-open')) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
  });
}

