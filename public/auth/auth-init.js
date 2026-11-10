/**
 * Auth Pages Initialization — Smart Study Companion
 * 
 * Handles all auth interactions:
 * - Login form submission -> Supabase signIn with onboarding routing
 * - Signup form submission -> Supabase signUp with onboarding routing
 * - Forgot password form -> Supabase resetPassword with link/OTP support
 * - Reset password form -> Supabase verifyOtp + updatePassword (dual link/code recovery)
 * - Verify page -> session auto-detection and resend verification
 * - Password toggle, validation rules, loading states
 */
import {
  signIn,
  signUp,
  resetPassword,
  verifyOtp,
  updatePassword,
  resendVerification,
  getSession,
  onAuthStateChange,
} from '../src/services/auth.js';
import { getProfile } from '../src/services/profile.js';
import { universitiesFor, COUNTRIES } from '../src/lib/academic-catalog.js';

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

  const listItems = document.querySelectorAll('#password-rules [data-rule]');
  listItems.forEach((li) => {
    const ruleKey = li.getAttribute('data-rule');
    const isMet = !!rules[ruleKey];
    li.classList.toggle('is-met', isMet);
    li.classList.toggle('is-fail', password.length > 0 && !isMet);
  });

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

// ---- Helper to extract auth errors from URL query or hash ----
function getUrlAuthError() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashStr = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  const hashParams = new URLSearchParams(hashStr);
  const desc = searchParams.get('error_description') || hashParams.get('error_description');
  const code = searchParams.get('error_code') || hashParams.get('error_code');
  const err = searchParams.get('error') || hashParams.get('error');
  if (!desc && !err) return null;
  return { code: code || err || 'auth_error', message: desc || err };
}

// ---- Route authenticated user into app based on onboarding status ----
async function routeAuthenticatedUser(userId) {
  try {
    const { data: profile } = await getProfile(userId);
    if (profile && profile.onboarding_completed) {
      window.location.href = '../index.html#dashboard';
    } else {
      window.location.href = '../index.html#subjects';
    }
  } catch (_) {
    window.location.href = '../index.html#subjects';
  }
}

