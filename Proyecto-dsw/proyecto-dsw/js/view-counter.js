/**
 * view-counter.js
 * Contador de vistas en temas con localStorage
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'travelersHub_views';

  function getViews() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveViews(views) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  }

  function initViewCounter() {
    const post = document.querySelector('.post');
    if (!post) return;

    const title = post.querySelector('h1');
    if (!title) return;

    const topicId = title.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const views = getViews();

    // Incrementar vista
    views[topicId] = (views[topicId] || 0) + 1;
    saveViews(views);

    // Actualizar el contador en el DOM
    const meta = post.querySelector('.meta');
    if (meta) {
      const viewText = views[topicId] + ' views';
      // Reemplazar o añadir el contador de vistas
      const existingView = meta.querySelector('.view-count');
      if (existingView) {
        existingView.textContent = viewText;
      } else {
        const viewSpan = document.createElement('span');
        viewSpan.className = 'view-count';
        viewSpan.textContent = ' · ' + viewText;
        meta.appendChild(viewSpan);
      }
    }

    // Mostrar badge "New view" brevemente
    const badge = document.createElement('span');
    badge.className = 'view-badge';
    badge.style.cssText = 'display:inline-block;background:#41EAD4;color:#011627;font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:999px;margin-left:8px;animation:fadeIn .3s ease;';
    badge.textContent = 'New view!';
    title.appendChild(badge);

    setTimeout(function () {
      badge.style.transition = 'opacity .5s';
      badge.style.opacity = '0';
      setTimeout(function () {
        badge.remove();
      }, 500);
    }, 2000);
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initViewCounter = initViewCounter;
})();
