(function () {
  'use strict';
  const root = document.querySelector('[data-staff-organogram]');
  if (!root) return;
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const initials = n => n.replace(/^Mr\.?\s|^Mrs\.?\s|^Ms\.?\s/, '').split(/\s+/).map(x => x[0]).slice(0,2).join('').toUpperCase();
  const card = (p, cls='') => !p ? '' : `<article class="staff-card ${cls} ${p.class||''}"><div class="staff-photo">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">` : `<span class="staff-photo-placeholder">${esc(initials(p.name))}</span>`}</div><div class="staff-card-body"><h4>${esc(p.name)}</h4><p>${esc(p.role)}</p></div></article>`;
  fetch('data/staff.json', {cache:'no-store'}).then(r => { if (!r.ok) throw Error(); return r.json(); }).then(data => {
    root.innerHTML = `<div class="org-leadership">${data.leadership.map((p,i)=>(i?'<div class="org-connector"></div>':'')+card(p,i===3?'factory-pic':i===4?'deputy-fpic':'')).join('')}</div><div class="org-department-grid">${data.departments.map(d => d.name === 'Production' ? `<section class="org-department production-department"><div class="department-title"><span>${esc(d.name)}</span><small>Department</small></div><div class="department-note">Production Manager</div><div class="production-groups">${d.groups.map(g=>`<div class="production-group"><h3>${esc(g.name)}</h3>${card(g.head,'department-head')}<div class="member-grid">${g.members.map(p=>card(p)).join('')}</div></div>`).join('')}</div></section>` : `<section class="org-department"><div class="department-title"><span>${esc(d.name)}</span><small>Department</small></div>${card(d.head,'department-head')}${d.members?.length?`<div class="member-grid">${d.members.map(p=>card(p)).join('')}</div>`:''}</section>`).join('')}</div>`;
  }).catch(() => root.innerHTML='<div class="staff-empty">Staff organogram data could not be loaded.</div>');
})();
