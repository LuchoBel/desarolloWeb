/**
 * profile-data.js
 * Carga y muestra los datos del usuario en el perfil
 */

(function () {
  'use strict';

  // Event delegation a nivel de IIFE para los botones guest
  // Se registra cuando el script carga, no depende de orden de inicialización
  document.addEventListener('click', function (e) {
    var target = e.target.closest('#guest-login-btn, #guest-register-btn');
    if (!target) return;
    e.preventDefault();
    if (target.id === 'guest-login-btn') {
      window.Tribo.openModal('login-modal');
    } else {
      window.Tribo.openModal('register-modal');
    }
  });

  function initProfileData() {
    const user = window.Tribo.getCurrentUser();
    const guestView = document.getElementById('profile-guest');
    const authView = document.getElementById('profile-authenticated');

    if (!user) {
      // Mostrar vista de invitado
      if (guestView) guestView.style.display = '';
      if (authView) authView.style.display = 'none';
      return;
    }

    // Mostrar vista de usuario autenticado
    if (guestView) guestView.style.display = 'none';
    if (authView) authView.style.display = '';

    loadUserProfile(user);
    populateTopics(user);
    populateReplies(user);
    populateSaved(user);
  }

  function loadUserProfile(user) {
    const profileHead = document.querySelector('.profile-head');
    if (profileHead) {
      const avatar = profileHead.querySelector('.avatar');
      const nameEl = profileHead.querySelector('h1');
      const infoEl = profileHead.querySelector('p');

      if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
      if (nameEl) nameEl.textContent = user.name;
      if (infoEl) {
        const countries = user.countries || 0;
        const replies = user.replies || 0;
        const joined = user.joined || '2024';
        infoEl.textContent = countries + ' countries · ' + replies + ' replies · Member since ' + joined;
      }
    }

    const tabs = document.querySelectorAll('.tabs .badge');
    if (tabs.length >= 3) {
      tabs[0].textContent = 'My topics (' + (user.topics ? user.topics.length : 0) + ')';
      tabs[1].textContent = 'Replies (' + (user.replies || 0) + ')';
      tabs[2].textContent = 'Saved (' + (user.saved ? user.saved.length : 0) + ')';
    }

    const tripsBox = document.querySelector('.sidebar-box h3');
    if (tripsBox && tripsBox.textContent === 'My trips') {
      const tripsText = tripsBox.parentNode.querySelector('.meta');
      if (tripsText && user.trips && user.trips.length > 0) {
        tripsText.textContent = user.trips.join(' · ');
      }
    }

    const savedBox = document.querySelectorAll('.sidebar-box')[1];
    if (savedBox) {
      const savedText = savedBox.querySelector('.meta');
      if (savedText && user.saved && user.saved.length > 0) {
        savedText.textContent = user.saved.join(' · ');
      }
    }
  }

  function populateTopics(user) {
    const topicsContent = document.getElementById('tab-topics');
    if (!topicsContent) return;

    if (!user.topics || user.topics.length === 0) {
      topicsContent.innerHTML = '<p class="meta" style="padding:16px;text-align:center;">You haven\'t created any topics yet. Start a conversation!</p>';
      return;
    }

    const sampleTopics = [
      { title: 'Kyoto in 7 days on €900, is it possible?', replies: 41, views: '2.8k' },
      { title: '4-day Barcelona route without the crowds', replies: 18, views: '980' }
    ];

    topicsContent.innerHTML = sampleTopics.map(function (topic) {
      return '<div class="topic"><div class="avatar">' + user.name.charAt(0).toUpperCase() + '</div><div><h3><a href="tema.html">' + topic.title + '</a></h3><p class="meta">' + topic.replies + ' replies · ' + topic.views + ' views</p></div><div class="counts"><a class="btn btn-small" href="tema.html">View</a></div></div>';
    }).join('');
  }

  function populateReplies(user) {
    const repliesContent = document.getElementById('tab-replies');
    if (!repliesContent) return;

    const sampleReplies = [
      { text: 'Yes, but it\'s tight. Hostel €35/night = €245. That\'s a lot. Look at guesthouses in Osaka and one day in Kyoto, you save €10/night.', time: '2h ago' },
      { text: 'The JR Pass only pays off if you go to Tokyo round-trip. If it\'s just Kansai, use a regional pass (€60).', time: '1d ago' }
    ];

    repliesContent.innerHTML = sampleReplies.map(function (reply) {
      return '<div class="reply"><div class="reply-header"><div class="avatar">' + user.name.charAt(0).toUpperCase() + '</div><strong>' + user.name + '</strong><span class="meta">' + reply.time + '</span></div><p>' + reply.text + '</p></div>';
    }).join('');
  }

  function populateSaved(user) {
    const savedContent = document.getElementById('tab-saved');
    if (!savedContent) return;

    if (!user.saved || user.saved.length === 0) {
      savedContent.innerHTML = '<p class="meta" style="padding:16px;text-align:center;">No saved topics yet. Browse the forum and save topics you like!</p>';
      return;
    }

    savedContent.innerHTML = '<p class="meta" style="padding:16px 0;">' + user.saved.length + ' saved topic(s). Full list coming soon!</p>';
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initProfileData = initProfileData;
})();
