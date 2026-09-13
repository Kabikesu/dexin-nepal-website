/* =========================================================
   DXN MANUFACTURING NEPAL
   FOLDER-BASED MEDIA GALLERY
   Images and videos are grouped automatically from images.json.
========================================================= */

(function () {
    "use strict";

    const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function titleCase(value) {
        return String(value || "")
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    function isVideo(item) {
        if (item?.type === "video") return true;
        const path = String(item?.path || "").toLowerCase();
        return VIDEO_EXTENSIONS.some(ext => path.endsWith(ext));
    }

    function isImage(item) {
        if (item?.type === "image") return true;
        const path = String(item?.path || "").toLowerCase();
        return IMAGE_EXTENSIONS.some(ext => path.endsWith(ext));
    }

    function folderNameFromPath(item, rootFolder) {
        const path = String(item?.path || "");
        const root = rootFolder.endsWith("/") ? rootFolder : `${rootFolder}/`;
        if (!path.startsWith(root)) return "";
        const remainder = path.slice(root.length);
        const parts = remainder.split("/");

        // Preferred structure: root/Event Name/photo.jpg
        if (parts.length > 1 && parts[0]) return parts[0];

        // Transition support for existing flat files such as
        // "Enviroment Day (1).jpeg". These become one temporary album
        // until the files are moved into their event folder.
        const stem = String(item?.name || parts[0] || "Image").trim();
        const grouped = stem.replace(/\s*\(\d+\)\s*$/, "").trim();
        return grouped || "General Gallery";
    }

    function groupMedia(items, rootFolder) {
        const groups = new Map();

        items.forEach(item => {
            if (!item?.src) return;
            const name = folderNameFromPath(item, rootFolder) || "General Gallery";
            if (!groups.has(name)) groups.set(name, []);
            groups.get(name).push(item);
        });

        return [...groups.entries()]
            .map(([name, media]) => ({
                name,
                media: media.sort((a, b) => String(a.path).localeCompare(String(b.path), undefined, { numeric: true }))
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    function createFolderView(container) {
        const detail = document.createElement("div");
        detail.className = "media-folder-detail";
        detail.hidden = true;
        container.appendChild(detail);
        return detail;
    }

    function renderFolderGallery(container, rootFolder, items, options = {}) {
        const groups = groupMedia(items, rootFolder);
        const folderGrid = document.createElement("div");
        folderGrid.className = "media-folder-grid";
        const detail = createFolderView(container);
        const title = options.title || "Gallery";

        if (!groups.length) {
            folderGrid.innerHTML = `<div class="media-gallery-empty">Media will appear here automatically when folders and files are added.</div>`;
            container.appendChild(folderGrid);
            return;
        }

        groups.forEach(group => {
            const firstImage = group.media.find(isImage);
            const firstVideo = group.media.find(isVideo);
            const cover = firstImage?.src || firstVideo?.src || "";
            const imageCount = group.media.filter(isImage).length;
            const videoCount = group.media.filter(isVideo).length;
            const countText = [
                imageCount ? `${imageCount} Photo${imageCount === 1 ? "" : "s"}` : "",
                videoCount ? `${videoCount} Video${videoCount === 1 ? "" : "s"}` : ""
            ].filter(Boolean).join(" · ");

            const card = document.createElement("button");
            card.type = "button";
            card.className = "media-folder-card";
            card.innerHTML = `
                <span class="media-folder-cover">
                    ${cover && firstImage ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(group.name)}" loading="lazy">` : "<span class=\"media-folder-video-cover\">▶</span>"}
                    <span class="media-folder-icon">▰</span>
                </span>
                <span class="media-folder-body">
                    <strong>${escapeHtml(titleCase(group.name))}</strong>
                    <span>${escapeHtml(countText)}</span>
                </span>
                <span class="media-folder-arrow">→</span>`;

            card.addEventListener("click", () => {
                folderGrid.hidden = true;
                detail.hidden = false;
                renderFolderDetail(detail, group, title, () => {
                    detail.hidden = true;
                    folderGrid.hidden = false;
                });
                detail.scrollIntoView({ behavior: "smooth", block: "start" });
            });

            folderGrid.appendChild(card);
        });

        container.appendChild(folderGrid);
    }

    function renderFolderDetail(detail, group, parentTitle, onBack) {
        const images = group.media.filter(isImage);
        const videos = group.media.filter(isVideo);

        detail.innerHTML = `
            <div class="media-detail-heading">
                <button type="button" class="media-back-btn">← Back to ${escapeHtml(parentTitle)}</button>
                <span class="section-label">${escapeHtml(parentTitle)}</span>
                <h3>${escapeHtml(titleCase(group.name))}</h3>
                <p>${images.length ? `${images.length} photo${images.length === 1 ? "" : "s"}` : ""}${images.length && videos.length ? " · " : ""}${videos.length ? `${videos.length} video${videos.length === 1 ? "" : "s"}` : ""}</p>
            </div>
            <div class="media-detail-grid"></div>`;

        detail.querySelector(".media-back-btn").addEventListener("click", onBack);
        const grid = detail.querySelector(".media-detail-grid");

        group.media.forEach(item => {
            if (isVideo(item)) {
                const card = document.createElement("article");
                card.className = "media-detail-card media-video-card";
                card.innerHTML = `
                    <video controls preload="metadata" src="${escapeHtml(item.src)}"></video>
                    <div>${escapeHtml(item.name || "Video")}</div>`;
                grid.appendChild(card);
                return;
            }

            if (isImage(item)) {
                const card = document.createElement("figure");
                card.className = "media-detail-card";
                card.innerHTML = `
                    <a href="${escapeHtml(item.src)}" target="_blank" rel="noopener">
                        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.name || group.name)}" loading="lazy">
                    </a>
                    <figcaption>${escapeHtml(item.name || group.name)}</figcaption>`;
                grid.appendChild(card);
            }
        });
    }

    function initializeGallery(manifest) {
        document.querySelectorAll("[data-media-root]").forEach(container => {
            const rootFolder = container.dataset.mediaRoot;
            const items = (manifest.folders || {})[rootFolder] || [];

            container.innerHTML = "";
            renderFolderGallery(container, rootFolder, items, {
                title: container.dataset.mediaTitle || "Gallery"
            });
        });
    }

    document.addEventListener("DOMContentLoaded", async function () {
        try {
            const response = await fetch(`images.json?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
            const manifest = await response.json();
            initializeGallery(manifest);
        } catch (error) {
            console.warn("Folder gallery could not load images.json", error);
        }
    });
})();
