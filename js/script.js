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
            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
            menuToggle.classList.toggle("open", isOpen);
        });

        /* Close menu when a navigation link is clicked */
        const navLinks = mainNav.querySelectorAll("a");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("active");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });

        /* Close menu when clicking outside */

        document.addEventListener("click", function (event) {
            const clickedInsideMenu =
                mainNav.contains(event.target);
            const clickedToggle =
                menuToggle.contains(event.target);
            if (
                !clickedInsideMenu &&
                !clickedToggle &&
                mainNav.classList.contains("active")
            ) {
                mainNav.classList.remove("active");
                menuToggle.classList.remove("open");
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
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
       CURRENT YEAR
    ====================================================== */

    const currentYear = document.querySelector(".current-year");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});