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