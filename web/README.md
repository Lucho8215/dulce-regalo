# 🛍️ Dulce Regalo - Tienda de Regalos

Una tienda en línea moderna de regalos y detalles especiales construida con React, Vite y Tailwind CSS.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Guía de Uso](#guía-de-uso)
- [Componentes Principales](#componentes-principales)
- [Páginas y Rutas](#páginas-y-rutas)
- [Hook Personalizado - Carrito](#hook-personalizado---carrito)
- [Personalización](#personalización)
- [Contribuir](#contribuir)

---

## 📖 Descripción del Proyecto

Este proyecto es una **tienda de regalos en línea** que permite a los usuarios:
- Navegar productos destacados y por categorías
- Ver detalles de cada producto
- Agregar productos al carrito de compras
- Realizar pedidos con formulario de checkout
- Acceder a un panel de administración para gestionar productos e inventario

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^18.3.1 | Biblioteca de interfaz de usuario |
| Vite | ^7.3.1 | Build tool y dev server |
| Tailwind CSS | ^3.4.17 | Framework de estilos CSS |
| React Router DOM | ^7.17.0 | Enrutamiento de páginas |
| Framer Motion | ^11.15.0 | Animaciones |
| Radix UI | Varios | Componentes UI accesibles |
| React Helmet | ^6.1.0 | Meta tags para SEO |
| Sonner | ^2.0.7 | Notificaciones toast |

---

## 📁 Estructura del Proyecto

```
web/
├── index.html              # Punto de entrada HTML
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── postcss.config.js       # Configuración de PostCSS
└── src/
    ├── main.jsx            # Punto de entrada React
    ├── App.jsx             # Componente principal con rutas
    ├── index.css           # Estilos globales
    ├── hooks/              # Hooks personalizados
    │   ├── useCart.jsx     # Hook del carrito de compras
    │   └── use-toast.js    # Hook para notificaciones
    ├── lib/                # Utilidades
    │   └── utils.js        # Funciones helper
    ├── components/         # Componentes reutilizables
    │   ├── Header.jsx      # Cabecera y navegación
    │   ├── Footer.jsx      # Pie de página
    │   ├── ProductCard.jsx # Tarjeta de producto
    │   ├── ShoppingCart.jsx # Carrito lateral
    │   ├── OrderSummary.jsx # Resumen de orden
    │   ├── CategoryFilter.jsx # Filtro por categorías
    │   ├── PriceFilter.jsx # Filtro por precio
    │   ├── SearchBar.jsx   # Barra de búsqueda
    │   ├── AdminProductForm.jsx # Formulario admin
    │   └── AdminInventoryTable.jsx # Tabla de inventario
    └── pages/              # Páginas de la aplicación
        ├── HomePage.jsx    # Página principal
        ├── ProductsPage.jsx # Lista de productos
        ├── ProductDetailPage.jsx # Detalle de producto
        ├── CartPage.jsx    # Carrito de compras
        ├── CheckoutPage.jsx # Proceso de pago
        ├── SuccessPage.jsx # Confirmación de pedido
        ├── ContactPage.jsx # Página de contacto
        ├── AdminPage.jsx   # Panel de administración
        ├── TermsPage.jsx   # Términos y condiciones
        └── PrivacyPage.jsx # Política de privacidad
```

---

## ⚙️ Instalación

### Requisitos previos
- Node.js 18 o superior
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/dulce-regalo.git
cd dulce-regalo/web

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run start` | Previsualiza el build |
| `npm run lint` | Ejecuta ESLint para encontrar errores |

---

## 👤 Guía de Uso

### Para Usuarios

1. **Navegar productos**: Visita `/productos` para ver todos los productos
2. **Filtrar**: Usa los filtros de categoría y precio en la barra lateral
3. **Buscar**: Escribe en la barra de búsqueda para encontrar productos
4. **Agregar al carrito**: Haz clic en "Agregar al carrito" en cualquier producto
5. **Ver carrito**: Haz clic en el ícono del carrito en el header
6. **Checkout**: Completa el formulario de pago en `/checkout`
7. **Confirmación**: Recibirás confirmación exitosa en `/success`

### Para Administradores

1. **Acceder al panel**: Ve a `/admin`
2. **Gestión de productos**: 
   - Crear nuevos productos con el botón "Nuevo Producto"
   - Editar productos existentes con el botón de editar
   - Eliminar productos con el botón de eliminar
3. **Ver órdenes**: Revisa el historial de pedidos en la pestaña "Órdenes"
4. **Gestionar inventario**: Actualiza stock en la pestaña "Inventario"

---

## 🧩 Componentes Principales

### Header.jsx
- Logo y nombre de la marca
- Navegación entre páginas
- Botón del carrito con contador
- Menú móvil responsive

### Footer.jsx
- Información de contacto
- Enlaces rápidos
- Enlaces legales
- Redes sociales

### ProductCard.jsx
- Muestra información del producto
- Imagen con efectos hover
- Precio y stock
- Botón de agregar al carrito

### ShoppingCart.jsx
- Panel lateral deslizable
- Lista de productos en el carrito
- Controles de cantidad
- Botón de checkout

### CategoryFilter.jsx
- Lista de categorías con checkbox
- Selección múltiple
- Contador de selecciones

### PriceFilter.jsx
- Slider para rango de precios
- Inputs manuales para min/max
- Botones de aplicar y resetear

---

## 📄 Páginas y Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage.jsx | Página principal con hero y productos destacados |
| `/productos` | ProductsPage.jsx | Lista completa de productos con filtros |
| `/product/:id` | ProductDetailPage.jsx | Detalle individual de un producto |
| `/carrito` | CartPage.jsx | Carrito de compras con resumen |
| `/checkout` | CheckoutPage.jsx | Formulario para procesar pedido |
| `/success` | SuccessPage.jsx | Página de confirmación de pedido |
| `/contacto` | ContactPage.jsx | Formulario de contacto |
| `/admin` | AdminPage.jsx | Panel de administración |
| `/terminos` | TermsPage.jsx | Términos y condiciones |
| `/privacidad` | PrivacyPage.jsx | Política de privacidad |

---

## 🛒 Hook Personalizado - Carrito

El hook `useCart` proporciona:

- **cartItems**: Array de productos en el carrito
- **addToCart**: Agregar producto al carrito
- **removeFromCart**: Eliminar producto del carrito
- **updateQuantity**: Actualizar cantidad de un producto
- **clearCart**: Vaciar el carrito
- **getCartTotal**: Calcular el total del carrito

Ejemplo de uso:
```jsx
import { useCart } from '@/hooks/useCart'

function Component() {
  const { cartItems, addToCart, getCartTotal } = useCart()
  // ...
}
```

---

## 🎨 Personalización

### Modificar productos
Edita el archivo `src/data/products.json` para agregar, modificar o eliminar productos.

### Cambiar colores
Modifica las variables CSS en `src/index.css` dentro del bloque `:root`.

### Agregar categorías
Actualiza el array `categories` en `src/components/AdminProductForm.jsx` y en los datos de productos.

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.