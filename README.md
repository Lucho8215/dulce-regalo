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

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI library |
| Vite | ^7.3.1 | Build tool and dev server |
| Tailwind CSS | ^3.4.17 | CSS utility framework |
| React Router DOM | ^7.17.0 | Routing |
| Framer Motion | ^11.15.0 | Animations |
| Radix UI | Various | Accessible UI components |
| React Helmet | ^6.1.0 | SEO meta tags |
| Sonner | ^2.0.7 | Toast notifications |

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
# 1. Clone the repository
git clone https://github.com/your-username/dulce-regalo.git
cd dulce-regalo/web

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Usage Guide

### For Users

1. Browse products at `/productos`
2. Filter by category and price in the sidebar
3. Search using the search bar
4. Add items to the cart with "Add to cart"
5. View the cart via the cart icon in the header
6. Complete checkout at `/checkout`
7. See confirmation at `/success`

### For Administrators

1. Access the admin panel at `/admin`
2. Manage products:
  - Create new products with "New Product"
  - Edit existing products with the edit button
  - Delete products with the delete button
3. View orders in the "Orders" section
4. Manage inventory in the "Inventory" section

---


## Main Components

### Header.jsx
- Brand logo and name
- Navigation
- Cart button with counter
- Responsive mobile menu

### Footer.jsx
- Contact information
- Quick links
- Legal links
- Social media links

### ProductCard.jsx
- Displays product information
- Image with hover effects
- Price and stock
- Add to cart button

### ShoppingCart.jsx
- Slide-out side cart
- List of cart items
- Quantity controls
- Checkout button

### CategoryFilter.jsx
- Category list with checkboxes
- Multiple selection
- Selection count

### PriceFilter.jsx
- Price range slider
- Manual min/max inputs
- Apply and reset buttons

---

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