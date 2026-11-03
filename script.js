function toggleFav(phone) {
  const i = favs.indexOf(phone);
  if (i >= 0) favs.splice(i, 1); else favs.push(phone);
  try { localStorage.setItem('mi_favs', JSON.stringify(favs)); } catch (e) {}
  applyFilters();
}

function tileHTML(t, selected) {
  const c = t.type === 'cat' ? catOf(t.id) : t;
  const icon = t.icon || c.icon, color = t.color || c.color;
  const val2 = t.id !== undefined ? t.id : '';
  return `<button class="tile ${color}${selected ? ' sel' : ''}" data-act="${t.type}" data-val="${esc(val2)}">
    <span class="ico"><i class="fa-solid ${icon}"></i></span><span class="lbl">${esc(t.label)}</span></button>`;
}
function renderHomeTiles() {
  const q = norm(val('searchInput'));
  setHTML('serviceGrid', homeTiles.map(t => {
    const sel = (t.type === 'cat' && state.cat === t.id) || (t.type === 'search' && q === norm(t.id));
    return tileHTML(t, sel);
  }).join(''));
}
function renderMoreSheet() {
  setHTML('moreGrid', moreSections.map(sec =>
    `<div class="more-title">${esc(sec.title)}</div><div class="more-row">${sec.items.map(t => tileHTML(t, false)).join('')}</div>`
  ).join(''));
}

/* लोकप्रिय सेवा: वर फोटो, खाली पांढऱ्या पट्टीवर नाव */
function renderPopular() {
  setHTML('popularList', popularServices.map(p => {
    const ph = catOf(p.id).photo;
    const pic = ph ? `<img src="${U(ph, 500)}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()">` : '';
    return `<button class="svc-card" data-act="cat" data-val="${p.id}">
      <span class="svc-img">${pic}<span class="svc-go"><i class="fa-solid fa-chevron-right"></i></span></span>
      <span class="svc-info"><b>${esc(p.title)}</b><small>${esc(p.sub)}</small></span></button>`;
  }).join(''));
}

/* लोकप्रिय दुकाने + सर्व दुकाने आणि सेवा (Home वर) - हे विभाग script स्वतः जोडते */
function ensureHomeBlocks() {
  if ($('homeShopsBlk')) return;
  const pl = $('popularList'); if (!pl) return;
  pl.insertAdjacentHTML('afterend',
    `<div class="home-blk" id="homeShopsBlk">
       <div class="sec-head"><h2 class="sec"><i class="fa-solid fa-fire fire"></i> लोकप्रिय दुकाने</h2>
         <button class="see-all" onclick="showAll()">सर्व पहा <i class="fa-solid fa-chevron-right"></i></button></div>
       <div class="fs-grid" id="homeShops"></div>
     </div>
     <div class="home-blk" id="homeAllBlk">
       <h2 class="sec"><i class="fa-solid fa-list-ul"></i> सर्व दुकाने आणि सेवा</h2>
       <div id="homeAll"></div>
     </div>`);
}
function renderHomeBlocks() {
  ensureHomeBlocks();
  const pop = shops.slice(0, POPULAR_SHOPS_COUNT);
  setHTML('homeShops', pop.map(miniShopCard).join(''));
  setHTML('homeAll', shops.map(shopCard).join(''));
  if ($('homeShopsBlk')) $('homeShopsBlk').hidden = !shops.length;
}

function renderTrending() {
  setHTML('trendChips', trending.map(t => `<button class="chip" data-act="search" data-val="${esc(t)}">${esc(t)}</button>`).join(''));
}
function renderAboutCats() {
  setHTML('aboutCats', Object.keys(CATS).filter(k => k !== 'OtherMain').map(k =>
    `<button class="chip" data-act="cat" data-val="${k}">${esc(CATS[k].name)}</button>`).join(''));
}
function injectSchema() {
  if (SITE_URL.includes('YOUR-SITE')) return;
  const data = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'मंगळवेढा दुकाने व सेवा', url: SITE_URL,
    itemListElement: shops.map((s, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'LocalBusiness', name: s.name, telephone: '+91' + s.phone,
        address: { '@type': 'PostalAddress', streetAddress: s.area, addressLocality: 'Mangalwedha', addressRegion: 'Maharashtra', addressCountry: 'IN' } }
    }))
  };
  const sc = document.createElement('script');
  sc.type = 'application/ld+json'; sc.textContent = JSON.stringify(data);
  document.head.appendChild(sc);
}

/* ---------- OVERLAYS ---------- */
const OVERLAYS = ['moreOverlay', 'menuOverlay', 'shopModal', 'timetableModal', 'emergencyModal'];
function syncLock() { document.body.classList.toggle('lock', OVERLAYS.some(id => $(id) && $(id).classList.contains('show'))); }
function openMore() { renderMoreSheet(); ['moreOverlay', 'moreSheet'].forEach(id => $(id) && $(id).classList.add('show')); syncLock(); }
function closeMore() { ['moreOverlay', 'moreSheet'].forEach(id => $(id) && $(id).classList.remove('show')); syncLock(); }
function openSideMenu() { ['menuOverlay', 'sideMenu'].forEach(id => $(id) && $(id).classList.add('show')); syncLock(); }
function closeSideMenu() { ['menuOverlay', 'sideMenu'].forEach(id => $(id) && $(id).classList.remove('show')); syncLock(); }
function menuGo(k) {
  closeSideMenu();
  if (k === 'home') goHome();
  else if (k === 'all') showAll();
  else if (k === 'favs') showFavs();
  else if (k === 'bus') showTimetable();
  else if (k === 'add') openModal();
}
function openEmergency() {
  setHTML('emergencyBody', emergencyList.concat(localEmergency).map(e =>
    `<div class="em-item"><b>${esc(e.name)}</b><a href="tel:${esc(e.num)}"><i class="fa-solid fa-phone"></i> ${esc(e.num)}</a></div>`).join(''));
  $('emergencyModal') && $('emergencyModal').classList.add('show'); syncLock();
}
function closeEmergency() { $('emergencyModal') && $('emergencyModal').classList.remove('show'); syncLock(); }

