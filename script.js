const subCategoriesData = {
    "Cat1": ["किराणा दुकान", "सुपरमार्केट व मिनी मार्केट"],
    "Cat2": ["पुरुषांचे कपडे", "महिलांचे कपडे", "मुलांचे कपडे", "साडी", "जीन्स व टी-शर्ट"],
    "Cat9": ["बियाणे व खते", "शेती अवजारे", "ठिबक सिंचन"],
    "Cat10": ["दुचाकी विक्री", "गॅरेज व दुरुस्ती", "स्पेअर पार्ट्स"],
    "Cat11": ["मेडिकल स्टोअर", "दवाखाना / क्लिनिक", "पॅथॉलॉजी लॅब"],
    "Cat14": ["मोबाईल विक्री", "मोबाईल दुरुस्ती", "कॉम्पुटर"],
    "Cat17": ["हॉटेल व रेस्टॉरंट", "चहा व नाश्ता", "फास्ट फूड"],
    "Cat19": ["प्लंबर", "इलेक्ट्रिशियन", "सुतार", "घर साफसफाई", "AC दुरुस्ती"],
    "Cat20": ["भाड्याने घरे", "दुकान/व्यावसायिक जागा", "जमीन खरेदी-विक्री"],
    "Cat24": ["डेअरी / दूध", "पशुखाद्य"],
    "Cat42": ["डिजिटल प्रिंटिंग", "झेरॉक्स"],
    "OtherMain": ["इतर सर्व"]
};

const searchDictionary = {
    "mobile": "मोबाईल", "mobiles": "मोबाईल", "phone": "मोबाईल",
    "hospital": "मेडिकल", "medical": "मेडिकल", "clinic": "मेडिकल", "doctor": "मेडिकल",
    "kirana": "किराणा", "grocery": "किराणा", "super market": "सुपर मार्केट",
    "kapade": "कपडे", "kapde": "कपडे", "cloth": "कपडे", "clothes": "कपडे", "dress": "कपडे",
    "hotel": "हॉटेल", "restaurant": "हॉटेल", "food": "हॉटेल", "cafe": "हॉटेल",
    "shoes": "फुटवेअर", "chappal": "चप्पल", "footwear": "फुटवेअर",
    "printing": "प्रिंटिंग", "xerox": "झेरॉक्स", "print": "प्रिंटिंग",
    "room": "रूम", "rent": "भाड्याने", "house": "घर", "flat": "रूम",
    "plumber": "प्लंबर", "electrician": "इलेक्ट्रिशियन", "worker": "कामगार", "kamgar": "कामगार"
};

const shops = [
    { name: "जय भवानी मोबाईल्स", category: "Cat14", phone: "9876543210", address: "बाजार चौक, मंगळवेढा", isVerified: true, offer: "दिवाळी धमाका: नवीन मोबाईलवर कव्हर आणि ग्लास मोफत!" },
    { name: "रोहित भगत डिजिटल", category: "Cat42", phone: "9876543213", address: "खंडोबा गल्ली, मंगळवेढा", isVerified: true, offer: "" },
    { name: "गणेश सुपर मार्केट", category: "Cat1", phone: "9876543211", address: "बस स्टँड जवळ, मंगळवेढा", isVerified: true, offer: "किराण्यावर 10% डिस्काउंट" },
    { name: "आशिष इस्टेट्स (रूम भाड्याने)", category: "Cat20", phone: "9876543222", address: "शिवाजी नगर, मंगळवेढा", isVerified: true, offer: "" },
    { name: "सुभाष प्लंबिंग आणि इलेक्ट्रिकल्स", category: "Cat19", phone: "9876543333", address: "दत्तू गल्ली, मंगळवेढा", isVerified: true, offer: "24 तास सेवा उपलब्ध" },
    { name: "संजीवनी मेडिकल", category: "Cat11", phone: "9876543111", address: "दत्तू गल्ली, मंगळवेढा", isVerified: false, offer: "" }
];

let currentCategory = 'All';
let showingOffersOnly = false;
const shopList = document.getElementById('shopList');
const searchInput = document.getElementById('searchInput');
const sectionHeading = document.getElementById('sectionHeading');

