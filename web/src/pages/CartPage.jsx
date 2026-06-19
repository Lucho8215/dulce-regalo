import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';

// Página del carrito de compras
const CartPage = () => {
  // Hook del carrito con todas las funciones
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  // Formatear precio
  const formatPrice = (priceInCents, currencyInfo) => {
    const price = priceInCents / 100;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currencyInfo?.code || 'USD'
    }).format(price);
  };

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
      return total + (price * item.quantity);
    }, 0);
  };

  // Calcular envío (gratis si es mayor a $50)
  const calculateShipping = () => {
    const subtotal = calculateSubtotal() / 100;
    return subtotal >= 50 ? 0 : 5.99;
  };

  // Calcular impuestos (16%)
  const calculateTax = () => {
    return (calculateSubtotal() / 100) * 0.16;
  };

  // Calcular total
  const calculateTotal = () => {
    return (calculateSubtotal() / 100) + calculateShipping() + calculateTax();
  };

  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Carrito de Compras - Dulce Regalo</title>
        <meta name="description" content="Revisa tu carrito de compras y procede al checkout" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Carrito de Compras
              </h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenido principal */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {cartItems.length === 0 ? (
              // Estado vacío
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Tu carrito está vacío
                </h2>
                <p className="text-muted-foreground mb-8">
                  Agrega productos para comenzar tu compra
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/productos">
                    Explorar productos
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              // Carrito con productos
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Botón de limpiar carrito */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Productos</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-destructive hover:text-destructive/90"
                    >
                      Vaciar carrito
                    </Button>
                  </div>

                  {/* Items del carrito */}
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.variant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-card rounded-xl p-6 shadow-sm border border-border"
                    >
                      <div className="flex gap-6">
                        {/* Imagen del producto */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-card-foreground mb-1">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.variant.title}
                          </p>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                                className="h-9 w-9 text-card-foreground hover:bg-muted"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-4 text-card-foreground font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                className="h-9 w-9 text-card-foreground hover:bg-muted"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Botón de eliminar */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.variant.id)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </div>

                        {/* Precio */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(
                              (item.variant.sale_price_in_cents ?? item.variant.price_in_cents) * item.quantity,
                              item.variant.currency_info
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(
                              item.variant.sale_price_in_cents ?? item.variant.price_in_cents,
                              item.variant.currency_info
                            )} c/u
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Resumen del pedido */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:sticky lg:top-24 h-fit"
                >
                  <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h2 className="text-xl font-bold text-card-foreground mb-6">
                      Resumen del Pedido
                    </h2>

                    {/* Desglose de costos */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-card-foreground">
                          ${(calculateSubtotal() / 100).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="font-medium text-card-foreground">
                          {calculateShipping() === 0 ? 'Gratis' : `$${calculateShipping().toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Impuestos (16%)</span>
                        <span className="font-medium text-card-foreground">
                          ${calculateTax().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-card-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>

                    {/* Botón de checkout */}
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      <Link to="/checkout">
                        Proceder al Pago
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>

                    {/* Mensaje de envío gratis */}
                    {calculateSubtotal() / 100 < 50 && (
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Agrega ${(50 - calculateSubtotal() / 100).toFixed(2)} más para envío gratis
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;