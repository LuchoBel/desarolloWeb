/**
 * auth.js
 * Sistema de autenticación con localStorage (demostración)
 */

(function () {
  'use strict';

  const USERS_KEY = 'travelersHub_users';
  const SESSION_KEY = 'travelersHub_session';

  /* ============================================================
   * Utilidades
   * ============================================================ */
  function getUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(session) {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(36);
  }

  function generateId() {
    return 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
  }

  /* ============================================================
   * API pública
   * ============================================================ */
  function isLoggedIn() {
    return getSession() !== null;
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const users = getUsers();
    return users.find(function (u) { return u.id === session.userId; }) || null;
  }

  function registerUser(name, email, password) {
    const users = getUsers();

    // Verificar si el email ya existe
    if (users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
      return { success: false, error: 'Email already registered.' };
    }

    const newUser = {
      id: generateId(),
      name: name,
      email: email,
      password: simpleHash(password),
      joined: new Date().toISOString().split('T')[0],
      countries: 0,
      replies: 0,
      topics: [],
      saved: [],
      trips: []
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login después del registro
    saveSession({ userId: newUser.id, loginDate: new Date().toISOString() });

    return { success: true, user: newUser };
  }

  function loginUser(email, password) {
    const users = getUsers();
    const hashed = simpleHash(password);

    const user = users.find(function (u) {
      return u.email.toLowerCase() === email.toLowerCase() && u.password === hashed;
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    saveSession({ userId: user.id, loginDate: new Date().toISOString() });
    return { success: true, user: user };
  }

  function logoutUser() {
    saveSession(null);
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.Tribo.showToast('Please log in to access your profile.');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1500);
      return false;
    }
    return true;
  }

  function updateHeader() {
    const user = getCurrentUser();
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    if (user) {
      // Usuario autenticado: mostrar nombre y botón de logout
      navActions.innerHTML = `
        <span class="user-greeting" style="color:var(--accent);font-weight:600;font-size:.9rem;">Hello, ${user.name.split(' ')[0]}</span>
        <a class="btn-ghost btn btn-small" href="#" id="logout-btn">Log out</a>
      `;

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
          e.preventDefault();
          logoutUser();
          window.Tribo.showToast('Logged out successfully.');
          setTimeout(function () {
            window.location.href = 'index.html';
          }, 1000);
        });
      }
    } else {
      // Usuario no autenticado: mostrar login y sign up
      navActions.innerHTML = `
        <a class="btn-ghost btn btn-small" href="login.html">Log in</a>
        <a class="btn btn-small" href="registro.html">Sign up</a>
      `;
    }
  }

  function initAuth() {
    updateHeader();

    // Si estamos en el perfil, verificar autenticación
    const path = window.location.pathname;
    if (path.includes('perfil.html')) {
      requireAuth();
    }
  }

  /* ============================================================
   * Toast notifications
   * ============================================================ */
  function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'alert');
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#011627;color:#FDFFFC;padding:14px 20px;border-radius:10px;font-weight:600;box-shadow:0 8px 24px rgba(1,22,39,.3);z-index:9999;animation:toastSlideIn .3s ease;max-width:320px;';
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
  window.Tribo.isLoggedIn = isLoggedIn;
  window.Tribo.getCurrentUser = getCurrentUser;
  window.Tribo.registerUser = registerUser;
  window.Tribo.loginUser = loginUser;
  window.Tribo.logoutUser = logoutUser;
  window.Tribo.requireAuth = requireAuth;
  window.Tribo.updateHeader = updateHeader;
  window.Tribo.initAuth = initAuth;
  window.Tribo.showToast = showToast;
})();
