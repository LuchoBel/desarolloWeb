/**
 * profile-tabs.js
 * Tabs funcionales en el perfil de usuario
 */

(function () {
  'use strict';

  function initProfileTabs() {
    const tabs = document.querySelectorAll('.tabs .badge');
    if (tabs.length === 0) return;

    // Los contenedores ya existen en el HTML
    const topicsContent = document.getElementById('tab-topics');
    const repliesContent = document.getElementById('tab-replies');
    const savedContent = document.getElementById('tab-saved');

    if (!topicsContent || !repliesContent || !savedContent) return;

    const contents = [topicsContent, repliesContent, savedContent];

    // Funcionalidad de tabs
    tabs.forEach(function (tab, idx) {
      tab.style.cursor = 'pointer';
      tab.addEventListener('click', function () {
        // Desactivar todas
        tabs.forEach(function (t) {
          t.classList.remove('badge-coral');
          t.classList.add('badge');
        });
        contents.forEach(function (c) {
          c.style.display = 'none';
          c.classList.remove('active');
        });

        // Activar la seleccionada
        tab.classList.remove('badge');
        tab.classList.add('badge-coral');
        contents[idx].style.display = '';
        contents[idx].classList.add('active');
      });
    });

    // Activar la primera tab por defecto
    tabs[0].classList.remove('badge');
    tabs[0].classList.add('badge-coral');
    topicsContent.style.display = '';
    topicsContent.classList.add('active');
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initProfileTabs = initProfileTabs;
})();
