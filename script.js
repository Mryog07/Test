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