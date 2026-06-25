// Importamos React y sus hooks
import React, { useState, useEffect } from 'react';
// Importamos Helmet para meta tags SEO
import { Helmet } from 'react-helmet';
// Importamos motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos
import { SlidersHorizontal } from 'lucide-react';
// Importamos componentes UI
import { Button } from '@/components/ui/button';
// Importamos componentes propios
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import PriceFilter from '@/components/PriceFilter';
import SearchBar from '@/components/SearchBar';
// Importamos el Sheet (sidebar móvil) desde UI
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// Importamos cliente Supabase
import { supabase } from '@/lib/supabase';
// Importamos hooks personalizados
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

// Página de listado de productos con filtros y búsqueda
const ProductsPage = () => {
  const { addToCart } = useCart();

  // Estados de productos y filtros
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 9999999]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Cargar productos desde Supabase al montar
  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { console.error(error); return; }
        const allProducts = data || [];
        setProducts(allProducts);
        setFilteredProducts(allProducts);

        const uniqueCategories = [...new Set(allProducts.map(p => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);

        // Precio inicial sin filtro (el PriceFilter maneja los rangos)
        setPriceRange([0, 9999999]);
      });
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.categoria));
    }

    filtered = filtered.filter(p => p.precio >= priceRange[0] && p.precio <= priceRange[1]);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, priceRange, searchTerm]);

  // Maneja agregar producto al carrito
  const handleAddToCart = (product) => {
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
      image: product.imagen_url
    };

    addToCart(mockProduct, mockVariant, 1, product.inventario)
      .then(() => {
        toast.success('¡Producto seleccionado exitosamente! 🎁', {
          description: `${product.nombre} fue agregado a tu carrito`,
          style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#14532d' },
          descriptionStyle: { color: '#15803d' },
        });
      })
      .catch((error) => {
        toast.error('No se pudo agregar al carrito', {
          description: error.message,
        });
      });
  };

  return (
    <>
      <Helmet>
        <title>Productos - Dulce Regalo</title>
        <meta name="description" content="Explora nuestra colección completa de regalos especiales. Osos de peluche, detalles personalizados y más." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero section de la página de productos */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Nuestros Productos
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encuentra el regalo perfecto entre nuestra selección especial
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenido principal con filtros y grid de productos */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Barra de búsqueda y botón de filtros móvil */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar onSearch={setSearchTerm} placeholder="Buscar productos..." />
              </div>

              {/* Botón de filtros para móvil (abre el Sheet) */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <CategoryFilter
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onCategoryChange={setSelectedCategories}
                    />
                    <PriceFilter onPriceChange={setPriceRange} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Layout con sidebar de filtros y grid de productos */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar de filtros (solo visible en desktop) */}
              <aside className="hidden lg:block space-y-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                />
                <PriceFilter onPriceChange={setPriceRange} />
              </aside>

              {/* Grid de productos */}
              <div className="lg:col-span-3">
                {/* Contador de resultados */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                  </p>
                </div>

                {/* Grid de productos: responsive 1-2-3 columnas */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <SlidersHorizontal className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No se encontraron productos
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Intenta ajustar los filtros o la búsqueda
                    </p>
                    <Button onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([priceRange[0], priceRange[1]]);
                      setSearchTerm('');
                    }} variant="outline">
                      Limpiar filtros
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;