/* ---------- BUS ---------- */
function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  const p = h < 4 ? 'रात्री' : h < 12 ? 'सकाळी' : h < 16 ? 'दुपारी' : h < 20 ? 'संध्याकाळी' : 'रात्री';
  return p + ' ' + (h % 12 || 12) + ':' + String(m).padStart(2, '0');
}
function showTimetable() {
  const warn = TIMETABLE_IS_SAMPLE ? '<div class="warn"><i class="fa-solid fa-triangle-exclamation"></i> ही वेळापत्रके नमुना आहेत. प्रवासापूर्वी बस स्थानकावर खात्री करा.</div>' : '';
  setHTML('timetableBody', warn + busTimetable.map(b =>
    `<div class="tt-card"><div class="tt-head"><span>मंगळवेढा → ${esc(b.to)}</span><small>${b.km} km</small></div>
     <div class="tt-times">${b.times.split(' ').map(t => `<span>${fmtTime(t)}</span>`).join('')}</div></div>`).join(''));
  $('timetableModal') && $('timetableModal').classList.add('show'); syncLock();
}
function closeTimetable() { $('timetableModal') && $('timetableModal').classList.remove('show'); syncLock(); }

/* ---------- ADD SHOP FORM ---------- */
function renderCategorySelect() {
  const sel = $('newCategory'); if (!sel) return;
  sel.innerHTML = '<option value="">-- प्रकार निवडा --</option>' +
    Object.keys(CATS).map(k => `<option value="${k}">${esc(CATS[k].name)}</option>`).join('') +
    '<option value="Custom">+ नवीन प्रकार लिहा</option>';
}
function updateSubCategories() {
  const sel = $('newSubCategory'); if (!sel) return;
  const list = subCategoriesData[val('newCategory')] || ['इतर'];
  sel.innerHTML = list.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
}
function checkCustomCategory() {
  const el = $('customCategoryInput'); if (!el) return;
  const show = val('newCategory') === 'Custom';
  el.style.display = show ? 'block' : 'none'; el.hidden = !show;
}
function openModal(pre) {
  renderCategorySelect();
  if (pre && CATS[pre] && $('newCategory')) $('newCategory').value = pre;
  updateSubCategories(); checkCustomCategory();
  $('shopModal') && $('shopModal').classList.add('show'); syncLock();
}
function closeModal() { $('shopModal') && $('shopModal').classList.remove('show'); syncLock(); }
function submitShop(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = val('newShopName'), phone = val('newPhone').replace(/\D/g, '').slice(-10);
  let c = val('newCategory'); if (c === 'Custom') c = val('customCategoryInput');
  const catName = CATS[c] ? CATS[c].name : c;
  if (!name) { alert('दुकानाचे नाव लिहा'); return; }
  if (phone.length !== 10) { alert('10 अंकी मोबाईल नंबर लिहा'); return; }
  const msg = `नवीन व्यवसाय:\nनाव: ${name}\nफोन: ${phone}\nप्रकार: ${catName}\nउप-प्रकार: ${val('newSubCategory')}\nमॅप: ${val('newMapLink')}`;
  if (ADMIN_WHATSAPP) window.open('https://wa.me/' + ADMIN_WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
  else alert('धन्यवाद! ही सुविधा लवकरच सुरू होईल.');
  closeModal();
}
function getCurrentLocation() {
  if (!navigator.geolocation) { alert('या फोनमध्ये लोकेशन उपलब्ध नाही'); return; }
  navigator.geolocation.getCurrentPosition(
    p => { if ($('newMapLink')) $('newMapLink').value = `https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`; },
    () => alert('लोकेशन मिळाले नाही. परवानगी द्या.'));
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  prepareSearchIndex();
  const inp = $('searchInput');
  if (inp) {
    inp.addEventListener('input', () => { resetState(); updateClearBtn(); applyFilters(); setNav(val('searchInput') ? 'none' : 'home'); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  }
  if ($('newCategory')) $('newCategory').addEventListener('change', () => { updateSubCategories(); checkCustomCategory(); });
  $('moreOverlay') && $('moreOverlay').addEventListener('click', closeMore);
  $('menuOverlay') && $('menuOverlay').addEventListener('click', closeSideMenu);
  [['shopModal', closeModal], ['timetableModal', closeTimetable], ['emergencyModal', closeEmergency]].forEach(([id, fn]) => {
    const m = $(id); if (m) m.addEventListener('click', e => { if (e.target === m) fn(); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMore(); closeSideMenu(); closeModal(); closeTimetable(); closeEmergency(); }
  });
  renderPopular(); renderTrending(); renderAboutCats(); renderCategorySelect();
  applyFilters(); setNav('home'); injectSchema();
});