// Importamos React y useState para el formulario
import React, { useState } from 'react';
// Importamos Helmet para meta tags SEO
import { Helmet } from 'react-helmet';
// Importamos useNavigate para redirigir después del pedido
import { useNavigate } from 'react-router-dom';
// Importamos motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos
import { CreditCard, Lock } from 'lucide-react';
// Importamos componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Importamos componentes propios
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSummary from '@/components/OrderSummary';
// Importamos hooks
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  
  // Estado del formulario con información del cliente
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    notas: ''
  });
  
  // Estado para mostrar "Procesando..." durante el envío
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcula el subtotal de todos los productos
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
      return total + ((price / 100) * item.quantity);
    }, 0);
  };

  // Calcula envío: gratis si subtotal >= 150.000 COP
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 150000 ? 0 : 15000;
  };

  // Calcula impuestos (19% IVA Colombia)
  const calculateTax = () => {
    return calculateSubtotal() * 0.19;
  };

  // Calcula el total final
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  // Maneja cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario de checkout
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación: campos requeridos
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.ciudad || !formData.codigoPostal) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    // Validación: formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor ingresa un email válido',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulamos procesamiento de pedido (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Creamos el objeto de orden
      const order = {
        id: `order_${Date.now()}`,
        fecha: new Date().toISOString(),
        cliente: formData,
        productos: cartItems,
        subtotal: calculateSubtotal(),
        envio: calculateShipping(),
        impuestos: calculateTax(),
        total: calculateTotal(),
        estado: 'Pendiente'
      };
      
      // Guardamos la orden en localStorage (simulación de base de datos)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Vaciamos el carrito
      clearCart();
      
      toast({
        title: 'Pedido realizado',
        description: 'Tu pedido ha sido procesado exitosamente',
      });
      
      // Redirigimos a la página de éxito
      navigate('/success');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al procesar tu pedido. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Si el carrito está vacío, redirigimos a la página del carrito
  if (cartItems.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Checkout - Dulce Regalo</title>
        <meta name="description" content="Completa tu compra de forma segura" />
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
                Finalizar Compra
              </h1>
              <p className="text-muted-foreground">
                Completa tus datos para procesar el pedido
              </p>
            </motion.div>
          </div>
        </section>

        {/* Formulario de checkout y resumen */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario (2/3 del ancho) */}
              <div className="lg:col-span-2">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-8 shadow-sm border border-border space-y-8"
                >
                  {/* Sección: Información de Contacto */}
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">
                      Información de Contacto
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nombre" className="text-sm font-medium text-card-foreground">
                          Nombre Completo *
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="María García López"
                          required
                          className="mt-1 bg-background text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="maria@ejemplo.com"
                            required
                            className="mt-1 bg-background text-foreground"
                          />
                        </div>

                        <div>
                          <Label htmlFor="telefono" className="text-sm font-medium text-card-foreground">
                            Teléfono *
                          </Label>
                          <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="+57 300 123 4567"
                            required
                            className="mt-1 bg-background text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Dirección de Envío */}
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">
                      Dirección de Envío
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="direccion" className="text-sm font-medium text-card-foreground">
                          Dirección *
                        </Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          placeholder="Calle Principal 123, Col. Centro"
                          required
                          className="mt-1 bg-background text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ciudad" className="text-sm font-medium text-card-foreground">
                            Ciudad *
                          </Label>
                          <Input
                            id="ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            placeholder="Bogotá"
                            required
                            className="mt-1 bg-background text-foreground"
                          />
                        </div>

                        <div>
                          <Label htmlFor="codigoPostal" className="text-sm font-medium text-card-foreground">
                            Código Postal *
                          </Label>
                          <Input
                            id="codigoPostal"
                            name="codigoPostal"
                            value={formData.codigoPostal}
                            onChange={handleChange}
                            placeholder="110111"
                            required
                            className="mt-1 bg-background text-foreground"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notas" className="text-sm font-medium text-card-foreground">
                          Notas Adicionales (Opcional)
                        </Label>
                        <Textarea
                          id="notas"
                          name="notas"
                          value={formData.notas}
                          onChange={handleChange}
                          placeholder="Instrucciones especiales de entrega, mensaje personalizado, etc."
                          rows={4}
                          className="mt-1 bg-background text-foreground resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón de envío */}
                  <div className="pt-6 border-t border-border">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      {isProcessing ? (
                        <>Procesando...</>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Realizar Pedido
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span>Pago 100% seguro y encriptado</span>
                    </div>
                  </div>
                </motion.form>
              </div>

              {/* Resumen de orden (1/3 del ancho) */}
              <OrderSummary
                cartItems={cartItems}
                subtotal={calculateSubtotal()}
                shipping={calculateShipping()}
                tax={calculateTax()}
                total={calculateTotal()}
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutPage;