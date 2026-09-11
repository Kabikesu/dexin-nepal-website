from pathlib import Path
import hashlib
import json
import re

ROOT = Path("images")
OUTPUT = Path("images.json")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
EXCLUDED_FOLDERS = {"sustainability"}


def human_name(stem: str) -> str:
    value = re.sub(r"[-_]+", " ", stem)
    value = re.sub(r"\s+", " ", value).strip()
    return value.title()


def file_version(path: Path) -> str:
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return digest[:12]


folders = {}

if ROOT.exists():
    for path in sorted(ROOT.rglob("*"), key=lambda p: p.as_posix().lower()):
        if not path.is_file() or path.suffix.lower() not in ALLOWED_EXTENSIONS:
            continue

        relative = path.relative_to(ROOT).as_posix()
        folder = path.parent.relative_to(ROOT).as_posix()
        if folder == ".":
            folder = ""

        folder_parts = set(folder.split("/")) if folder else set()
        if folder_parts & EXCLUDED_FOLDERS:
            continue

        version = file_version(path)
        item = {
            "src": "images/" + relative + "?v=" + version,
            "path": relative,
            "name": human_name(path.stem),
            "type": "image",
            "version": version,
        }
        folders.setdefault(folder, []).append(item)

manifest = {
    "generated": True,
    "folders": folders,
}

OUTPUT.write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

print(f"Generated {OUTPUT} with {sum(len(items) for items in folders.values())} images in {len(folders)} folders.")