// ---- Redirect logged-in user away from auth pages (except reset-password) ----
async function checkExistingSession() {
  try {
    const urlError = getUrlAuthError();
    if (urlError) return; // Keep user on page so error alert can be displayed
    const session = await getSession();
    const isResetPage = window.location.pathname.includes('reset-password');
    if (session && !isResetPage) {
      await routeAuthenticatedUser(session.user.id);
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
  const unconfirmedBox = $('unconfirmed-actions');
  const resendBtn = $('login-resend-btn');
  const verifyLink = $('login-verify-link');
  const submitBtn = $('login-btn') || loginForm.querySelector('button[type="submit"]');

  // Handle redirects from signup, email verification links, or password reset
  const params = new URLSearchParams(window.location.search);
  const registered = params.get('registered');
  const registeredEmail = params.get('email');
  const resetParam = params.get('reset');
  const urlError = getUrlAuthError();

  if (emailInput && registeredEmail) {
    emailInput.value = registeredEmail;
  }

  // Listen for email link / PKCE completion so verified link users enter smoothly
  onAuthStateChange((event, session) => {
    if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
      toast('Email verified! Opening your study dashboard...');
      routeAuthenticatedUser(session.user.id);
    }
  });

  if (urlError) {
    const friendlyMsg = urlError.message.toLowerCase().includes('expired')
      ? 'This email verification link has expired or was already used. Enter your email below to sign in or resend a fresh link.'
      : `Verification link error: ${urlError.message}`;
    showAlert(alertBox, friendlyMsg);
    if (unconfirmedBox) unconfirmedBox.hidden = false;
  } else if (registered === 'verify') {
    showAlert(
      alertBox,
      'Registration successful! Please check your email to verify your account before logging in.',
      true
    );
  } else if (registered === 'true') {
    showAlert(
      alertBox,
      'Account created successfully! Please sign in with your email and password.',
      true
    );
    if (passwordInput) passwordInput.focus();
  } else if (resetParam === 'true') {
    showAlert(
      alertBox,
      'Password updated successfully! Please sign in with your new password.',
      true
    );
    if (passwordInput) passwordInput.focus();
  }

  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      const targetEmail = (emailInput?.value || registeredEmail || '').trim();
      if (!targetEmail || !EMAIL_PATTERN.test(targetEmail)) {
        setError(emailInput, 'Enter your registered email address first.');
        showAlert(alertBox, 'Please enter your email address above, then click Resend.');
        if (emailInput) emailInput.focus();
        return;
      }
      resendBtn.disabled = true;
      const origHtml = resendBtn.innerHTML;
      resendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
      const { error } = await resendVerification(targetEmail);
      if (error) {
        if (error.message && error.message.toLowerCase().includes('rate limit')) {
          showAlert(alertBox, 'Email rate limit reached (~3-4 emails/hour). Please wait a few minutes or disable "Confirm email" in Supabase for instant testing.');
        } else {
          showAlert(alertBox, error.message || 'Could not resend verification email.');
        }
        resendBtn.disabled = false;
        resendBtn.innerHTML = origHtml;
      } else {
        showAlert(alertBox, `Fresh verification email sent to ${targetEmail}. Check your inbox (and spam folder).`, true);
        toast('Verification email resent!');
        let wait = 60;
        const timer = setInterval(() => {
          wait--;
          if (wait <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.innerHTML = origHtml;
          } else {
            resendBtn.innerHTML = `<i class="fa-solid fa-clock" aria-hidden="true"></i> Resend (${wait}s)`;
          }
        }, 1000);
      }
    });
  }

  [emailInput, passwordInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        setError(input, '');
        hideAlert(alertBox);
        if (unconfirmedBox) unconfirmedBox.hidden = true;
      });
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertBox);
    if (unconfirmedBox) unconfirmedBox.hidden = true;

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
        showAlert(alertBox, 'Please verify your email before signing in. Check your inbox or click Resend below.');
        if (verifyLink) verifyLink.href = `verify.html?email=${encodeURIComponent(email)}`;
        if (unconfirmedBox) unconfirmedBox.hidden = false;
      } else if (error.message.includes('Invalid login credentials')) {
        showAlert(alertBox, 'Invalid email or password. Please try again.');
      } else {
        showAlert(alertBox, error.message);
      }
      return;
    }

    toast('Signed in successfully! Opening application...');
    setTimeout(() => routeAuthenticatedUser(data.user.id), 400);
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
  const countryInput = $('country');
  const universityInput = $('university');
  const passwordInput = $('password');
  const confirmInput = $('confirm-password') || $('confirm');
  const termsCheckbox = $('terms');
  const alertBox = $('form-alert');
  const submitBtn = $('signup-btn') || signupForm.querySelector('button[type="submit"]');

  if (countryInput) {
    // Populate countries dynamically if select is basic
    if (countryInput.options.length <= 3) {
      const currentVal = countryInput.value;
      countryInput.innerHTML =
        '<option value="">Select your region or country</option>' +
        COUNTRIES.map((c) => `<option value="${c}">${c}</option>`).join('');
      if (currentVal) countryInput.value = currentVal;
    }
  }

  if (countryInput && universityInput) {
    const updateUniversities = () => {
      const prevUni = universityInput.value;
      const universities = universitiesFor(countryInput.value);
      universityInput.innerHTML =
        '<option value="">Select your university or college</option>' +
        universities.map((name) => `<option value="${name}">${name}</option>`).join('');
      if (prevUni && universities.includes(prevUni)) {
        universityInput.value = prevUni;
      }
      setError(countryInput, '');
      setError(universityInput, '');
    };

    countryInput.addEventListener('change', updateUniversities);
    universityInput.addEventListener('change', () => setError(universityInput, ''));
    updateUniversities();
  }

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

  let isSubmitting = false;

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    hideAlert(alertBox);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const country = countryInput?.value || '';
    const university = universityInput?.value || '';
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

    if (!country) {
      setError(countryInput, 'Select your region or country.');
      valid = false;
    } else {
      setError(countryInput, '');
    }

    if (!university) {
      setError(universityInput, 'Select your university or college.');
      valid = false;
    } else {
      setError(universityInput, '');
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

    isSubmitting = true;
    setLoading(submitBtn, true, 'Creating account...');

    try {
      const { data, error } = await signUp({
        email,
        password,
        fullName: name,
        country,
        university,
      });

      setLoading(submitBtn, false);

      if (error) {
        isSubmitting = false;
        if (error.message && error.message.toLowerCase().includes('rate limit')) {
          showAlert(
            alertBox,
            'Email rate limit reached (Supabase limits test emails to ~3-4 per hour). Please wait a few minutes, disable "Confirm email" in Supabase for unlimited instant testing, or add custom SMTP.'
          );
        } else {
          showAlert(alertBox, error.message);
        }
        return;
      }

      // Check if account already exists
      if (data?.user?.identities?.length === 0) {
        isSubmitting = false;
        showAlert(alertBox, 'An account with this email already exists. Try signing in.');
        return;
      }

      // Problem 1 Fix: Signup must always navigate to the Login page.
      // The user must explicitly enter their credentials to enter the application.
      const signupFormEl = $('signup-form');
      const successCard = $('signup-success');
      const nameDisplay = $('signup-name-display');
      const emailDisplay = $('signup-email-display');
      const infoTitle = $('signup-info-title');
      const infoText = $('signup-info-text');
      const footerText = $('signup-footer-text');
      const loginBtn = $('signup-login-btn');
      const verifyBtn = $('signup-verify-btn');

      if (successCard && signupFormEl) {
        const needsVerification = data?.emailConfirmed === false;
        if (nameDisplay) nameDisplay.textContent = name;
        if (emailDisplay) emailDisplay.textContent = email;
        const targetUrl = needsVerification
          ? `login.html?registered=verify&email=${encodeURIComponent(email)}`
          : `login.html?registered=true&email=${encodeURIComponent(email)}`;
        if (loginBtn) loginBtn.href = targetUrl;
        if (verifyBtn) {
          verifyBtn.href = `verify.html?email=${encodeURIComponent(email)}`;
          verifyBtn.hidden = !needsVerification;
        }
        if (infoTitle && infoText) {
          if (needsVerification) {
            infoTitle.innerHTML = '<i class="fa-solid fa-envelope-circle-check" aria-hidden="true"></i> Welcome &amp; Confirmation Email Sent';
            infoText.innerHTML = `We dispatched an account confirmation message to <strong>${email}</strong>. Please check your inbox (and spam folder) for your verification link or code.`;
          } else {
            infoTitle.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Account Active &amp; Ready';
            infoText.innerHTML = `Your student account for <strong>${email}</strong> is ready right now! Click <strong>Proceed to Sign In</strong> to log in with your email and password.`;
          }
        }
        signupFormEl.hidden = true;
        if (footerText) footerText.hidden = true;
        successCard.hidden = false;
        if (needsVerification) {
          toast('Registration successful! Please check your email to verify your account.');
        } else {
          toast('Account created successfully! Please sign in with your credentials.');
        }
        // Auto-redirect to login after 6 seconds if user doesn't click
        setTimeout(() => {
          window.location.href = `login.html?registered=${needsVerification ? 'verify' : 'true'}&email=${encodeURIComponent(email)}`;
        }, 6000);
      } else {
        if (data?.emailConfirmed === false) {
          toast('Registration successful! Please check your email to verify your account before logging in.');
          setTimeout(() => {
            window.location.href = `login.html?registered=verify&email=${encodeURIComponent(email)}`;
          }, 500);
        } else {
          toast('Account created successfully! Please sign in with your credentials.');
          setTimeout(() => {
            window.location.href = `login.html?registered=true&email=${encodeURIComponent(email)}`;
          }, 500);
        }
      }
    } catch (err) {
      isSubmitting = false;
      setLoading(submitBtn, false);
      showAlert(alertBox, err.message || 'Signup failed. Please try again.');
    }
  });
}

