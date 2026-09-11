/* =========================================================
   DXN MANUFACTURING NEPAL
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const mainNav = document.getElementById("mainNav");

    if (mainNav) {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        mainNav.innerHTML = `
            <a href="index.html" data-page="index.html">Home</a>
            <a href="about.html" data-page="about.html">About Us</a>
            <details class="nav-dropdown" data-menu="products"><summary>Products</summary><div class="nav-dropdown-menu">
                <a href="products.html#all-products">All Products</a>
                <a href="products.html#upcoming-products">Upcoming Products</a>
                <details class="nav-subdropdown"><summary>Product Categories</summary><div class="nav-submenu"><a href="products.html#nutraceuticals">Nutraceuticals</a><a href="products.html#coffee">Coffee</a></div></details>
                <details class="nav-subdropdown"><summary>Top Products</summary><div class="nav-submenu"><a href="products.html#dxn-coffee">DXN Coffee</a><a href="products.html#dxn-rg-gl">DXN RG &amp; GL</a><a href="products.html#dxn-spirulina">DXN Spirulina</a><a href="products.html#dxn-cocozhi">DXN Cocozhi</a></div></details>
                <details class="nav-subdropdown"><summary>Manufacturing Units</summary><div class="nav-submenu"><a href="products.html#coffee-unit">Coffee Unit</a><a href="products.html#nutraceutical-unit">Nutraceutical Unit</a></div></details>
            </div></details>
            <a href="quality.html" data-page="quality.html">Quality</a>
            <details class="nav-dropdown" data-menu="gallery"><summary>Gallery</summary><div class="nav-dropdown-menu"><a href="gallery.html#image-gallery">Image Gallery</a><a href="gallery.html#video-gallery">Video Gallery</a><a href="gallery.html#corporate-events">Corporate Events</a><a href="gallery.html#news-press">News &amp; Press</a></div></details>
            <details class="nav-dropdown" data-menu="company"><summary>Company</summary><div class="nav-dropdown-menu"><a href="careers.html">Careers</a><a href="staff-portal.html">Staff Portal</a></div></details>
            <a href="contact.html" data-page="contact.html">Contact</a>`;

        const activePage = mainNav.querySelector(`[data-page="${currentPage}"]`);
        if (activePage) activePage.classList.add("active");
        const activeMenus = {"products.html":"products","gallery.html":"gallery","careers.html":"company","staff-portal.html":"company"};
        const activeMenuName = activeMenus[currentPage];
        if (activeMenuName) mainNav.querySelector(`[data-menu="${activeMenuName}"] summary`)?.classList.add("active");

        const desktopQuery = window.matchMedia("(min-width: 993px)");
        mainNav.querySelectorAll("details.nav-dropdown, details.nav-subdropdown").forEach(function (dropdown) {
            dropdown.addEventListener("mouseenter", function () { if (desktopQuery.matches) dropdown.open = true; });
            dropdown.addEventListener("mouseleave", function () { if (desktopQuery.matches) { dropdown.open = false; dropdown.querySelectorAll("details[open]").forEach(child => child.open = false); } });
        });
    }

    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () { const isOpen = mainNav.classList.toggle("active"); menuToggle.setAttribute("aria-expanded", isOpen); menuToggle.classList.toggle("open", isOpen); });
        mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", function () { mainNav.classList.remove("active"); menuToggle.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); }));
        document.addEventListener("click", function (event) { if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) { mainNav.classList.remove("active"); menuToggle.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); } });
    }

    const header = document.querySelector(".site-header");
    if (header) window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20));

    const productData = [
        {id:"gl90",category:"Nutraceuticals",type:"current",name:"Ganocelium (GL-90) Capsule",packaging:"90 Caps. × 450 mg",imageNames:["Ganocelium GL-90","Ganocelium","GL-90"],description:"Ganocelium (GL) is a DXN nutraceutical product featuring Ganoderma-based formulation. Product presentation and reference information are adapted for the Nepal catalogue.",features:["Ganoderma-based nutraceutical","Capsule format","90 capsules"]},
        {id:"rg90",category:"Nutraceuticals",type:"current",name:"Reishi Gano (RG-90) Capsule",packaging:"90 Caps × 270 mg",imageNames:["Reishi Gano RG-90","Reishi Gano","RG-90"],description:"Reishi Gano (RG) is a DXN nutraceutical product featuring Ganoderma. The Nepal catalogue retains the supplied packaging specification.",features:["Ganoderma-based nutraceutical","Capsule format","90 capsules"]},
        {id:"spirulina-powder",category:"Nutraceuticals",type:"current",name:"Spirulina Powder-50 gm",packaging:"50 gm",imageNames:["Spirulina Powder","Spirulina"],description:"Spirulina in powder format for the Nepal product range.",features:["Spirulina powder","50 gm pack"]},
        {id:"spirulina-tab-120",category:"Nutraceuticals",type:"current",name:"Spirulina Tablets 120",packaging:"120 Tabs × 300 mg",imageNames:["Spirulina Tablets 120","Spirulina"],description:"Spirulina tablets presented in a 120-tablet pack for the Nepal product range.",features:["Spirulina tablets","120 tablets","300 mg each"]},
        {id:"spirulina-tab-360",category:"Nutraceuticals",type:"current",name:"Spirulina Tablets 360",packaging:"360 Tabs × 300 mg",imageNames:["Spirulina Tablets 360","Spirulina"],description:"Spirulina tablets presented in a 360-tablet pack for the Nepal product range.",features:["Spirulina tablets","360 tablets","300 mg each"]},
        {id:"spirulina-cap-120",category:"Nutraceuticals",type:"current",name:"Spirulina Capsule 120",packaging:"120 Caps. × 300 mg",imageNames:["Spirulina Capsule 120","Spirulina"],description:"Spirulina capsules presented in a 120-capsule pack for the Nepal product range.",features:["Spirulina capsules","120 capsules","300 mg each"]},
        {id:"spirulina-cap-360",category:"Nutraceuticals",type:"current",name:"Spirulina Capsule 360",packaging:"360 Caps. × 300 mg",imageNames:["Spirulina Capsule 360","Spirulina"],description:"Spirulina capsules presented in a 360-capsule pack for the Nepal product range.",features:["Spirulina capsules","360 capsules","300 mg each"]},
        {id:"rg360",category:"Nutraceuticals",type:"upcoming",name:"Reishi Gano (RG-360) Capsule",packaging:"360 Caps. × 270 mg",imageNames:["Reishi Gano RG-360","Reishi Gano","RG-360"],description:"Upcoming 360-capsule Reishi Gano product for the Nepal range.",features:["Upcoming product","Ganoderma-based nutraceutical","360 capsules"]},
        {id:"gl360",category:"Nutraceuticals",type:"upcoming",name:"Ganocelium (GL-360) Capsule",packaging:"360 Caps. × 450 mg",imageNames:["Ganocelium GL-360","Ganocelium","GL-360"],description:"Upcoming 360-capsule Ganocelium product for the Nepal range.",features:["Upcoming product","Ganoderma-based nutraceutical","360 capsules"]},
        {id:"cordy-cap-120",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Capsule 120",packaging:"120 Caps. × 450 mg",imageNames:["Cordyceps Capsule 120","Cordyceps"],description:"Upcoming Cordyceps capsule product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","120 capsules"]},
        {id:"cordy-cap-360",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Capsule 360",packaging:"360 Caps. × 450 mg",imageNames:["Cordyceps Capsule 360","Cordyceps"],description:"Upcoming Cordyceps capsule product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","360 capsules"]},
        {id:"cordy-tab-120",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Tablets 120",packaging:"120 Tabs × 300 mg",imageNames:["Cordyceps Tablets 120","Cordyceps"],description:"Upcoming Cordyceps tablet product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","120 tablets"]},
        {id:"cordy-tab-360",category:"Nutraceuticals",type:"upcoming",name:"Cordyceps Tablets 360",packaging:"360 Tabs × 300 mg",imageNames:["Cordyceps Tablets 360","Cordyceps"],description:"Upcoming Cordyceps tablet product for the Nepal range.",features:["Upcoming product","Cordyceps-based product","360 tablets"]},
        {id:"lion-cap-120",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Capsule 120",packaging:"120 Caps. × 450 mg",imageNames:["LionsMane Capsule 120","LionsMane","Lion's Mane"],description:"Upcoming LionsMane capsule product for the Nepal range.",features:["Upcoming product","LionsMane product","120 capsules"]},
        {id:"lion-cap-360",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Capsule 360",packaging:"360 Caps. × 450 mg",imageNames:["LionsMane Capsule 360","LionsMane","Lion's Mane"],description:"Upcoming LionsMane capsule product for the Nepal range.",features:["Upcoming product","LionsMane product","360 capsules"]},
        {id:"lion-tab-120",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Tablets 120",packaging:"120 Tabs × 300 mg",imageNames:["LionsMane Tablets 120","LionsMane","Lion's Mane"],description:"Upcoming LionsMane tablet product for the Nepal range.",features:["Upcoming product","LionsMane product","120 tablets"]},
        {id:"lion-tab-360",category:"Nutraceuticals",type:"upcoming",name:"LionsMane Tablets 360",packaging:"360 Tabs × 300 mg",imageNames:["LionsMane Tablets 360","LionsMane","Lion's Mane"],description:"Upcoming LionsMane tablet product for the Nepal range.",features:["Upcoming product","LionsMane product","360 tablets"]},
        {id:"reishi-powder",category:"Nutraceuticals",type:"upcoming",name:"Reishi Mushroom Powder - 70 gm",packaging:"70 gm",imageNames:["Reishi Mushroom Powder","Reishi Powder","Reishi"],description:"Upcoming Reishi mushroom powder product for the Nepal range.",features:["Upcoming product","Reishi mushroom powder","70 gm"]},
        {id:"cocozhi",category:"Coffee",type:"current",name:"Cocoa Drink Premix with Ganoderma Extract (Cocozhi)",packaging:"Coffee / cocoa premix",imageNames:["Cocozhi","CocoZhi"],description:"Cocozhi is formulated from cocoa with Ganoderma extract. It can be prepared with hot water or milk and can also be enjoyed as a cold drink.",features:["Cocoa drink premix","Ganoderma extract","Hot or cold preparation"]},
        {id:"lingzhi-coffee",category:"Coffee",type:"current",name:"Coffee Drink Premix with Ganoderma Extract (Lingzhi Coffee 3 in 1)",packaging:"3 in 1 coffee premix",imageNames:["Lingzhi Coffee 3 in 1","Lingzhi Coffee","DXN Coffee"],description:"DXN Lingzhi Coffee 3 in 1 combines coffee powder with Ganoderma mushroom for a convenient premix beverage.",features:["Coffee drink premix","Ganoderma mushroom","3 in 1 format"]},
        {id:"cordyceps-coffee",category:"Coffee",type:"current",name:"Coffee Drink Premix With Cordyceps Powder (Cordyceps Coffee 3 in 1)",packaging:"3 in 1 coffee premix",imageNames:["Cordyceps Coffee 3 in 1","Cordyceys Coffe","Cordyceps Coffee"],description:"DXN Cordyceps Coffee 3 in 1 is a coffee premix with Cordyceps powder. The existing Nepal product image is retained and can be replaced with an updated product image at any time.",features:["Coffee drink premix","Cordyceps powder","3 in 1 format"]}
    ];

    function createPlaceholder(title, category) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f5f5f2"/><circle cx="400" cy="320" r="150" fill="#fff" stroke="#b5121b" stroke-width="5"/><text x="400" y="315" text-anchor="middle" font-family="Arial" font-size="34" fill="#8f0e15">DXN</text><text x="400" y="365" text-anchor="middle" font-family="Arial" font-size="22" fill="#555">${category}</text><text x="400" y="620" text-anchor="middle" font-family="Arial" font-size="25" fill="#222">${title.replace(/&/g,"&amp;").slice(0,38)}</text></svg>`;
        return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    function findProductImage(product, manifest) {
        const folder = product.category === "Coffee" ? "products/coffee" : "products/nutraceuticals";
        const images = (manifest.folders || {})[folder] || [];
        const terms = product.imageNames.map(value => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
        return images.find(item => {
            const name = (item.name + " " + item.path).toLowerCase().replace(/[^a-z0-9]+/g, " ");
            return terms.some(term => name.includes(term));
        })?.src || (product.id === "cordyceps-coffee" ? (manifest.folders.products || []).find(item => item.name.toLowerCase().includes("cordyceys"))?.src : null) || createPlaceholder(product.name, product.category);
    }

    function renderProducts(filter, manifest) {
        const catalog = document.getElementById("productCatalog");
        const empty = document.getElementById("catalogEmpty");
        if (!catalog) return;
        const selected = productData.filter(product => filter === "all" || product.type === filter || product.category.toLowerCase() === filter);
        catalog.innerHTML = "";
        selected.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";
            card.dataset.category = product.category.toLowerCase();
            card.dataset.status = product.type;
            const image = findProductImage(product, manifest);
            card.innerHTML = `<div class="product-card-image"><img src="${image}" alt="${product.name}" loading="lazy"></div><div class="product-card-body"><span class="product-card-category">${product.category}</span><span class="product-status ${product.type}">${product.type === "upcoming" ? "Upcoming" : "Current"}</span><h3>${product.name}</h3><p class="product-packaging">${product.packaging}</p><p>${product.description}</p><ul>${product.features.map(feature => `<li>${feature}</li>`).join("")}</ul></div>`;
            catalog.appendChild(card);
        });
        if (empty) empty.hidden = selected.length > 0;
    }

    async function loadProductManifest() {
        const catalog = document.getElementById("productCatalog");
        if (!catalog) return;
        let manifest = {folders:{}};
        try {
            const response = await fetch(`images.json?v=${Date.now()}`);
            if (response.ok) manifest = await response.json();
        } catch (error) {
            console.warn("Image manifest unavailable; using pending product images.", error);
        }
        const filterButtons = document.querySelectorAll("[data-product-filter]");
        const initialFilter = document.querySelector("[data-product-filter].active")?.dataset.productFilter || "all";
        renderProducts(initialFilter, manifest);
        filterButtons.forEach(button => button.addEventListener("click", function () {
            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            renderProducts(button.dataset.productFilter, manifest);
        }));
    }

    loadProductManifest();

    const year = document.querySelector(".current-year");
    if (year) year.textContent = new Date().getFullYear();
});
