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


  const productHero = document.getElementById('products-hero-visual');
  const productHeroOrbit = document.getElementById('products-hero-orbit');
  let heroRotation = 0;
  let heroFrame = 0;
  let heroLastTime = 0;

  const renderProductHero = () => {
    if (!productHeroOrbit) return;

    productHeroOrbit.innerHTML = products.map((product, index) => `
      <button class="products-hero-card" type="button" data-hero-product="${product.id}" aria-label="View ${product.name}">
        <img src="${product.image}" alt="" loading="${index < 8 ? 'eager' : 'lazy'}">
        <span class="products-hero-card-label">${product.name}</span>
      </button>
    `).join('');
  };

  const animateProductHero = (time) => {
    if (!productHeroOrbit || !productHero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!heroLastTime) heroLastTime = time;
    const delta = Math.min(time - heroLastTime, 40);
    heroLastTime = time;
    heroRotation = (heroRotation + delta * 0.014) % 360;

    const cards = productHeroOrbit.querySelectorAll('.products-hero-card');
    const total = cards.length;
    const width = productHero.clientWidth;
    const height = productHero.clientHeight;
    const radiusX = Math.min(width * 0.43, 390);
    const radiusY = Math.min(height * 0.30, 205);
    const depth = Math.min(width * 0.30, 245);

    cards.forEach((card, index) => {
      const angle = ((index / total) * Math.PI * 2) + (heroRotation * Math.PI / 180);
      const x = Math.sin(angle) * radiusX;
      const y = Math.cos(angle) * radiusY;
      const z = Math.cos(angle) * depth;
      const frontness = (z + depth) / (depth * 2);
      const scale = 0.68 + (frontness * 0.40);
      const opacity = 0.28 + (frontness * 0.72);
      const blur = Math.max(0, (0.42 - frontness) * 2.2);
      const isFront = Math.cos(angle) > 0.90;

      card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) scale(${scale})`;
      card.style.zIndex = String(Math.round(frontness * 1000));
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = `blur(${blur.toFixed(2)}px)`;
      card.classList.toggle('is-front', isFront);
    });

    heroFrame = window.requestAnimationFrame(animateProductHero);
  };

  renderProductHero();
  if (productHeroOrbit && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroFrame = window.requestAnimationFrame(animateProductHero);
  }

  const productGrid = document.getElementById('product-grid');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCount = document.getElementById('product-count');
  const productEmpty = document.getElementById('product-empty');
  const modal = document.getElementById('product-modal');

  if (!productGrid || !modal) return;

  let activeFilter = 'all';
  let lastFocused = null;

  const labelForStatus = (status) => status === 'upcoming' ? 'Upcoming' : 'Current';
  const labelForCategory = (category) => category === 'coffee' ? 'Coffee' : 'Nutraceuticals';

  const renderProducts = (filter = 'all') => {
    activeFilter = filter;
    const visibleProducts = products.filter((product) => filter === 'all' || product.status === filter || product.category === filter);

    productGrid.innerHTML = visibleProducts.map((product, index) => `
      <article class="product-card is-entering" style="--i:${index}" data-product-id="${product.id}">
        <div class="product-media">
          <span class="product-badge ${product.status === 'upcoming' ? 'upcoming' : ''} ${product.id === 'cordyceps-coffee' ? 'top' : ''}">${product.status === 'upcoming' ? 'Upcoming' : product.id === 'cordyceps-coffee' ? 'Featured' : 'Product'}</span>
          <img data-product-image src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-card-body">
          <div class="product-meta">
            <span class="product-category">${labelForCategory(product.category)}</span>
            <span class="product-status ${product.status === 'upcoming' ? 'upcoming' : ''}">${labelForStatus(product.status)}</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <button class="product-card-button" type="button" data-product-open="${product.id}">View Details</button>
        </div>
      </article>
    `).join('');

    productCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}`;
    productEmpty.hidden = visibleProducts.length !== 0;

  
  if (productHeroOrbit) {
    productHeroOrbit.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-hero-product]');
      if (!trigger) return;
      const product = products.find((item) => item.id === trigger.dataset.heroProduct);
      if (product) openModal(product);
    });
  }

  filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    enableCardTilt();
  };

  const enableCardTilt = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover)').matches) return;

    productGrid.querySelectorAll('.product-card').forEach((card) => {
      let frame = 0;
      let pendingX = 0;
      let pendingY = 0;

      const reset = () => {
        window.cancelAnimationFrame(frame);
        card.style.transform = '';
      };

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        pendingX = x;
        pendingY = y;

        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          card.style.transform = `translate3d(0,-7px,0) perspective(900px) rotateX(${pendingY * -5}deg) rotateY(${pendingX * 5}deg)`;
          frame = 0;
        });
      }, { passive: true });

      card.addEventListener('pointerleave', reset, { passive: true });
    });
  };

  const openModal = (product) => {
    lastFocused = document.activeElement;
    document.getElementById('modal-product-status').textContent = labelForStatus(product.status);
    document.getElementById('modal-product-status').className = `product-status ${product.status === 'upcoming' ? 'upcoming' : ''}`;
    document.getElementById('modal-product-category').textContent = labelForCategory(product.category);
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description;

    const media = document.getElementById('modal-product-media');
    media.innerHTML = `<img data-product-image src="${product.image}" alt="${product.name}">`;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => modal.querySelector('.modal-close')?.focus());
  };

  const closeModal = () => {
    if (modal.hidden) return;
    modal.classList.add('is-closing');
    window.setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lastFocused?.focus();
    }, 180);
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => renderProducts(button.dataset.filter));
  });

  productGrid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-product-open]');
    if (!trigger) return;
    const product = products.find((item) => item.id === trigger.dataset.productOpen);
    if (product) openModal(product);
  });

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-modal-close]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  renderProducts();
})();
