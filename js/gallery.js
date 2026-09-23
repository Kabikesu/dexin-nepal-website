(() => {
  'use strict';

  const albumGrid = document.getElementById('album-grid');
  const mediaGrid = document.getElementById('media-grid');
  const status = document.getElementById('gallery-status');
  const toolbar = document.getElementById('gallery-toolbar');
  const backButton = document.getElementById('gallery-back');
  const albumTitle = document.getElementById('album-title');
  const albumCategory = document.getElementById('album-category');
  const albumCount = document.getElementById('album-count');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxThumbs = document.getElementById('lightbox-thumbs');
  if (!albumGrid || !mediaGrid || !status || !lightbox || !lightboxThumbs) return;

  const state = { albums: [], activeAlbum: null, activeIndex: 0, lastFocused: null, touchStartX: 0, touchStartY: 0, touchActive: false };
  const imageExtensions = new Set(['jpg','jpeg','png','gif','webp','svg','avif']);
  const videoExtensions = new Set(['mp4','webm','ogg','mov','m4v']);
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const pretty = (value = '') => String(value).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (char) => char.toUpperCase());
  const extension = (path = '') => path.split('?')[0].split('.').pop().toLowerCase();
  const mediaType = (item) => item.type || (videoExtensions.has(extension(item.path || item.src)) ? 'video' : imageExtensions.has(extension(item.path || item.src)) ? 'image' : 'unsupported');
  const mediaUrl = (value = '') => {
    const raw = String(value).trim();
    if (!raw) return '';
    try {
      const hashIndex = raw.indexOf('#');
      const hash = hashIndex >= 0 ? raw.slice(hashIndex) : '';
      const withoutHash = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
      const queryIndex = withoutHash.indexOf('?');
      const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
      const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
      return pathname.split('/').map((part) => encodeURIComponent(part)).join('/') + query + hash;
    } catch {
      return raw;
    }
  };
  const normalizeItems = (items) => {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    return items.map((item) => {
      if (!item || typeof item !== 'object') return null;
      const src = mediaUrl(item.src || item.path || '');
      const path = String(item.path || item.src || '').trim();
      if (!src || !path) return null;
      const type = mediaType({ ...item, path, src });
      if (type === 'unsupported') return null;
      const key = path.toLowerCase();
      if (seen.has(key)) return null;
      seen.add(key);
      return { ...item, src, path, type };
    }).filter(Boolean);
  };

  const imageFallback = (target) => {
    target.addEventListener('error', () => {
      const parent = target.parentElement;
      if (!parent || parent.dataset.fallback) return;
      parent.dataset.fallback = 'true';
      target.remove();
      const fallback = document.createElement('span');
      fallback.className = 'gallery-media-fallback';
      fallback.textContent = 'Media unavailable';
      parent.appendChild(fallback);
    }, { once: true });
  };

  const coverMarkup = (item) => {
    if (!item) return '<span class="album-cover-placeholder">DXN</span>';
    if (mediaType(item) === 'video') return `<video src="${escapeHtml(mediaUrl(item.src))}" muted playsinline preload="metadata"></video>`;
    return `<img src="${escapeHtml(mediaUrl(item.src))}" alt="${escapeHtml(item.name || 'Gallery image')}" loading="lazy">`;
  };

  const renderAlbums = () => {
    toolbar.hidden = true;
    mediaGrid.hidden = true;
    albumGrid.hidden = false;
    status.hidden = state.albums.length > 0;
    status.textContent = state.albums.length ? '' : 'No gallery media has been published yet.';
    albumGrid.innerHTML = state.albums.map((album, index) => `
      <button class="album-card" type="button" data-album-id="${escapeHtml(album.id)}" aria-label="Open ${escapeHtml(album.title)} album">
        <span class="album-card-inner">
          <span class="album-depth"></span>
          <span class="album-cover">${coverMarkup(album.items[0])}<span class="album-icon">↗</span></span>
          <span class="album-info"><span class="album-category">${escapeHtml(album.categoryLabel)}</span><span class="album-title-text">${escapeHtml(album.title)}</span><span>${album.items.length} media item${album.items.length === 1 ? '' : 's'}</span></span>
        </span>
      </button>
    `).join('');
    albumGrid.querySelectorAll('img').forEach(imageFallback);
  };

  const renderMedia = () => {
    const album = state.activeAlbum;
    if (!album) return renderAlbums();
    toolbar.hidden = false;
    albumGrid.hidden = true;
    mediaGrid.hidden = false;
    status.hidden = true;
    albumTitle.textContent = album.title;
    albumCategory.textContent = album.categoryLabel;
    albumCount.textContent = `${album.items.length} media item${album.items.length === 1 ? '' : 's'}`;
    mediaGrid.innerHTML = album.items.length ? album.items.map((item, index) => {
      const type = mediaType(item);
      const content = type === 'video'
        ? `<video src="${escapeHtml(mediaUrl(item.src))}" muted playsinline preload="metadata"></video>`
        : `<img src="${escapeHtml(mediaUrl(item.src))}" alt="${escapeHtml(item.name || album.title)}" loading="lazy">`;
      return `<button class="media-card" type="button" style="--i:${index}" data-media-index="${index}" aria-label="Open ${escapeHtml(item.name || album.title)}"><span class="media-thumb">${content}<span class="media-type">${type}</span></span><span class="media-name">${escapeHtml(item.name || pretty(item.path || 'Media'))}</span></button>`;
    }).join('') : '<div class="media-empty">This album does not contain any supported media files.</div>';
    mediaGrid.querySelectorAll('img').forEach(imageFallback);
  };

  const openAlbum = (album) => {
    state.activeAlbum = album;
    state.activeIndex = 0;
    openLightbox(0);
  };

  const closeAlbum = () => { state.activeAlbum = null; renderAlbums(); };

  const renderLightboxThumbs = () => {
    const album = state.activeAlbum;
    if (!album) return;
    lightboxThumbs.innerHTML = album.items.map((item, index) => {
      const type = mediaType(item);
      const content = type === 'video'
        ? '<video src="' + escapeHtml(mediaUrl(item.src)) + '" muted playsinline preload="metadata" aria-hidden="true"></video>'
        : '<img src="' + escapeHtml(mediaUrl(item.src)) + '" alt="" loading="lazy">';
      return '<button class="lightbox-thumb' + (index === state.activeIndex ? ' is-active' : '') + '" type="button" role="listitem" data-thumb-index="' + index + '" aria-label="View ' + (index + 1) + ' of ' + album.items.length + '"' + (index === state.activeIndex ? ' aria-current="true"' : '') + '>' + content + '</button>';
    }).join('');
    lightboxThumbs.querySelectorAll('img').forEach(imageFallback);
    requestAnimationFrame(() => {
      lightboxThumbs.querySelector('.lightbox-thumb.is-active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  };

  const updateLightboxThumbState = () => {
    lightboxThumbs.querySelectorAll('.lightbox-thumb').forEach((thumb, index) => {
      const active = index === state.activeIndex;
      thumb.classList.toggle('is-active', active);
      if (active) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    requestAnimationFrame(() => {
      lightboxThumbs.querySelector('.lightbox-thumb.is-active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  };

  const updateLightbox = () => {
    const album = state.activeAlbum;
    if (!album || !album.items.length) return;
    const item = album.items[state.activeIndex];
    const type = mediaType(item);
    const media = document.getElementById('lightbox-media');
    lightbox.classList.add('is-changing');
    window.setTimeout(() => {
      media.innerHTML = type === 'video'
        ? `<video src="${escapeHtml(mediaUrl(item.src))}" controls playsinline preload="metadata"></video>`
        : `<img src="${escapeHtml(mediaUrl(item.src))}" alt="${escapeHtml(item.name || album.title)}">`;
      document.getElementById('lightbox-name').textContent = item.name || pretty(item.path || 'Media');
      document.getElementById('lightbox-position').textContent = `${state.activeIndex + 1} / ${album.items.length}`;
      lightbox.querySelector('.lightbox-prev').disabled = album.items.length < 2;
      lightbox.querySelector('.lightbox-next').disabled = album.items.length < 2;
      updateLightboxThumbState();
      lightbox.classList.remove('is-changing');
    }, 90);
  };

  const openLightbox = (index) => {
    if (!state.activeAlbum?.items?.length) return;
    state.lastFocused = document.activeElement;
    state.activeIndex = index;
    renderLightboxThumbs();
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    updateLightbox();
    window.requestAnimationFrame(() => lightbox.querySelector('.lightbox-close')?.focus());
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.querySelectorAll('video').forEach((video) => video.pause());
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    state.lastFocused?.focus?.();
  };

  const stepLightbox = (direction) => {
    const length = state.activeAlbum?.items?.length || 0;
    if (length < 2) return;
    state.activeIndex = (state.activeIndex + direction + length) % length;
    updateLightbox();
  };

  albumGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-album-id]');
    if (!card) return;
    const album = state.albums.find((item) => item.id === card.dataset.albumId);
    if (album) openAlbum(album);
  });
  mediaGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-media-index]');
    if (card) openLightbox(Number(card.dataset.mediaIndex));
  });
  backButton?.addEventListener('click', closeAlbum);
  lightbox.addEventListener('click', (event) => {
    if (event.target.closest('[data-lightbox-close]')) {
      closeLightbox();
      return;
    }
    const thumb = event.target.closest('[data-thumb-index]');
    if (!thumb) return;
    state.activeIndex = Number(thumb.dataset.thumbIndex);
    updateLightbox();
  });
  document.getElementById('lightbox-prev')?.addEventListener('click', () => stepLightbox(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => stepLightbox(1));

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });

  lightbox.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    state.touchActive = true;
    state.touchStartX = event.touches[0].clientX;
    state.touchStartY = event.touches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener('touchend', (event) => {
    if (!state.touchActive || event.changedTouches.length !== 1) return;
    state.touchActive = false;
    const dx = event.changedTouches[0].clientX - state.touchStartX;
    const dy = event.changedTouches[0].clientY - state.touchStartY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.15) stepLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });

  const buildAlbums = (manifest) => {
    const folders = Array.isArray(manifest.folders) ? manifest.folders : [];
    if (folders.length) return folders.map((folder) => ({ ...folder, id: folder.id || folder.path || folder.title, title: folder.title || pretty(folder.path), categoryLabel: folder.categoryLabel || pretty(folder.category || 'Gallery'), items: normalizeItems(folder.items) })).filter((folder) => folder.items.length);
    const legacy = manifest.folders && typeof manifest.folders === 'object' ? manifest.folders : {};
    return Object.entries(legacy).map(([path, items]) => ({ id: path, path, title: path ? pretty(path.split('/').pop()) : 'Gallery', categoryLabel: path.startsWith('factory') ? 'Factory Images' : path.startsWith('events') ? 'Corporate Events' : path.startsWith('videos') ? 'Video Gallery' : 'Gallery', items: normalizeItems(items) })).filter((folder) => folder.items.length);
  };

  const buildAutoAlbums = (tree, manifest) => {
    const manifestAlbums = buildAlbums(manifest);
    const metadata = new Map();

    manifestAlbums.forEach((album) => {
      album.items.forEach((item) => {
        const key = String(item.path || item.src || '').split('?')[0].replace(/^images\\//, '').toLowerCase();
        metadata.set(key, item);
      });
    });

    const files = Array.isArray(tree?.tree)
      ? tree.tree.filter((entry) =>
          entry?.type === 'blob' &&
          entry.path?.startsWith('images/gallery/') &&
          (imageExtensions.has(extension(entry.path)) || videoExtensions.has(extension(entry.path)))
        )
      : [];

    if (!files.length) return manifestAlbums;

    const grouped = new Map();

    files.forEach((entry) => {
      const relative = entry.path.replace(/^images\\/gallery\\//, '');
      const parts = relative.split('/');
      if (parts.length < 2) return;

      const folder = parts.slice(0, -1).join('/');
      const fileName = parts.at(-1);
      const manifestItem = metadata.get(entry.path.replace(/^images\\//, '').toLowerCase());
      const id = folder.toLowerCase();

      if (!grouped.has(id)) {
        const firstFolder = folder.split('/');
        grouped.set(id, {
          id: id,
          title: firstFolder.at(-1) ? pretty(firstFolder.at(-1)) : 'Gallery',
          category: 'gallery',
          categoryLabel: folder.startsWith('events/') ? 'Corporate Events' : 'Gallery Album',
          path: folder,
          items: []
        });
      }

      const type = videoExtensions.has(extension(fileName)) ? 'video' : 'image';
      grouped.get(id).items.push({
        ...(manifestItem || {}),
        src: `images/gallery/${relative}`,
        path: `gallery/${relative}`,
        name: manifestItem?.name || pretty(fileName.replace(/\\.[^.]+$/, '')),
        type
      });
    });

    const ordered = [];
    const used = new Set();

    manifestAlbums.forEach((album) => {
      const key = String(album.path || '').toLowerCase();
      const autoAlbum = grouped.get(key);
      if (autoAlbum) {
        autoAlbum.title = album.title || autoAlbum.title;
        autoAlbum.category = album.category || autoAlbum.category;
        autoAlbum.categoryLabel = album.categoryLabel || autoAlbum.categoryLabel;
        autoAlbum.id = album.id || autoAlbum.id;
        ordered.push(autoAlbum);
        used.add(key);
      } else if (!String(album.path || '').startsWith('events/') && !String(album.path || '').startsWith('images')) {
        ordered.push(album);
      }
    });

    grouped.forEach((album, key) => {
      if (!used.has(key)) ordered.push(album);
    });

    return ordered.filter((album) => album.items.length);
  };

  const load = async () => {
    try {
      const [manifestResponse, treeResponse] = await Promise.all([
        fetch(`images.json?v=${Date.now()}`, { cache: 'no-store' }),
        fetch(`https://api.github.com/repos/Kabikesu/dexin-nepal-website/git/trees/main?recursive=1&t=${Date.now()}`, { cache: 'no-store' })
      ]);

      if (!manifestResponse.ok) throw new Error(`Manifest HTTP ${manifestResponse.status}`);

      const manifest = await manifestResponse.json();

      if (treeResponse.ok) {
        const tree = await treeResponse.json();
        state.albums = buildAutoAlbums(tree, manifest);
      } else {
        console.warn('GitHub gallery auto-detection unavailable; using images.json fallback.');
        state.albums = buildAlbums(manifest);
      }

      renderAlbums();
    } catch (error) {
      console.error('Gallery load failed:', error);
      status.hidden = false;
      status.textContent = 'Gallery collections are temporarily unavailable.';
    }
  };

  load();
})();
