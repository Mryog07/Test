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

// ========== होम पेज घटक लपवणे / दाखवणे ==========
// (जेव्हा युजर सर्च करेल तेव्हा हे फंक्शन बाकीचे घटक लपवेल)
function toggleHomePageElements(isSearching) {
    const displayStyle = isSearching ? 'none' : '';
    
    const elementsToHide = [
        document.querySelector('.category-wrapper'),
        document.querySelector('.quick-features'),
        document.querySelector('.popular-services'),
        document.getElementById('popularShopsList')
    ];
    
    elementsToHide.forEach(el => {
        if (el) el.style.display = displayStyle;
    });

    // लपवायचे टायटल्स (लोकप्रिय सेवा आणि लोकप्रिय दुकाने)
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length >= 3) {
        sectionTitles[0].style.display = displayStyle; // लोकप्रिय सेवा
        sectionTitles[1].style.display = displayStyle; // लोकप्रिय दुकाने
    }
}

// ========== सुधारित स्मार्ट फिल्टर ==========
function applyFilters() {
    let rawTerm = searchInput.value.toLowerCase().trim();
    let searchTerm = searchDictionary[rawTerm] ? searchDictionary[rawTerm] : rawTerm;
    
    // सर्च चालू असल्यास फक्त लिस्ट दाखवा, बाकी लपवा
    if (rawTerm.length > 0) {
        toggleHomePageElements(true);
        sectionHeading.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> शोध निकाल (Search Results)`;
    } else {
        toggleHomePageElements(false);
        if (showingOffersOnly) {
            sectionHeading.innerHTML = `<i class="fa-solid fa-tags" style="color:red;"></i> आजच्या लाईव्ह ऑफर्स`;
        } else {
            sectionHeading.innerHTML = `<i class="fa-solid fa-list"></i> सर्व दुकाने आणि सेवा`;
        }
    }

    let searchNoVowels = rawTerm.replace(/[aeiou\s]/g, ""); 

    const filtered = shops.filter(shop => {
        // १. मराठीत नॉर्मल सर्च आणि डिक्शनरी सर्च चेक करणे
        const normalString = `${shop.name} ${shop.address} ${shop.offer || ""} ${shop.category}`.toLowerCase();
        let matchesSearch = normalString.includes(searchTerm);

        // २. जर मराठीत नाही सापडले, तर ऑटो-कन्व्हर्ट करून इंग्लिशमध्ये शोधणे
        if (!matchesSearch && searchNoVowels.length > 0) {
            let autoEng = getAutoEnglish(shop.name);
            let shopNoVowels = autoEng.replace(/[aeiou\s]/g, ""); // दुकानाच्या नावातील स्वर काढणे
            
            // जर मुख्य अक्षरे मॅच झाली (उदा. gnesh आणि gnsh)
            if (shopNoVowels.includes(searchNoVowels)) {
                matchesSearch = true;
            }
        }

        const matchesCategory = currentCategory === 'All' || shop.category === currentCategory;
        const matchesOffer = showingOffersOnly ? shop.offer && shop.offer.trim() !== "" : true;
        return matchesSearch && matchesCategory && matchesOffer;
    });
    
    displayShops(filtered);
}

function openSideMenu() {
    document.getElementById('sideMenu').classList.add('active');
    document.getElementById('menuOverlay').classList.add('active');
}
function closeSideMenu() {
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('menuOverlay').classList.remove('active');
}

const timetableModal = document.getElementById("timetableModal");
function showTimetable() { timetableModal.style.display = "block"; }
function closeTimetable() { timetableModal.style.display = "none"; }

const modal = document.getElementById("shopModal");
function openModal() { 
    modal.style.display = "block"; 
    const catSelect = document.getElementById("newCategory");
    if (currentCategory !== 'All' && currentCategory.startsWith('Cat')) {
        catSelect.value = currentCategory;
    } else {
        catSelect.value = "";
    }
    updateSubCategories();
}
function closeModal() { modal.style.display = "none"; }

function updateSubCategories() {
    const mainCat = document.getElementById("newCategory").value;
    const subCatDropdown = document.getElementById("newSubCategory");
    const customInput = document.getElementById("customCategoryInput");
    subCatDropdown.innerHTML = '<option value="" disabled selected>उपकॅटेगरी निवडा...</option>';
    customInput.style.display = "none";
    customInput.value = "";

    if(subCategoriesData[mainCat]) {
        subCategoriesData[mainCat].forEach(sub => {
            const opt = document.createElement("option");
            opt.value = sub;
            opt.innerText = sub;
            subCatDropdown.appendChild(opt);
        });
        const otherOpt = document.createElement("option");
        otherOpt.value = "Other";
        otherOpt.innerText = "➕ इतर (स्वतः टाईप करा)";
        subCatDropdown.appendChild(otherOpt);
        subCatDropdown.style.display = "block";
    } else {
        subCatDropdown.style.display = "none";
    }
}

function checkCustomCategory() {
    const subCat = document.getElementById("newSubCategory").value;
    const customInput = document.getElementById("customCategoryInput");
    customInput.style.display = subCat === "Other" ? "block" : "none";
}

function submitShop() {
    const name = document.getElementById("newShopName").value;
    const phone = document.getElementById("newPhone").value;
    
    // मॅप लिंक घेणे
    const mapLinkInput = document.getElementById("newMapLink");
    const mapLink = (mapLinkInput && mapLinkInput.value !== "") ? mapLinkInput.value : "लोकेशन दिलेली नाही";

    if(name === "" || phone === "") {
        alert("कृपया दुकानाचे नाव आणि मोबाईल नंबर नक्की टाका!");
        return;
    }
    
    alert(`माहिती यशस्वीरित्या पाठवली!\nदुकान: ${name}\nमॅप लिंक: ${mapLink}\nॲडमिन तपासून ॲपवर ॲड करतील.`);
    closeModal();
}

searchInput.addEventListener('input', applyFilters);
renderPopularShops();
displayShops(shops);

// ========== सर्व कॅटेगरीज कार्ड स्वरूपात दाखवणे ==========
const allCategoriesList = [
    { id: "Cat1", name: "किराणा व धान्य", sub: "सुपरमार्केट | मिनी मार्केट" },
    { id: "Cat2", name: "कपडे व फॅशन", sub: "पुरुष | महिला | मुले" },
    { id: "Cat9", name: "कृषी व शेती साहित्य", sub: "बियाणे | अवजारे | खते" },
    { id: "Cat10", name: "वाहन व ऑटोमोबाईल", sub: "दुचाकी | गॅरेज | पार्ट्स" },
    { id: "Cat11", name: "मेडिकल व दवाखाने", sub: "औषधे | हेल्थ केअर" },
    { id: "Cat14", name: "मोबाईल व कॉम्पुटर", sub: "नवीन | रिपेअर | सर्व्हिस" },
    { id: "Cat17", name: "हॉटेल व रेस्टॉरंट", sub: "नाश्ता | जेवण | स्नॅक्स" },
    { id: "Cat19", name: "कामगार व सर्व्हिस", sub: "प्लंबर | इलेक्ट्रिशियन | सुतार" },
    { id: "Cat20", name: "रूम व घर भाड्याने", sub: "घरे | दुकान जागा | जमीन" },
    { id: "Cat24", name: "दुग्धव्यवसाय व पशुपालन", sub: "डेअरी | पशुखाद्य" },
    { id: "Cat42", name: "प्रिंटिंग व झेरॉक्स", sub: "डिजिटल प्रिंट | झेरॉक्स" },
    { id: "OtherMain", name: "इतर सर्व व्यवसाय", sub: "इतर सेवा पहा" }
];

function showAllCategoriesCards() {
    const popularSection = document.querySelector('.popular-services');
    if (!popularSection) return;

    popularSection.innerHTML = allCategoriesList.map(cat => `
        <div class="service-card" onclick="filterCategory('${cat.id}', null)">
            <div class="service-img-wrap">
                <img src="${getShopImage(cat.id)}" alt="${cat.name}">
                <span class="card-arrow"><i class="fa-solid fa-chevron-right"></i></span>
            </div>
            <div class="service-card-info">
                <h4>${cat.name}</h4>
                <p>${cat.sub}</p>
            </div>
        </div>
    `).join('');

    const sectionTitle = popularSection.previousElementSibling.querySelector('h3');
    if (sectionTitle) {
        sectionTitle.innerHTML = `<i class="fa-solid fa-store"></i> सर्व कॅटेगरीज`;
    }

    popularSection.scrollIntoView({behavior:'smooth', block:'start'});
}

function getCurrentLocation() {
    const mapLinkInput = document.getElementById("newMapLink");
    mapLinkInput.value = "लोकेशन शोधत आहे... कृपया थांबा.";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const gmapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                mapLinkInput.value = gmapUrl;
                alert("लोकेशन यशस्वीरित्या मिळवली!");
            },
            (error) => {
                mapLinkInput.value = "";
                alert("लोकेशन मिळवता आली नाही. कृपया तुमच्या फोनची लोकेशन (GPS) चालू करा आणि पुन्हा प्रयत्न करा.");
            }
        );
    } else {
        alert("तुमचा ब्राउझर लोकेशन सपोर्ट करत नाही.");
    }
}
