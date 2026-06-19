import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import PriceFilter from '@/components/PriceFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import productsData from '@/data/products.json';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

// Página de listado de productos con filtros y búsqueda
const ProductsPage = () => {
  // Hook del carrito
  const { addToCart } = useCart();
  // Hook de notificaciones
  const { toast } = useToast();
  
  // Estado de productos y filtros
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Cargar productos y categorías al montar
  useEffect(() => {
    const allProducts = productsData.products;
    setProducts(allProducts);
    setFilteredProducts(allProducts);
    
    // Extraer categorías únicas
    const uniqueCategories = [...new Set(allProducts.map(p => p.categoria))];
    setCategories(uniqueCategories);
    
    // Calcular rango de precios
    const prices = allProducts.map(p => p.precio);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    setPriceRange([minPrice, maxPrice]);
  }, []);

  // Aplicar filtros cuando cambian los criterios
  useEffect(() => {
    let filtered = [...products];
    
    // Filtrar por categorías seleccionadas
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.categoria));
    }
    
    // Filtrar por rango de precio
    filtered = filtered.filter(p => p.precio >= priceRange[0] && p.precio <= priceRange[1]);
    
    // Filtrar por término de búsqueda
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

  // Manejar agregar producto al carrito
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
      image: product.imagen
    };

    addToCart(mockProduct, mockVariant, 1, product.inventario)
      .then(() => {
        toast({
          title: 'Producto agregado',
          description: `${product.nombre} se agregó al carrito`,
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

  // Calcular precios mínimo y máximo para el filtro
  const minPrice = products.length > 0 ? Math.floor(Math.min(...products.map(p => p.precio))) : 0;
  const maxPrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.precio))) : 100;

  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Productos - Dulce Regalo</title>
        <meta name="description" content="Explora nuestra colección completa de regalos especiales. Osos de peluche, detalles personalizados y más." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero section de productos */}
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

        {/* Contenido principal */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Barra de búsqueda y botón de filtros móvil */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar onSearch={setSearchTerm} placeholder="Buscar productos..." />
              </div>
              
              {/* Botón de filtros para móvil */}
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
                    <PriceFilter
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      onPriceChange={setPriceRange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Layout con sidebar de filtros y grid de productos */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar de filtros (desktop) */}
              <aside className="hidden lg:block space-y-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                />
                <PriceFilter
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={setPriceRange}
                />
              </aside>

              {/* Grid de productos */}
              <div className="lg:col-span-3">
                {/* Contador de resultados */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                  </p>
                </div>

                {/* Grid de productos */}
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
                  // Estado vacío cuando no hay resultados
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
                    <Button
                      onClick={() => {
                        setSelectedCategories([]);
                        setPriceRange([minPrice, maxPrice]);
                        setSearchTerm('');
                      }}
                      variant="outline"
                    >
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