/**
 * upload-media.mjs
 * 1. Borra todo lo que hay en Supabase Storage (products/ y catalog/)
 * 2. Renombra archivos locales a nombres limpios (producto-001.jpeg, video-001.mp4)
 * 3. Agrega marca de agua "Dulce Regalo LPC" a cada imagen
 * 4. Sube todo a Supabase Storage
 * 5. Genera public/media-urls.json con las URLs públicas
 *
 * Ejecutar: cd web && node tools/upload-media.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR   = path.join(__dirname, '..', 'public', 'img');
const OUT_FILE  = path.join(__dirname, '..', 'public', 'media-urls.json');

// ── Leer .env ────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
const envVars = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
  });
}
const SUPABASE_URL  = envVars['VITE_SUPABASE_URL'];
const SUPABASE_KEY  = envVars['SUPABASE_SERVICE_KEY'] || envVars['VITE_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMG_EXTS   = ['.jpg', '.jpeg', '.png', '.webp'];
const VIDEO_EXTS = ['.mp4', '.mov', '.webm'];

// ── Marca de agua ─────────────────────────────────────────────────────────────
async function addWatermark(imagePath) {
  const img      = sharp(imagePath);
  const meta     = await img.metadata();
  const w        = meta.width  || 800;
  const fontSize = Math.max(20, Math.round(w * 0.045));
  const pad      = Math.round(w * 0.03);
  const texto    = 'Dulce Regalo LPC';
  const txW      = Math.round(texto.length * fontSize * 0.58);
  const txH      = Math.round(fontSize * 1.5);

  const svg = `<svg width="${txW + pad * 2}" height="${txH + pad}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${txW + pad * 2}" height="${txH + pad}" rx="6" fill="rgba(0,0,0,0.50)"/>
    <text x="${pad + 1}" y="${txH - 5}" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="bold" fill="rgba(0,0,0,0.6)">${texto}</text>
    <text x="${pad}" y="${txH - 6}" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="bold" fill="rgba(255,255,255,0.92)">${texto}</text>
  </svg>`;

  return img
    .composite([{ input: Buffer.from(svg), gravity: 'southeast', blend: 'over' }])
    .jpeg({ quality: 88 })
    .toBuffer();
}

// ── Limpiar Supabase Storage ──────────────────────────────────────────────────
async function limpiarBucket(bucket, carpeta) {
  console.log(`\n🗑  Limpiando Supabase Storage: ${bucket}/${carpeta}/...`);
  const { data, error } = await supabase.storage.from(bucket).list(carpeta, { limit: 1000 });
  if (error) { console.log(`   ⚠️  No se pudo listar: ${error.message}`); return; }
  if (!data || data.length === 0) { console.log('   (vacío — nada que borrar)'); return; }

  const paths = data.map(f => `${carpeta}/${f.name}`);
  const { error: delErr } = await supabase.storage.from(bucket).remove(paths);
  if (delErr) console.log(`   ⚠️  Error borrando: ${delErr.message}`);
  else console.log(`   ✅ Borrados ${paths.length} archivos`);
}

// ── Subir archivo ─────────────────────────────────────────────────────────────
async function subirArchivo(buffer, bucket, storagePath, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ════════════════════════════════════════════════════════════════════════════
// INICIO
// ════════════════════════════════════════════════════════════════════════════
console.log('🚀 Iniciando limpieza y subida de medios...');

// PASO 1 — Leer archivos locales
const todos    = fs.readdirSync(IMG_DIR).filter(f => !f.startsWith('.'));
const imagenes = todos.filter(f => IMG_EXTS.includes(path.extname(f).toLowerCase()));
const videos   = todos.filter(f => VIDEO_EXTS.includes(path.extname(f).toLowerCase()));
console.log(`\n📂 Encontrados: ${imagenes.length} imágenes, ${videos.length} videos`);

// PASO 2 — Renombrar archivos locales a nombres limpios
console.log('\n✏️  Renombrando archivos locales...');
const imagenesRenombradas = [];
const videosRenombrados   = [];

imagenes.forEach((file, idx) => {
  const num     = String(idx + 1).padStart(3, '0');
  const newName = `producto-${num}.jpeg`;
  const oldPath = path.join(IMG_DIR, file);
  const newPath = path.join(IMG_DIR, newName);
  if (oldPath !== newPath) {
    fs.renameSync(oldPath, newPath);
    console.log(`   ${file}  →  ${newName}`);
  }
  imagenesRenombradas.push(newName);
});

videos.forEach((file, idx) => {
  const num     = String(idx + 1).padStart(3, '0');
  const ext     = path.extname(file).toLowerCase();
  const newName = `video-${num}${ext}`;
  const oldPath = path.join(IMG_DIR, file);
  const newPath = path.join(IMG_DIR, newName);
  if (oldPath !== newPath) {
    fs.renameSync(oldPath, newPath);
    console.log(`   ${file}  →  ${newName}`);
  }
  videosRenombrados.push(newName);
});

// PASO 3 — Limpiar Supabase
await limpiarBucket('product-images', 'products');
await limpiarBucket('product-videos', 'catalog');

// PASO 4 — Subir imágenes con marca de agua
console.log('\n☁️  Subiendo imágenes a Supabase con marca de agua...');
const imageUrls = [];

for (const file of imagenesRenombradas) {
  const localPath = path.join(IMG_DIR, file);
  if (!fs.existsSync(localPath)) continue;
  try {
    const buffer = await addWatermark(localPath);
    const url    = await subirArchivo(buffer, 'product-images', `products/${file}`, 'image/jpeg');
    imageUrls.push({ file, url, type: 'image' });
    process.stdout.write(`   ✅ ${file}\r`);
  } catch (err) {
    console.error(`\n   ❌ ${file}: ${err.message}`);
    imageUrls.push({ file, url: `/img/${file}`, type: 'image', local: true });
  }
}
console.log(`\n   📸 ${imageUrls.length} imágenes subidas`);

// PASO 5 — Subir videos (sin marca de agua)
console.log('\n🎥 Subiendo videos...');
const videoUrls = [];

for (const file of videosRenombrados) {
  const localPath = path.join(IMG_DIR, file);
  if (!fs.existsSync(localPath)) continue;
  try {
    const buffer = fs.readFileSync(localPath);
    const url    = await subirArchivo(buffer, 'product-videos', `catalog/${file}`, 'video/mp4');
    videoUrls.push({ file, url, type: 'video' });
    console.log(`   ✅ ${file}`);
  } catch (err) {
    console.error(`   ❌ ${file}: ${err.message}`);
    videoUrls.push({ file, url: `/img/${file}`, type: 'video', local: true });
  }
}

// PASO 6 — Guardar JSON
fs.writeFileSync(OUT_FILE, JSON.stringify({
  generatedAt: new Date().toISOString(),
  images: imageUrls,
  videos: videoUrls,
}, null, 2));

console.log(`\n🎉 ¡Listo!`);
console.log(`   📸 Imágenes: ${imageUrls.length}`);
console.log(`   🎥 Videos:   ${videoUrls.length}`);
console.log(`   📄 JSON:     public/media-urls.json`);
console.log(`\n➡️  Abre /catalogo en el navegador para ver los resultados.\n`);
