// Importamos React y useState para manejar estados locales
import React, { useState } from 'react';
// Importamos componentes de React Router para navegación
import { Link, useLocation } from 'react-router-dom';
// Importamos iconos de lucide-react
import { ShoppingCart, Menu, X, Heart, User } from 'lucide-react';
// Importamos el componente Button desde nuestra librería UI
import { Button } from '@/components/ui/button';
// Importamos el hook del carrito para contar items
import { useCart } from '@/hooks/useCart';
// Importamos el componente del carrito lateral
import ShoppingCartComponent from '@/components/ShoppingCart';
// Importamos motion y AnimatePresence de framer-motion para animaciones
import { motion, AnimatePresence } from 'framer-motion';

// Componente de encabezado con navegación y carrito
const Header = () => {
  // Hook de ubicación: detecta la ruta actual para resaltar el link activo
  const location = useLocation();
  // Hook del carrito: obtenemos los items para mostrar contador
  const { cartItems } = useCart();
  // Estado para controlar el menú móvil (visible en pantallas pequeñas)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Estado para controlar el carrito lateral
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculamos la cantidad total de items en el carrito
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Definimos los enlaces de navegación principales
  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/productos', label: 'Productos' },
    { path: '/contacto', label: 'Contacto' },
  ];

  // Función para verificar si una ruta está activa (para estilos)
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Header principal con posición sticky (siempre visible en top) */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo y nombre de la marca - con efecto hover */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold brand-text-gradient">
                  Dulce Regalo
                </h1>
                <p className="text-xs text-muted-foreground">Detalles con amor</p>
              </div>
            </Link>

            {/* Navegación desktop (oculta en móvil) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Acciones del header: carrito, usuario y menú móvil */}
            <div className="flex items-center gap-3">
              {/* Botón de carrito con contador de items */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-foreground hover:text-primary hover:bg-muted"
              >
                <ShoppingCart className="w-5 h-5" />
                {/* Badge rosa con cantidad solo visible si hay items */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {/* Botón de usuario (placeholder - funcionalidad futura) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-foreground hover:text-primary hover:bg-muted"
              >
                <User className="w-5 h-5" />
              </Button>

              {/* Botón de menú móvil (visible solo en móvil) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-foreground hover:text-primary hover:bg-muted"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Menú móvil animado - aparece/desaparece con AnimatePresence */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-background"
            >
              <nav className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg font-medium transition-all duration-200
                      ${isActive(link.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Componente del carrito lateral - recibe props de control */}
      <ShoppingCartComponent isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Header;