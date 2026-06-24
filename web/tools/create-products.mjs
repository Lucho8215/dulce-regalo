/**
 * create-products.mjs
 * Lee media-urls.json y crea un producto en Supabase por cada imagen.
 * Precio base: $50.000 COP (el admin lo cambia después desde el panel).
 *
 * Ejecutar: node tools/create-products.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Leer .env ─────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
const envVars = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
});

const supabase = createClient(
  envVars['VITE_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_KEY'] || envVars['VITE_SUPABASE_ANON_KEY']
);

// ── Leer el JSON de medios ────────────────────────────────────────────────────
const mediaPath = path.join(__dirname, '..', 'public', 'media-urls.json');
const media     = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));

console.log(`\n🛍️  Creando ${media.images.length} productos en Supabase...\n`);

// ── Categorías para rotar entre los productos ─────────────────────────────────
const categorias = ['Osos', 'Peluches', 'Regalos', 'Detalles', 'Canastas'];

let creados  = 0;
let errores  = 0;

for (let i = 0; i < media.images.length; i++) {
  const img      = media.images[i];
  const num      = i + 1;
  const categoria = categorias[i % categorias.length];

  // La URL: si está en Supabase la usamos, si no, la local /img/...
  const imagenUrl = img.local
    ? `/img/${img.file}`
    : img.url;

  const producto = {
    nombre:      `Producto ${String(num).padStart(2, '0')}`,   // "Producto 01"
    descripcion: 'Detalle especial con mucho amor. Precio puede variar según personalización.',
    precio:      50000,          // $50.000 COP — cambiar desde el panel admin
    categoria:   categoria,
    imagen_url:  imagenUrl,
    imagen_path: `products/${img.file}`,
    inventario:  10,             // stock inicial
    destacado:   num <= 6,       // los primeros 6 aparecen en la página de inicio
    activo:      true,
  };

  const { error } = await supabase.from('products').insert(producto);

  if (error) {
    console.error(`❌ ${producto.nombre}: ${error.message}`);
    errores++;
  } else {
    process.stdout.write(`✅ ${producto.nombre} — ${categoria} — $50.000\n`);
    creados++;
  }
}

console.log(`\n🎉 Listo:`);
console.log(`   ✅ Creados:  ${creados}`);
console.log(`   ❌ Errores:  ${errores}`);
console.log(`\n➡️  Ve al Panel Admin → Productos para editar nombres y precios.`);
console.log(`➡️  Los primeros 6 ya están marcados como "destacados" (aparecen en inicio).\n`);
