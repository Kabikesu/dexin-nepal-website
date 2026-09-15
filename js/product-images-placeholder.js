(() => {
  'use strict';

  const fallbackClass = 'product-media-fallback';

  const createFallback = (image) => {
    const media = image.closest('.product-media, .modal-product-media');
    if (!media || media.querySelector(`.${fallbackClass}`)) return;

    const fallback = document.createElement('div');
    fallback.className = fallbackClass;
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML = `<strong>${image.alt || 'Product image unavailable'}</strong>`;
    media.appendChild(fallback);
    image.style.opacity = '0';
  };

  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement && event.target.matches('[data-product-image]')) {
      createFallback(event.target);
    }
  }, true);
})();
