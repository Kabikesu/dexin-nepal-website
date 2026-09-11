/* =========================================================
   DXN MANUFACTURING NEPAL
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            menuToggle.classList.toggle("open", isOpen);
        });

        const navLinks = mainNav.querySelectorAll("a");
        navLinks.forEach(function (link) {
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
            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    /* =====================================================
       AUTOMATIC IMAGE LOADER
       Images are discovered by GitHub Actions and listed in
       images.json. Any new/replaced image is therefore picked
       up without manually editing the HTML.

       Example:
       <div class="auto-image-gallery" data-image-folder="gallery/images"></div>
    ====================================================== */

    async function loadImageManifest() {
        const response = await fetch("images.json?v=" + Date.now(), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Image manifest could not be loaded.");
        }

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
                const folder = (container.dataset.imageFolder || "")
                    .replace(/^images\//, "")
                    .replace(/\/$/, "");

                const images = folders[folder] || [];
                container.innerHTML = "";

                if (!images.length) {
                    container.setAttribute("data-image-empty", "true");
                    return;
                }

                container.removeAttribute("data-image-empty");
                images.forEach(function (item) {
                    container.appendChild(createImageCard(item));
                });
            });
        } catch (error) {
            console.warn("Automatic image loader:", error.message);
        }
    }

    renderAutomaticImages();

    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    const currentYear = document.querySelector(".current-year");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
