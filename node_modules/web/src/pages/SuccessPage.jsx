// Importamos React
import React from 'react';
// Importamos Helmet para meta tags SEO
import { Helmet } from 'react-helmet';
// Importamos Link para navegación
import { Link } from 'react-router-dom';
// Importamos motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
// Importamos componente UI
import { Button } from '@/components/ui/button';
// Importamos componentes propios
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Página de confirmación de compra exitosa
const SuccessPage = () => {
  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Compra Exitosa - Dulce Regalo</title>
        <meta name="description" content="Tu pedido ha sido procesado exitosamente" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Contenido principal centrado */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Icono de éxito animado con spring */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle className="w-12 h-12 text-primary" />
              </motion.div>

              {/* Título de confirmación */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              >
                ¡Pedido Realizado con Éxito!
              </motion.h1>

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos pronto.
              </motion.p>

              {/* Tarjeta de información con detalles del pedido */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-8"
              >
                <div className="space-y-6">
                  {/* Confirmación por email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-card-foreground mb-1">
                        Confirmación enviada
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Recibirás un email con los detalles de tu pedido y el número de seguimiento.
                      </p>
                    </div>
                  </div>

                  {/* Tiempo de entrega estimado */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-card-foreground mb-1">
                        Tiempo de entrega
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tu pedido llegará en 3-5 días hábiles. Te notificaremos cuando sea enviado.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
                  <Link to="/">
                    <Home className="w-5 h-5 mr-2" />
                    Volver al Inicio
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 active:scale-[0.98]">
                  <Link to="/productos">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Seguir Comprando
                  </Link>
                </Button>
              </motion.div>

              {/* Enlace a contacto */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-sm text-muted-foreground mt-8"
              >
                ¿Tienes alguna pregunta? <Link to="/contacto" className="text-primary hover:underline">Contáctanos</Link>
              </motion.p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SuccessPage;