/**
 * Auth Pages Initialization — Smart Study Companion
 * 
 * Handles all auth interactions:
 * - Login form submission → Supabase signIn
 * - Signup form submission → Supabase signUp
 * - Forgot password form → Supabase resetPassword
 * - Reset password form → Supabase updatePassword
 * - Verify page → resend verification
 * - Password toggle, validation rules, loading states
 */
import {
  signIn,
  signUp,
  resetPassword,
  updatePassword,
  resendVerification,
  getSession,
} from '../src/services/auth.js';

// ---- Helpers ----

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LETTER = /[A-Za-z]/;
const NUMBER = /\d/;

function $(id) {
  return document.getElementById(id);
}

function setError(input, message) {
  if (!input) return;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  const describedBy = input.getAttribute('aria-describedby') || '';
  const ids = describedBy.split(/\s+/).filter(Boolean);
  const errorId = ids.find((id) => /-error$/.test(id)) || `${input.id}-error`;
  const slot = document.getElementById(errorId);
  if (slot) slot.textContent = message || '';
}

function showAlert(alertBox, message, isSuccess = false) {
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.removeAttribute('hidden');
  alertBox.classList.add('is-visible');
  alertBox.classList.toggle('is-success', isSuccess);
}

function hideAlert(alertBox) {
  if (!alertBox) return;
  alertBox.textContent = '';
  alertBox.setAttribute('hidden', '');
  alertBox.classList.remove('is-visible', 'is-success');
}

function toast(message) {
  const stack = $('toast-stack') || document.body;
  const note = document.createElement('div');
  note.className = 'toast';
  note.setAttribute('role', 'status');
  note.textContent = message;
  stack.appendChild(note);
  setTimeout(() => note.remove(), 2600);
}

function setLoading(button, loading, loadingText) {
  if (!button) return;
  button.disabled = loading;
  const labelSpan = button.querySelector('.btn-label');
  if (loading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = labelSpan ? labelSpan.textContent : button.textContent;
    }
    const html = `<span class="spinner" aria-hidden="true"></span> ${loadingText || 'Please wait...'}`;
    if (labelSpan) {
      labelSpan.innerHTML = html;
    } else {
      button.innerHTML = html;
    }
  } else {
    const orig = button.dataset.originalText || 'Submit';
    if (labelSpan) {
      labelSpan.textContent = orig;
    } else {
      button.textContent = orig;
    }
  }
}

function passwordRules(value) {
  return {
    length: value.length >= 8,
    letter: LETTER.test(value),
    number: NUMBER.test(value),
  };
}

function passwordValid(value) {
  const rules = passwordRules(value);
  return rules.length && rules.letter && rules.number;
}

function updateRuleDisplay(password) {
  const rules = passwordRules(password);

  // Style 1: <ul id="password-rules"><li data-rule="length">...
  const listItems = document.querySelectorAll('#password-rules [data-rule]');
  listItems.forEach((li) => {
    const ruleKey = li.getAttribute('data-rule');
    const isMet = !!rules[ruleKey];
    li.classList.toggle('is-met', isMet);
    li.classList.toggle('is-fail', password.length > 0 && !isMet);
  });

  // Style 2: <span id="rule-length" class="rule">
  const map = {
    'rule-length': rules.length,
    'rule-letter': rules.letter,
    'rule-number': rules.number,
  };
  Object.keys(map).forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.classList.toggle('is-met', map[id]);
    el.classList.toggle('is-fail', password.length > 0 && !map[id]);
  });
}

// ---- Password Toggle Buttons ----
function initPasswordToggles() {
  document.querySelectorAll('.input-toggle, [data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target') || button.getAttribute('data-toggle-password');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

      const icon = button.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      }
    });
  });
}

// ---- Redirect logged-in user away from auth pages (except reset-password) ----
async function checkExistingSession() {
  try {
    const session = await getSession();
    const isResetPage = window.location.pathname.includes('reset-password');
    if (session && !isResetPage) {
      window.location.href = '../index.html';
    }
  } catch (err) {
    console.warn('Session check error:', err);
  }
}

