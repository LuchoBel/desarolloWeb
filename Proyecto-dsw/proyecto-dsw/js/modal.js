/**
 * modal.js
 * Modales de login y registro con blur de fondo
 */

(function () {
  'use strict';

  function createModal(id, title, content) {
    // Remover modal previo si existe
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = id;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);

    const box = document.createElement('div');
    box.className = 'modal-box';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', function () {
      closeModal(id);
    });

    const heading = document.createElement('h1');
    heading.textContent = title;

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;

    box.appendChild(closeBtn);
    box.appendChild(heading);
    box.appendChild(contentDiv);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Cerrar al hacer clic fuera del modal
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal(id);
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal(id);
        document.removeEventListener('keydown', escHandler);
      }
    });

    return overlay;
  }

  function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('active');
    // Focus al primer input
    const firstInput = overlay.querySelector('input');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
  }

  function closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initModals() {
    // Contenido del modal de login
    const loginContent = `
      <form class="form" onsubmit="return false">
        <label for="modal-email">Email</label>
        <input id="modal-email" type="email" placeholder="your@email.com">

        <label for="modal-password">Password</label>
        <input id="modal-password" type="password" placeholder="••••••••">

        <p style="margin-top:16px">
          <button class="btn" style="width:100%" type="submit">Log in</button>
        </p>

        <p class="auth-links meta">Don't have an account?
          <a id="switch-to-register">Sign up</a>
        </p>
      </form>
    `;

    // Contenido del modal de registro
    const registerContent = `
      <form class="form" onsubmit="return false">
        <label for="modal-name">Name</label>
        <input id="modal-name" placeholder="Your traveler name">

        <label for="modal-email">Email</label>
        <input id="modal-email" type="email" placeholder="your@email.com">

        <label for="modal-password">Password</label>
        <input id="modal-password" type="password" placeholder="Minimum 8 characters">

        <p style="margin-top:16px">
          <button class="btn" style="width:100%" type="submit">Join for free</button>
        </p>

        <p class="auth-links meta">Already have an account?
          <a id="switch-to-login">Log in</a>
        </p>
      </form>
    `;

    // Crear modales
    createModal('login-modal', 'Log in', loginContent);
    createModal('register-modal', 'Create account', registerContent);

    // Usar event delegation para manejar clicks en botones de login/registro
    // Esto funciona incluso si auth.js reemplaza el HTML del header después
    document.addEventListener('click', function (e) {
      const target = e.target.closest('a[href="login.html"], a[href="registro.html"]');
      if (!target) return;
      e.preventDefault();
      if (target.getAttribute('href') === 'login.html') {
        openModal('login-modal');
      } else {
        openModal('register-modal');
      }
    });

    // Enlaces para cambiar entre login y registro
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'switch-to-register') {
        closeModal('login-modal');
        setTimeout(function () { openModal('register-modal'); }, 200);
      }
      if (e.target && e.target.id === 'switch-to-login') {
        closeModal('register-modal');
        setTimeout(function () { openModal('login-modal'); }, 200);
      }
    });

    // Validación de formularios en modales
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');

    if (loginModal) {
      const form = loginModal.querySelector('form');
      const emailInput = loginModal.querySelector('#modal-email');
      const passwordInput = loginModal.querySelector('#modal-password');
      const submitBtn = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
          emailInput.classList.add('error');
          return;
        }
        emailInput.classList.remove('error');

        if (!passwordInput.value) {
          passwordInput.classList.add('error');
          return;
        }
        passwordInput.classList.remove('error');

        const result = window.Tribo.loginUser(emailInput.value.trim(), passwordInput.value);

        if (result.success) {
          window.Tribo.showToast('Login successful! Welcome back, ' + result.user.name.split(' ')[0] + '!');
          submitBtn.textContent = 'Logging in...';
          submitBtn.disabled = true;
          setTimeout(function () {
            closeModal('login-modal');
            window.Tribo.updateHeader();
            submitBtn.textContent = 'Log in';
            submitBtn.disabled = false;
            form.reset();
          }, 1500);
        } else {
          window.Tribo.showToast(result.error);
          passwordInput.classList.add('error');
        }
      });
    }

    if (registerModal) {
      const form = registerModal.querySelector('form');
      const nameInput = registerModal.querySelector('#modal-name');
      const emailInput = registerModal.querySelector('#modal-email');
      const passwordInput = registerModal.querySelector('#modal-password');
      const submitBtn = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          nameInput.classList.add('error');
          return;
        }
        nameInput.classList.remove('error');

        if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
          emailInput.classList.add('error');
          return;
        }
        emailInput.classList.remove('error');

        if (!passwordInput.value || passwordInput.value.length < 8) {
          passwordInput.classList.add('error');
          return;
        }
        passwordInput.classList.remove('error');

        const result = window.Tribo.registerUser(nameInput.value.trim(), emailInput.value.trim(), passwordInput.value);

        if (result.success) {
          window.Tribo.showToast('Account created! Welcome, ' + result.user.name.split(' ')[0] + '!');
          submitBtn.textContent = 'Creating account...';
          submitBtn.disabled = true;
          setTimeout(function () {
            closeModal('register-modal');
            window.Tribo.updateHeader();
            submitBtn.textContent = 'Join for free';
            submitBtn.disabled = false;
            form.reset();
          }, 1500);
        } else {
          window.Tribo.showToast(result.error);
          emailInput.classList.add('error');
        }
      });
    }
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initModals = initModals;
  window.Tribo.openModal = openModal;
  window.Tribo.closeModal = closeModal;
})();
