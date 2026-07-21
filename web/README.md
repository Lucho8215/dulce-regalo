# Momentos Magicos - Guía de Cambios

Tienda de regalos. React + Vite + Supabase + Vercel.

---

## ¿Dónde hacer cambios?

### 🎨 Logo y marca
**Archivo:** `src/components/BrandLogo.jsx`

| Qué cambiar | Dónde |
|-------------|-------|
| Texto del título animado | Array `['M','o','m','e','n','t','o','s',' ','M','a','g','i','c','o','s']` (línea 134) |
| Colores de cada letra | Array `colors` (índice 0 a 15) |
| Grosor del título | `fontWeight: 500` → 700 o 900 |
| Velocidad de caída de letras | `animationDelay: i * 0.09` |
| Texto tagline "Detalles con amor" | String al final del componente (línea 175) |
| Tamaño del logo | Objeto `sizes` → valores `icon`, `title`, `tagline`, `gap` |
| Evitar corte de texto en footer | Propiedades `whiteSpace: 'nowrap'`, `letterSpacing: '0.02em'` |

---

### 🛒 Precios y decimales
**Archivos principales:**
- `src/hooks/useCart.jsx`
- `src/components/OrderSummary.jsx`
- `src/components/ProductCard.jsx`
- `src/pages/ProductsPage.jsx`
- `src/pages/CheckoutPage.jsx`
- `src/pages/CartPage.jsx`
- `src/pages/AdminPage.jsx`

**Metodología utilizada:**
- Todos los precios usan `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })`.
- En casos donde se necesita un array o variable, se usa `Math.round(price).toLocaleString('es-CO')`.
- No se usan `.toFixed(2)` para precios de productos.

---

### 📦 Gestión de inventario

**Archivo local:** `src/data/products.json` (fallback)

**En producción:** Supabase → Table Editor → tabla `products` → columna `inventario`.

**Panel admin:** `src/pages/AdminPage.jsx` → Tab "Inventario" → editar y guardar.

**Cambios realizados:**
- Estado "Bajo" ahora se muestra solo cuando `inventario < 1`.
- Input de inventario tiene `min="1"`.
- Producto `prod_003` actualizado a `inventario: 1`.

---

### 📞 Contacto y horarios
**Archivo:** `src/pages/ContactPage.jsx`

| Cambio | Dónde |
|--------|-------|
| Teléfono | Buscar `321 3175459` y `+573213175459` |
| Email | Buscar `Lepacaru@gmail.com` |
| Dirección | Buscar `Calle 63a sur #71h-46` |
| Horario | Bloque `<div className="bg-muted rounded-xl p-6">` con clase `space-y-2 text-sm text-muted-foreground` |
| Horario actual | `Todos los días: 10:00 AM - 8:00 PM` |

---

### 🤝 Botón de WhatsApp
**Archivo:** `src/components/WhatsAppButton.jsx`

| Cambio | Dónde |
|--------|-------|
| Número | `WHATSAPP_NUMBER = '573213175459'` |
| Mensaje pre-escrito | `WHATSAPP_MESSAGE = 'Hola! Me interesa un regalo de Momentos Magicos 🎁'` |
| Texto del globo | `<span>¿Tienes dudas? ¡Escríbenos!</span>` |

---

### 💳 Checkout y pagos
**Archivo:** `src/pages/CheckoutPage.jsx`

**Cambios realizados:**
- Referencia de orden usa prefijo `MM-` en lugar de `DR-`.
- Confirmación de pedido con banner grande verde: título `text-4xl`, padding amplio, borde `border-2 border-green-200`.
- Botón de Wompi con `padding: 24px 32px` y `fontSize: 20px` para mayor tamaño.

**Cómo cambiar precios de envío:**
```js
const OPCIONES_ENTREGA = [
  { id: 'bogota', precio: 15000, label: 'Domicilio en Bogotá', ... },
  { id: 'colombia', precio: 25000, label: 'Envío a todo Colombia', ... },
  { id: 'tienda', precio: 0, label: 'Recoger en tienda', ... },
];
```

---

