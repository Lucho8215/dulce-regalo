import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import PriceFilter from '@/components/PriceFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProducts, getCatalogs } from '@/lib/api';

const ProductsPage = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(searchParams.get('catalogo') || '');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCatalogs()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setFilteredProducts(prods);
        setCatalogs(cats);
        const uniqueCategories = [...new Set(prods.map((p) => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
        const prices = prods.map((p) => p.precio);
        if (prices.length) {
          setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products];

    if (selectedCatalog) {
      const catalog = catalogs.find((c) => c.id === selectedCatalog);
      if (catalog) {
        const ids = new Set(catalog.catalog_products.map((cp) => cp.product?.id).filter(Boolean));
        filtered = filtered.filter((p) => ids.has(p.id));
      }
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.categoria));
    }

    filtered = filtered.filter((p) => p.precio >= priceRange[0] && p.precio <= priceRange[1]);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(term) ||
          p.descripcion?.toLowerCase().includes(term) ||
          p.categoria?.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [products, catalogs, selectedCategories, selectedCatalog, priceRange, searchTerm]);

  const handleSelectCatalog = (id) => {
    const newId = id === selectedCatalog ? '' : id;
    setSelectedCatalog(newId);
    if (newId) {
      setSearchParams({ catalogo: newId });
    } else {
      setSearchParams({});
    }
  };

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
    const prod = { id: product.id, title: product.nombre, image: product.imagen_url };

    addToCart(prod, variant, 1, product.inventario)
      .then(() => toast({ title: 'Producto agregado', description: `${product.nombre} se agregó al carrito` }))
      .catch((error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }));
  };

  const minPrice = products.length ? Math.floor(Math.min(...products.map((p) => p.precio))) : 0;
  const maxPrice = products.length ? Math.ceil(Math.max(...products.map((p) => p.precio))) : 500000;

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedCatalog('');
    setPriceRange([minPrice, maxPrice]);
    setSearchTerm('');
    setSearchParams({});
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Filtro por catálogo */}
      {catalogs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Catálogos
          </h3>
          <div className="space-y-2">
            {catalogs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCatalog(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCatalog === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                {cat.nombre}
                <span className="ml-1 text-xs opacity-70">
                  ({cat.catalog_products?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
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
  );

  return (
    <>
      <Helmet>
        <title>Productos - Dulce Regalo</title>
        <meta name="description" content="Explora nuestra colección completa de regalos especiales." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Nuestros Productos</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encuentra el regalo perfecto entre nuestra selección especial
              </p>
              {selectedCatalog && catalogs.find((c) => c.id === selectedCatalog) && (
                <Badge className="mt-4 bg-primary text-primary-foreground px-4 py-1 text-sm">
                  Catálogo: {catalogs.find((c) => c.id === selectedCatalog)?.nombre}
                </Badge>
              )}
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar onSearch={setSearchTerm} placeholder="Buscar productos..." />
              </div>
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
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="hidden lg:block space-y-6">
                <FilterSidebar />
              </aside>

              <div className="lg:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Cargando...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="bg-muted animate-pulse rounded-2xl h-72" />
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
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
                    <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron productos</h3>
                    <p className="text-muted-foreground mb-6">Intenta ajustar los filtros o la búsqueda</p>
                    <Button onClick={resetFilters} variant="outline">Limpiar filtros</Button>
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