// ================================================================
// LOGIN PAGE
// ================================================================
function initLogin() {
  const loginForm = $('login-form');
  if (!loginForm) return;

  const emailInput = $('email');
  const passwordInput = $('password');
  const alertBox = $('form-alert');
  const submitBtn = $('login-btn') || loginForm.querySelector('button[type="submit"]');

  [emailInput, passwordInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        setError(input, '');
        hideAlert(alertBox);
      });
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertBox);

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (!email || !EMAIL_PATTERN.test(email)) {
      setError(emailInput, 'Enter a valid student email address.');
      valid = false;
    } else {
      setError(emailInput, '');
    }

    if (!password) {
      setError(passwordInput, 'Enter your password.');
      valid = false;
    } else {
      setError(passwordInput, '');
    }

    if (!valid) {
      showAlert(alertBox, 'Please fix the errors above.');
      return;
    }

    setLoading(submitBtn, true, 'Signing in...');

    const { data, error } = await signIn({ email, password });

    setLoading(submitBtn, false);

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        showAlert(alertBox, 'Please verify your email before signing in. Check your inbox.');
      } else if (error.message.includes('Invalid login credentials')) {
        showAlert(alertBox, 'Invalid email or password. Please try again.');
      } else {
        showAlert(alertBox, error.message);
      }
      return;
    }

    toast('Signed in successfully! Opening dashboard...');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 400);
  });
}

// ================================================================
// SIGNUP PAGE
// ================================================================
function initSignup() {
  const signupForm = $('signup-form');
  if (!signupForm) return;

  const nameInput = $('fullname') || $('name');
  const emailInput = $('email');
  const passwordInput = $('password');
  const confirmInput = $('confirm-password') || $('confirm');
  const termsCheckbox = $('terms');
  const alertBox = $('form-alert');
  const submitBtn = $('signup-btn') || signupForm.querySelector('button[type="submit"]');

  if (passwordInput) {
    ['input', 'change'].forEach((ev) => {
      passwordInput.addEventListener(ev, () => {
        updateRuleDisplay(passwordInput.value);
        setError(passwordInput, '');
      });
    });
  }

  [nameInput, emailInput, confirmInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        setError(input, '');
        hideAlert(alertBox);
      });
    }
  });

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertBox);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    let valid = true;

    if (!name || name.length < 2) {
      setError(nameInput, 'Enter your full name (at least 2 characters).');
      valid = false;
    } else {
      setError(nameInput, '');
    }

    if (!email || !EMAIL_PATTERN.test(email)) {
      setError(emailInput, 'Enter a valid student email address.');
      valid = false;
    } else {
      setError(emailInput, '');
    }

    if (!passwordValid(password)) {
      setError(passwordInput, 'Must be 8+ characters with a letter and a number.');
      valid = false;
    } else {
      setError(passwordInput, '');
    }

    if (!confirm || confirm !== password) {
      setError(confirmInput, 'Passwords do not match.');
      valid = false;
    } else {
      setError(confirmInput, '');
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      const termsError = $('terms-error');
      if (termsError) termsError.textContent = 'You must accept the terms to continue.';
      showAlert(alertBox, 'Please agree to the draft Terms and Privacy Policy.');
      valid = false;
    } else {
      const termsError = $('terms-error');
      if (termsError) termsError.textContent = '';
    }

    updateRuleDisplay(password);

    if (!valid) {
      showAlert(alertBox, 'Please complete all required fields.');
      return;
    }

    setLoading(submitBtn, true, 'Creating account...');

    const { data, error } = await signUp({
      email,
      password,
      fullName: name,
    });

    setLoading(submitBtn, false);

    if (error) {
      showAlert(alertBox, error.message);
      return;
    }

    // Check if account already exists
    if (data?.user?.identities?.length === 0) {
      showAlert(alertBox, 'An account with this email already exists. Try signing in.');
      return;
    }

    toast('Account created! Please check your email.');
    setTimeout(() => {
      window.location.href = `verify.html?email=${encodeURIComponent(email)}`;
    }, 600);
  });
}