### 🖼️ Catálogo y galería
**Archivo:** `src/pages/CatalogoPage.jsx`

**Cambios realizados:**
- Cada imagen de catálogo muestra su precio en la esquina inferior izquierda.
- Consulta Supabase incluye `precio` de productos.
- Precios sin decimales.

---

### 🔐 Panel de administración
**Acceso:** `/admin` (requiere login)

**Gestión de productos:**
- Crear, editar, eliminar productos desde la interfaz.
- Modificar precios, stock, categorías e imágenes.

**Gestión de inventario:**
- Editar stock directamente desde la tabla.
- Estado "Bajo" solo en 0 unidades.

**Gestión de catálogos:**
- Crear catálogos y asignar productos.

**Gestión de órdenes:**
- Cambiar estado de la orden (pendiente → confirmado → enviado → entregado → cancelado).

---

### 🔒 Login de administrador
**Archivo:** `src/pages/LoginPage.jsx`

**Cambios realizados:**
- Título "Acceso Admin - Momentos Magicos".
- Logo muestra "Momentos Magicos".

**Para crear usuarios admin:**
1. Ir a Supabase → Authentication → Users.
2. Hacer clic en "Add user" o "Invite user".
3. Ingresar email y contraseña.
4. El usuario podrá acceder a `/login` y luego a `/admin`.

---

### 📄 Términos y Privacidad
**Archivos:**
- `src/pages/TermsPage.jsx`
- `src/pages/PrivacyPage.jsx`

**Cambios realizados:**
- Todos los textos legales actualizados de "Dulce Regalo" a "Momentos Magicos".

---

## ℹ️ Variables de Entorno

**Archivo local:** `web/.env`

**En Vercel:** Settings → Environment Variables

| Variable | Función |
|----------|---------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública Supabase |
| `VITE_EMAILJS_SERVICE_ID` | ID servicio EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | ID plantilla EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | Llave pública EmailJS |
| `VITE_WOMPI_PUBLIC_KEY` | Llave pública Wompi |
| `VITE_WOMPI_INTEGRITY_SECRET` | Secreto de integridad Wompi |

---

## 🚀 Subir cambios a Vercel

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

Vercel despliega automáticamente en 1-2 minutos.

---

## 📂 Estructura de carpetas

```
web/
├── src/
│   ├── components/
│   │   ├── BrandLogo.jsx          ← Logo y título animados
│   │   ├── Header.jsx             ← Navegación superior
│   │   ├── Footer.jsx             ← Pie de página
│   │   ├── ProductCard.jsx        ← Tarjeta de producto
│   │   ├── WompiButton.jsx        ← Botón de pago
│   │   └── WhatsAppButton.jsx     ← Botón flotante WhatsApp
│   ├── pages/
│   │   ├── HomePage.jsx           ← Inicio
│   │   ├── ProductsPage.jsx       ← Listado de productos
│   │   ├── ProductDetailPage.jsx  ← Detalle de producto
│   │   ├── CatalogoPage.jsx       ← Galería y catálogos
│   │   ├── CartPage.jsx           ← Carrito
│   │   ├── CheckoutPage.jsx       ← Checkout y envío
│   │   ├── SuccessPage.jsx        ← Confirmación de pedido
│   │   ├── PagoExitosoPage.jsx    ← Retorno de Wompi
│   │   ├── ContactPage.jsx        ← Contacto
│   │   ├── AdminPage.jsx          ← Panel admin
│   │   ├── LoginPage.jsx          ← Login admin
│   │   ├── TermsPage.jsx          ← Términos
│   │   └── PrivacyPage.jsx        ← Privacidad
│   ├── hooks/
│   │   └── useCart.jsx            ← Carrito de compras
│   └── tools/
│       └── upload-media.mjs       ← Subida de imágenes con marca de agua
└── .env                           ← Variables de entorno
```

---

## 🔗 Links

| Recurso | URL |
|---------|-----|
| Producción | https://momentosmagicos.vercel.app |
| Supabase | https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz |
| Vercel | https://vercel.com/lucho8215/dulce-regalo |
| GitHub | https://github.com/Lucho8215/dulce-regalo |
