(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    };
    updateHeader();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  if (menuToggle && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const products = [
    { id: 'gl90', name: 'Ganocelium (GL-90) Capsule', status: 'current', category: 'nutraceuticals', description: 'A DXN nutraceutical product listed for the Nepal manufacturing portfolio.', image: 'images/products/nutraceuticals/Ganocelium GL-90.jpg' },
    { id: 'rg90', name: 'Reishi Gano (RG-90) Capsule', status: 'current', category: 'nutraceuticals', description: 'A DXN nutraceutical product listed for the Nepal manufacturing portfolio.', image: 'images/products/nutraceuticals/Reishi Gano RG-90.jpg' },
    { id: 'spirulina-powder', name: 'Spirulina Powder - 50 gm', status: 'current', category: 'nutraceuticals', description: 'DXN Spirulina powder in the planned nutraceutical product range.', image: 'images/products/nutraceuticals/Spirulina Powder 50g.jpg' },
    { id: 'spirulina-tablet-120', name: "Spirulina Tablets 120's", status: 'current', category: 'nutraceuticals', description: 'DXN Spirulina tablet product in the Nepal portfolio.', image: 'images/products/nutraceuticals/spirulina-tablet-120.jpg' },
    { id: 'spirulina-tablet-360', name: "Spirulina Tablets 360's", status: 'current', category: 'nutraceuticals', description: 'DXN Spirulina tablet product in the Nepal portfolio.', image: 'images/products/nutraceuticals/spirulina-tablet-360.jpg' },
    { id: 'spirulina-capsule-120', name: "Spirulina Capsule 120's", status: 'current', category: 'nutraceuticals', description: 'DXN Spirulina capsule product in the Nepal portfolio.', image: 'images/products/nutraceuticals/spirulina-capsule-120.jpg' },
    { id: 'spirulina-capsule-360', name: "Spirulina Capsule 360's", status: 'current', category: 'nutraceuticals', description: 'DXN Spirulina capsule product in the Nepal portfolio.', image: 'images/products/nutraceuticals/spirulina-capsule-360.jpg' },
    { id: 'cocozhi', name: 'Cocozhi', status: 'current', category: 'coffee', description: 'A DXN beverage product included in the coffee-unit portfolio.', image: 'images/products/coffee/Cocozhi.jpg' },
    { id: 'lingzhi-3in1', name: 'Lingzhi Coffee 3 in 1', status: 'current', category: 'coffee', description: 'DXN coffee product for the coffee manufacturing portfolio.', image: 'images/products/coffee/Lingzhi Coffee 3 in 1.jpg' },
    { id: 'cordyceps-coffee', name: 'Cordyceps Coffee 3 in 1', status: 'current', category: 'coffee', description: 'DXN coffee product included in the coffee-unit portfolio.', image: 'images/products/coffee/Cordyceys coffe.jpeg' },
    { id: 'rg360', name: 'Reishi Gano (RG-360) Capsule', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming nutraceutical product in the Nepal manufacturing plan.', image: 'images/products/nutraceuticals/rg-360.jpg' },
    { id: 'gl360', name: 'Ganocelium (GL-360) Capsule', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming nutraceutical product in the Nepal manufacturing plan.', image: 'images/products/nutraceuticals/gl-360.jpg' },
    { id: 'cordyceps-capsule-120', name: 'Cordyceps Capsule 120', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming Cordyceps capsule product.', image: 'images/products/nutraceuticals/cordyceps-capsule-120.jpg' },
    { id: 'cordyceps-capsule-360', name: 'Cordyceps Capsule 360', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming Cordyceps capsule product.', image: 'images/products/nutraceuticals/cordyceps-capsule-360.jpg' },
    { id: 'cordyceps-tablet-120', name: 'Cordyceps Tablets 120', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming Cordyceps tablet product.', image: 'images/products/nutraceuticals/cordyceps-tablet-120.jpg' },
    { id: 'cordyceps-tablet-360', name: 'Cordyceps Tablets 360', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming Cordyceps tablet product.', image: 'images/products/nutraceuticals/cordyceps-tablet-360.jpg' },
    { id: 'lionsmane-capsule-120', name: "LionsMane Capsule 120", status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming LionsMane capsule product.', image: 'images/products/nutraceuticals/lionsmane-capsule-120.jpg' },
    { id: 'lionsmane-capsule-360', name: "LionsMane Capsule 360", status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming LionsMane capsule product.', image: 'images/products/nutraceuticals/lionsmane-capsule-360.jpg' },
    { id: 'lionsmane-tablet-120', name: "LionsMane Tablets 120", status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming LionsMane tablet product.', image: 'images/products/nutraceuticals/lionsmane-tablet-120.jpg' },
    { id: 'lionsmane-tablet-360', name: "LionsMane Tablets 360", status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming LionsMane tablet product.', image: 'images/products/nutraceuticals/lionsmane-tablet-360.jpg' },
    { id: 'reishi-powder', name: 'Reishi Mushroom Powder - 70 gm', status: 'upcoming', category: 'nutraceuticals', description: 'An upcoming Reishi mushroom powder product.', image: 'images/products/nutraceuticals/reishi-powder-70g.jpg' }
  ];

  const filterButtons = Array.from(document.querySelectorAll('#product-filters [data-filter]'));
  const productGrid = document.getElementById('product-grid');
  const productCount = document.getElementById('product-count');
  const productEmpty = document.getElementById('product-empty');
  const modal = document.getElementById('product-modal');
  const modalMedia = document.getElementById('modal-product-media');
  const modalStatus = document.getElementById('modal-product-status');
  const modalCategory = document.getElementById('modal-product-category');
  const modalName = document.getElementById('modal-product-name');
  const modalDescription = document.getElementById('modal-product-description');
  let lastFocused = null;

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const labelForCategory = (category) => category === 'coffee' ? 'Coffee' : 'Nutraceuticals';
  const labelForStatus = (status) => status === 'upcoming' ? 'Upcoming' : 'Current';
  const normalizeIndex = (index) => products.length ? ((index % products.length) + products.length) % products.length : 0;

  const openModal = (product) => {
    if (!modal || !product) return;
    lastFocused = document.activeElement;
    modalStatus.textContent = labelForStatus(product.status);
    modalStatus.classList.toggle('upcoming', product.status === 'upcoming');
    modalCategory.textContent = labelForCategory(product.category);
    modalName.textContent = product.name;
    modalDescription.textContent = product.description;
    modalMedia.innerHTML = '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '">';
    const image = modalMedia.querySelector('img');
    image.addEventListener('error', () => {
      modalMedia.innerHTML = '<div class="product-media-fallback"><strong>' + escapeHtml(product.name) + '</strong></div>';
    });
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => modal.querySelector('.modal-close')?.focus());
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.classList.add('is-closing');
    window.setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lastFocused?.focus();
    }, 180);
  };

  const renderProducts = (filter = 'all') => {
    if (!productGrid) return;
    const visibleProducts = products.filter((product) =>
      filter === 'all' || product.status === filter || product.category === filter
    );

    productGrid.innerHTML = visibleProducts.map((product, index) =>
      '<article class="product-card is-entering" style="--i:' + index + '">' +
        '<div class="product-media">' +
          '<span class="product-badge ' + product.status + '">' + escapeHtml(labelForStatus(product.status)) + '</span>' +
          '<img data-product-image src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">' +
        '</div>' +
        '<div class="product-card-body">' +
          '<div class="product-meta">' +
            '<span class="product-category">' + escapeHtml(labelForCategory(product.category)) + '</span>' +
            '<span class="product-status ' + product.status + '">' + escapeHtml(labelForStatus(product.status)) + '</span>' +
          '</div>' +
          '<h3>' + escapeHtml(product.name) + '</h3>' +
          '<p>' + escapeHtml(product.description) + '</p>' +
          '<button class="product-card-button" type="button" data-product-open="' + escapeHtml(product.id) + '">View product</button>' +
        '</div>' +
      '</article>'
    ).join('');

    productCount.textContent = visibleProducts.length + ' product' + (visibleProducts.length === 1 ? '' : 's');
    productEmpty.hidden = visibleProducts.length !== 0;
  };

  const heroShowcase = document.getElementById('hero-product-showcase');

  if (heroShowcase && products.length) {
    const heroRing = document.getElementById('hero-product-ring');
    const heroMain = document.getElementById('hero-product-main');
    const heroMainImage = document.getElementById('hero-product-main-image');
    const heroName = document.getElementById('hero-product-name');
    const heroType = document.getElementById('hero-product-type');
    const heroCounter = document.getElementById('hero-product-counter');
    const heroPrev = document.getElementById('hero-product-prev');
    const heroNext = document.getElementById('hero-product-next');

    let heroIndex = Math.max(0, products.findIndex((product) => product.id === 'cocozhi'));
    let heroTimer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const slotConfig = [
      { offset: -3, x: -500, y: 42, scale: .56, rotate: -12, opacity: .42 },
      { offset: -2, x: -350, y: 14, scale: .72, rotate: -8, opacity: .68 },
      { offset: -1, x: -210, y: -8, scale: .86, rotate: -4, opacity: .94 },
      { offset: 1, x: 210, y: -8, scale: .86, rotate: 4, opacity: .94 },
      { offset: 2, x: 350, y: 14, scale: .72, rotate: 8, opacity: .68 },
      { offset: 3, x: 500, y: 42, scale: .56, rotate: 12, opacity: .42 }
    ];

    const renderHero = (animate = true) => {
      const product = products[heroIndex];
      heroMainImage.src = product.image;
      heroMainImage.alt = product.name;
      heroName.textContent = product.name;
      heroType.textContent = labelForCategory(product.category);
      heroCounter.textContent = String(heroIndex + 1).padStart(2, '0') + ' / ' + String(products.length).padStart(2, '0');
      heroMain.dataset.productId = product.id;

      heroRing.innerHTML = slotConfig.map((slot) => {
        const productIndex = normalizeIndex(heroIndex + slot.offset);
        const item = products[productIndex];
        return '<button class="hero-product-orbit-item" type="button" data-hero-index="' + productIndex + '" aria-label="Show ' + escapeHtml(item.name) + '">' +
          '<span class="hero-product-orbit-media">' +
            '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" loading="eager">' +
            '<span class="hero-product-image-fallback" aria-hidden="true">' + escapeHtml(item.name) + '</span>' +
          '</span>' +
          '<span class="hero-product-orbit-label">' + escapeHtml(item.name) + '</span>' +
        '</button>';
      }).join('');

      heroRing.querySelectorAll('.hero-product-orbit-item').forEach((item) => {
        const productIndex = Number(item.dataset.heroIndex);
        const delta = (productIndex - heroIndex + products.length) % products.length;
        const signedDelta = delta > products.length / 2 ? delta - products.length : delta;
        const slot = slotConfig.find((entry) => entry.offset === signedDelta);
        if (!slot) return;

        item.style.setProperty('--slot-x', slot.x + 'px');
        item.style.setProperty('--slot-y', slot.y + 'px');
        item.style.setProperty('--slot-scale', slot.scale);
        item.style.setProperty('--slot-rotate', slot.rotate + 'deg');
        item.style.opacity = String(slot.opacity);
        item.style.zIndex = String(30 - Math.abs(slot.offset));

        item.addEventListener('click', () => {
          heroIndex = productIndex;
          renderHero(true);
          restartHeroTimer();
        });

        item.querySelector('img')?.addEventListener('error', (event) => {
          event.currentTarget.closest('.hero-product-orbit-media')?.classList.add('is-missing');
        });
      });

      heroShowcase.classList.toggle('is-changing', animate);
      if (animate) window.setTimeout(() => heroShowcase.classList.remove('is-changing'), 650);
    };

    const advanceHero = (step = 1) => {
      heroIndex = normalizeIndex(heroIndex + step);
      renderHero(true);
    };

    const stopHeroTimer = () => {
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
    };

    const restartHeroTimer = () => {
      stopHeroTimer();
      if (!reduceMotion) heroTimer = window.setInterval(() => advanceHero(1), 3000);
    };

    heroPrev?.addEventListener('click', () => {
      advanceHero(-1);
      restartHeroTimer();
    });

    heroNext?.addEventListener('click', () => {
      advanceHero(1);
      restartHeroTimer();
    });

    heroMain?.addEventListener('click', () => {
      const product = products.find((item) => item.id === heroMain.dataset.productId);
      if (product) openModal(product);
    });

    heroShowcase.addEventListener('mouseenter', stopHeroTimer);
    heroShowcase.addEventListener('mouseleave', restartHeroTimer);
    heroShowcase.addEventListener('focusin', stopHeroTimer);
    heroShowcase.addEventListener('focusout', (event) => {
      if (!heroShowcase.contains(event.relatedTarget)) restartHeroTimer();
    });

    heroMainImage.addEventListener('error', () => {
      heroMainImage.style.display = 'none';
      heroMain.classList.add('has-image-fallback');
    });

    heroMainImage.addEventListener('load', () => {
      heroMainImage.style.display = '';
      heroMain.classList.remove('has-image-fallback');
    });

    renderHero(false);
    restartHeroTimer();
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderProducts(button.dataset.filter);
    });
  });

  productGrid?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-product-open]');
    if (!trigger) return;
    const product = products.find((item) => item.id === trigger.dataset.productOpen);
    if (product) openModal(product);
  });

  modal?.addEventListener('click', (event) => {
    if (event.target.closest('[data-modal-close]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  renderProducts();
})();