// ========== संपूर्ण दुकाने लिस्ट ==========
function displayShops(shopArray) {
    shopList.innerHTML = "";
    const totalCountEl = document.getElementById('totalShopsCount');
    if (totalCountEl) totalCountEl.innerText = shops.length;

    if(shopArray.length === 0) {
        shopList.innerHTML = `<p style="text-align:center; color:#6b7280; margin-top:30px;">माहिती आढळली नाही.</p>`;
        return;
    }
    shopArray.forEach(shop => {
        const card = document.createElement('div');
        card.className = "shop-card";

        const verifiedHTML = shop.isVerified ? `<i class="fa-solid fa-circle-check verified-tick"></i>` : '';
        const offerHTML = shop.offer ? `<div class="offer-tag"><i class="fa-solid fa-gift"></i> ${shop.offer}</div>` : '';

        const ratingHTML = shop.rating ? `<span class="rating"><i class="fa-solid fa-star"></i> ${shop.rating} (${shop.reviews || 0})</span>` : '';
        const distanceHTML = shop.distance ? `<span><i class="fa-solid fa-location-dot"></i> ${shop.distance} कि.मी</span>` : '';
        const metaHTML = (ratingHTML || distanceHTML) ? `<div class="shop-meta">${ratingHTML} ${distanceHTML}</div>` : '';

        const callButton = shop.phone ? `<a href="tel:${shop.phone}" class="btn btn-call"><i class="fa-solid fa-phone-volume"></i> कॉल</a>` : '';
        const dirButton = shop.address ? `<a href="https://maps.google.com/?q=${shop.name}, ${shop.address}" target="_blank" class="btn btn-direction"><i class="fa-solid fa-map-location-dot"></i> दिशा</a>` : '';
        const buttonsHTML = (callButton || dirButton) ? `<div class="card-buttons">${callButton} ${dirButton}</div>` : '';

        card.innerHTML = `
            <div class="shop-img-box">
                <div class="shop-avatar"><img src="${getShopImage(shop.category)}" alt="${shop.name}"></div>
                <i class="fa-regular fa-heart fav-icon" onclick="toggleFav(this, event)"></i>
            </div>
            <div class="shop-info">
                <div class="shop-name">${shop.name} ${verifiedHTML}</div>
                ${metaHTML}
                <div class="shop-details" ${!metaHTML ? 'style="margin-top: 8px;"' : ''}>
                    <p><i class="fa-solid fa-map-pin"></i> ${shop.address}</p>
                </div>
                ${offerHTML}
                ${buttonsHTML}
            </div>
        `;
        shopList.appendChild(card);
    });
}

function toggleFav(el, event) {
    event.stopPropagation();
    const icon = el.querySelector('i') || el;
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
}

function filterCategory(category, element) {
    showingOffersOnly = false;
    currentCategory = category;
    sectionHeading.innerHTML = `<i class="fa-solid fa-list"></i> सर्व दुकाने आणि सेवा`;
    document.querySelectorAll('.cat-item').forEach(chip => chip.classList.remove('active'));
    if(element) { element.classList.add('active'); } 
    else { document.getElementById('cat-all').classList.add('active'); }
    applyFilters();
    document.getElementById('shopList').scrollIntoView({behavior:'smooth', block:'start'});
}

function showOffers() {
    showingOffersOnly = true;
    currentCategory = 'All';
    document.querySelectorAll('.cat-item').forEach(chip => chip.classList.remove('active'));
    sectionHeading.innerHTML = `<i class="fa-solid fa-tags" style="color:red;"></i> आजच्या लाईव्ह ऑफर्स`;
    applyFilters();
    document.getElementById('shopList').scrollIntoView({behavior:'smooth', block:'start'});
}