// ================================================================
// VERIFY PAGE
// ================================================================
function initVerify() {
  const verifyEmail = $('verify-email');
  const verifyEmailInput = $('verify-email-input');
  const verifyEmailGroup = $('verify-email-group');
  const resendBtn = $('resend-btn') || $('resend-expired-btn');
  if (!verifyEmail && !resendBtn) return;

  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';
  if (verifyEmail && email) {
    verifyEmail.textContent = email;
  }
  if (verifyEmailInput) {
    if (email) {
      verifyEmailInput.value = email;
      if (verifyEmailGroup) verifyEmailGroup.style.display = 'none';
    }
    verifyEmailInput.addEventListener('input', () => setError(verifyEmailInput, ''));
  }

  // Check URL hash or query for error conditions
  const urlError = getUrlAuthError();
  if (urlError || window.location.hash.includes('expired')) {
    const expiredState = $('verify-expired');
    const defaultState = $('verify-default');
    if (expiredState && defaultState) {
      defaultState.hidden = true;
      expiredState.hidden = false;
    }
  }

  // Auto-detect verified session from email link or auth event
  const checkVerifiedSession = async () => {
    try {
      const session = await getSession();
      if (session) {
        const defaultState = $('verify-default');
        const expiredState = $('verify-expired');
        const successState = $('verify-success');
        if (defaultState) defaultState.hidden = true;
        if (expiredState) expiredState.hidden = true;
        if (successState) {
          successState.hidden = false;
          successState.innerHTML = `
            <div class="verify-icon verify-icon-success" aria-hidden="true">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <p class="auth-status-text auth-status-success">Email confirmed! Redirecting to study setup...</p>
          `;
        }
        toast('Email verified! Opening application...');
        setTimeout(() => routeAuthenticatedUser(session.user.id), 1000);
      }
    } catch (_) {}
  };

  checkVerifiedSession();
  onAuthStateChange((event, session) => {
    if (session) checkVerifiedSession();
  });

  const handleResend = async (btn) => {
    const targetEmail = (verifyEmailInput?.value || email || '').trim();
    if (!targetEmail || !EMAIL_PATTERN.test(targetEmail)) {
      if (verifyEmailInput && verifyEmailGroup) {
        verifyEmailGroup.style.display = '';
        setError(verifyEmailInput, 'Enter your registered email address first.');
        verifyEmailInput.focus();
      }
      toast('Enter your registered email to resend the verification email.');
      return;
    }

    setLoading(btn, true, 'Sending email...');
    const { error } = await resendVerification(targetEmail);
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

  // 6-digit PIN verification handler for signup confirmation
  const verifyCodeForm = $('verify-code-form');
  const verifyTokenInput = $('verify-token');
  if (verifyCodeForm && verifyTokenInput) {
    verifyTokenInput.addEventListener('input', () => {
      setError(verifyTokenInput, '');
    });

    verifyCodeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetEmail = (verifyEmailInput?.value || email || '').trim();
      if (!targetEmail || !EMAIL_PATTERN.test(targetEmail)) {
        if (verifyEmailGroup) verifyEmailGroup.style.display = '';
        setError(verifyEmailInput, 'Enter your registered student email address.');
        return;
      }

      const cleanToken = verifyTokenInput.value.trim().replace(/\D/g, '');
      if (!cleanToken || cleanToken.length < 6) {
        setError(verifyTokenInput, 'Enter the 6-digit confirmation PIN from your email.');
        return;
      }

      const tokenBtn = $('verify-token-btn');
      setLoading(tokenBtn, true, 'Confirming PIN...');
      let { data, error } = await verifyOtp({
        email: targetEmail,
        token: cleanToken,
        type: 'signup',
      });
      if (error && !error.code?.includes('AUTH_UNCONFIGURED')) {
        const retry = await verifyOtp({
          email: targetEmail,
          token: cleanToken,
          type: 'email',
        });
        if (!retry.error) {
          data = retry.data;
          error = null;
        }
      }
      setLoading(tokenBtn, false);

      if (error) {
        setError(verifyTokenInput, error.message || 'Invalid or expired confirmation PIN.');
        toast(`Verification error: ${error.message}`);
        return;
      }

      toast('Email confirmed! Welcome to StudySmart.');
      const defaultState = $('verify-default');
      const successState = $('verify-success');
      if (defaultState) defaultState.hidden = true;
      if (successState) {
        successState.hidden = false;
        successState.innerHTML = `
          <div class="verify-icon verify-icon-success" aria-hidden="true">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <p class="auth-status-text auth-status-success">Email confirmed! Redirecting to sign in...</p>
        `;
      }
      setTimeout(() => {
        window.location.href = `login.html?registered=true&email=${encodeURIComponent(targetEmail)}`;
      }, 1500);
    });
  }
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

    setLoading(submitBtn, true, 'Sending recovery instructions...');
    const { error } = await resetPassword(email);
    setLoading(submitBtn, false);

    if (error) {
      if (error.message && error.message.toLowerCase().includes('rate limit')) {
        showAlert(
          alertBox,
          'Email rate limit reached (Supabase limits test emails to ~3-4 per hour). Please wait a few minutes, or configure custom SMTP in your Supabase dashboard.'
        );
      } else {
        showAlert(alertBox, error.message);
      }
      return;
    }

    const requestState = $('forgot-request');
    const successState = $('forgot-success');
    const emailDisplay = $('forgot-email-display');
    const enterOtpBtn = $('enter-otp-btn');

    if (emailDisplay) emailDisplay.textContent = email;
    if (enterOtpBtn) enterOtpBtn.href = `reset-password.html?email=${encodeURIComponent(email)}`;
    if (requestState) requestState.hidden = true;
    if (successState) successState.hidden = false;

    toast('Password recovery instructions sent!');
  });
}

