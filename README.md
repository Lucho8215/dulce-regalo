# Dulce Regalo - Gift Store

An online gift shop built with React, Vite, and Tailwind CSS.

## Table of Contents

- [Project Description](#project-description)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Usage Guide](#usage-guide)
- [Main Components](#main-components)
- [Pages and Routes](#pages-and-routes)
- [Custom Hook - Cart](#custom-hook---cart)
- [Customization](#customization)
- [Contributing](#contributing)

---

## Project Description

This project is an online gift shop that allows users to:
- Browse featured products and categories
- View product details
- Add products to the shopping cart
- Place orders using a checkout form
- Access an admin panel to manage products and inventory

---

## Technologies Used

Tecnología,Versión,Propósito
React,^18.3.1,Biblioteca de UI
Vite,^7.3.1,Herramienta de compilación y servidor de desarrollo
Tailwind CSS,^3.4.17,Framework de utilidades CSS
React Router DOM,^7.17.0,Enrutamiento
Framer Motion,^11.15.0,Animaciones
Radix UI,Varias,Componentes de UI accesibles
React Helmet,^6.1.0,Etiquetas meta para SEO
Sonner,^2.0.7,Notificaciones flotantes (toasts)
---

## Project Structure

```
web/
├── index.html              # Punto de entrada HTML
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── postcss.config.js       # Configuración de PostCSS
└── src/

    ├── main.jsx            # React entry point
      ├── App.jsx             # Main component with routes
      ├── index.css           # Global styles
      ├── hooks/              # Custom hooks
      │   ├── useCart.jsx     # Shopping cart hook
      │   └── use-toast.js    # Toast notifications hook
      ├── lib/                # Utilities
      │   └── utils.js        # Helper functions
      ├── components/         # Reusable components
      │   ├── Header.jsx      # Header and navigation
      │   ├── Footer.jsx      # Footer
      │   ├── ProductCard.jsx # Product card
      │   ├── ShoppingCart.jsx # Side cart
      │   ├── OrderSummary.jsx # Order summary
      │   ├── CategoryFilter.jsx # Category filter
      │   ├── PriceFilter.jsx # Price filter
      │   ├── SearchBar.jsx   # Search bar
      │   ├── AdminProductForm.jsx # Admin form
      │   └── AdminInventoryTable.jsx # Inventory table
      └── pages/              # Application pages
        ├── HomePage.jsx    # Home page
        ├── ProductsPage.jsx # Products list
        ├── ProductDetailPage.jsx # Product detail
        ├── CartPage.jsx    # Cart page
        ├── CheckoutPage.jsx # Checkout flow
        ├── SuccessPage.jsx # Order confirmation
        ├── ContactPage.jsx # Contact page
        ├── AdminPage.jsx   # Admin panel
        ├── TermsPage.jsx   # Terms and conditions
        └── PrivacyPage.jsx # Privacy policy
```

---

## Installation

### Requirements
- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/dulce-regalo.git
cd dulce-regalo/web

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
---

## Available Scripts

Script,Descripción
npm run dev,Inicia el servidor de desarrollo
npm run build,Crea una compilación de producción
npm run start,Previsualiza la compilación de producción
npm run lint,Ejecuta ESLint

---

## Usage Guide
Ruta,Página,Descripción
/HomePage.jsx,Página de inicio con sección hero y productos destacados
/productos,ProductsPage.jsx,Lista completa de productos con filtros
/product/:id,ProductDetailPage.jsx,Detalle individual del producto
/carrito,CartPage.jsx,Carrito de compras con el resumen
/checkout,CheckoutPage.jsx,Formulario de pago y datos de envío
/success,SuccessPage.jsx,Confirmación de la orden realizada
/contacto,ContactPage.jsx,Formulario de contacto
/admin,AdminPage.jsx,Panel de administración
/terminos,TermsPage.jsx,Términos y condiciones
/privacidad,PrivacyPage.jsx,Política de privacidad

## Pages and Routes

| Route | Page | Description |
|------|--------|-------------|
| `/` | HomePage.jsx | Home page with hero and featured products |
| `/productos` | ProductsPage.jsx | Full products list with filters |
| `/product/:id` | ProductDetailPage.jsx | Individual product detail |
| `/carrito` | CartPage.jsx | Shopping cart with summary |
| `/checkout` | CheckoutPage.jsx | Checkout form |
| `/success` | SuccessPage.jsx | Order confirmation |
| `/contacto` | ContactPage.jsx | Contact form |
| `/admin` | AdminPage.jsx | Admin panel |
| `/terminos` | TermsPage.jsx | Terms and conditions |
| `/privacidad` | PrivacyPage.jsx | Privacy policy |

---


## Custom Hook - Cart

The `useCart` hook provides:

- **cartItems**: Array of items in the cart
- **addToCart**: Add an item to the cart
- **removeFromCart**: Remove an item from the cart
- **updateQuantity**: Update item quantity
- **clearCart**: Clear the cart
- **getCartTotal**: Calculate the cart total

Example:
```jsx
import { useCart } from '@/hooks/useCart'

function Component() {
  const { cartItems, addToCart, getCartTotal } = useCart()
  // ...
}
```

---

## Customization

### Modify products
Edit `src/data/products.json` to add, modify, or remove products.

### Change colors
Adjust CSS variables in `src/index.css` under the `:root` block.

### Add categories
Update the `categories` array in `src/components/AdminProductForm.jsx` and in the product data.

---

## Contributing

1. Fork the repository
2. Create a branch for your feature: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push the branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the MIT License.