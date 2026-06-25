import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formatCOP = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);

const OrderSummary = ({ cartItems, subtotal, shipping, tax, total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24"
    >
      <h2 className="text-2xl font-bold text-card-foreground mb-6">Resumen de Compra</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item, index) => {
          // La imagen puede estar en item.product.image o item.product.imagen_url
          const image = item.product?.image || item.product?.imagen_url || item.imagen || item.image;
          const nombre = item.product?.title || item.nombre || item.title || 'Producto';
          // El precio está en price_in_cents (×100 del precio COP)
          const priceCents = item.variant?.sale_price_in_cents ?? item.variant?.price_in_cents ?? 0;
          const precioUnitario = priceCents / 100;

          return (
            <motion.div
              key={item.variant?.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex gap-3"
            >
              {/* Imagen */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                {image ? (
                  <img
                    src={image}
                    alt={nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-card-foreground truncate">{nombre}</h4>
                <p className="text-xs text-muted-foreground mt-1">Cantidad: {item.quantity || 1}</p>
              </div>

              {/* Precio */}
              <div className="text-sm font-semibold text-card-foreground whitespace-nowrap">
                {formatCOP(precioUnitario * (item.quantity || 1))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Separator className="my-6" />

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-card-foreground">{formatCOP(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Envío
          </span>
          <span className="font-medium text-card-foreground">
            {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
          </span>
        </div>
        {/* IVA oculto por el momento — descomentar cuando se active */}
        {/* <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">IVA (19%)</span>
          <span className="font-medium text-card-foreground">{formatCOP(tax)}</span>
        </div> */}
      </div>

      <Separator className="my-6" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-card-foreground">Total</span>
        <span className="text-2xl font-bold text-primary">{formatCOP(total)}</span>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Package className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>Envío seguro y con seguimiento incluido</span>
        </div>
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>Pago 100% seguro y encriptado</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
