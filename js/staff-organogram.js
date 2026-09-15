(function () {
  'use strict';

  const root = document.querySelector('[data-staff-organogram]');
  if (!root) return;

  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
  const initials = name => String(name || '').replace(/^Mr\.?\s|^Mrs\.?\s|^Ms\.?\s/, '').split(/\s+/).filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  const cleanName = name => String(name || '').replace(/^Mr\.?\s|^Mrs\.?\s|^Ms\.?\s/, '');

  const bioFor = person => {
    if (person.bio) return person.bio;
    const role = String(person.role || '').toLowerCase();
    if (role.includes('microbiolog')) return 'Supports microbiological quality activities and laboratory controls that help maintain product quality, hygiene, and compliance standards.';
    if (role.includes('it')) return 'Supports IT infrastructure, systems, users, connectivity, cybersecurity, and day-to-day technology operations across the organization.';
    if (role.includes('finance') || role.includes('account')) return 'Supports financial operations, accounting activities, reporting, controls, and timely coordination of finance requirements.';
    if (role.includes('hr') || role.includes('human')) return 'Supports people operations, employee administration, HR coordination, and workplace services.';
    if (role.includes('procurement') || role.includes('purchase')) return 'Supports sourcing, purchasing coordination, supplier communication, and procurement activities for operational requirements.';
    if (role.includes('warehouse')) return 'Supports warehouse operations, inventory handling, material coordination, and organized movement of goods.';
    if (role.includes('quality') || role.includes('qc')) return 'Supports quality control activities, inspection, documentation, and coordination of quality requirements.';
    if (role.includes('engineering') || role.includes('technician') || role.includes('electrical')) return 'Supports engineering, equipment, electrical, maintenance, and technical activities required for reliable operations.';
    if (role.includes('utility')) return 'Supports utility operations and technical services that help maintain reliable factory facilities and production support systems.';
    if (role.includes('production') || role.includes('operator') || role.includes('packing') || role.includes('filling')) return 'Contributes to safe, efficient, and consistent production activities within the assigned manufacturing unit.';
    if (role.includes('admin') || role.includes('driver') || role.includes('housekeeping') || role.includes('assistant')) return 'Supports administration and day-to-day workplace operations, helping maintain smooth and efficient factory activities.';
    return 'Contributes to the successful operation of Dexin Manufacturing Nepal through responsibilities within the assigned role and department.';
  };

  const photoMarkup = person => person.photo
    ? `<img src="${esc(person.photo)}" alt="${esc(person.name)}" loading="lazy">`
    : `<span class="staff-photo-placeholder" aria-hidden="true">${esc(initials(person.name))}</span>`;

  const personCard = (person, isHead, extraClass = '') => `
    <button type="button" class="team-member-card ${isHead ? 'team-member-head' : ''} ${extraClass}" data-person='${esc(JSON.stringify(person))}'>
      <span class="team-member-photo">${photoMarkup(person)}<span class="team-member-open">View profile</span></span>
      <span class="team-member-label">${isHead ? '<small>HEAD OF DEPARTMENT</small>' : ''}<strong>${esc(cleanName(person.name))}</strong><em>${esc(person.role)}</em></span>
    </button>`;

  const normalizeDepartment = d => ({name: d.name, head: d.head || null, members: d.members || [], groups: d.groups || []});

  const build = data => {
    const leadership = {
      name: 'Executive Leadership',
      head: data.leadership?.[0] || null,
      members: data.leadership?.slice(1) || [],
      groups: []
    };
    const departments = [leadership, ...(data.departments || []).map(normalizeDepartment)];

    root.innerHTML = `
      <div class="team-intro">
        <p>Explore the leadership structure and departments of Dexin Manufacturing Nepal. Click a department or leadership level to discover individual profiles.</p>
      </div>
      <div class="team-department-grid">
        ${departments.map((d, index) => {
          const count = d.groups.length ? d.groups.reduce((n, g) => n + 1 + (g.members || []).length, 0) : (d.head ? 1 : 0) + d.members.length;
          return `<section class="team-department ${index === 0 ? 'leadership-department' : ''}" data-department>
            <button type="button" class="department-toggle" aria-expanded="false">
              <span class="department-icon">${esc(d.name.charAt(0))}</span>
              <span class="department-copy"><strong>${esc(d.name)}</strong><small>${count} team member${count === 1 ? '' : 's'}</small></span>
              <span class="department-chevron" aria-hidden="true">+</span>
            </button>
            <div class="department-panel" hidden>
              ${d.groups.length ? `<div class="team-unit-grid">${d.groups.map(g => `<div class="team-unit"><div class="team-unit-title"><h3>${esc(g.name)}</h3><span>${1 + (g.members || []).length} members</span></div>${g.head ? personCard(g.head, true) : ''}<div class="team-member-grid">${(g.members || []).map(p => personCard(p, false)).join('')}</div></div>`).join('')}</div>` : `<div class="team-member-grid department-members">${d.head ? personCard(d.head, true, d.name === 'Executive Leadership' ? 'executive-chairman-card' : '') : ''}${d.members.map(p => personCard(p, false)).join('')}</div>`}
            </div>
          </section>`;
        }).join('')}
      </div>
      <div class="team-profile-modal" data-profile-modal hidden>
        <div class="team-profile-backdrop" data-profile-close></div>
        <div class="team-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-name">
          <button type="button" class="team-profile-close" data-profile-close aria-label="Close profile">&times;</button>
          <div class="team-profile-content" data-profile-content></div>
        </div>
      </div>`;

    root.querySelectorAll('.department-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const section = toggle.closest('[data-department]');
        const panel = section.querySelector('.department-panel');
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
        section.classList.toggle('is-open', !open);
        toggle.querySelector('.department-chevron').textContent = open ? '+' : '−';
      });
    });

    const modal = root.querySelector('[data-profile-modal]');
    const content = root.querySelector('[data-profile-content]');
    const closeModal = () => { modal.hidden = true; document.body.classList.remove('profile-modal-open'); };

    root.querySelectorAll('.team-member-card').forEach(button => {
      button.addEventListener('click', () => {
        const person = JSON.parse(button.dataset.person);
        const email = person.email || '';
        const linkedin = person.linkedin || '';
        const isFounder = person.name === 'Datuk Dr Lim Siow Jin';
        content.innerHTML = `
          <div class="profile-photo-large ${isFounder ? 'founder-profile-photo' : ''}">${photoMarkup(person)}</div>
          <div class="profile-details ${isFounder ? 'founder-profile-details' : ''}">
            ${button.classList.contains('team-member-head') ? '<span class="profile-badge">EXECUTIVE LEADERSHIP</span>' : ''}
            <span class="profile-eyebrow">DEXIN MANUFACTURING NEPAL</span>
            <h3 id="profile-name">${esc(cleanName(person.name))}</h3>
            <p class="profile-role">${esc(person.role)}</p>
            <div class="profile-divider"></div>
            <p class="profile-bio">${esc(bioFor(person))}</p>
            <div class="profile-contact">
              ${email ? `<a href="mailto:${esc(email)}"><span>✉</span>${esc(email)}</a>` : '<span class="profile-unavailable">Professional email not published</span>'}
              ${linkedin ? `<a href="${esc(linkedin)}" target="_blank" rel="noopener noreferrer"><span>in</span>LinkedIn</a>` : ''}
            </div>
          </div>`;
        modal.hidden = false;
        document.body.classList.add('profile-modal-open');
      });
    });

    root.querySelectorAll('[data-profile-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });
  };

  fetch('data/staff.json', {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('Staff data unavailable'); return response.json(); })
    .then(build)
    .catch(() => { root.innerHTML = '<div class="staff-empty">Staff team data could not be loaded.</div>'; });
})();
