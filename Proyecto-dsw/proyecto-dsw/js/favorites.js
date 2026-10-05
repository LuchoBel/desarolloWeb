/**
 * favorites.js
 * Sistema de "Saved" / Guardar temas con localStorage
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'travelersHub_saved';

  function getSaved() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSaved(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function isFavorite(id) {
    return getSaved().includes(id);
  }

  function toggleFavorite(id) {
    const saved = getSaved();
    const idx = saved.indexOf(id);
    if (idx === -1) {
      saved.push(id);
    } else {
      saved.splice(idx, 1);
    }
    saveSaved(saved);
    return idx === -1; // true si se agregó, false si se quitó
  }

  function getTopicId(topic) {
    const link = topic.querySelector('h3 a');
    if (!link) return null;
    const href = link.getAttribute('href');
    const text = link.textContent.toLowerCase().trim();
    // Crear ID único basado en el texto del título
    return text.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50) + '-' + href.replace('.html', '');
  }

  function createFavoriteButton(id) {
    const btn = document.createElement('button');
    btn.className = 'favorite-btn';
    btn.setAttribute('aria-label', 'Save topic');
    btn.setAttribute('aria-pressed', 'false');
    btn.type = 'button';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:1.2rem;padding:4px 8px;border-radius:6px;transition:transform .2s,background .2s;';

    const updateVisual = function () {
      const active = isFavorite(id);
      btn.textContent = active ? '★' : '☆';
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active', active);
    };

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const added = toggleFavorite(id);
      updateVisual();
      if (added) {
        window.Tribo.showToast('Topic saved to your favorites!');
      } else {
        window.Tribo.showToast('Topic removed from favorites.');
      }
    });

    updateVisual();
    return btn;
  }

  function initFavorites() {
    // Añadir botones a los temas del foro
    const topics = document.querySelectorAll('.topic');
    topics.forEach(function (topic) {
      const id = getTopicId(topic);
      if (!id) return;

      const btn = createFavoriteButton(id);
      const counts = topic.querySelector('.counts');
      if (counts) {
        counts.appendChild(btn);
      }
    });

    // Añadir botones a las tarjetas de destinos
    const cards = document.querySelectorAll('.grid-3 .card');
    cards.forEach(function (card, idx) {
      const title = card.querySelector('h3');
      if (!title) return;
      const id = 'destino-' + title.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

      const btn = createFavoriteButton(id);
      const footer = card.querySelector('.card-footer');
      if (footer) {
        footer.appendChild(btn);
      }
    });

    // Añadir botón al post principal en tema.html
    const mainPost = document.querySelector('.post');
    if (mainPost) {
      const title = mainPost.querySelector('h1');
      if (title) {
        const id = 'tema-' + title.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        const btn = createFavoriteButton(id);
        const header = mainPost.querySelector('.post-header');
        if (header) {
          header.appendChild(btn);
        }
      }
    }

    // Actualizar contador en el perfil
    const savedBadge = document.querySelector('.tabs .badge-yellow');
    if (savedBadge) {
      const count = getSaved().length;
      savedBadge.textContent = 'Saved (' + count + ')';
    }
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initFavorites = initFavorites;
  window.Tribo.getSaved = getSaved;
  window.Tribo.isFavorite = isFavorite;
  window.Tribo.toggleFavorite = toggleFavorite;
})();