// कॅटेगरीनुसार फोटो मॅपिंग (डेमो इमेजेस)
const categoryImages = {
    "Cat1": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=70",
    "Cat2": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=70",
    "Cat9": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70",
    "Cat10": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=70",
    "Cat11": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=70",
    "Cat14": "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&q=70",
    "Cat17": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=70",
    "Cat19": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70",
    "Cat20": "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=70",
    "Cat24": "https://images.unsplash.com/photo-1545468259-05d8c4a62b3d?w=400&q=70",
    "Cat42": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=70",
    "default": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=70"
};

function getShopImage(category) {
    return categoryImages[category] || categoryImages["default"];
}
function getInitial(name) {
    return name.trim().charAt(0);
}

// ========== लोकप्रिय दुकाने (फोटोसह) ==========
function renderPopularShops() {
    const container = document.getElementById('popularShopsList');
    if (!container) return;

    // verified दुकाने आधी दाखवा, जास्तीत जास्त 4
    const popular = [...shops].sort((a,b) => (b.isVerified - a.isVerified)).slice(0, 4);

    container.innerHTML = popular.map(shop => {
        const rating = (4 + Math.random()).toFixed(1);
        const reviews = Math.floor(Math.random()*100 + 20);
        const distance = (Math.random()*2).toFixed(1);
        const verifiedHTML = shop.isVerified ? `<i class="fa-solid fa-circle-check verified-tick"></i>` : '';

        return `
            <div class="pshop-card">
                <div class="pshop-img-wrap">
                    <img src="${getShopImage(shop.category)}" alt="${shop.name}">
                    <span class="pshop-fav" onclick="toggleFav(this, event)"><i class="fa-regular fa-heart"></i></span>
                </div>
                <div class="pshop-info">
                    <h4>${shop.name} ${verifiedHTML}</h4>
                    <div class="pshop-meta">
                        <span class="rating"><i class="fa-solid fa-star"></i> ${rating} (${reviews})</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${distance} कि.मी</span>
                    </div>
                    <div class="pshop-buttons">
                        <a href="tel:${shop.phone}" class="btn-call"><i class="fa-solid fa-phone"></i> कॉल</a>
                        <a href="https://maps.google.com/?q=${shop.name}, ${shop.address}" target="_blank" class="btn-direction"><i class="fa-solid fa-location-arrow"></i> दिशा</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

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
        const callButton = shop.phone ? `<a href="tel:${shop.phone}" class="btn btn-call"><i class="fa-solid fa-phone-volume"></i> कॉल</a>` : '';
        const offerHTML = shop.offer ? `<div class="offer-tag"><i class="fa-solid fa-gift"></i> ${shop.offer}</div>` : '';

        const rating = (4 + Math.random()).toFixed(1);
        const reviews = Math.floor(Math.random()*100 + 20);
        const distance = (Math.random()*2).toFixed(1) + " कि.मी";

        card.innerHTML = `
            <div class="shop-img-box">
                <div class="shop-avatar"><img src="${getShopImage(shop.category)}" alt="${shop.name}"></div>
                <i class="fa-regular fa-heart fav-icon" onclick="toggleFav(this, event)"></i>
            </div>
            <div class="shop-info">
                <div class="shop-name">${shop.name} ${verifiedHTML}</div>
                <div class="shop-meta">
                    <span class="rating"><i class="fa-solid fa-star"></i> ${rating} (${reviews})</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${distance}</span>
                </div>
                <div class="shop-details">
                    <p><i class="fa-solid fa-map-pin"></i> ${shop.address}</p>
                </div>
                ${offerHTML}
                <div class="card-buttons">
                    ${callButton}
                    <a href="https://maps.google.com/?q=${shop.name}, ${shop.address}" target="_blank" class="btn btn-direction"><i class="fa-solid fa-map-location-dot"></i> दिशा</a>
                </div>
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

function applyFilters() {
    let rawTerm = searchInput.value.toLowerCase().trim();
    let searchTerm = searchDictionary[rawTerm] ? searchDictionary[rawTerm] : rawTerm;
    const filtered = shops.filter(shop => {
        const searchString = `${shop.name} ${shop.address} ${shop.offer || ""} ${shop.category}`.toLowerCase();
        const matchesSearch = searchString.includes(searchTerm);
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
    if(name === "" || phone === "") {
        alert("कृपया दुकानाचे नाव आणि मोबाईल नंबर नक्की टाका!");
        return;
    }
    alert(`माहिती यशस्वीरित्या पाठवली!\nदुकान: ${name}\nॲडमिन तपासून ॲपवर ॲड करतील.`);
    closeModal();
}

searchInput.addEventListener('input', applyFilters);
renderPopularShops();
displayShops(shops);
