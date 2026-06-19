// Importamos React y useCallback para optimizar funciones
import React, { useCallback } from 'react';
// Importamos useNavigate para redirigir programáticamente
import { useNavigate } from 'react-router-dom';
// Importamos motion y AnimatePresence para animaciones
import { motion, AnimatePresence } from 'framer-motion';
// Importamos iconos
import { ShoppingCart as ShoppingCartIcon, X } from 'lucide-react';
// Importamos componentes UI
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Componente del carrito lateral deslizable
const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  // Hook toast para mostrar notificaciones
  const { toast } = useToast();
  // Hook navigate para redirección
  const navigate = useNavigate();
  // Hook carrito: obtenemos todos los datos y funciones del carrito
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Maneja el proceso de checkout
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast({
        title: 'Tu carrito está vacío',
        description: 'Agrega algunos productos antes de proceder al pago.',
        variant: 'destructive',
      });
      return;
    }

    // Redirigimos a la página de checkout local
    setIsCartOpen(false);
    navigate('/checkout');
  }, [cartItems, navigate, setIsCartOpen, toast]);

  return (
    // AnimatePresence maneja la animación de entrada/salida
    <AnimatePresence>
      {isCartOpen && (
        // Overlay semitransparente que cubre la pantalla
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          {/* Panel del carrito que entra desde la derecha */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl flex flex-col rounded-l-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del carrito */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-card-foreground">Carrito de Compras</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-card-foreground hover:bg-muted">
                <X />
              </Button>
            </div>
            
            {/* Lista de productos en el carrito */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                // Estado vacío del carrito
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4" />
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                // Items del carrito
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-4 bg-card border border-border p-3 rounded-lg">
                    <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-card-foreground">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.variant.title}</p>
                      <p className="text-sm text-primary font-bold">
                        {item.variant.price_formatted}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/* Controles de cantidad */}
                      <div className="flex items-center border border-border rounded-md">
                        <Button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} size="sm" variant="ghost" className="px-2 text-card-foreground hover:bg-muted">-</Button>
                        <span className="px-2 text-card-foreground">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="sm" variant="ghost" className="px-2 text-card-foreground hover:bg-muted">+</Button>
                      </div>
                      {/* Botón eliminar */}
                      <Button onClick={() => removeFromCart(item.variant.id)} size="sm" variant="ghost" className="text-destructive hover:text-destructive/90 text-xs">Eliminar</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer del carrito con total y botón de checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border">
                <div className="flex justify-between items-center mb-4 text-card-foreground">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{getCartTotal()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base">
                  Proceder al Pago
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;