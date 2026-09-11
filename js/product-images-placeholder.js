/* =========================================================
   DXN MANUFACTURING NEPAL
   PRODUCT IMAGE FALLBACK

   Purpose:
   1. Keep a real product image when it loads successfully.
   2. If the real image is missing or fails to load, show a
      clean placeholder containing the product name.

   The product catalogue in script.js is responsible for
   selecting the real image from images.json. This file only
   handles the final load/error fallback.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const PLACEHOLDER_LABEL = "Product Image";

    function escapeSvgText(value) {
        return String(value || "Product").replace(/[&<>\"]/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;"
        }[character]));
    }

    function createPlaceholder(productName) {
        const name = escapeSvgText(productName || "Product");
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${name} image placeholder">
                <rect width="800" height="600" fill="#f3f4f6"/>
                <rect x="40" y="40" width="720" height="520" rx="18" fill="#ffffff" stroke="#d1d5db" stroke-width="3"/>
                <circle cx="400" cy="245" r="70" fill="#e5e7eb"/>
                <path d="M360 245h80M400 205v80" stroke="#9ca3af" stroke-width="10" stroke-linecap="round"/>
                <text x="400" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#4b5563">${PLACEHOLDER_LABEL}</text>
                <text x="400" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">${name}</text>
            </svg>`;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function isPendingPath(src) {
        return String(src || "").includes("images/products/pending/");
    }

    function applyFallback(image) {
        if (!image || image.dataset.placeholderApplied === "true") return;

        const productCard = image.closest(".product-card");
        const productName = productCard?.querySelector(".product-card-body h3")?.textContent?.trim()
            || image.alt
            || "Product";

        image.dataset.placeholderApplied = "true";
        image.src = createPlaceholder(productName);
        image.alt = `${productName} image placeholder`;
        image.removeAttribute("data-image-fallback-pending");
    }

    function watchImage(image) {
        if (!image || image.dataset.fallbackWatcher === "true") return;
        image.dataset.fallbackWatcher = "true";

        image.addEventListener("error", function () {
            applyFallback(image);
        });

        /* script.js uses the pending path when no real image is found. */
        if (isPendingPath(image.getAttribute("src"))) {
            applyFallback(image);
        }
    }

    function scanImages(root = document) {
        root.querySelectorAll?.(".product-card-image img, #modalProductImage").forEach(watchImage);
    }

    const catalog = document.getElementById("productCatalog");
    if (catalog) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) scanImages(node);
                });
            });
        });

        observer.observe(catalog, { childList: true, subtree: true });
    }

    scanImages();
});
