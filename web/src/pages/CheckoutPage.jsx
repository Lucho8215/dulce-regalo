import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Store, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSummary from '@/components/OrderSummary';
import WompiButton from '@/components/WompiButton';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { createOrder } from '@/lib/api';

const OPCIONES_ENTREGA = [
  {
    id: 'bogota',
    label: 'Domicilio en Bogotá',
    precio: 15000,
    icon: Truck,
    detalle: 'Mismo día si pides antes del mediodía',
    color: 'text-green-600',
  },
  {
    id: 'colombia',
    label: 'Envío a todo Colombia',
    precio: 25000,
    icon: Truck,
    detalle: '1 día hábil después del despacho',
    color: 'text-blue-600',
  },
  {
    id: 'tienda',
    label: 'Recoger en tienda',
    precio: 0,
    icon: Store,
    detalle: 'Calle 63a sur #71h-46, Barrio Perdomo, Bogotá',
    color: 'text-primary',
  },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [tipoEntrega, setTipoEntrega] = useState('bogota');
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
  const [ordenGuardada, setOrdenGuardada] = useState(false);

  const entregaSeleccionada = OPCIONES_ENTREGA.find(o => o.id === tipoEntrega);

  // Referencia única para esta orden: usamos timestamp para que nunca se repita
  // Ejemplo: "DR-1718900000000"  (DR = Dulce Regalo)
  const referenciaRef = useRef(`DR-${Date.now()}`);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
      return total + (price / 100) * item.quantity;
    }, 0);

  const calculateShipping = () => entregaSeleccionada?.precio ?? 0;
  const calculateTax = () => 0; // IVA oculto por el momento — cambiar a: calculateSubtotal() * 0.19
  const calculateTotal = () => calculateSubtotal() + calculateShipping();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const necesitaDireccion = tipoEntrega !== 'tienda';
    if (!formData.nombre || !formData.email || !formData.telefono ||
        (necesitaDireccion && (!formData.direccion || !formData.ciudad || !formData.codigoPostal))) {
      toast.error('Campos incompletos', { description: 'Por favor completa todos los campos requeridos' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido', { description: 'Por favor ingresa un email válido' });
      return;
    }

    setIsProcessing(true);

    try {
      // Guardamos la orden en Supabase ANTES de ir a Wompi
      // así queda registrada aunque el cliente cierre la ventana de pago
      await createOrder(
        {
          ...formData,
          referencia: referenciaRef.current,
          tipo_entrega: tipoEntrega,
          subtotal: calculateSubtotal(),
          envio: calculateShipping(),
          iva: calculateTax(),
          total: calculateTotal(),
        },
        cartItems
      );

      // Marcamos que la orden ya fue guardada → el botón Wompi se habilita
      setOrdenGuardada(true);
      toast.success('Datos guardados', { description: 'Ahora completa el pago con Wompi.' });
    } catch (error) {
      toast.error('Error al guardar el pedido', { description: error?.message || 'Hubo un problema. Intenta nuevamente.' });
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

                  {/* ── Método de entrega ── */}
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">Método de Entrega</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {OPCIONES_ENTREGA.map((op) => {
                        const Icon = op.icon;
                        const activo = tipoEntrega === op.id;
                        return (
                          <button
                            key={op.id}
                            type="button"
                            onClick={() => setTipoEntrega(op.id)}
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                              activo
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-background hover:border-primary/40'
                            }`}
                          >
                            <div className={`mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activo ? 'bg-primary/10' : 'bg-muted'}`}>
                              <Icon className={`w-5 h-5 ${activo ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-semibold ${activo ? 'text-primary' : 'text-foreground'}`}>{op.label}</span>
                                <span className={`font-bold text-base ${activo ? 'text-primary' : 'text-foreground'}`}>
                                  {op.precio === 0 ? 'Gratis' : `$${op.precio.toLocaleString('es-CO')}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{op.detalle}</span>
                              </div>
                            </div>
                            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${activo ? 'border-primary bg-primary' : 'border-border'}`}>
                              {activo && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Dirección (solo si no es recoger en tienda) ── */}
                  {tipoEntrega !== 'tienda' ? (
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
                          <Textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} placeholder="Instrucciones especiales de entrega, barrio, punto de referencia, etc." rows={3} className="mt-1 bg-background text-foreground resize-none" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted rounded-xl p-5 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Punto de recogida</p>
                        <p className="text-sm text-muted-foreground mt-1">Calle 63a sur #71h-46, Barrio Perdomo, Bogotá</p>
                        <p className="text-sm text-muted-foreground">Lunes a Viernes 9am–7pm · Sábados 10am–5pm</p>
                        <div>
                          <Label htmlFor="notas" className="mt-3 block">Notas (Opcional)</Label>
                          <Textarea id="notas" name="notas" value={formData.notas} onChange={handleChange} placeholder="Hora aproximada de recogida, mensaje personalizado, etc." rows={2} className="mt-1 bg-background text-foreground resize-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border space-y-4">

                    {/* PASO 1: Guardar la orden (solo si aún no se guardó) */}
                    {!ordenGuardada && (
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-4 text-base rounded-xl transition-all"
                      >
                        {isProcessing ? 'Guardando...' : '1. Confirmar datos del pedido'}
                      </button>
                    )}

                    {/* PASO 2: Botón Wompi (aparece después de guardar la orden) */}
                    {ordenGuardada && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-sm text-green-600 font-medium mb-3 text-center">
                          ✅ Datos guardados — ahora completa el pago:
                        </p>
                        {/* WompiButton recibe todo lo necesario para el pago */}
                        <WompiButton
                          totalCOP={calculateTotal()}
                          referencia={referenciaRef.current}
                          email={formData.email}
                          nombre={formData.nombre}
                          disabled={false}
                        />
                      </motion.div>
                    )}

                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span>Pago seguro — PSE, tarjeta, Nequi, Daviplata</span>
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
