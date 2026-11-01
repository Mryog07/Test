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
    "default": "https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
};

function getShopImage(category) {
    return categoryImages[category] || categoryImages["default"];
}

// ========== लोकप्रिय दुकाने (फोटोसह) ==========
function renderPopularShops() {
    const container = document.getElementById('popularShopsList');
    if (!container) return;

    const popular = [...shops].sort((a,b) => (b.isVerified - a.isVerified)).slice(0, 4);

    container.innerHTML = popular.map(shop => {
        const verifiedHTML = shop.isVerified ? `<i class="fa-solid fa-circle-check verified-tick"></i>` : '';

        const ratingHTML = shop.rating ? `<span class="rating"><i class="fa-solid fa-star"></i> ${shop.rating} (${shop.reviews || 0})</span>` : '';
        const distanceHTML = shop.distance ? `<span><i class="fa-solid fa-location-dot"></i> ${shop.distance} कि.मी</span>` : '';
        const metaHTML = (ratingHTML || distanceHTML) ? `<div class="pshop-meta">${ratingHTML} ${distanceHTML}</div>` : '';

        const callBtn = shop.phone ? `<a href="tel:${shop.phone}" class="btn-call"><i class="fa-solid fa-phone"></i> कॉल</a>` : '';
        const dirBtn = shop.address ? `<a href="https://maps.google.com/?q=${shop.name}, ${shop.address}" target="_blank" class="btn-direction"><i class="fa-solid fa-location-arrow"></i> दिशा</a>` : '';
        const buttonsHTML = (callBtn || dirBtn) ? `<div class="pshop-buttons" style="margin-top: 10px;">${callBtn} ${dirBtn}</div>` : '';

        return `
            <div class="pshop-card">
                <div class="pshop-img-wrap">
                    <img src="${getShopImage(shop.category)}" alt="${shop.name}">
                    <span class="pshop-fav" onclick="toggleFav(this, event)"><i class="fa-regular fa-heart"></i></span>
                </div>
                <div class="pshop-info">
                    <h4>${shop.name} ${verifiedHTML}</h4>
                    ${metaHTML}
                    ${buttonsHTML}
                </div>
            </div>
        `;
    }).join('');
}