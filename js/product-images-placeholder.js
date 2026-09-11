/* =========================================================
   DXN NEPAL PRODUCT IMAGE PLACEHOLDERS
   Intentionally keeps product images broken until the real
   Nepal product photographs are added.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const catalog = document.getElementById("productCatalog");
    if (!catalog) return;

    function applyPendingImages() {
        catalog.querySelectorAll(".product-card").forEach(card => {
            const id = card.id;
            const image = card.querySelector(".product-card-image img");
            if (!id || !image) return;

            image.src = `images/products/pending/${id}.jpg`;
            image.alt = image.alt || "Product image pending";
            image.loading = "lazy";
        });
    }

    const observer = new MutationObserver(applyPendingImages);
    observer.observe(catalog, { childList: true, subtree: true });

    applyPendingImages();
});
