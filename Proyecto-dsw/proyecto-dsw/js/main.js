/**
 * main.js
 * Punto de entrada — detecta la página e inicializa los módulos correspondientes
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    /* ------------------------------------------------------------
     * FORO — Búsqueda y filtrado de temas
     * ------------------------------------------------------------ */
    if (path.includes('foro.html')) {
      window.Tribo.initForumFilters();
      window.Tribo.initFavorites();
    }

    /* ------------------------------------------------------------
     * DESTINOS — Búsqueda y filtrado de tarjetas
     * ------------------------------------------------------------ */
    if (path.includes('destinos.html')) {
      window.Tribo.initDestinationFilters();
      window.Tribo.initFavorites();
    }

    /* ------------------------------------------------------------
     * LOGIN — Validación de formulario
     * ------------------------------------------------------------ */
    if (path.includes('login.html')) {
      window.Tribo.initLoginValidation();
    }

    /* ------------------------------------------------------------
     * REGISTRO — Validación de formulario
     * ------------------------------------------------------------ */
    if (path.includes('registro.html')) {
      window.Tribo.initRegisterValidation();
    }

    /* ------------------------------------------------------------
     * CREAR TEMA — Validación de formulario + preview de imagen
     * ------------------------------------------------------------ */
    if (path.includes('crear-tema.html')) {
      window.Tribo.initNewTopicValidation();
      window.Tribo.initImagePreview();
      window.Tribo.initCharCounter();
    }

    /* ------------------------------------------------------------
     * TEMA — Validación de respuesta + contador de vistas
     * ------------------------------------------------------------ */
    if (path.includes('tema.html')) {
      window.Tribo.initReplyValidation();
      window.Tribo.initViewCounter();
      window.Tribo.initFavorites();
      window.Tribo.initCharCounter();
    }

    /* ------------------------------------------------------------
     * PERFIL — Tabs funcionales
     * ------------------------------------------------------------ */
    if (path.includes('perfil.html')) {
      window.Tribo.initFavorites();
      window.Tribo.initProfileTabs();
    }

    /* ------------------------------------------------------------
     * MODALES — Login y registro (todas las páginas)
     * ------------------------------------------------------------ */
    if (!path.includes('login.html') && !path.includes('registro.html')) {
      window.Tribo.initModals();
    }

    /* ------------------------------------------------------------
     * AUTENTICACIÓN — Sistema de login/registro/logout
     * ------------------------------------------------------------ */
    window.Tribo.initAuth();

    /* ------------------------------------------------------------
     * PERFIL — Datos del usuario autenticado
     * ------------------------------------------------------------ */
    if (path.includes('perfil.html')) {
      window.Tribo.initProfileData();
    }
  });
})();
