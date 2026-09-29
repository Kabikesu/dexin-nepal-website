import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const roots = [
  { folder: "images/products/coffee", type: "Coffee" },
  { folder: "images/products/nutraceuticals", type: "Nutraceuticals" }
];
const allowed = new Set([".jpg",".jpeg",".png",".webp",".avif"]);

const slug = name => basename(name, extname(name)).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const title = name => basename(name, extname(name)).replace(/[-_]+/g," ").replace(/\s+/g," ").replace(/\b\w/g,c=>c.toUpperCase()).trim();

let existing = {};
try {
  const data = JSON.parse(await readFile("data/products.json","utf8"));
  existing = Object.fromEntries(data.map(p => [p.id,p]));
} catch {}

async function scan(folder,type){
  try {
    const entries = await readdir(folder,{withFileTypes:true});
    return entries.filter(e=>e.isFile() && allowed.has(extname(e.name).toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name))
      .map(e=>{
        const id=slug(e.name), known=existing[id] || {};
        return {
          id,
          name: known.name || title(e.name),
          type: known.type || type,
          description: known.description || "",
          image: join(folder,e.name).replaceAll("\\","/"),
          packageSize: known.packageSize || "",
          status: known.status || "current",
          featured: known.featured ?? false,
          upcoming: (known.status || "current") === "upcoming",
          published: known.published ?? true
        };
      });
  } catch { return []; }
}

const detected=(await Promise.all(roots.map(r=>scan(r.folder,r.type)))).flat();
const detectedIds=new Set(detected.map(p=>p.id));
const metadata=Object.values(existing).filter(p=>!detectedIds.has(p.id));
await writeFile("data/products.json",JSON.stringify([...detected,...metadata],null,2)+"\n");
console.log(`Generated ${detected.length} image-backed products + ${metadata.length} metadata-only products.`);