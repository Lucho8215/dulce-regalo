// Importamos React y useState
import React, { useState } from 'react';
// Importamos Helmet para meta tags SEO
import { Helmet } from 'react-helmet';
// Importamos motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos
import { Mail, Phone, MapPin, Send } from 'lucide-react';
// Importamos componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Importamos componentes propios
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Importamos hook toast
import { useToast } from '@/hooks/use-toast';

// Página de contacto con formulario
const ContactPage = () => {
  const { toast } = useToast();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación: campos requeridos
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos',
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

    // Simulamos envío (1.5 segundos)
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Mensaje enviado',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
      });
      
      // Limpiamos el formulario
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu mensaje. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Contacto - Dulce Regalo</title>
        <meta name="description" content="Contáctanos para cualquier consulta sobre nuestros productos y servicios" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Contáctanos
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenido principal: información de contacto y formulario */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Información de contacto */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Información de Contacto
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Puedes contactarnos a través de cualquiera de estos medios. Nuestro equipo está disponible para ayudarte con cualquier consulta.
                  </p>
                </div>

                {/* Tarjetas de contacto con iconos */}
                <div className="space-y-4">
                  {/* Email */}
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground mb-1">Email</h3>
                        <a href="mailto:contacto@dulceregalo.com" className="text-muted-foreground hover:text-primary transition-colors">
                          contacto@dulceregalo.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground mb-1">Teléfono</h3>
                        <a href="tel:+525512345678" className="text-muted-foreground hover:text-primary transition-colors">
                          +52 55 1234 5678
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground mb-1">Dirección</h3>
                        <p className="text-muted-foreground">
                          Av. Principal 123<br />
                          Ciudad de México, 01000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horario de atención */}
                <div className="bg-muted rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3">Horario de Atención</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                    <p>Sábados: 10:00 AM - 5:00 PM</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </motion.div>

              {/* Formulario de contacto */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Envíanos un Mensaje
                  </h2>

                  {/* Nombre */}
                  <div>
                    <Label htmlFor="nombre" className="text-sm font-medium text-card-foreground">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="María García"
                      required
                      className="mt-1 bg-background text-foreground"
                    />
                  </div>

                  {/* Email */}
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

                  {/* Asunto */}
                  <div>
                    <Label htmlFor="asunto" className="text-sm font-medium text-card-foreground">
                      Asunto *
                    </Label>
                    <Input
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      placeholder="Consulta sobre productos"
                      required
                      className="mt-1 bg-background text-foreground"
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <Label htmlFor="mensaje" className="text-sm font-medium text-card-foreground">
                      Mensaje *
                    </Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                      required
                      className="mt-1 bg-background text-foreground resize-none"
                    />
                  </div>

                  {/* Botón de envío */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;