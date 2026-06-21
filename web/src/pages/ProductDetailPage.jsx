import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Package, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProductById } from '@/lib/api';

const formatCOP = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const variant = {
      id: product.id,
      title: 'Estándar',
      price_in_cents: product.precio * 100,
      sale_price_in_cents: null,
      currency_info: { code: 'COP', symbol: '$' },
      sale_price_formatted: null,
      price_formatted: formatCOP(product.precio),
      manage_inventory: true,
      inventory_quantity: product.inventario,
    };

    const prod = { id: product.id, title: product.nombre, image: product.imagen_url };

    addToCart(prod, variant, quantity, product.inventario)
      .then(() =>
        toast({
          title: 'Producto agregado',
          description: `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.nombre} agregadas al carrito`,
        })
      )
      .catch((error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Producto no encontrado</h2>
          <Button asChild>
            <Link to="/productos">Volver a productos</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.nombre} - Dulce Regalo`}</title>
        <meta name="description" content={product.descripcion} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
        </div>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <div className="sticky top-24">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
                    {product.imagen_url ? (
                      <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
                    )}
                  </div>
                  {product.destacado && (
                    <Badge className="mt-4 bg-accent text-accent-foreground">Producto Destacado</Badge>
                  )}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                <div>
                  <Badge variant="outline" className="mb-4">{product.categoria}</Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{product.nombre}</h1>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">{formatCOP(product.precio)}</span>
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.descripcion}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {product.inventario > 0 ? (
                      <span className="text-primary font-medium">{product.inventario} unidades disponibles</span>
                    ) : (
                      <span className="text-destructive font-medium">Agotado</span>
                    )}
                  </span>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Cantidad</label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</Button>
                    <span className="text-xl font-semibold text-foreground w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.inventario, quantity + 1))} disabled={quantity >= product.inventario}>+</Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.inventario === 0}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al carrito
                  </Button>
                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-xl">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                <div className="bg-muted rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Envío gratis</p>
                      <p className="text-sm text-muted-foreground">En compras mayores a $150.000 COP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Compra segura</p>
                      <p className="text-sm text-muted-foreground">Pago 100% protegido</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Empaque especial</p>
                      <p className="text-sm text-muted-foreground">Presentación premium incluida</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
