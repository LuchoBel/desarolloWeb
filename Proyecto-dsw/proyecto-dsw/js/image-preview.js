/**
 * image-preview.js
 * Preview de imagen en crear-tema
 */

(function () {
  'use strict';

  const MAX_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  function initImagePreview() {
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) return;

    // Crear contenedor de preview
    const container = document.createElement('div');
    container.id = 'image-preview-container';
    container.style.cssText = 'margin-top:12px;display:none;';

    const img = document.createElement('img');
    img.style.cssText = 'max-width:300px;width:100%;border-radius:10px;border:2px solid var(--border);';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-small btn-light';
    removeBtn.textContent = 'Remove image';
    removeBtn.style.cssText = 'margin-top:8px;';

    const errorEl = document.createElement('p');
    errorEl.className = 'field-error';
    errorEl.style.display = 'none';

    container.appendChild(img);
    container.appendChild(document.createElement('br'));
    container.appendChild(removeBtn);
    container.appendChild(errorEl);

    fileInput.parentNode.insertBefore(container, fileInput.nextSibling);

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
      container.style.display = 'none';
    }

    function clearError() {
      errorEl.style.display = 'none';
    }

    function showPreview(file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        showError('Invalid file type. Only JPG, PNG, WebP and GIF are allowed.');
        fileInput.value = '';
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showError('File is too large. Maximum size is ' + MAX_SIZE_MB + 'MB.');
        fileInput.value = '';
        return;
      }

      clearError();
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
        container.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }

    function removePreview() {
      fileInput.value = '';
      img.src = '';
      container.style.display = 'none';
      clearError();
    }

    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) {
        showPreview(fileInput.files[0]);
      } else {
        removePreview();
      }
    });

    removeBtn.addEventListener('click', removePreview);
  }

  window.Tribo = window.Tribo || {};
  window.Tribo.initImagePreview = initImagePreview;
})();
