# Momentos Magicos - Tienda de Regalos

Tienda online de regalos y detalles especiales construida con React, Vite, Tailwind CSS, Supabase y desplegada en Vercel. Este documento explica, de forma detallada y paso a paso, cómo está conformado el proyecto, qué metodologías se utilizan, cómo realizar cambios en cada página y cómo mantener el sitio funcionando correctamente.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Metodologías de Desarrollo](#metodologías-de-desarrollo)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Guía de Uso](#guía-de-uso)
- [Guía de Cambios por Página](#guía-de-cambios-por-página)
- [Componentes Principales](#componentes-principales)
- [Hooks Personalizados](#hooks-personalizados)
- [Personalización del Sitio](#personalización-del-sitio)
- [Proceso de Despliegue en Vercel](#proceso-de-despliegue-en-vercel)
- [Base de Datos y Gestión de Contenido](#base-de-datos-y-gestión-de-contenido)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 📖 Descripción del Proyecto

**Momentos Magicos** es una tienda en línea dedicada a la venta de regalos, detalles personalizados y artículos para ocasiones especiales. El sitio permite a los usuarios:

- Navegar por productos destacados y categorías.
- Ver detalles de cada producto, incluyendo precio, stock disponible e imágenes.
- Agregar productos al carrito de compras.
- Realizar pedidos mediante un formulario de checkout con opciones de envío.
- Pagar de forma segura a través de Wompi (pasarela de pagos colombiana).
- Contactar al vendedor por WhatsApp o mediante formulario de contacto.
- Consultar términos y condiciones y política de privacidad.
- Acceder a un panel de administración para gestionar productos, catálogos, inventario y órdenes.

### Metodologías de Desarrollo

El proyecto sigue las siguientes metodologías y buenas prácticas:

- **Componentización**: Cada elemento de la interfaz está dividido en componentes React reutilizables (Botones, Tarjetas, Formularios, Tablas, etc.).
- **Enrutamiento declarativo**: Se utiliza React Router DOM para definir rutas por página.
- **Gestión de estado global**: El carrito de compras se maneja mediante un Context API (`useCart`) para que esté disponible en toda la aplicación.
- **Estilos con utilidades**: Tailwind CSS permite construir la interfaz de forma rápida y consistente mediante clases de utilidad.
- **Animaciones suaves**: Framer Motion se usa para animaciones de entrada, hover y transiciones.
- **SEO dinámico**: React Helmet modifica las etiquetas `<title>` y `<meta>` por página para mejorar el posicionamiento en buscadores.
- **Notificaciones**: Sonner proporciona toasts (notificaciones flotantes) para confirmar acciones como agregar al carrito o errores.
- **Accesibilidad**: Componentes de Radix UI garantizan accesibilidad en elementos como tabs, dialogs, selects, etc.
- **Despliegue continuo**: Vercel se encarga de construir y desplegar automáticamente cada vez que se suben cambios a GitHub.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^18.3.1 | Biblioteca de interfaz de usuario |
| Vite | ^7.3.1 | Herramienta de compilación y servidor de desarrollo |
| Tailwind CSS | ^3.4.17 | Framework de utilidades CSS |
| React Router DOM | ^7.17.0 | Enrutamiento de la aplicación |
| Framer Motion | ^11.15.0 | Animaciones y transiciones |
| Radix UI | Varias versiones | Componentes accesibles (Tabs, Dialogs, etc.) |
| React Helmet | ^6.1.0 | Gestión de metadatos SEO |
| Sonner | ^2.0.7 | Notificaciones tipo toast |
| Lucide React | Varias versiones | Iconos |
| Supabase | SDK JS | Backend como servicio (base de datos, almacenamiento, autenticación) |
| Wompi | Checkout | Pasarela de pagos |
| Sharp | - | Procesamiento de imágenes (marca de agua) en build |
| EmailJS | - | Envío de correos desde el formulario de contacto |

---

## 📁 Estructura del Proyecto

```
dulce-regalo/
├── README.md                      # Este archivo
├── web/
│   ├── index.html                 # Punto de entrada HTML
│   ├── package.json               # Dependencias y scripts del proyecto web
│   ├── vite.config.js             # Configuración de Vite
│   ├── tailwind.config.js         # Configuración de Tailwind
│   ├── postcss.config.js          # Configuración de PostCSS
│   ├── .env                       # Variables de entorno locales (NO subir a GitHub)
│   └── src/
│       ├── main.jsx               # Punto de entrada de React
│       ├── App.jsx                # Componente principal con rutas
│       ├── index.css              # Estilos globales
│       ├── hooks/                 # Custom hooks
│       │   ├── useCart.jsx        # Carrito de compras (Context API)
│       │   └── use-toast.js       # Hook de notificaciones
│       ├── lib/                   # Librerias y utilidades
│       │   ├── utils.js           # Funciones auxiliares
│       │   ├── supabase.js        # Cliente de Supabase
│       │   └── api.js             # Funciones CRUD para productos, órdenes, etc.
│       ├── components/            # Componentes reutilizables
│       │   ├── Header.jsx         # Barra de navegación superior
│       │   ├── Footer.jsx         # Pie de página con contacto y redes sociales
│       │   ├── BrandLogo.jsx      # Logo animado "Momentos Magicos" con letras cayendo
│       │   ├── ProductCard.jsx    # Tarjeta individual de producto
│       │   ├── CartPage.jsx       # Página del carrito de compras
│       │   ├── OrderSummary.jsx   # Resumen del pedido (usado en checkout)
│       │   ├── CategoryFilter.jsx # Filtro de categorías (productos)
│       │   ├── PriceFilter.jsx    # Filtro de rango de precios
│       │   ├── SearchBar.jsx      # Barra de búsqueda
│       │   ├── WompiButton.jsx    # Botón de pago con Wompi
│       │   └── WhatsAppButton.jsx # Botón flotante de WhatsApp
│       ├── pages/                 # Páginas principales
│       │   ├── HomePage.jsx       # Página de inicio (hero + productos destacados)
│       │   ├── ProductsPage.jsx   # Listado completo de productos con filtros
│       │   ├── ProductDetailPage.jsx # Detalle individual de producto
│       │   ├── CatalogoPage.jsx   # Galería de imágenes y videos de productos
│       │   ├── CartPage.jsx       # Carrito de compras
│       │   ├── CheckoutPage.jsx   # Formulario de checkout y selección de envío
│       │   ├── SuccessPage.jsx    # Confirmación del pedido
│       │   ├── PagoExitosoPage.jsx # Página de retorno después de Wompi
│       │   ├── ContactPage.jsx    # Formulario de contacto y datos de la tienda
│       │   ├── AdminPage.jsx      # Panel de administración (productos, inventario, órdenes)
│       │   ├── LoginPage.jsx      # Página de inicio de sesión del administrador
│       │   ├── TermsPage.jsx      # Términos y condiciones legales
│       │   └── PrivacyPage.jsx    # Política de privacidad
│       ├── data/
│       │   └── products.json      # Datos locales de productos (fallback)
│       └── tools/
│           ├── upload-media.mjs   # Script para procesar imágenes y subirlas a Supabase
│           └── update-products-names.sql # Script SQL con nombres/precios de productos
└── AGENTS.md                      # Configuración de agentes (metadatos)
```

---

## 🚀 Instalación y Configuración

### Requisitos

- Node.js 18 o superior
- npm o yarn
- Git

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Lucho8215/dulce-regalo.git
cd dulce-regalo/web

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env en la carpeta web/ con las variables necesarias (ver sección Variables de Entorno)

# 4. Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:5173`.

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en modo watch |
| `npm run build` | Crea la compilación de producción en la carpeta `dist/` |
| `npm run start` | Previsualiza la compilación de producción localmente |
| `npm run lint` | Ejecuta ESLint para revisar errores de código |

---

## 🗺️ Guía de Uso

### Rutas disponibles

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | `HomePage.jsx` | Página de inicio con sección hero y productos destacados. Al agregar un producto al carrito, se muestra una notificación y se redirige automáticamente a la lista de productos. |
| `/productos` | `ProductsPage.jsx` | Catálogo completo con filtros por categoría, precio y búsqueda. |
| `/product/:id` | `ProductDetailPage.jsx` | Página individual del producto con botón de agregar al carrito. Al agregar, redirige a `/productos`. |
| `/carrito` | `CartPage.jsx` | Carrito de compras con resumen y botón de proceder al pago. |
| `/checkout` | `CheckoutPage.jsx` | Formulario con datos de envío y selección de método de entrega. Tras guardar el pedido, aparece un banner de confirmación y el botón de pago Wompi. |
| `/success` | `SuccessPage.jsx` | Página de confirmación del pedido realizado. |
| `/pago-exitoso` | `PagoExitosoPage.jsx` | Página de retorno desde Wompi (muestra estado: aprobado, rechazado, pendiente). |
| `/contacto` | `ContactPage.jsx` | Formulario de contacto por EmailJS y datos de contacto. |
| `/catalogo` | `CatalogoPage.jsx` | Galería de imágenes y videos. Al filtrar por catálogo, cada imagen muestra su precio en la esquina inferior. |
| `/admin` | `AdminPage.jsx` | Panel de administración (requiere login). |
| `/login` | `LoginPage.jsx` | Inicio de sesión del administrador. |
| `/terminos` | `TermsPage.jsx` | Términos y condiciones legales. |
| `/privacidad` | `PrivacyPage.jsx` | Política de privacidad. |

---

## 🎯 Guía de Cambios por Página

A continuación, se explica detalladamente cómo modificar cada página, qué archivos editar y qué metodologías se aplican.

### 🏠 Página de Inicio - `HomePage.jsx`

**Ruta:** `/`

**Qué contiene:**
- Sección hero con imagen de fondo, titulo y botones.
- Sección de productos destacados traídos desde Supabase.
- Botones de "Ver Productos" y "Contactar".
- Pie de página.

**Metodología utilizada:**
- `useState` para manejar el estado de productos y loading.
- `useEffect` para cargar productos destacados desde Supabase al montar el componente.
- `useCart` para agregar productos al carrito.
- `useToast` para mostrar notificaciones.
- `react-helmet` para establecer el título y meta descripción de la página.
- `framer-motion` para animaciones de entrada.
- `lucide-react` para iconos.

**Cambios realizados:**
1. **Título de la pestaña y meta descripción**: Se cambió de "Dulce Regalo" a "Momentos Magicos".
2. **Redirección al agregar al carrito**: Cuando el usuario agrega un producto, se muestra la notificación y se redirige automáticamente a `/productos`.
3. **Precios sin decimales**: Ya se muestran sin decimales gracias a `minimumFractionDigits: 0`.

**Cómo modificar:**
- Para cambiar el texto del hero: buscar los elementos `<motion.h1>`, `<motion.p>` y los botones.
- Para cambiar productos destacados: modificar la consulta en `getProductsDestacados()` o cambiar los productos en Supabase.
- Para cambiar la imagen de fondo hero: modificar la URL en `<img src="...">`.

---

### 📦 Listado de Productos - `ProductsPage.jsx`

**Ruta:** `/productos`

**Qué contiene:**
- Hero con título "Nuestros Productos".
- Barra de búsqueda y botón de filtros (móvil).
- Filtros laterales por categoría y precio (desktop).
- Grid de productos.
- Contador de resultados.

**Metodología utilizada:**
- `useState` para productos, filtros y búsqueda.
- `useEffect` para cargar productos desde Supabase.
- `useMemo` implícito en `useEffect` para recalcular productos filtrados.
- `react-helmet` para SEO.
- `framer-motion` para animaciones.
- `sonner` para notificaciones de éxito.

**Cambios realizados:**
1. **Título de la pestaña**: Cambiado a "Productos - Momentos Magicos".
2. **Notificación al agregar producto**: Ahora muestra "Producto agregado 🎁" y redirige a `/productos`.
3. **Precios sin decimales**: Se usa `Math.round(product.precio).toLocaleString('es-CO')`.

**Cómo modificar:**
- Para cambiar categorías: modificar los datos en Supabase tabla `products`.
- Para cambiar el rango de precios del filtro: modificar `setPriceRange([0, 9999999])`.
- Para cambiar la cantidad de columnas del grid: modificar `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`.

---

### 🔍 Detalle de Producto - `ProductDetailPage.jsx`

**Ruta:** `/product/:id`

**Qué contiene:**
- Imagen del producto.
- Nombre, precio, descripción.
- Selector de cantidad.
- Botón "Agregar al carrito".
- Botón de favoritos.
- Información de envío, seguridad y empaque.
- Productos relacionados (no implementado).

**Metodología utilizada:**
- `useParams` para obtener el ID del producto desde la URL.
- `useEffect` para cargar el producto desde Supabase.
- `useCart` para agregar al carrito.
- `useToast` para notificaciones.
- `useNavigate` para redirección posterior.

**Cambios realizados:**
1. **Título de la pestaña**: Cambiado a "Nombre del Producto - Momentos Magicos".
2. **Redirección al agregar al carrito**: Ahora redirige a `/productos` después de la notificación.

**Cómo modificar:**
- Para cambiar el texto "Agregar al carrito": buscar el botón en la sección de acciones.
- Para cambiar la información de envío: modificar los textos en la sección de características.

---

### 🛒 Carrito de Compras - `CartPage.jsx`

**Ruta:** `/carrito`

**Qué contiene:**
- Lista de productos en el carrito.
- Controles de cantidad (+ y -).
- Botón para eliminar productos.
- Resumen del pedido con subtotal, envío e impuestos.
- Botón "Proceder al Pago" que dirige a checkout.

**Metodología utilizada:**
- `useCart` para obtener items, totales y funciones de actualización.
- `framer-motion` para animaciones.
- `Intl.NumberFormat` para formatear precios en COP.

**Cambios realizados:**
1. **Precios sin decimales**: Se eliminó `.toFixed(2)` y se reemplazó por `Math.round().toLocaleString('es-CO')`.
2. **Formato COP consistente**: Ahora no muestra decimales sobrantes.

**Cómo modificar:**
- Para cambiar el umbral de envío gratis: modificar `calculateSubtotal() / 100 < 50` (actualmente 50.000 COP).
- Para cambiar el porcentaje de IVA: modificar `calculateTax()` (actualmente 0, IVA oculto).

---

### 💳 Checkout y Pago - `CheckoutPage.jsx`

**Ruta:** `/checkout`

**Qué contiene:**
- Formulario de datos de contacto y dirección.
- Selección de método de entrega:
  - Domicilio en Bogotá: $15.000
  - Envío a todo Colombia: $25.000
  - Recoger en tienda: Gratis
- Botón "1. Confirmar datos del pedido" para guardar en Supabase.
- Botón de pago Wompi que aparece después de guardar.
- Resumen del pedido.

**Metodología utilizada:**
- `useState` para formulario y pasos del checkout.
- `useRef` para generar referencia única de orden (`DR-` + timestamp, cambiado a `MM-`).
- `useCart` para obtener items del carrito.
- `createOrder` para guardar la orden en Supabase.
- `WompiButton` para el pago.

**Cambios realizados:**
1. **Confirmación de pedido más grande**: Se reemplazó el texto pequeño por un banner verde con borde, título grande `text-4xl` y padding amplio.
2. **Referencia de orden**: Cambiada de `DR-` a `MM-` (Momentos Magicos).
3. **Precios sin decimales**: Ahora se muestran sin decimales en las opciones de envío.

**Cómo modificar:**
- Para cambiar precios de envío: editar el array `OPCIONES_ENTREGA`.
- Para agregar nuevo método de entrega: agregar un objeto nuevo al array.
- Para cambiar el mensaje de confirmación: modificar el banner verde.

---

### ✅ Página de Confirmación de Pedido - `SuccessPage.jsx`

**Ruta:** `/success`

**Qué contiene:**
- Ícono de éxito animado.
- Título "¡Pedido Realizado con Éxito!".
- Descripción y tarjeta con información del pedido.
- Botones para volver al inicio o seguir comprando.

**Metodología utilizada:**
- `react-helmet` para SEO.
- `framer-motion` para animaciones.
- `lucide-react` para iconos.

**Cambios realizados:**
1. **Título de pestaña**: Cambiado a "Compra Exitosa - Momentos Magicos".

---

### 💰 Página de Pago Exitoso - `PagoExitosoPage.jsx`

**Ruta:** `/pago-exitoso`

**Qué contiene:**
- Lectura de parámetros de URL de Wompi (`status`, `id`, `reference`).
- Icono, título y mensaje según estado (APPROVED, DECLINED, PENDING).
- Datos de la transacción.
- Botones de navegación.

**Metodología utilizada:**
- `useSearchParams` para leer query params.
- `useCart` para limpiar el carrito si el pago fue aprobado.
- `framer-motion` para animaciones.

**Cambios realizados:**
1. **Tarjeta más grande**: Ahora usa `rounded-3xl`, `p-12`, `shadow-lg` y `border-2` para mayor destaque.
2. **Icono más grande**: Ahora mide `w-20 h-20` en lugar de `w-16 h-16`.
3. **Título y mensaje más grandes**: Título `text-4xl` y mensaje `text-xl`.

---

### 📞 Página de Contacto - `ContactPage.jsx`

**Ruta:** `/contacto`

**Qué contiene:**
- Hero con título "Contáctanos".
- Tarjetas de Email, Teléfono, Dirección.
- Horario de atención.
- Formulario con validación.
- Botón de envío por EmailJS.

**Metodología utilizada:**
- `useState` para formulario.
- `useToast` para notificaciones.
- `emailjs` SDK para envío de correos.

**Cambios realizados:**
1. **Título y meta**: Cambiados a "Contacto - Momentos Magicos".
2. **Horario de atención**: Actualizado a "Todos los días: 10:00 AM - 8:00 PM" (antes era L-V 9-7, Sáb 10-5, Dom cerrado).

**Cómo modificar:**
- Para cambiar teléfono/email/dirección: buscar y reemplazar en las tarjetas de contacto y en `Footer.jsx`.
- Para cambiar el horario: modificar el bloque `<div className="bg-muted rounded-xl p-6">` con clase `space-y-2`.

---

### 🖼️ Catálogo y Galería - `CatalogoPage.jsx`

**Ruta:** `/catalogo`

**Qué contiene:**
- Carga de imágenes y videos desde `public/media-urls.json`.
- Carga de catálogos desde Supabase.
- Filtros de catálogos.
- Galería de imágenes con lightbox.
- Videos reproducibles.

**Metodología utilizada:**
- `useState` para media, catálogos y filtros.
- `useEffect` para cargar datos.
- `supabase` para consultar catálogos.
- `framer-motion` para animaciones.

**Cambios realizados:**
1. **Precios en imágenes**: Ahora cada imagen muestra su precio (COP sin decimales) en la esquina inferior izquierda, siempre que esté asignada a un catálogo.
   - Se agregó `precio` a la consulta Supabase: `.select(`*, catalog_products(product_id, products(id, nombre, imagen_url, precio))`)`.
   - Se creó un mapa `urlPriceMap` para relacionar URL de imagen con precio.
   - Se agregó un overlay absoluto en cada imagen con el precio formateado.
2. **Título de pestaña**: Cambiado a "Catálogo — Momentos Magicos".
3. **Precios sin decimales**: Todas las monedas usan `maximumFractionDigits: 0`.

**Para agregar precios a las imágenes del catálogo:**
1. Ir a Supabase → Tabla `products` y asegurar que cada producto tenga `precio` e `imagen_url`.
2. En Supabase → Tabla `catalogs`, crear un catálogo.
3. En Supabase → Tabla `catalog_products`, relacionar el catálogo con los productos.
4. Al visualizar el catálogo, las imágenes asignadas mostrarán su precio automáticamente.

---

### 🔐 Panel de Administración - `AdminPage.jsx`

**Ruta:** `/admin`

**Qué contiene:**
- Tabs para Productos, Catálogos, Órdenes e Inventario.
- CRUD de productos (crear, editar, eliminar).
- CRUD de catálogos.
- Tabla de órdenes con cambio de estado.
- Tabla de inventario editable.
- Botón de cerrar sesión.

**Metodología utilizada:**
- `useState` para productos, catálogos, órdenes, modales.
- `useEffect` para cargar datos al montar.
- Componentes `Dialog` y `AlertDialog` de Radix UI.
- `Table` de Radix UI.
- `formatCOP` para formatear precios.

**Cambios realizados:**
1. **Título de pestaña**: Cambiado a "PANEL DE ADMINISTRACIÓN - Momentos Magicos".
2. **Formato de precios sin decimales**: Se agregó `maximumFractionDigits: 0`.
3. **Estado mínimo de stock**: Cambiado de `< 10` a `< 1`. Ahora solo se marca "Bajo" cuando el stock es 0. "Disponible" es 1 o más.
4. **Input de inventario mínimo**: Ahora el campo de inventario en el formulario de producto tiene `min="1"`.

**Gestión de productos desde Supabase:**
- Ir a Supabase → Table Editor → tabla `products`.
- Modificar nombre, precio, categoría, inventario, imagen, etc.
- Para actualizaciones masivas: usar SQL Editor.

**Gestión de inventario desde el panel:**
- Ir a `/admin/inventory` (tab Inventario).
- Hacer clic en "Editar" en la fila del producto.
- Ingresar nuevo valor (debe ser mayor o igual a 1).
- Hacer clic en "Guardar".

---

### 📝 Términos y Condiciones - `TermsPage.jsx`

**Ruta:** `/terminos`

**Cambios realizados:**
1. **Título de pestaña**: Cambiado a "Términos y Condiciones - Momentos Magicos".
2. **Texto legal**: Se reemplazaron todas las menciones de "Dulce Regalo" por "Momentos Magicos".

**Metodología utilizada:**
- `react-helmet` para SEO.
- `framer-motion` para animaciones de entrada.

---

### 🔒 Política de Privacidad - `PrivacyPage.jsx`

**Ruta:** `/privacidad`

**Cambios realizados:**
1. **Título de pestaña**: Cambiado a "Política de Privacidad - Momentos Magicos".
2. **Texto legal**: Reemplazo de "Dulce Regalo" por "Momentos Magicos".

---

## 🧩 Componentes Principales

### BrandLogo (`src/components/BrandLogo.jsx`)

Es el logo animado que aparece en el Header y en el Footer. Está compuesto por:

- Un icono SVG de caja de regalo con lazo.
- Un título animado donde cada letra cae del cielo con rebote.
- Un tagline "Detalles con amor" con efecto de brillo y flotado.

**Metodología:**
- Inyección de estilos CSS mediante `<style>{TAGLINE_ANIM}</style>`.
- Componente controlado por props: `size`, `showTagline`, `linkTo`.
- Array `colors` define el color de cada letra del título.
- Array de letras `['M','o','m','e','n','t','o','s',' ','M','a','g','i','c','o','s']` genera los spans con animación `caerLetra`.

**Cómo modificar:**
- **Textos**: Modificar el array de letras y los comentarios.
- **Colores**: Editar el array `colors`.
- **Tamaños**: Modificar el objeto `sizes`.
- **Animaciones**: Editar `TAGLINE_ANIM` (keyframes `caerLetra`, `shimmerRed`, `floatTag`).
- **Tagline**: Cambiar el string "Detalles con amor" en el `<div>` final.

**Nota importante**: Se agregó `whiteSpace: 'nowrap'` y `letterSpacing: '0.02em'` para evitar que el texto se corte en el Footer.

---

### ProductCard (`src/components/ProductCard.jsx`)

Muestra una tarjeta de producto con imagen, nombre, descripción, precio y stock.

**Metodología:**
- `formatPrice` usando `Intl.NumberFormat` con `minimumFractionDigits: 0` y `maximumFractionDigits: 0`.
- `Link` de React Router para navegación.
- `framer-motion` para animaciones `initial`, `animate`, `whileInView`.

**Cambios realizados:**
- Precios sin decimales.
- Indicador de stock: "X disponibles" o "Agotado".

---

### WhatsAppButton (`src/components/WhatsAppButton.jsx`)

Botón flotante en la esquina inferior derecha.

**Metodología:**
- Estado `showTooltip` para mostrar/ocultar el globo de ayuda.
- URL generada con `encodeURIComponent` para el mensaje pre-escrito.
- Animaciones con `framer-motion`.

**Cambios realizados:**
- Mensaje actualizado a "Hola! Me interesa un regalo de Momentos Magicos 🎁".

---

### Header y Footer

- **Header**: Contiene el logo (BrandLogo) y enlaces de navegación.
- **Footer**: Contiene logo pequeño sin tagline, descripción, redes sociales, enlaces rápidos, información legal y datos de contacto.

**Cambios en Footer:**
- Copyright actualizado: "© {año} Momentos Magicos. Todos los derechos reservados."
- Logo reducido: `size="sm" showTagline={false}`.

---

## 🛒 Hooks Personalizados

### useCart (`src/hooks/useCart.jsx`)

Contexto de React que proporciona:

- `cartItems`: Array de productos en el carrito.
- `addToCart(product, variant, quantity, availableQuantity)`: Agrega un producto validando stock.
- `removeFromCart(variantId)`: Elimina un producto.
- `updateQuantity(variantId, quantity)`: Actualiza la cantidad.
- `clearCart()`: Vacía el carrito.
- `getCartTotal()`: Devuelve el total formateado en COP sin decimales.

**Metodología:**
- `createContext` + `useContext`.
- `useState` para el estado del carrito.
- `useEffect` para persistencia en `localStorage`.
- `useCallback` para funciones memoizadas.
- `useMemo` para el valor del provider.

---

## 🎨 Personalización del Sitio

### Cambiar nombre de la marca

Para cambiar "Momentos Magicos" por otro nombre:

1. **Títulos y textos visibles**:
   - Buscar y reemplazar en:
     - `web/index.html` (línea del `<title>`)
     - Todas las páginas en `src/pages/` dentro de `<title>`.
     - `src/components/Footer.jsx` (copyright).
     - `src/components/WhatsAppButton.jsx` (mensaje pre-escrito).
     - `src/components/BrandLogo.jsx` (array de letras y colores).

2. **Logo animado**:
   - En `BrandLogo.jsx`, cambiar el array de letras.
   - Actualizar el array `colors` (debe coincidir en longitud con el array de letras).
   - Modificar los comentarios de referencia.

### Cambiar precios de envío

Ir a `src/pages/CheckoutPage.jsx` y modificar el array `OPCIONES_ENTREGA`.

### Cambiar colores del sitio

Ir a `src/index.css` y modificar las variables CSS en `:root`. Tailwind las usa para generar las clases de color.

### Cambiar imágenes

- Subir nuevas imágenes a `web/public/img/`.
- Ejecutar `node tools/upload-media.mjs` para procesarlas y subirlas a Supabase con marca de agua.

### Cambiar datos de contacto

Editar:
- `src/pages/ContactPage.jsx` (tarjetas de contacto).
- `src/components/Footer.jsx` (teléfono, email, dirección).

### Agregar stock a productos

1. Desde Supabase → Table Editor → `products` → modificar columna `inventario`.
2. O desde el panel admin → Tab Inventario → Editar.

---

## 🔗 Proceso de Despliegue en Vercel

Vercel se configura automáticamente al conectar el repositorio de GitHub. Cada push a `main` dispara un despliegue automático.

### Pasos para cambiar la URL en Vercel

1. **Acceder a Vercel**:
   - Ir a https://vercel.com
   - Iniciar sesión con la cuenta asociada al proyecto.

2. **Seleccionar el proyecto**:
   - En el dashboard, buscar y hacer clic en el proyecto `dulce-regalo`.

3. **Entrar a Settings**:
   - En el menú lateral izquierdo, hacer clic en **Settings**.

4. **Ir a la sección Domains**:
   - Dentro de Settings, buscar la pestaña **Domains**.

5. **Cambiar el dominio**:
   - Verás el dominio actual `dulce-regalo.vercel.app`.
   - Para cambiarlo: hacer clic en **Edit** junto al dominio.
   - Escribir el nuevo nombre deseado (por ejemplo, `momentosmagicos.vercel.app`).
   - Vercel verificará y actualizará automáticamente.

6. **Esperar propagación**:
   - El cambio puede tardar entre 1 y 5 minutos en propagarse globalmente.
   - Vercel mantendrá el historial de despliegues por si necesitas revertir.

### Agregar un dominio personalizado (opcional)

- En **Domains** → **Add Domain**.
- Ingresar el dominio propio (ej: `tienda.momentosmagicos.com`).
- Seguir las instrucciones de Vercel para configurar los registros DNS en tu proveedor de dominio.

---

## 🗄️ Base de Datos y Gestión de Contenido

### Acceso a Supabase

- URL: https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz
- Tablas principales: `products`, `catalogs`, `catalog_products`, `orders`, `order_items`.

### Gestión de productos

1. Ir a **Table Editor** → `products`.
2. Puedes:
   - Crear nuevos productos.
   - Editar nombre, precio, categoría, inventario, imagen, etc.
   - Eliminar productos (se marcan como inactivos).

### Gestión de catálogos

1. Ir a **Table Editor** → `catalogs`.
2. Crear un nuevo catálogo con `nombre`, `descripcion`, `activo = true`.
3. Ir a `catalog_products` y relacionar el catálogo con productos existentes.

### Variables de entorno

**Archivo local:** `web/.env` (no subir a GitHub).

**Variables requeridas:**

| Variable | Para qué sirve |
|----------|---------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública Supabase (frontend) |
| `VITE_EMAILJS_SERVICE_ID` | ID del servicio EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | ID de la plantilla EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | Clave pública EmailJS |
| `VITE_WOMPI_PUBLIC_KEY` | Llave pública de Wompi |
| `VITE_WOMPI_INTEGRITY_SECRET` | Secreto de integridad de Wompi |

**En Vercel:**
- Ir a Settings → Environment Variables.
- Agregar cada variable con su valor correspondiente.
- Asegurarse de que estén marcadas como disponibles tanto para Preview como para Production.

---

## 🔄 Metodologías Específicas Utilizadas

### Formateo de precios

Todas las cantidades monetarias se formatean usando `Intl.NumberFormat`:

```js
new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(price);
```

Esto garantiza que no aparezcan decimales y el formato sea el estándar colombiano (pesos).

### Validación de inventario

El hook `useCart` valida que no se pueda agregar más cantidad de la disponible:

```js
if ((currentCartQuantity + quantity) > availableQuantity) {
  const error = new Error(`No hay suficiente stock para ${product.title}. Solo quedan ${availableQuantity}.`);
  reject(error);
}
```

El estado "Bajo" en el inventario se muestra solo cuando `inventario < 1`. El estado "Disponible" aplica para `inventario >= 1`.

### Animaciones

Se utiliza `framer-motion` para:

- Entrada de elementos (`initial`, `animate`, `transition`).
- Hover con `whileHover`.
- Animaciones de salida con `AnimatePresence`.
- Animaciones de scroll con `whileInView`.

### SEO

Cada página define su propio título y meta descripción con `react-helmet`:

```jsx
<Helmet>
  <title>Pagina - Momentos Magicos</title>
  <meta name="description" content="Descripción de la página" />
</Helmet>
```

---

## 🤝 Contribución

1. Hacer fork del repositorio.
2. Crear una rama: `git checkout -b feature/nueva-funcionalidad`.
3. Hacer commit: `git commit -m 'feat: nueva funcionalidad'`.
4. Push a la rama: `git push origin feature/nueva-funcionalidad`.
5. Abrir un Pull Request en GitHub.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🔗 Links Importantes

| Recurso | URL |
|---------|-----|
| Tienda en producción | https://momentosmagicos.vercel.app (o el dominio actual configurado en Vercel) |
| Supabase (base de datos) | https://supabase.com/dashboard/project/lzrhelqswsvomyvbehdz |
| Vercel (despliegue) | https://vercel.com/lucho8215/dulce-regalo |
| GitHub (repositorio) | https://github.com/Lucho8215/dulce-regalo |
| Wompi (pasarela de pagos) | https://dashboard.wompi.co |

---

## 📌 Notas Finales

- Los cambios en los archivos de código fuente requieren un commit y push a GitHub para verse reflejados en producción (Vercel despliega automáticamente).
- Los cambios en la base de datos (Supabase) se reflejan inmediatamente sin necesidad de deploy.
- El archivo `.env` nunca debe subirse a GitHub. Las variables de entorno deben configurarse en Vercel y localmente.
- Para procesar y subir imágenes con marca de agua: ejecutar `node tools/upload-media.mjs` desde la carpeta `web/`.