// ================================================================
// VERIFY PAGE
// ================================================================
function initVerify() {
  const verifyEmail = $('verify-email');
  const resendBtn = $('resend-btn') || $('resend-expired-btn');
  if (!verifyEmail && !resendBtn) return;

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';
  if (verifyEmail && email) {
    verifyEmail.textContent = email;
  }

  // Check URL hash for error conditions (e.g. #error=access_denied&error_code=otp_expired)
  const hash = window.location.hash;
  if (hash.includes('error=') || hash.includes('expired')) {
    const expiredState = $('verify-expired');
    const defaultState = $('verify-default');
    if (expiredState && defaultState) {
      defaultState.hidden = true;
      expiredState.hidden = false;
    }
  }

  const handleResend = async (btn) => {
    if (!email) {
      toast('No email found. Please sign up or sign in first.');
      return;
    }

    setLoading(btn, true, 'Sending email...');
    const { error } = await resendVerification(email);
    setLoading(btn, false);

    if (error) {
      toast(`Could not resend: ${error.message}`);
    } else {
      const successState = $('verify-success');
      const defaultState = $('verify-default');
      const expiredState = $('verify-expired');
      if (defaultState) defaultState.hidden = true;
      if (expiredState) expiredState.hidden = true;
      if (successState) successState.hidden = false;
      toast('Verification link resent! Check your inbox.');
    }
  };

  const b1 = $('resend-btn');
  const b2 = $('resend-expired-btn');
  if (b1) b1.addEventListener('click', () => handleResend(b1));
  if (b2) b2.addEventListener('click', () => handleResend(b2));
}

// ================================================================
// FORGOT PASSWORD PAGE
// ================================================================
function initForgotPassword() {
  const forgotForm = $('forgot-form');
  if (!forgotForm) return;

  const emailInput = $('email');
  const alertBox = $('form-alert');
  const submitBtn = $('forgot-btn') || forgotForm.querySelector('button[type="submit"]');

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      setError(emailInput, '');
      hideAlert(alertBox);
    });
  }

  forgotForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertBox);

    const email = emailInput.value.trim();
    if (!email || !EMAIL_PATTERN.test(email)) {
      setError(emailInput, 'Enter a valid student email address.');
      showAlert(alertBox, 'Enter a valid student email.');
      return;
    }

    setLoading(submitBtn, true, 'Sending link...');
    const { error } = await resetPassword(email);
    setLoading(submitBtn, false);

    if (error) {
      showAlert(alertBox, error.message);
      return;
    }

    const requestState = $('forgot-request');
    const successState = $('forgot-success');
    const emailDisplay = $('forgot-email-display');

    if (emailDisplay) emailDisplay.textContent = email;
    if (requestState) requestState.hidden = true;
    if (successState) successState.hidden = false;

    toast('Password reset link sent! Check your inbox.');
  });
}

// ================================================================
// RESET PASSWORD PAGE
// ================================================================
function initResetPassword() {
  const resetForm = $('reset-form');
  if (!resetForm) return;

  const passwordInput = $('password') || $('new-password');
  const confirmInput = $('confirm-password') || $('confirm');
  const alertBox = $('form-alert');
  const submitBtn = $('reset-btn') || resetForm.querySelector('button[type="submit"]');

  if (passwordInput) {
    ['input', 'change'].forEach((ev) => {
      passwordInput.addEventListener(ev, () => {
        updateRuleDisplay(passwordInput.value);
        setError(passwordInput, '');
      });
    });
  }

  if (confirmInput) {
    confirmInput.addEventListener('input', () => {
      setError(confirmInput, '');
      hideAlert(alertBox);
    });
  }

  resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertBox);

    const password = passwordInput.value;
    const confirm = confirmInput.value;
    let valid = true;

    if (!passwordValid(password)) {
      setError(passwordInput, 'Must be 8+ characters with a letter and a number.');
      valid = false;
    } else {
      setError(passwordInput, '');
    }

    if (!confirm || confirm !== password) {
      setError(confirmInput, 'Passwords do not match.');
      valid = false;
    } else {
      setError(confirmInput, '');
    }

    updateRuleDisplay(password);

    if (!valid) {
      showAlert(alertBox, 'Please complete all required fields.');
      return;
    }

    setLoading(submitBtn, true, 'Updating password...');
    const { error } = await updatePassword(password);
    setLoading(submitBtn, false);

    if (error) {
      showAlert(alertBox, error.message);
      return;
    }

    const formState = $('reset-form-state');
    const successState = $('reset-success');

    if (formState) formState.hidden = true;
    if (successState) successState.hidden = false;

    toast('Password updated! Redirecting to sign in...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  });
}

// ---- Main bootstrap ----
document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  checkExistingSession();
  initLogin();
  initSignup();
  initVerify();
  initForgotPassword();
  initResetPassword();
});
