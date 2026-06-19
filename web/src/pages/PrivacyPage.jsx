import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Página de política de privacidad
const PrivacyPage = () => {
  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Política de Privacidad - Dulce Regalo</title>
        <meta name="description" content="Lee nuestra política de privacidad y protección de datos" />
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
                Política de Privacidad
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
              {/* Introducción */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  En Dulce Regalo, valoramos y respetamos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestro sitio web y servicios.
                </p>
              </div>

              {/* Sección 1 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  1. Información que Recopilamos
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Información personal: nombre, email, teléfono, dirección</li>
                  <li>Información de pago: datos de tarjeta de crédito (procesados de forma segura)</li>
                  <li>Información de navegación: dirección IP, tipo de navegador, páginas visitadas</li>
                  <li>Información de pedidos: historial de compras y preferencias</li>
                </ul>
              </div>

              {/* Sección 2 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  2. Cómo Usamos tu Información
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Procesar y entregar tus pedidos</li>
                  <li>Comunicarnos contigo sobre tu pedido y nuestros servicios</li>
                  <li>Mejorar nuestro sitio web y experiencia de usuario</li>
                  <li>Enviar promociones y ofertas (con tu consentimiento)</li>
                  <li>Prevenir fraudes y garantizar la seguridad</li>
                </ul>
              </div>

              {/* Sección 3 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  3. Compartir Información
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  No vendemos ni alquilamos tu información personal a terceros. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro negocio, como procesadores de pagos y servicios de envío, siempre bajo estrictos acuerdos de confidencialidad.
                </p>
              </div>

              {/* Sección 4 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  4. Cookies y Tecnologías Similares
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web. Las cookies nos ayudan a recordar tus preferencias, analizar el tráfico del sitio y personalizar el contenido. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
                </p>
              </div>

              {/* Sección 5 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  5. Seguridad de los Datos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, pérdida o alteración. Utilizamos encriptación SSL para todas las transacciones y almacenamos datos en servidores seguros.
                </p>
              </div>

              {/* Sección 6 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  6. Tus Derechos
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir información inexacta</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al procesamiento de tus datos</li>
                  <li>Retirar tu consentimiento en cualquier momento</li>
                </ul>
              </div>

              {/* Sección 7 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  7. Retención de Datos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Conservamos tu información personal solo durante el tiempo necesario para cumplir con los fines descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
                </p>
              </div>

              {/* Sección 8 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  8. Enlaces a Sitios de Terceros
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestro sitio web puede contener enlaces a sitios de terceros. No somos responsables de las prácticas de privacidad de estos sitios. Te recomendamos leer las políticas de privacidad de cualquier sitio web que visites.
                </p>
              </div>

              {/* Sección 9 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  9. Cambios a esta Política
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web. Te recomendamos revisar esta página regularmente.
                </p>
              </div>

              {/* Sección 10 */}
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  10. Contacto
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos, contáctanos en contacto@dulceregalo.com o llama al +52 55 1234 5678.
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

export default PrivacyPage;