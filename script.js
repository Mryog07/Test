/* ---------- STATE ---------- */
let favs = [];
try { favs = JSON.parse(localStorage.getItem('mi_favs') || '[]'); } catch (e) { favs = []; }
const state = { cat: null, favs: false, all: false };

function resetState() { state.cat = null; state.favs = false; state.all = false; }
function updateClearBtn() { const b = $('clearSearch'); if (b) b.style.display = val('searchInput') ? 'flex' : 'none'; }

function setNav(name) {
  document.querySelectorAll('.bottom-nav [data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
}
function scrollToList() {
  const el = $('listSection'); if (!el) return;
  window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 150), behavior: 'smooth' });
}

function applyFilters() {
  const q = norm(val('searchInput'));
  const isHome = !state.cat && !state.favs && !state.all && !q;
  ['homeSections', 'aboutSection', 'heroExtra'].forEach(id => { if ($(id)) $(id).hidden = !isHome; });
  if ($('listSection')) $('listSection').hidden = isHome;
  if ($('clearFilterBtn')) $('clearFilterBtn').hidden = isHome;
  renderHomeTiles();
  renderHomeBlocks();
  if (isHome) return;

  let list = shops.slice();
  let title = 'सर्व दुकाने';
  if (state.favs) { list = list.filter(s => favs.includes(s.phone)); title = 'आवडती दुकाने'; }
  else if (state.cat) { list = list.filter(s => s.cat === state.cat); title = catOf(state.cat).name; }
  if (q) {
    const toks = q.split(' ').filter(Boolean);
    list = list.filter(s => toks.every(t => tokenMatch(s, t)));
    title = '“' + val('searchInput') + '” साठी निकाल';
  }
  if ($('sectionHeading')) $('sectionHeading').textContent = title + ' (' + list.length + ')';

  if (!list.length) {
    const msg = state.favs ? 'अजून कोणतीही आवडती दुकाने नाहीत.' : 'या विभागात अजून दुकाने जोडलेली नाहीत.';
    setHTML('shopList', `<div class="empty"><i class="fa-regular fa-face-smile"></i>${msg}<br><button onclick="openModal()">तुमचा व्यवसाय जोडा</button></div>`);
  } else setHTML('shopList', list.map(shopCard).join(''));
}

function filterCategory(id) { resetState(); state.cat = id; if ($('searchInput')) $('searchInput').value = ''; updateClearBtn(); applyFilters(); setNav('none'); scrollToList(); }
function showFavs() { resetState(); state.favs = true; if ($('searchInput')) $('searchInput').value = ''; updateClearBtn(); applyFilters(); setNav('none'); scrollToList(); }
function showAll() { resetState(); state.all = true; if ($('searchInput')) $('searchInput').value = ''; updateClearBtn(); applyFilters(); setNav('none'); scrollToList(); }
function searchByKeyword(k) { resetState(); if ($('searchInput')) $('searchInput').value = k; updateClearBtn(); applyFilters(); setNav('none'); scrollToList(); }
function clearFilters() { resetState(); if ($('searchInput')) $('searchInput').value = ''; updateClearBtn(); applyFilters(); setNav('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function clearSearchBox() { clearFilters(); }
function goHome() { closeMore(); closeSideMenu(); clearFilters(); }
function doSearch() {
  resetState(); updateClearBtn(); applyFilters();
  if ($('searchInput')) $('searchInput').blur();
  if (val('searchInput')) { setNav('none'); scrollToList(); }
}

function handleAction(type, value) {
  if (type !== 'more') closeMore();
  switch (type) {
    case 'cat': filterCategory(value); break;
    case 'search': searchByKeyword(value); break;
    case 'bus': showTimetable(); break;
    case 'emergency': openEmergency(); break;
    case 'more': openMore(); break;
    case 'favs': showFavs(); break;
    case 'add': openModal(); break;
    case 'all': showAll(); break;
  }
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el) handleAction(el.dataset.act, el.dataset.val);
});

/* ---------- RENDER ---------- */
function mapLinkOf(s) {
  return s.mapLink || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.name + ' मंगळवेढा');
}
function shopCard(s) {
  const c = catOf(s.cat), img = shopImg(s), fav = favs.includes(s.phone);
  const wa = 'https://wa.me/91' + s.phone + '?text=' + encodeURIComponent('नमस्कार, मी Mangalwedha Info वरून तुमचा नंबर पाहिला.');
  const pic = img ? `<img src="${esc(img)}" alt="${esc(s.name)}" loading="lazy" style="position:absolute;inset:0" onerror="this.remove()">` : '';
  return `<article class="shop-card">
    <div class="shop-main">
      <div class="shop-img ${c.color}" style="position:relative"><i class="fa-solid ${c.icon}"></i>${pic}</div>
      <div class="shop-body">
        <div class="shop-top">
          <div class="shop-name">${esc(s.name)}</div>
          <button class="fav-btn ${fav ? 'on' : ''}" onclick="toggleFav('${esc(s.phone)}')" aria-label="आवडते"><i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i></button>
        </div>
        ${s.verified ? '<span class="verified"><i class="fa-solid fa-circle-check"></i> Verified</span>' : ''}
        <div class="shop-meta">
          <span><i class="fa-solid fa-location-dot"></i>${esc(s.area)}, मंगळवेढा</span>
          ${s.distance ? `<span><i class="fa-solid fa-route"></i>${esc(s.distance)}</span>` : ''}
        </div>
        <span class="badge ${c.color}">${esc(s.sub || c.name)}</span>
      </div>
    </div>
    <div class="shop-actions">
      <a class="btn-call" href="tel:${esc(s.phone)}"><i class="fa-solid fa-phone"></i> कॉल</a>
      <a class="btn-dir" href="${esc(mapLinkOf(s))}" target="_blank" rel="noopener"><i class="fa-solid fa-location-arrow"></i> दिशा</a>
      <a class="btn-wa" href="${esc(wa)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
    </div>
  </article>`;
}
/* Home वरील छोटे दुकान कार्ड (2 रांगा) */
function miniShopCard(s) {
  const c = catOf(s.cat), img = shopImg(s), fav = favs.includes(s.phone);
  const pic = img ? `<img src="${esc(img)}" alt="${esc(s.name)}" loading="lazy" onerror="this.remove()">` : '';
  return `<article class="fs-card">
    <div class="fs-img ${c.color}"><i class="fa-solid ${c.icon}"></i>${pic}
      <button class="fs-fav ${fav ? 'on' : ''}" onclick="toggleFav('${esc(s.phone)}')" aria-label="आवडते"><i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i></button>
    </div>
    <div class="fs-body">
      <div class="fs-name">${esc(s.name)}${s.verified ? '<i class="fa-solid fa-circle-check"></i>' : ''}</div>
      <div class="fs-btns">
        <a class="btn-call" href="tel:${esc(s.phone)}"><i class="fa-solid fa-phone"></i> कॉल</a>
        <a class="btn-dir" href="${esc(mapLinkOf(s))}" target="_blank" rel="noopener"><i class="fa-solid fa-location-arrow"></i> दिशा</a>
      </div>
    </div>
  </article>`;
}