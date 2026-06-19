// Importamos React y sus hooks
import React, { useState, useEffect } from 'react';
// Importamos Helmet para meta tags SEO
import { Helmet } from 'react-helmet';
// Importamos motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos
import { Plus, Edit, Trash2, Package, ShoppingBag, AlertCircle } from 'lucide-react';
// Importamos componentes UI
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// Importamos diálogos
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// Importamos componentes propios
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminProductForm from '@/components/AdminProductForm';
import AdminInventoryTable from '@/components/AdminInventoryTable';
// Importamos datos
import productsData from '@/data/products.json';
// Importamos hook toast
import { useToast } from '@/hooks/use-toast';

// Página de administración para gestión de productos, órdenes e inventario
const AdminPage = () => {
  const { toast } = useToast();
  
  // Estados
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // Cargar productos desde localStorage o datos iniciales
  const loadProducts = () => {
    const storedProducts = localStorage.getItem('admin_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(productsData.products);
      localStorage.setItem('admin_products', JSON.stringify(productsData.products));
    }
  };

  // Cargar órdenes desde localStorage
  const loadOrders = () => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  };

  // Abrir modal para crear nuevo producto
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  // Abrir modal para editar producto existente
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Guardar producto (crear o actualizar)
  const handleSaveProduct = (productData) => {
    let updatedProducts;
    
    if (selectedProduct) {
      // Actualizar producto existente
      updatedProducts = products.map(p =>
        p.id === productData.id ? productData : p
      );
      toast({
        title: 'Producto actualizado',
        description: 'El producto se actualizó correctamente',
      });
    } else {
      // Crear nuevo producto
      updatedProducts = [...products, productData];
      toast({
        title: 'Producto creado',
        description: 'El producto se creó correctamente',
      });
    }
    
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  // Confirmar eliminación de producto
  const handleConfirmDelete = () => {
    const updatedProducts = products.filter(p => p.id !== productToDelete);
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    
    toast({
      title: 'Producto eliminado',
      description: 'El producto se eliminó correctamente',
    });
    
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Actualizar inventario de un producto
  const handleUpdateInventory = (productId, newInventory) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, inventario: newInventory } : p
    );
    
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    
    toast({
      title: 'Inventario actualizado',
      description: 'El inventario se actualizó correctamente',
    });
  };

  // Formatear precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Meta tags para SEO */}
      <Helmet>
        <title>Panel de Administración - Dulce Regalo</title>
        <meta name="description" content="Panel de administración para gestionar productos, órdenes e inventario" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground">
                Gestiona productos, órdenes e inventario
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contenido principal con pestañas */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs de navegación */}
            <Tabs defaultValue="products" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Productos
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Órdenes
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Inventario
                </TabsTrigger>
              </TabsList>

              {/* Tab de Productos */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Gestión de Productos</h2>
                  <Button onClick={handleCreateProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Inventario</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={product.imagen}
                                alt={product.nombre}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-card-foreground">
                            {product.nombre}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.categoria}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-card-foreground">
                            {formatPrice(product.precio)}
                          </TableCell>
                          <TableCell className="text-center text-card-foreground">
                            {product.inventario}
                          </TableCell>
                          <TableCell className="text-center">
                            {product.destacado ? (
                              <Badge className="bg-accent text-accent-foreground">Destacado</Badge>
                            ) : (
                              <Badge variant="secondary">Normal</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditProduct(product)}
                                className="text-primary hover:text-primary/90 hover:bg-primary/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(product.id)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Tab de Órdenes */}
              <TabsContent value="orders" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Órdenes Recientes</h2>

                {orders.length === 0 ? (
                  <div className="bg-card rounded-xl p-12 text-center border border-border">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay órdenes registradas</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Orden</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-medium text-card-foreground">
                              {order.id}
                            </TableCell>
                            <TableCell className="text-card-foreground">
                              {order.cliente.nombre}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(order.fecha)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-card-foreground">
                              {formatPrice(order.total)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{order.estado}</Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Tab de Inventario */}
              <TabsContent value="inventory">
                <AdminInventoryTable
                  products={products}
                  onUpdateInventory={handleUpdateInventory}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Modal de formulario de producto */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>
            <AdminProductForm
              product={selectedProduct}
              onSubmit={handleSaveProduct}
              onCancel={() => setIsProductModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Footer />
      </div>
    </>
  );
};

export default AdminPage;