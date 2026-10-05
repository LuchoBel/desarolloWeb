/**
 * char-counter.js
 * Contador de caracteres generalizado para todos los textareas del sitio
 */

(function () {
  'use strict';

  function initCharCounter() {
    const textareas = document.querySelectorAll('textarea[data-min-chars], textarea[data-max-chars]');

    textareas.forEach(function (textarea) {
      const minChars = parseInt(textarea.getAttribute('data-min-chars'), 10) || 0;
      const maxChars = parseInt(textarea.getAttribute('data-max-chars'), 10) || 500;

      // Crear contador
      const counter = document.createElement('span');
      counter.className = 'char-counter meta';
      counter.style.cssText = 'display:inline-block;margin-top:4px;font-size:.8rem;';

      // Insertar después del textarea
      textarea.parentNode.insertBefore(counter, textarea.nextSibling);

      function updateCounter() {
        const len = textarea.value.length;
        counter.textContent = len + '/' + maxChars + ' characters';

        // Limpiar clases previas
        counter.classList.remove('char-ok', 'char-warning', 'char-error');

        if (len > maxChars) {
          counter.classList.add('char-error');
        } else if (len >= minChars) {
          counter.classList.add('char-ok');
        } else if (len > 0) {
          counter.classList.add('char-warning');
        }
      }

      textarea.addEventListener('input', updateCounter);
      updateCounter();
    });
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initCharCounter = initCharCounter;
})();
