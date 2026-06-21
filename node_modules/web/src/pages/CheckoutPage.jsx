import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    notas: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
      return total + (price / 100) * item.quantity;
    }, 0);

  const calculateShipping = () => (calculateSubtotal() >= 150000 ? 0 : 15000);
  const calculateTax = () => calculateSubtotal() * 0.19;
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.ciudad || !formData.codigoPostal) {
      toast({ title: 'Campos incompletos', description: 'Por favor completa todos los campos requeridos', variant: 'destructive' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: 'Email inválido', description: 'Por favor ingresa un email válido', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);

    try {
      await createOrder(
        {
          ...formData,
          subtotal: calculateSubtotal(),
          envio: calculateShipping(),
          iva: calculateTax(),
          total: calculateTotal(),
        },
        cartItems
      );

      clearCart();
      toast({ title: 'Pedido realizado', description: 'Tu pedido ha sido procesado exitosamente' });
      navigate('/success');
    } catch (error) {
      toast({ title: 'Error', description: 'Hubo un problema al procesar tu pedido. Intenta nuevamente.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Dulce Regalo</title>
        <meta name="description" content="Completa tu compra de forma segura" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Finalizar Compra</h1>
              <p className="text-muted-foreground">Completa tus datos para procesar el pedido</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-8 shadow-sm border border-border space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">Información de Contacto</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nombre">Nombre Completo *</Label>
                        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="María García López" required className="mt-1 bg-background text-foreground" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="maria@ejemplo.com" required className="mt-1 bg-background text-foreground" />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono *</Label>
                          <Input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} placeholder="+57 300 123 4567" required className="mt-1 bg-background text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">Dirección de Envío</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="direccion">Dirección *</Label>
                        <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle Principal 123, Barrio Centro" required className="mt-1 bg-background text-foreground" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ciudad">Ciudad *</Label>
                          <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Bogotá" required className="mt-1 bg-background text-foreground" />
                        </div>
                        <div>
                          <Label htmlFor="codigoPostal">Código Postal *</Label>
                          <Input id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="110111" required className="mt-1 bg-background text-foreground" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notas">Notas Adicionales (Opcional)</Label>
                        <Textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} placeholder="Instrucciones especiales de entrega, mensaje personalizado, etc." rows={4} className="mt-1 bg-background text-foreground resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      {isProcessing ? 'Procesando...' : (
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
