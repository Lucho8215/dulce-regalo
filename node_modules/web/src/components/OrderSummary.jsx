import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Componente de resumen de orden para checkout
const OrderSummary = ({ cartItems, subtotal, shipping, tax, total }) => {
  // Formatear precio a moneda
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    // Contenedor principal del resumen
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24"
    >
      {/* Título del resumen */}
      <h2 className="text-2xl font-bold text-card-foreground mb-6">Resumen de Compra</h2>
      
      {/* Lista de productos en el carrito */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex gap-3"
          >
            {/* Imagen del producto */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={item.imagen || item.image}
                alt={item.nombre || item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Información del producto */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-card-foreground truncate">
                {item.nombre || item.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Cantidad: {item.quantity || 1}
              </p>
            </div>
            
            {/* Precio del producto */}
            <div className="text-sm font-semibold text-card-foreground">
              {formatPrice((item.precio || item.price_in_cents / 100) * (item.quantity || 1))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <Separator className="my-6" />
      
      {/* Desglose de costos */}
      <div className="space-y-3 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-card-foreground">{formatPrice(subtotal)}</span>
        </div>
        
        {/* Envío */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Envío
          </span>
          <span className="font-medium text-card-foreground">
            {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
          </span>
        </div>
        
        {/* Impuestos */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Impuestos</span>
          <span className="font-medium text-card-foreground">{formatPrice(tax)}</span>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-card-foreground">Total</span>
        <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
      </div>
      
      {/* Información adicional */}
      <div className="space-y-3 pt-4 border-t border-border">
        {/* Envío seguro */}
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Package className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>Envío seguro y con seguimiento incluido</span>
        </div>
        
        {/* Pago seguro */}
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>Pago 100% seguro y encriptado</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;