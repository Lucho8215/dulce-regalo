// Importamos React y sus hooks
import React, { useState, useEffect } from 'react';
// Importamos Helmet para meta tags SEO
import { Helmet } from 'react-helmet';
// Importamos hooks de React Router para obtener el ID de la URL
import { useParams, Link } from 'react-router-dom';
// Importamos motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos
import { ShoppingCart, Heart, ArrowLeft, Package, Truck, Shield } from 'lucide-react';
// Importamos componentes UI
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// Importamos componentes propios
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Importamos datos y hooks
import productsData from '@/data/products.json';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

// Página de detalle de producto individual
const ProductDetailPage = () => {
  // Obtenemos el ID del producto desde la URL (ej: /product/prod_001)
  const { id } = useParams();
  // Hook del carrito para agregar productos
  const { addToCart } = useCart();
  // Hook toast para notificaciones
  const { toast } = useToast();
  
  // Estados: producto actual, cantidad seleccionada, estado de loading
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar producto cuando el componente se monta o el ID cambia
  useEffect(() => {
    setIsLoading(true);
    // Buscamos el producto en los datos por su ID
    const foundProduct = productsData.products.find(p => p.id === id);
    setProduct(foundProduct);
    setIsLoading(false);
  }, [id]);

  // Maneja el clic en agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;

    const mockVariant = {
      id: product.id,
      title: 'Estándar',
      price_in_cents: Math.round(product.precio * 100),
      sale_price_in_cents: null,
      currency_info: { code: 'USD', symbol: '$' },
      sale_price_formatted: null,
      price_formatted: `$${product.precio.toFixed(2)}`,
      manage_inventory: true,
      inventory_quantity: product.inventario
    };

    const mockProduct = {
      id: product.id,
      title: product.nombre,
      image: product.imagen
    };

    addToCart(mockProduct, mockVariant, quantity, product.inventario)
      .then(() => {
        toast({
          title: 'Producto agregado',
          description: `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.nombre} agregadas al carrito`,
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      });
  };

  // Formatea precios como moneda
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Mostramos estado de carga mientras se busca el producto
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si no se encuentra el producto, mostramos error
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Producto no encontrado</h2>
            <Button asChild>
              <Link to="/productos">Volver a productos</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {/* Meta tags dinámicos según el producto */}
      <Helmet>
        <title>{`${product.nombre} - Dulce Regalo`}</title>
        <meta name="description" content={product.descripcion} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Breadcrumb: volver a productos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
        </div>

        {/* Contenido principal del producto */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Columna izquierda: Imagen del producto */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="sticky top-24">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Badge de destacado si aplica */}
                  {product.destacado && (
                    <Badge className="mt-4 bg-accent text-accent-foreground">
                      Producto Destacado
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Columna derecha: Información del producto */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Categoría del producto */}
                <div>
                  <Badge variant="outline" className="mb-4">
                    {product.categoria}
                  </Badge>
                </div>

                {/* Nombre del producto */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {product.nombre}
                </h1>

                {/* Precio destacado */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.precio)}
                  </span>
                </div>

                <Separator />

                {/* Descripción del producto */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.descripcion}
                  </p>
                </div>

                {/* Información de disponibilidad */}
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {product.inventario > 0 ? (
                      <span className="text-primary font-medium">
                        {product.inventario} unidades disponibles
                      </span>
                    ) : (
                      <span className="text-destructive font-medium">Agotado</span>
                    )}
                  </span>
                </div>

                <Separator />

                {/* Selector de cantidad con botones +/- */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="text-xl font-semibold text-foreground w-12 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.inventario, quantity + 1))}
                      disabled={quantity >= product.inventario}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Botones de acción: agregar al carrito y favoritos */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.inventario === 0}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al carrito
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-14 h-14 rounded-xl"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Información adicional: envío, garantía, presentación */}
                <div className="bg-muted rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Envío gratis</p>
                      <p className="text-sm text-muted-foreground">En compras mayores a $50</p>
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