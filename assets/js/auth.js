/**
 * STACKLY AGRICULTURE & FARMING - AUTHENTICATION & STORAGE ENGINE
 * Handles Session Persistence, Strict Validation, Password Requirements,
 * Dynamic Role Dashboards, and Digit-Free Name Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initRealtimeInputRestrictions();
  initPasswordToggles();
  initPasswordStrengthMeter();
  initSignInForm();
  initSignUpForm();
});

/* ==========================================================================
   1. REAL-TIME INPUT RESTRICTIONS
   ========================================================================== */
function initRealtimeInputRestrictions() {
  // Strip digits from all name fields in real-time
  const nameInputs = document.querySelectorAll('#contactName, #signupFirstName, #signupLastName');
  nameInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[0-9]/g, '');
    });
  });

  // Clamp mobile numbers to max 10 digits only
  const phoneInputs = document.querySelectorAll('#contactPhone, #signupPhone');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  });
}

/* ==========================================================================
   2. PASSWORD TOGGLE VISIBILITY
   ========================================================================== */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.btn-password-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '👁️';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        btn.innerHTML = '👁️‍🗨️';
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });
}

/* ==========================================================================
   3. PASSWORD STRENGTH METER & REQUIREMENT VERIFIER
   ========================================================================== */
function initPasswordStrengthMeter() {
  const passwordInput = document.getElementById('signupPassword');
  const strengthBar = document.getElementById('passwordStrengthFill');
  const strengthText = document.getElementById('passwordStrengthText');
  if (!passwordInput || !strengthBar || !strengthText) return;

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const score = calculatePasswordStrength(val);

    let width = '0%';
    let color = '#E0E0E0';
    let label = 'Requires: 8+ chars, upper, lower, number, special symbol';

    if (val.length === 0) {
      width = '0%';
      label = 'Requires: 8+ chars, upper, lower, number, special symbol';
    } else if (score <= 2) {
      width = '25%';
      color = '#D32F2F'; // Danger red
      label = 'Weak (Needs upper, lower, numbers & symbol)';
    } else if (score === 3) {
      width = '55%';
      color = '#ED6C02'; // Warning orange
      label = 'Fair (Add missing symbols or length)';
    } else if (score === 4) {
      width = '80%';
      color = '#2E7D32'; // Good green
      label = 'Good password';
    } else {
      width = '100%';
      color = '#1B4332'; // Strong forest green
      label = 'Strong & Secure!';
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = label;
  });
}

function calculatePasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

/* ==========================================================================
   4. SIGN IN FORM HANDLING (ANY VALID EMAIL & PASSWORD ACCEPTED)
   ========================================================================== */
function initSignInForm() {
  const form = document.getElementById('signInForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalid = null;

    const emailEl = document.getElementById('signinEmail');
    const pwdEl = document.getElementById('signinPassword');
    const roleEl = document.getElementById('signinRole');

    // Email validation
    const emailVal = emailEl.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      window.showFieldError(emailEl, 'Please enter a valid email address (e.g. name@domain.com).');
      isValid = false;
      if (!firstInvalid) firstInvalid = emailEl;
    } else {
      window.clearFieldError(emailEl);
    }

    // Password validation: Must meet complexity requirements
    const pwdVal = pwdEl.value;
    const pwdScore = calculatePasswordStrength(pwdVal);
    if (pwdVal.length < 8 || pwdScore < 4) {
      window.showFieldError(pwdEl, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      isValid = false;
      if (!firstInvalid) firstInvalid = pwdEl;
    } else {
      window.clearFieldError(pwdEl);
    }

    // Role validation
    const roleVal = roleEl.value;
    if (!roleVal) {
      window.showFieldError(roleEl, 'Please select your role (Farm Manager or Produce Buyer).');
      isValid = false;
      if (!firstInvalid) firstInvalid = roleEl;
    } else {
      window.clearFieldError(roleEl);
    }

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      window.showToast('Please correct form validation errors.', 'error');
      return;
    }

    // Anyone with any valid email and password can log in
    const nameParts = emailVal.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim().split(/\s+/);
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Agricultural';
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Partner';

    const user = {
      username: emailVal.split('@')[0],
      firstName: firstName,
      lastName: lastName,
      email: emailVal,
      role: roleVal,
      avatar: roleVal === 'Farm Manager' ? '../assets/images/farm-manager-david-chen.webp' : '../assets/images/produce-buyer-dashboard-avatar.webp',
      lastLogin: new Date().toISOString()
    };

    // Persist session
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('role', roleVal);
    localStorage.setItem('loginStatus', 'true');

    window.showToast(`Welcome, ${user.firstName}! Loading ${roleVal} Dashboard...`, 'success');

    // Route to appropriate dedicated role dashboard
    setTimeout(() => {
      if (roleVal === 'Farm Manager') {
        window.location.href = 'dashboard-farm-manager.html';
      } else {
        window.location.href = 'dashboard-produce-buyer.html';
      }
    }, 600);
  });
}

/* ==========================================================================
   5. SIGN UP FORM HANDLING
   ========================================================================== */
