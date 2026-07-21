# Dulce Regalo — Guía de cambios

Tienda de regalos colombiana. React + Vite + Supabase + Vercel.

---

## ¿Dónde entrar a hacer cambios?

### 🎨 Logo y marca
**Archivo:** `src/components/BrandLogo.jsx`

| Qué cambiar | Dónde |
|-------------|-------|
| Tamaño del logo | Objeto `sizes` → valores `icon`, `title`, `tagline` |
| Grosor de "Dulce Regalo" | `fontWeight: 500` → subir a 700 o 900 para más grueso |
| Colores de cada letra | Array `colors` → índice 0=D, 1=u, 2=l, 3=c, 4=e, 6=R, 7=e, 8=g, 9=a, 10=l, 11=o |
| Velocidad de caída de letras | `animationDelay: i * 0.09` → número más alto = más lento |
| Texto "Detalles con amor" | String al final del componente |
| Velocidad del brillo rojo | `shimmerRed 3.5s` → número más bajo = más rápido |
| Colores del brillo | `linear-gradient(90deg, #c0392b ...)` |

---

### 🛒 Precios y opciones de envío
**Archivo:** `src/pages/CheckoutPage.jsx`

| Qué cambiar | Dónde |
|-------------|-------|
| Precio domicilio Bogotá | `OPCIONES_ENTREGA` → objeto `id: 'bogota'` → `precio: 15000` |
| Precio envío Colombia | `OPCIONES_ENTREGA` → objeto `id: 'colombia'` → `precio: 25000` |
| Texto de cada opción | `label` y `detalle` dentro de `OPCIONES_ENTREGA` |
| Agregar nueva opción de envío | Agregar un objeto nuevo en el array `OPCIONES_ENTREGA` |

---

### 📱 Botón de WhatsApp
**Archivo:** `src/components/WhatsAppButton.jsx`

| Qué cambiar | Dónde |
|-------------|-------|
| Número de WhatsApp | `WHATSAPP_NUMBER = '573213175459'` |
| Mensaje pre-escrito | `WHATSAPP_MESSAGE = 'Hola! Me interesa...'` |
| Texto del globito | `<span>¿Tienes dudas? ¡Escríbenos!</span>` |

---

### 📦 Productos (nombres, descripciones, precios)
**Dónde:** Supabase → Table Editor → tabla `products`
- URL: https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz/editor

Para cambiar masivamente → usar el SQL Editor:
- URL: https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz/sql/new

---

### 📂 Catálogos
**Dónde:** Supabase → Table Editor → tablas `catalogs` y `catalog_products`

Para crear un catálogo nuevo:
1. Insertar fila en `catalogs` (nombre, descripcion, activo=true)
2. Insertar filas en `catalog_products` (catalog_id, product_id)

---

### 📞 Datos de contacto (teléfono, email, dirección)
**Archivos:**
- `src/pages/ContactPage.jsx` → tarjetas de contacto y mapa
- `src/components/Footer.jsx` → pie de página

Buscar y reemplazar:
- Teléfono: `321 3175459` / `+573213175459`
- Email: `Lepacaru@gmail.com`
- Dirección: `Calle 63a sur #71h-46, Barrio Perdomo`

---

### 🔐 Panel de administración
**URL producción:** https://dulce-regalo.vercel.app/admin
**Login:** https://dulce-regalo.vercel.app/login

Para crear/editar usuarios admin:
- Supabase → Authentication → Users
- URL: https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz/auth/users

---

### 🌐 Variables de entorno
**Archivo local:** `web/.env` (no se sube a GitHub)
**En Vercel:** Settings → Environment Variables

| Variable | Para qué sirve |
|----------|---------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública Supabase (frontend) |
| `VITE_EMAILJS_SERVICE_ID` | ID del servicio EmailJS (formulario contacto) |
| `VITE_EMAILJS_TEMPLATE_ID` | ID de la plantilla EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | Clave pública EmailJS |

---

## ¿Cómo subir cambios a Vercel?

```bash
# En la terminal, dentro de la carpeta del proyecto:
git add .
git commit -m "descripción del cambio"
git push origin main
```

Vercel despliega automáticamente en 1-2 minutos después del push.

---

## Estructura de carpetas importantes

```
web/
├── src/
│   ├── components/
│   │   ├── BrandLogo.jsx       ← Logo, título y tagline animados
│   │   ├── Header.jsx          ← Barra de navegación superior
│   │   ├── Footer.jsx          ← Pie de página con contacto
│   │   └── WhatsAppButton.jsx  ← Botón flotante de WhatsApp
│   ├── pages/
│   │   ├── HomePage.jsx        ← Página de inicio
│   │   ├── ProductsPage.jsx    ← Catálogo de productos con filtros
│   │   ├── CheckoutPage.jsx    ← Proceso de compra y envío
│   │   ├── ContactPage.jsx     ← Formulario de contacto
│   │   ├── CatalogoPage.jsx    ← Galería de fotos y catálogos
│   │   ├── AdminPage.jsx       ← PANEL DE ADMINISTRACIÓN
│   │   └── LoginPage.jsx       ← Login del administrador
│   └── lib/
│       ├── supabase.js         ← Conexión a Supabase
│       └── api.js              ← Funciones de base de datos
├── tools/
│   ├── upload-media.mjs        ← Script para subir imágenes a Supabase
│   └── update-products-names.sql ← SQL con nombres/precios de los 47 productos
└── .env                        ← Variables de entorno (NO subir a GitHub)
```

---

## Links importantes

| Recurso | URL |
|---------|-----|
| Tienda en producción | https://dulce-regalo.vercel.app |
| Supabase (base de datos) | https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz |
| Vercel (deploy) | https://vercel.com/lucho8215/dulce-regalo |
| GitHub (código) | https://github.com/Lucho8215/dulce-regalo |
