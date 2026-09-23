from pathlib import Path
import hashlib
import json
import re

OUTPUT = Path("images.json")
ROOTS = {
    Path("images/gallery"): "gallery",
    Path("images/factory"): "factory",
}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".ogg", ".mov", ".m4v"}
ALLOWED_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS


def human_name(value: str) -> str:
    value = re.sub(r"[-_]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value.title()


def version(path: Path) -> str:
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return digest[:12]


def category_label(category: str, folder: str) -> str:
    if category == "factory":
        return "Factory Images"
    if folder == "events" or folder.startswith("events/"):
        return "Corporate Events"
    return "Corporate Images"


albums = {}

for root, category in ROOTS.items():
    if not root.exists():
        continue

    for path in sorted(root.rglob("*"), key=lambda item: item.as_posix().lower()):
        if not path.is_file() or path.name.startswith(".") or path.suffix.lower() not in ALLOWED_EXTENSIONS:
            continue

        relative = path.relative_to(root).as_posix()
        folder = path.parent.relative_to(root).as_posix()
        folder = "" if folder == "." else folder

        if category == "factory":
            album_id = "factory-images"
            title = "Factory Images"
            category_text = "Factory Images"
        else:
            parts = folder.split("/") if folder else []
            if not parts:
                album_id = "gallery"
                title = "Gallery"
                category_text = "Gallery"
            elif parts[0] == "videos" and len(parts) == 1:
                album_id = "video-gallery"
                title = "Video Gallery"
                category_text = "Video Gallery"
            else:
                album_id = folder.lower().replace("/", "-")
                title = human_name(parts[-1])
                category_text = category_label(category, folder)

        item_version = version(path)
        media_type = "video" if path.suffix.lower() in VIDEO_EXTENSIONS else "image"
        item = {
            "src": "images/" + (path.relative_to(Path("images")).as_posix()) + "?v=" + item_version,
            "path": path.relative_to(Path("images")).as_posix(),
            "name": human_name(path.stem),
            "type": media_type,
            "version": item_version,
        }

        album = albums.setdefault(album_id, {
            "id": album_id,
            "title": title,
            "category": category,
            "categoryLabel": category_text,
            "path": folder,
            "items": [],
        })
        album["items"].append(item)

manifest = {
    "schemaVersion": "1.0",
    "generated": True,
    "folders": list(albums.values()),
}

OUTPUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Generated {OUTPUT} with {sum(len(album['items']) for album in albums.values())} media files in {len(albums)} albums.")