function initSignUpForm() {
  const form = document.getElementById('signUpForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalid = null;

    const usernameEl = document.getElementById('signupUsername');
    const firstNameEl = document.getElementById('signupFirstName');
    const lastNameEl = document.getElementById('signupLastName');
    const emailEl = document.getElementById('signupEmail');
    const phoneEl = document.getElementById('signupPhone');
    const phoneCodeEl = document.getElementById('signupPhoneCode');
    const roleEl = document.getElementById('signupRole');
    const pwdEl = document.getElementById('signupPassword');
    const confirmPwdEl = document.getElementById('signupConfirmPassword');
    const termsEl = document.getElementById('signupTerms');
    const countryEl = document.getElementById('signupCountry');
    const addressEl = document.getElementById('signupAddress');

    const alphaRegex = /^[A-Za-z\s]+$/;

    // 1. Username (optional or min 3 chars, letters/nums)
    if (usernameEl && usernameEl.value.trim()) {
      const uVal = usernameEl.value.trim();
      if (uVal.length < 3) {
        window.showFieldError(usernameEl, 'Username must be at least 3 characters.');
        isValid = false;
        if (!firstInvalid) firstInvalid = usernameEl;
      } else {
        window.clearFieldError(usernameEl);
      }
    }

    // 2. First Name: Mandatory, Alphabets only (NO DIGITS)
    const fNameVal = firstNameEl.value.trim();
    if (!fNameVal || !alphaRegex.test(fNameVal) || /[0-9]/.test(fNameVal)) {
      window.showFieldError(firstNameEl, 'First name must contain only alphabets (digits are strictly not accepted).');
      isValid = false;
      if (!firstInvalid) firstInvalid = firstNameEl;
    } else {
      window.clearFieldError(firstNameEl);
    }

    // 3. Last Name: Mandatory, Alphabets only (NO DIGITS)
    const lNameVal = lastNameEl.value.trim();
    if (!lNameVal || !alphaRegex.test(lNameVal) || /[0-9]/.test(lNameVal)) {
      window.showFieldError(lastNameEl, 'Last name must contain only alphabets (digits are strictly not accepted).');
      isValid = false;
      if (!firstInvalid) firstInvalid = lastNameEl;
    } else {
      window.clearFieldError(lastNameEl);
    }

    // 4. Email: Mandatory, valid format
    const emailVal = emailEl.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      window.showFieldError(emailEl, 'Please enter a valid corporate or farm email address.');
      isValid = false;
      if (!firstInvalid) firstInvalid = emailEl;
    } else {
      window.clearFieldError(emailEl);
    }

    // 5. Mobile Number: Mandatory, exact 10 digits
    const phoneVal = phoneEl.value.trim().replace(/\D/g, '');
    if (phoneVal.length !== 10) {
      window.showFieldError(phoneEl, 'Mobile phone number must have exact length of 10 digits.');
      isValid = false;
      if (!firstInvalid) firstInvalid = phoneEl;
    } else {
      window.clearFieldError(phoneEl);
    }

    // 6. Role: Mandatory (Farm Manager or Produce Buyer)
    const roleVal = roleEl.value;
    if (!roleVal) {
      window.showFieldError(roleEl, 'Please select your role.');
      isValid = false;
      if (!firstInvalid) firstInvalid = roleEl;
    } else {
      window.clearFieldError(roleEl);
    }

    // 7. Password: Mandatory, complex meeting standard requirements
    const pwdVal = pwdEl.value;
    const pwdScore = calculatePasswordStrength(pwdVal);
    if (pwdVal.length < 8 || pwdScore < 4) {
      window.showFieldError(pwdEl, 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.');
      isValid = false;
      if (!firstInvalid) firstInvalid = pwdEl;
    } else {
      window.clearFieldError(pwdEl);
    }

    // 8. Confirm Password: Must match
    const confirmVal = confirmPwdEl.value;
    if (confirmVal !== pwdVal) {
      window.showFieldError(confirmPwdEl, 'Passwords do not match.');
      isValid = false;
      if (!firstInvalid) firstInvalid = confirmPwdEl;
    } else {
      window.clearFieldError(confirmPwdEl);
    }

    // 9. Terms and Conditions: Mandatory
    if (!termsEl.checked) {
      window.showFieldError(termsEl, 'You must agree to the Terms of Use and Privacy Policy to register.');
      isValid = false;
      if (!firstInvalid) firstInvalid = termsEl;
    } else {
      window.clearFieldError(termsEl);
    }

    // Address length check if provided
    if (addressEl && addressEl.value.trim() && addressEl.value.trim().length < 5) {
      window.showFieldError(addressEl, 'Address must be at least 5 characters if specified.');
      isValid = false;
      if (!firstInvalid) firstInvalid = addressEl;
    } else if (addressEl) {
      window.clearFieldError(addressEl);
    }

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      window.showToast('Please fix all form validation errors.', 'error');
      return;
    }

    // Register user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      username: usernameEl && usernameEl.value.trim() ? usernameEl.value.trim() : fNameVal.toLowerCase() + '_' + phoneVal.slice(-4),
      firstName: fNameVal,
      lastName: lNameVal,
      email: emailVal,
      phone: phoneVal,
      phoneCode: phoneCodeEl ? phoneCodeEl.value : '+91',
      password: pwdVal,
      role: roleVal,
      country: countryEl ? countryEl.value : 'India',
      address: addressEl ? addressEl.value.trim() : '',
      avatar: roleVal === 'Farm Manager' ? '../assets/images/farm-manager-david-chen.webp' : '../assets/images/produce-buyer-dashboard-avatar.webp',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    window.showToast('Registration successful! Redirecting to sign in...', 'success');
    setTimeout(() => {
      window.location.href = 'sign-in.html';
    }, 1000);
  });
}
