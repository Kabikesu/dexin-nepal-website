(() => {
  'use strict';

  const departmentGrid = document.getElementById('department-grid');
  const leadershipGrid = document.getElementById('leadership-grid');
  const loadError = document.getElementById('staff-load-error');
  const modal = document.getElementById('staff-modal');
  if (!departmentGrid || !leadershipGrid || !modal) return;

  const state = { staff: null, lastFocused: null };
  const initials = (name = '') => name.replace(/^(Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'DX';
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const photoMarkup = (person, className = 'staff-photo') => {
    const label = escapeHtml(person?.name || 'Staff member');
    if (person?.photo) {
      return `<div class="${className}"><img src="${escapeHtml(person.photo)}" alt="${label}" loading="lazy" data-photo-fallback="${escapeHtml(initials(person.name))}"></div>`;
    }
    return `<div class="${className}"><span class="${className.includes('member') ? 'member-placeholder' : 'head-placeholder'}" aria-label="Photo not available">${escapeHtml(initials(person?.name))}</span></div>`;
  };

  const attachPhotoFallbacks = (root) => {
    root.querySelectorAll('img[data-photo-fallback]').forEach((image) => {
      image.addEventListener('error', () => {
        const box = image.parentElement;
        if (!box || box.dataset.fallbackApplied) return;
        box.dataset.fallbackApplied = 'true';
        const placeholder = document.createElement('span');
        placeholder.className = 'head-placeholder';
        placeholder.textContent = image.dataset.photoFallback || 'DX';
        placeholder.setAttribute('aria-label', 'Photo not available');
        image.replaceWith(placeholder);
      }, { once: true });
    });
  };

  const allMembers = (department) => {
    const direct = Array.isArray(department.members) ? department.members : [];
    const groups = Array.isArray(department.groups) ? department.groups : [];
    return direct.concat(groups.flatMap((group) => Array.isArray(group.members) ? group.members : []));
  };

  const findPerson = (id) => {
    for (const person of state.staff.leadership || []) if (person.id === id) return person;
    for (const department of state.staff.departments || []) {
      if (department.headId === id) return department.members?.find((person) => person.id === id) || null;
      for (const person of department.members || []) if (person.id === id) return person;
      for (const group of department.groups || []) {
        if (group.headId === id) return group.members?.find((person) => person.id === id) || null;
        for (const person of group.members || []) if (person.id === id) return person;
      }
    }
    return null;
  };

  const headFor = (department) => department.headId ? findPerson(department.headId) : null;

  const memberCard = (person, departmentName) => `
    <button class="member-card" type="button" data-person-id="${escapeHtml(person.id)}" data-department="${escapeHtml(departmentName)}">
      ${photoMarkup(person, 'member-photo')}
      <span class="member-body">
        <strong>${escapeHtml(person.name)}</strong>
        <span>${escapeHtml(person.role)}</span>
      </span>
    </button>`;

  const departmentMembers = (department) => {
    if (department.groups?.length) {
      return department.groups.map((group) => {
        const groupHead = group.headId ? group.members?.find((person) => person.id === group.headId) : null;
        const members = (group.members || []).filter((person) => person.id !== group.headId);
        return `<div class="unit-block">
          <div class="unit-title"><h4>${escapeHtml(group.name)}</h4><span>${members.length + (groupHead ? 1 : 0)} members</span></div>
          ${groupHead ? `<div class="unit-head">${memberCard(groupHead, `${department.name} / ${group.name}`)}</div>` : ''}
          <div class="member-grid">${members.map((person) => memberCard(person, `${department.name} / ${group.name}`)).join('')}</div>
        </div>`;
      }).join('');
    }
    const members = (department.members || []).filter((person) => person.id !== department.headId);
    return members.length ? `<div class="member-grid">${members.map((person) => memberCard(person, department.name)).join('')}</div>` : '<p class="staff-state">No additional team members listed.</p>';
  };

  const renderLeadership = () => {
    leadershipGrid.innerHTML = (state.staff.leadership || []).map((person) => `
      <article class="leadership-card" tabindex="0" data-person-id="${escapeHtml(person.id)}">
        ${person.label ? `<span class="staff-label">${escapeHtml(person.label)}</span>` : ''}
        ${photoMarkup(person)}
        <h3>${escapeHtml(person.name)}</h3>
        <p class="staff-role">${escapeHtml(person.role)}</p>
      </article>
    `).join('');
    attachPhotoFallbacks(leadershipGrid);
  };

  const renderDepartments = () => {
    departmentGrid.innerHTML = (state.staff.departments || []).map((department, index) => {
      const head = headFor(department);
      const count = allMembers(department).length;
      const headMarkup = head ? `
        <div class="department-head">
          ${photoMarkup(head)}
          <div><span class="department-head-label">Department Head</span><h3>${escapeHtml(head.name)}</h3><p class="staff-role">${escapeHtml(head.role)}</p></div>
        </div>` : `
        <div class="department-head vacant-head">
          <div class="staff-photo"><span class="head-placeholder">—</span></div>
          <div><span class="department-head-label">Department Head</span><h3>Position Vacant / Not Specified</h3><p class="staff-role">Update the staff data when the position is assigned.</p></div>
        </div>`;
      return `<article class="department-card" data-department-id="${escapeHtml(department.id)}">
        <button class="department-trigger" type="button" aria-expanded="false" aria-controls="department-content-${escapeHtml(department.id)}">
          <span class="department-top"><span><span class="department-index">${String(index + 1).padStart(2, '0')}</span><span class="department-index"> · ${count} people</span><h3>${escapeHtml(department.name)}</h3><p>${escapeHtml(department.description || '')}</p></span><span class="department-arrow" aria-hidden="true">⌄</span></span>
          ${headMarkup}
        </button>
        <div class="department-content" id="department-content-${escapeHtml(department.id)}"><div class="department-content-inner">${departmentMembers(department)}</div></div>
      </article>`;
    }).join('');
    attachPhotoFallbacks(departmentGrid);
  };

  const openProfile = (person, departmentName = 'TEAM MEMBER') => {
    if (!person) return;
    state.lastFocused = document.activeElement;
    document.getElementById('staff-modal-department').textContent = departmentName;
    document.getElementById('staff-modal-name').textContent = person.name || 'Staff member';
    document.getElementById('staff-modal-role').textContent = person.role || '';
    document.getElementById('staff-modal-bio').textContent = person.bio || 'Professional profile information will be added to the staff data when approved.';
    const photo = document.getElementById('staff-modal-photo');
    photo.innerHTML = photoMarkup(person, 'staff-modal-photo');
    const email = document.getElementById('staff-modal-email');
    if (person.email) { email.href = `mailto:${person.email}`; email.hidden = false; } else { email.hidden = true; }
    attachPhotoFallbacks(photo);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => modal.querySelector('.staff-modal-close')?.focus());
  };

  const closeProfile = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    state.lastFocused?.focus?.();
  };

  const bindInteractions = () => {
    departmentGrid.addEventListener('click', (event) => {
      const member = event.target.closest('[data-person-id]');
      if (member && member.classList.contains('member-card')) {
        openProfile(findPerson(member.dataset.personId), member.dataset.department || 'TEAM MEMBER');
        return;
      }
      const trigger = event.target.closest('.department-trigger');
      if (!trigger) return;
      const card = trigger.closest('.department-card');
      const open = card.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });

    leadershipGrid.addEventListener('click', (event) => {
      const card = event.target.closest('[data-person-id]');
      if (card) openProfile(findPerson(card.dataset.personId), 'LEADERSHIP');
    });

    leadershipGrid.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest('[data-person-id]');
      if (!card) return;
      event.preventDefault();
      openProfile(findPerson(card.dataset.personId), 'LEADERSHIP');
    });

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-modal-close]')) closeProfile();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeProfile(); });
  };

  const load = async () => {
    try {
      const response = await fetch('data/staff.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.staff = await response.json();
      renderLeadership();
      renderDepartments();
      bindInteractions();
    } catch (error) {
      console.error('Staff data load failed:', error);
      loadError.hidden = false;
    }
  };

  load();
})();
