import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Página de términos y condiciones
const TermsPage = () => {
  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Términos y Condiciones - Dulce Regalo</title>
        <meta name="description" content="Lee nuestros términos y condiciones de uso" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Términos y Condiciones
              </h1>
              <p className="text-muted-foreground">
                Última actualización: Junio 2026
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border space-y-8"
            >
              {/* Sección 1 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  1. Aceptación de los Términos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Al acceder y utilizar el sitio web de Dulce Regalo, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio web.
                </p>
              </div>

              {/* Sección 2 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  2. Uso del Sitio Web
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Te comprometes a utilizar nuestro sitio web únicamente para fines legales y de manera que no infrinja los derechos de terceros. Está prohibido:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Utilizar el sitio de manera fraudulenta o ilegal</li>
                  <li>Intentar acceder a áreas restringidas del sitio</li>
                  <li>Transmitir contenido malicioso o dañino</li>
                  <li>Interferir con el funcionamiento normal del sitio</li>
                </ul>
              </div>

              {/* Sección 3 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  3. Productos y Precios
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nos esforzamos por mostrar información precisa sobre nuestros productos y precios. Sin embargo, nos reservamos el derecho de corregir errores y actualizar información sin previo aviso. Los precios están sujetos a cambios y no incluyen impuestos ni costos de envío, a menos que se indique lo contrario.
                </p>
              </div>

              {/* Sección 4 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  4. Pedidos y Pagos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Al realizar un pedido, garantizas que toda la información proporcionada es precisa y completa. Nos reservamos el derecho de rechazar o cancelar pedidos por cualquier motivo, incluyendo disponibilidad de productos, errores en precios o información, o problemas con el pago.
                </p>
              </div>

              {/* Sección 5 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  5. Envíos y Entregas
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Los tiempos de entrega son estimados y pueden variar. No nos hacemos responsables por retrasos causados por servicios de mensajería o circunstancias fuera de nuestro control. Es responsabilidad del cliente proporcionar una dirección de entrega correcta.
                </p>
              </div>

              {/* Sección 6 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  6. Devoluciones y Reembolsos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto, siempre que esté en su estado original. Los productos personalizados no son elegibles para devolución. Los reembolsos se procesarán dentro de 7-10 días hábiles después de recibir el producto devuelto.
                </p>
              </div>

              {/* Sección 7 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  7. Propiedad Intelectual
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Todo el contenido del sitio web, incluyendo textos, imágenes, logos y diseños, es propiedad de Dulce Regalo y está protegido por leyes de propiedad intelectual. No está permitido copiar, reproducir o distribuir ningún contenido sin autorización previa.
                </p>
              </div>

              {/* Sección 8 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  8. Limitación de Responsabilidad
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dulce Regalo no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar nuestros productos o servicios. Nuestra responsabilidad máxima se limitará al valor del producto adquirido.
                </p>
              </div>

              {/* Sección 9 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  9. Modificaciones
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. Es tu responsabilidad revisar periódicamente estos términos.
                </p>
              </div>

              {/* Sección 10 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  10. Contacto
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos en contacto@dulceregalo.com o llamar al +52 55 1234 5678.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TermsPage;