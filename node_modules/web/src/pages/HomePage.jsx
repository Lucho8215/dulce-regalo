import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Gift, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProductsDestacados } from '@/lib/api';

const HomePage = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsDestacados()
      .then(setFeaturedProducts)
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    const variant = {
      id: product.id,
      title: 'Estándar',
      price_in_cents: product.precio * 100,
      sale_price_in_cents: null,
      currency_info: { code: 'COP', symbol: '$' },
      sale_price_formatted: null,
      price_formatted: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.precio),
      manage_inventory: true,
      inventory_quantity: product.inventario,
    };

    const prod = {
      id: product.id,
      title: product.nombre,
      image: product.imagen_url,
    };

    addToCart(prod, variant, 1, product.inventario)
      .then(() => toast({ title: 'Producto agregado', description: `${product.nombre} se agregó al carrito` }))
      .catch((error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }));
  };

  return (
    <>
      <Helmet>
        <title>Dulce Regalo - Detalles con amor para momentos especiales</title>
        <meta name="description" content="Encuentra el regalo perfecto en Dulce Regalo. Osos de peluche, regalos personalizados y detalles únicos para expresar tu amor." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1666107143525-270f35c4a1ed"
              alt="Regalos románticos y detalles especiales"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Regalos únicos y personalizados</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Detalles con amor para momentos especiales
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/90 mb-8 leading-relaxed"
              >
                Encuentra el regalo perfecto para expresar tus sentimientos. Cada detalle cuenta una historia única.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
                  <Link to="/productos">
                    Ver Productos
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 active:scale-[0.98]">
                  <Link to="/contacto">Contactar</Link>
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 right-20 hidden lg:block"
          >
            <Heart className="w-16 h-16 text-primary/30" fill="currentColor" />
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Gift, color: 'primary', title: 'Regalos únicos', desc: 'Cada producto es cuidadosamente seleccionado para crear momentos inolvidables.' },
                { icon: Sparkles, color: 'accent', title: 'Personalización', desc: 'Agrega tu toque personal con mensajes, nombres y detalles especiales.' },
                { icon: Star, color: 'primary', title: 'Calidad premium', desc: 'Materiales de alta calidad y acabados impecables en cada detalle.' },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${color}/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 text-${color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Productos destacados */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Productos destacados</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubre nuestra selección especial de regalos más populares
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-muted animate-pulse rounded-2xl h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
                <Link to="/productos">
                  Ver todos los productos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para sorprender?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Crea momentos inolvidables con nuestros regalos especiales
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
                <Link to="/productos">
                  Explorar catálogo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
