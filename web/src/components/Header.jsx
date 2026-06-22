// Importamos React y useState para manejar estados locales
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Settings } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import ShoppingCartComponent from '@/components/ShoppingCart';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Componente de encabezado con navegación y carrito
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { session, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
            {/* Logo y nombre de la marca */}
            <BrandLogo size="md" showTagline={true} linkTo="/" />

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

              {/* Botón de usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`hidden sm:flex hover:bg-muted ${session ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {session ? (
                    <>
                      <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Panel Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/login')} className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Acceso Admin
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

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