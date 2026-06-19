// Importamos React
import React from 'react';
// Importamos componentes de React Router para la navegación
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
// Importamos componente para scroll hacia arriba en cada navegación
import ScrollToTop from '@/components/ScrollToTop';
// Importamos todas las páginas de la aplicación
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import SuccessPage from '@/pages/SuccessPage';
import ContactPage from '@/pages/ContactPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import AdminPage from '@/pages/AdminPage';

// Componente principal que define el enrutamiento de la aplicación
function App() {
    return (
        // Router habilita la navegación sin recargar la página
        <Router>
            {/* ScrollToTop hace scroll a la parte superior en cada cambio de ruta */}
            <ScrollToTop />
            {/* Routes contiene todas las rutas de la aplicación */}
            <Routes>
                {/* Ruta de la página principal */}
                <Route path="/" element={<HomePage />} />
                {/* Ruta de la lista de productos */}
                <Route path="/productos" element={<ProductsPage />} />
                {/* Ruta del detalle de un producto específico (recibe id por URL) */}
                <Route path="/product/:id" element={<ProductDetailPage />} />
                {/* Ruta del carrito de compras */}
                <Route path="/carrito" element={<CartPage />} />
                {/* Ruta del proceso de checkout */}
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* Ruta de confirmación de pedido exitoso */}
                <Route path="/success" element={<SuccessPage />} />
                {/* Ruta de la página de contacto */}
                <Route path="/contacto" element={<ContactPage />} />
                {/* Ruta de términos y condiciones */}
                <Route path="/terminos" element={<TermsPage />} />
                {/* Ruta de política de privacidad */}
                <Route path="/privacidad" element={<PrivacyPage />} />
                {/* Ruta del panel de administración */}
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

// Exportamos el componente para usarlo en main.jsx
export default App;