/**
 * search-filter.js
 * Búsqueda y filtrado en tiempo real para foro.html y destinos.html
 */

(function () {
  'use strict';

  /* ============================================================
   * FORO — Filtro de temas
   * ============================================================ */
  function initForumFilters() {
    const searchInput = document.querySelector('.forum-tools input[type="search"]');
    const categorySelect = document.querySelector('.forum-tools select:nth-of-type(1)');
    const sortSelect = document.querySelector('.forum-tools select:nth-of-type(2)');
    const topics = document.querySelectorAll('.topic');

    if (!searchInput || !categorySelect || !sortSelect || topics.length === 0) return;

    // Contenedor para mensaje de "no results"
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('p');
      noResultsMsg.className = 'no-results meta';
      noResultsMsg.style.cssText = 'text-align:center;padding:24px;display:none;';
      noResultsMsg.textContent = 'No topics match your search.';
      topics[0].parentNode.insertBefore(noResultsMsg, topics[0].nextSibling);
    }

    function getCategoryFromTopic(topic) {
      const badge = topic.querySelector('.badge');
      if (!badge) return '';
      const text = badge.textContent.trim().toLowerCase();
      if (text.includes('tips')) return 'tips';
      if (text.includes('routes')) return 'routes';
      if (text.includes('budget')) return 'budget';
      if (text.includes('buddies')) return 'buddies';
      return 'other';
    }

    function getViewsFromTopic(topic) {
      const counts = topic.querySelector('.counts');
      if (!counts) return 0;
      const match = counts.textContent.match(/([\d,.]+)k?\s*views/i);
      if (!match) return 0;
      let num = parseFloat(match[1].replace(',', ''));
      if (counts.textContent.toLowerCase().includes('k')) num *= 1000;
      return num;
    }

    function getRepliesFromTopic(topic) {
      const counts = topic.querySelector('.counts');
      if (!counts) return 0;
      const match = counts.textContent.match(/(\d+)\s*replies/i);
      return match ? parseInt(match[1], 10) : 0;
    }

    function getTimestampFromTopic(topic) {
      const meta = topic.querySelector('.meta');
      if (!meta) return 0;
      const text = meta.textContent.toLowerCase();
      const hourMatch = text.match(/(\d+)\s*h/);
      if (hourMatch) return parseInt(hourMatch[1], 10);
      const dayMatch = text.match(/(\d+)\s*d/);
      if (dayMatch) return parseInt(dayMatch[1], 10) * 24;
      return 999;
    }

    function applyFilters() {
      const query = searchInput.value.trim().toLowerCase();
      const category = categorySelect.value.toLowerCase();
      const sort = sortSelect.value.toLowerCase();

      let visibleCount = 0;

      topics.forEach(function (topic) {
        const title = topic.querySelector('h3');
        const meta = topic.querySelector('.meta');
        const titleText = title ? title.textContent.toLowerCase() : '';
        const metaText = meta ? meta.textContent.toLowerCase() : '';
        const topicCategory = getCategoryFromTopic(topic);

        // Filtro por texto
        const matchesQuery = !query || titleText.includes(query) || metaText.includes(query);

        // Filtro por categoría
        const matchesCategory = category === 'all categories' || topicCategory === category;

        if (matchesQuery && matchesCategory) {
          topic.style.display = '';
          visibleCount++;
        } else {
          topic.style.display = 'none';
        }
      });

      // Ordenar
      const visibleTopics = Array.from(topics).filter(function (t) {
        return t.style.display !== 'none';
      });

      if (sort === 'most viewed') {
        visibleTopics.sort(function (a, b) {
          return getViewsFromTopic(b) - getViewsFromTopic(a);
        });
      } else if (sort === 'most replies') {
        visibleTopics.sort(function (a, b) {
          return getRepliesFromTopic(b) - getRepliesFromTopic(a);
        });
      } else {
        // Recent (por defecto)
        visibleTopics.sort(function (a, b) {
          return getTimestampFromTopic(a) - getTimestampFromTopic(b);
        });
      }

      // Reinsertar en orden
      const container = topics[0].parentNode;
      visibleTopics.forEach(function (topic) {
        container.appendChild(topic);
      });

      // Mostrar mensaje si no hay resultados
      if (visibleCount === 0) {
        noResultsMsg.style.display = '';
      } else {
        noResultsMsg.style.display = 'none';
      }
    }

    searchInput.addEventListener('input', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  }

  /* ============================================================
   * DESTINOS — Filtro de tarjetas
   * ============================================================ */
  function initDestinationFilters() {
    const searchInput = document.querySelector('.forum-tools input[type="search"]');
    const typeSelect = document.querySelector('.forum-tools select:nth-of-type(1)');
    const sortSelect = document.querySelector('.forum-tools select:nth-of-type(2)');
    const cards = document.querySelectorAll('.grid-3 .card');

    if (!searchInput || !typeSelect || !sortSelect || cards.length === 0) return;

    // Contenedor para mensaje de "no results"
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('p');
      noResultsMsg.className = 'no-results meta';
      noResultsMsg.style.cssText = 'text-align:center;padding:24px;display:none;';
      noResultsMsg.textContent = 'No destinations match your search.';
      cards[0].parentNode.insertBefore(noResultsMsg, cards[0].nextSibling);
    }

    function getTypeFromCard(card) {
      const meta = card.querySelector('.meta');
      if (!meta) return '';
      const text = meta.textContent.toLowerCase();
      if (text.includes('beach')) return 'beach';
      if (text.includes('mountain')) return 'mountain';
      if (text.includes('city')) return 'city';
      if (text.includes('adventure')) return 'adventure';
      return 'other';
    }

    function getTopicsFromCard(card) {
      const footer = card.querySelector('.card-footer .meta');
      if (!footer) return 0;
      const match = footer.textContent.match(/(\d+)\s*topics/i);
      return match ? parseInt(match[1], 10) : 0;
    }

    function applyFilters() {
      const query = searchInput.value.trim().toLowerCase();
      const type = typeSelect.value.toLowerCase();
      const sort = sortSelect.value.toLowerCase();

      let visibleCount = 0;

      cards.forEach(function (card) {
        const title = card.querySelector('h3');
        const meta = card.querySelector('.meta');
        const titleText = title ? title.textContent.toLowerCase() : '';
        const metaText = meta ? meta.textContent.toLowerCase() : '';
        const cardType = getTypeFromCard(card);

        // Filtro por texto
        const matchesQuery = !query || titleText.includes(query) || metaText.includes(query);

        // Filtro por tipo
        const matchesType = type === 'all' || cardType === type;

        if (matchesQuery && matchesType) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Ordenar
      const visibleCards = Array.from(cards).filter(function (c) {
        return c.style.display !== 'none';
      });

      if (sort === 'a-z') {
        visibleCards.sort(function (a, b) {
          const titleA = a.querySelector('h3').textContent.toLowerCase();
          const titleB = b.querySelector('h3').textContent.toLowerCase();
          return titleA.localeCompare(titleB);
        });
      } else {
        // Most popular (por defecto)
        visibleCards.sort(function (a, b) {
          return getTopicsFromCard(b) - getTopicsFromCard(a);
        });
      }

      // Reinsertar en orden
      const container = cards[0].parentNode;
      visibleCards.forEach(function (card) {
        container.appendChild(card);
      });

      // Mostrar mensaje si no hay resultados
      if (visibleCount === 0) {
        noResultsMsg.style.display = '';
      } else {
        noResultsMsg.style.display = 'none';
      }
    }

    searchInput.addEventListener('input', applyFilters);
    typeSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  }

  /* ============================================================
   * Exportar al scope global
   * ============================================================ */
  window.Tribo = window.Tribo || {};
  window.Tribo.initForumFilters = initForumFilters;
  window.Tribo.initDestinationFilters = initDestinationFilters;
})();