// ================================================================
// RESET PASSWORD PAGE (Dual Link & 6-digit OTP Support)
// ================================================================
function initResetPassword() {
  const resetForm = $('reset-form');
  if (!resetForm) return;

  const emailInput = $('email');
  const otpInput = $('otp-code');
  const passwordInput = $('password') || $('new-password');
  const confirmInput = $('confirm-password') || $('confirm');
  const alertBox = $('form-alert');
  const submitBtn = $('reset-btn') || resetForm.querySelector('button[type="submit"]');

  // Pre-fill email from query param if available
  const params = new URLSearchParams(window.location.search);
  const emailParam = params.get('email') || '';
  if (emailInput && emailParam) {
    emailInput.value = emailParam;
  }

  // Check if arrived from direct recovery link
  const hash = window.location.hash;
  const isLinkRecovery = hash.includes('type=recovery') || hash.includes('access_token') || params.has('code');

  if (isLinkRecovery) {
    const otpGroup = $('otp-group');
    const emailGroup = $('email-group');
    if (otpGroup) otpGroup.style.display = 'none';
    if (emailGroup && emailParam) emailGroup.style.display = 'none';
    showAlert(alertBox, 'Email verified via recovery link. Set your new password below.', true);
  }

  // Handle Resend 6-Digit PIN button
  const resendResetBtn = $('resend-reset-btn');
  if (resendResetBtn) {
    resendResetBtn.addEventListener('click', async () => {
      const email = emailInput ? emailInput.value.trim() : emailParam;
      if (!email || !EMAIL_PATTERN.test(email)) {
        setError(emailInput, 'Enter your registered email address first.');
        showAlert(alertBox, 'Enter your email address to resend the 6-digit PIN.');
        if (emailInput) emailInput.focus();
        return;
      }

      resendResetBtn.disabled = true;
      const originalText = resendResetBtn.innerHTML;
      resendResetBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      const { error } = await resetPassword(email);
      if (error) {
        showAlert(alertBox, error.message || 'Failed to resend code.');
        resendResetBtn.disabled = false;
        resendResetBtn.innerHTML = originalText;
      } else {
        toast('New 6-digit PIN sent to your email!');
        showAlert(alertBox, `New 6-digit PIN sent to ${email}. Check your inbox.`, true);
        let countdown = 60;
        resendResetBtn.innerHTML = `<i class="fa-solid fa-clock"></i> Resend (${countdown}s)`;
        const timer = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(timer);
            resendResetBtn.disabled = false;
            resendResetBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Resend code';
          } else {
            resendResetBtn.innerHTML = `<i class="fa-solid fa-clock"></i> Resend (${countdown}s)`;
          }
        }, 1000);
      }
    });
  }

  [emailInput, otpInput].forEach((inp) => {
    if (inp) {
      inp.addEventListener('input', () => {
        setError(inp, '');
        hideAlert(alertBox);
      });
    }
  });

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

    const email = emailInput ? emailInput.value.trim() : emailParam;
    const otpCode = otpInput ? otpInput.value.trim() : '';
    const cleanOtp = otpCode.replace(/\D/g, '');
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    let valid = true;

    // If not link recovery, check email and otp
    if (!isLinkRecovery) {
      if (!email || !EMAIL_PATTERN.test(email)) {
        setError(emailInput, 'Enter your registered email address.');
        valid = false;
      }
      if (!cleanOtp || cleanOtp.length < 6) {
        setError(otpInput, 'Enter the 6-digit verification code.');
        valid = false;
      }
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

    updateRuleDisplay(password);

    if (!valid) {
      showAlert(alertBox, 'Please complete all required fields.');
      return;
    }

    setLoading(submitBtn, true, 'Verifying & resetting password...');

    // If OTP provided and not a direct link session, verify OTP first
    if (!isLinkRecovery && cleanOtp) {
      const { error: otpError } = await verifyOtp({
        email,
        token: cleanOtp,
        type: 'recovery',
      });

      if (otpError) {
        setLoading(submitBtn, false);
        setError(otpInput, otpError.message);
        showAlert(alertBox, otpError.message || 'Invalid or expired verification code.');
        return;
      }
    }

    const { error } = await updatePassword(password);
    setLoading(submitBtn, false);

    if (error) {
      if (error.message && error.message.toLowerCase().includes('rate limit')) {
        showAlert(
          alertBox,
          'Email rate limit reached (Supabase limits test emails to ~3-4 per hour). Please wait a few minutes, or configure custom SMTP in your Supabase dashboard.'
        );
      } else {
        showAlert(alertBox, error.message);
      }
      return;
    }

    const formState = $('reset-form-state');
    const successState = $('reset-success');

    if (formState) formState.hidden = true;
    if (successState) successState.hidden = false;

    toast('Password updated successfully! Redirecting to sign in...');
    setTimeout(() => {
      window.location.href = `login.html?reset=true&email=${encodeURIComponent(email)}`;
    }, 1500);
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
