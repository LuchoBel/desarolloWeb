/**
 * form-validation.js
 * Validación de formularios para login, registro, crear-tema y tema
 */

(function () {
  'use strict';

  /* ============================================================
   * Utilidades compartidas
   * ============================================================ */
  function showError(input, message) {
    clearError(input);
    input.classList.add('error');
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.setAttribute('aria-live', 'polite');
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
  }

  function clearError(input) {
    input.classList.remove('error', 'success');
    const existing = input.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
  }

  function showSuccess(input) {
    clearError(input);
    input.classList.add('success');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
   * LOGIN — Validación de inicio de sesión
   * ============================================================ */
  function initLoginValidation() {
    const form = document.querySelector('.auth-wrap .form');
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!emailInput || !passwordInput) return;

    emailInput.addEventListener('blur', function () {
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
      } else {
        showSuccess(emailInput);
      }
    });

    passwordInput.addEventListener('blur', function () {
      if (!passwordInput.value) {
        showError(passwordInput, 'Password is required.');
      } else {
        showSuccess(passwordInput);
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
        valid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        valid = false;
      }

      if (!passwordInput.value) {
        showError(passwordInput, 'Password is required.');
        valid = false;
      }

      if (valid) {
        // Simular login exitoso
        showToast('Login successful! Redirecting...');
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
      }
    });
  }

  /* ============================================================
   * REGISTRO — Validación de cuenta nueva
   * ============================================================ */
  function initRegisterValidation() {
    const form = document.querySelector('.auth-wrap .form');
    if (!form) return;

    const nameInput = form.querySelector('input:not([type="email"]):not([type="password"])');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!nameInput || !emailInput || !passwordInput) return;

    // Indicador de fortaleza de contraseña
    let strengthBar = document.querySelector('.password-strength');
    if (!strengthBar) {
      strengthBar = document.createElement('div');
      strengthBar.className = 'password-strength';
      strengthBar.style.cssText = 'margin-top:6px;height:4px;border-radius:2px;transition:width .3s,background .3s;';
      passwordInput.parentNode.insertBefore(strengthBar, passwordInput.nextSibling);
    }

    function getPasswordStrength(pwd) {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (pwd.length >= 12) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score;
    }

    function updateStrengthBar(pwd) {
      const score = getPasswordStrength(pwd);
      const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
      const widths = ['20%', '40%', '60%', '80%', '100%'];
      if (pwd.length === 0) {
        strengthBar.style.width = '0';
        strengthBar.style.background = 'transparent';
      } else {
        const idx = Math.min(score - 1, 4);
        strengthBar.style.width = widths[idx];
        strengthBar.style.background = colors[idx];
      }
    }

    nameInput.addEventListener('blur', function () {
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required.');
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters.');
      } else {
        showSuccess(nameInput);
      }
    });

    emailInput.addEventListener('blur', function () {
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
      } else {
        showSuccess(emailInput);
      }
    });

    passwordInput.addEventListener('input', function () {
      updateStrengthBar(passwordInput.value);
    });

    passwordInput.addEventListener('blur', function () {
      if (!passwordInput.value) {
        showError(passwordInput, 'Password is required.');
      } else if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters.');
      } else {
        showSuccess(passwordInput);
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required.');
        valid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters.');
        valid = false;
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
        valid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        valid = false;
      }

      if (!passwordInput.value) {
        showError(passwordInput, 'Password is required.');
        valid = false;
      } else if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters.');
        valid = false;
      }

      if (valid) {
        showToast('Account created successfully! Redirecting...');
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
      }
    });
  }

  /* ============================================================
   * CREAR TEMA — Validación de nuevo tema
   * ============================================================ */
  function initNewTopicValidation() {
    const form = document.querySelector('.form');
    if (!form) return;

    const titleInput = form.querySelector('input[type="text"], input:not([type])');
    const messageInput = form.querySelector('textarea');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!titleInput || !messageInput) return;

    const MAX_CHARS = 500;

    titleInput.addEventListener('blur', function () {
      if (!titleInput.value.trim()) {
        showError(titleInput, 'Title is required.');
      } else if (titleInput.value.trim().length < 10) {
        showError(titleInput, 'Title must be at least 10 characters.');
      } else {
        showSuccess(titleInput);
      }
    });

    messageInput.addEventListener('blur', function () {
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required.');
      } else if (messageInput.value.trim().length < 30) {
        showError(messageInput, 'Message must be at least 30 characters.');
      } else if (messageInput.value.length > MAX_CHARS) {
        showError(messageInput, 'Message must not exceed ' + MAX_CHARS + ' characters.');
      } else {
        showSuccess(messageInput);
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      if (!titleInput.value.trim()) {
        showError(titleInput, 'Title is required.');
        valid = false;
      } else if (titleInput.value.trim().length < 10) {
        showError(titleInput, 'Title must be at least 10 characters.');
        valid = false;
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required.');
        valid = false;
      } else if (messageInput.value.trim().length < 30) {
        showError(messageInput, 'Message must be at least 30 characters.');
        valid = false;
      } else if (messageInput.value.length > MAX_CHARS) {
        showError(messageInput, 'Message must not exceed ' + MAX_CHARS + ' characters.');
        valid = false;
      }

      if (valid) {
        showToast('Topic published successfully!');
        submitBtn.textContent = 'Publishing...';
        submitBtn.disabled = true;
      }
    });

  }

  /* ============================================================
   * TEMA — Validación de respuesta
   * ============================================================ */
  function initReplyValidation() {
    const form = document.querySelector('.post .form');
    if (!form) return;

    const textarea = form.querySelector('textarea');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!textarea) return;

    const MAX_CHARS = 500;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!textarea.value.trim()) {
        showError(textarea, 'Reply cannot be empty.');
        return;
      }

      if (textarea.value.length > MAX_CHARS) {
        showError(textarea, 'Reply must not exceed ' + MAX_CHARS + ' characters.');
        return;
      }

      showSuccess(textarea);
      showToast('Reply posted successfully!');
      submitBtn.textContent = 'Posting...';
      submitBtn.disabled = true;

      // Simular envío
      setTimeout(function () {
        textarea.value = '';
        submitBtn.textContent = 'Post reply';
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /* ============================================================
   * Toast notifications
   * ============================================================ */
  function showToast(message) {
    // Remover toast previo si existe
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'alert');
    toast.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'background:#011627',
      'color:#FDFFFC',
      'padding:14px 20px',
      'border-radius:10px',
      'font-weight:600',
      'box-shadow:0 8px 24px rgba(1,22,39,.3)',
      'z-index:9999',
      'animation:toastSlideIn .3s ease',
      'max-width:320px'
    ].join(';');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.animation = 'toastSlideOut .3s ease';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /* ============================================================
   * Exportar al scope global
   * ============================================================ */
  window.Tribo = window.Tribo || {};
  window.Tribo.initLoginValidation = initLoginValidation;
  window.Tribo.initRegisterValidation = initRegisterValidation;
  window.Tribo.initNewTopicValidation = initNewTopicValidation;
  window.Tribo.initReplyValidation = initReplyValidation;
  window.Tribo.showToast = showToast;
})();
