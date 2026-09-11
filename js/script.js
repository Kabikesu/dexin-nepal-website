/* =========================================================
   DXN MANUFACTURING NEPAL
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SHARED NAVIGATION
       The same navigation is rendered on every page.
    ====================================================== */
    const mainNav = document.getElementById("mainNav");
    if (mainNav) {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        mainNav.innerHTML = `
            <a href="index.html" data-page="index.html">Home</a>
            <a href="about.html" data-page="about.html">About</a>
            <details class="nav-dropdown" data-menu="products">
                <summary>Products</summary>
                <div class="nav-dropdown-menu">
                    <a href="products.html#all-products">All Products</a>
                    <a href="products.html#new-products">New Products</a>
                    <details class="nav-subdropdown">
                        <summary>Product Categories</summary>
                        <div class="nav-submenu">
                            <a href="products.html#nutraceuticals">Nutraceuticals</a>
                            <a href="products.html#coffee">Coffee</a>
                        </div>
                    </details>
                    <details class="nav-subdropdown">
                        <summary>Top Products</summary>
                        <div class="nav-submenu">
                            <a href="products.html#dxn-coffee">DXN Coffee</a>
                            <a href="products.html#dxn-rg-gl">DXN RG &amp; GL</a>
                            <a href="products.html#dxn-spirulina">DXN Spirulina</a>
                            <a href="products.html#dxn-cocozhi">DXN Cocozhi</a>
                        </div>
                    </details>
                    <details class="nav-subdropdown">
                        <summary>Manufacturing Units</summary>
                        <div class="nav-submenu">
                            <a href="products.html#coffee-unit">Coffee Unit</a>
                            <a href="products.html#nutraceutical-unit">Nutraceutical Unit</a>
                        </div>
                    </details>
                </div>
            </details>
            <a href="quality.html" data-page="quality.html">Quality</a>
            <details class="nav-dropdown" data-menu="gallery">
                <summary>Gallery</summary>
                <div class="nav-dropdown-menu">
                    <a href="gallery.html#image-gallery">Image Gallery</a>
                    <a href="gallery.html#video-gallery">Video Gallery</a>
                    <a href="gallery.html#corporate-events">Corporate Events</a>
                    <a href="gallery.html#news-press">News &amp; Press</a>
                </div>
            </details>
            <details class="nav-dropdown" data-menu="company">
                <summary>Company</summary>
                <div class="nav-dropdown-menu">
                    <a href="about.html">About Us</a>
                    <a href="careers.html">Careers</a>
                    <a href="staff-portal.html">Staff Portal</a>
                </div>
            </details>
            <a href="contact.html" data-page="contact.html">Contact</a>
        `;

        const activePage = mainNav.querySelector(`[data-page="${currentPage}"]`);
        if (activePage) activePage.classList.add("active");
        if (currentPage === "products.html") mainNav.querySelector('[data-menu="products"]')?.querySelector("summary")?.classList.add("active");
        if (currentPage === "gallery.html") mainNav.querySelector('[data-menu="gallery"]')?.querySelector("summary")?.classList.add("active");
        if (["careers.html", "staff-portal.html"].includes(currentPage)) mainNav.querySelector('[data-menu="company"]')?.querySelector("summary")?.classList.add("active");
        if (currentPage === "about.html") mainNav.querySelector('[data-menu="company"]')?.querySelector("summary")?.classList.add("active");
    }

    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */
    const menuToggle = document.getElementById("menuToggle");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            menuToggle.classList.toggle("open", isOpen);
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("active");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu = mainNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);
            if (!clickedInsideMenu && !clickedToggle && mainNav.classList.contains("active")) {
                mainNav.classList.remove("active");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* =====================================================
       HEADER SHADOW ON SCROLL
    ====================================================== */
    const header = document.querySelector(".site-header");
    if (header) {
        window.addEventListener("scroll", function () {
            header.classList.toggle("scrolled", window.scrollY > 20);
        });
    }

    /* =====================================================
       AUTOMATIC IMAGE LOADER
    ====================================================== */
    async function loadImageManifest() {
        const response = await fetch("images.json?v=" + Date.now(), { cache: "no-store" });
        if (!response.ok) throw new Error("Image manifest could not be loaded.");
        return response.json();
    }

    function createImageCard(item) {
        const card = document.createElement("figure");
        card.className = "auto-image-card";
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.name || "DXN Manufacturing Nepal";
        image.loading = "lazy";
        image.decoding = "async";
        const caption = document.createElement("figcaption");
        caption.textContent = item.name || "DXN Manufacturing Nepal";
        card.appendChild(image);
        card.appendChild(caption);
        return card;
    }

    async function renderAutomaticImages() {
        const containers = document.querySelectorAll("[data-image-folder]");
        if (!containers.length) return;
        try {
            const manifest = await loadImageManifest();
            const folders = manifest.folders || {};
            containers.forEach(function (container) {
                const folder = (container.dataset.imageFolder || "").replace(/^images\//, "").replace(/\/$/, "");
                const images = folders[folder] || [];
                container.innerHTML = "";
                if (!images.length) {
                    container.setAttribute("data-image-empty", "true");
                    return;
                }
                container.removeAttribute("data-image-empty");
                images.forEach(function (item) { container.appendChild(createImageCard(item)); });
            });
        } catch (error) {
            console.warn("Automatic image loader:", error.message);
        }
    }

    renderAutomaticImages();

    const currentYear = document.querySelector(".current-year");
    if (currentYear) currentYear.textContent = new Date().getFullYear();
});
