import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, ShoppingBag, AlertCircle, BookOpen, LogOut, Loader2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminProductForm from '@/components/AdminProductForm';
import AdminInventoryTable from '@/components/AdminInventoryTable';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getAllCatalogsAdmin,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  getOrders,
  updateOrderStatus,
} from '@/lib/api';

const formatCOP = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

const ORDER_STATES = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

const AdminPage = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Products
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);

  // Catalogs
  const [catalogs, setCatalogs] = useState([]);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [deleteCatalogDialog, setDeleteCatalogDialog] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ nombre: '', descripcion: '', productIds: [] });
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [savingCatalog, setSavingCatalog] = useState(false);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    loadProducts();
    loadCatalogs();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch {
      toast({ title: 'Error', description: 'No se pudieron cargar los productos', variant: 'destructive' });
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadCatalogs = async () => {
    try {
      const data = await getAllCatalogsAdmin();
      setCatalogs(data);
    } catch {
      toast({ title: 'Error', description: 'No se pudieron cargar los catálogos', variant: 'destructive' });
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      toast({ title: 'Error', description: 'No se pudieron cargar las órdenes', variant: 'destructive' });
    } finally {
      setLoadingOrders(false);
    }
  };

  // ── Products CRUD ──────────────────────────────────────────────────────────

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    setSavingProduct(true);
    try {
      if (selectedProduct) {
        const updated = await updateProduct(selectedProduct.id, {
          ...productData,
          oldImagePath: productData.oldImagePath || selectedProduct.imagen_path,
        });
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast({ title: 'Producto actualizado', description: 'El producto se actualizó correctamente' });
      } else {
        const created = await createProduct(productData);
        setProducts((prev) => [created, ...prev]);
        toast({ title: 'Producto creado', description: 'El producto se creó correctamente' });
      }
      setIsProductModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProductClick = (productId) => {
    setProductToDelete(productId);
    setDeleteProductDialog(true);
  };

  const handleConfirmDeleteProduct = async () => {
    const product = products.find((p) => p.id === productToDelete);
    try {
      await deleteProduct(productToDelete, product?.imagen_path);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
      toast({ title: 'Producto eliminado', description: 'El producto se eliminó correctamente' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteProductDialog(false);
      setProductToDelete(null);
    }
  };

  const handleUpdateInventory = async (productId, newInventory) => {
    try {
      await updateInventory(productId, newInventory);
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, inventario: newInventory } : p)));
      toast({ title: 'Inventario actualizado', description: 'El inventario se actualizó correctamente' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // ── Catalogs CRUD ──────────────────────────────────────────────────────────

  const openCreateCatalog = () => {
    setSelectedCatalog(null);
    setCatalogForm({ nombre: '', descripcion: '', productIds: [] });
    setIsCatalogModalOpen(true);
  };

  const openEditCatalog = (catalog) => {
    setSelectedCatalog(catalog);
    setCatalogForm({
      nombre: catalog.nombre,
      descripcion: catalog.descripcion || '',
      productIds: catalog.catalog_products?.map((cp) => cp.product?.id).filter(Boolean) || [],
    });
    setIsCatalogModalOpen(true);
  };

  const toggleProductInCatalog = (productId) => {
    setCatalogForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const handleSaveCatalog = async (e) => {
    e.preventDefault();
    if (!catalogForm.nombre) {
      toast({ title: 'Nombre requerido', description: 'El catálogo debe tener un nombre.', variant: 'destructive' });
      return;
    }
    setSavingCatalog(true);
    try {
      if (selectedCatalog) {
        await updateCatalog(selectedCatalog.id, catalogForm);
        toast({ title: 'Catálogo actualizado' });
      } else {
        await createCatalog(catalogForm);
        toast({ title: 'Catálogo creado' });
      }
      await loadCatalogs();
      setIsCatalogModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSavingCatalog(false);
    }
  };

  const handleDeleteCatalogClick = (id) => {
    setCatalogToDelete(id);
    setDeleteCatalogDialog(true);
  };

  const handleConfirmDeleteCatalog = async () => {
    try {
      await deleteCatalog(catalogToDelete);
      setCatalogs((prev) => prev.filter((c) => c.id !== catalogToDelete));
      toast({ title: 'Catálogo eliminado' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteCatalogDialog(false);
      setCatalogToDelete(null);
    }
  };

  // ── Orders ─────────────────────────────────────────────────────────────────

  const handleOrderStatusChange = async (orderId, estado) => {
    try {
      await updateOrderStatus(orderId, estado);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, estado } : o)));
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // ── Auth ───────────────────────────────────────────────────────────────────

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const activeProducts = products.filter((p) => p.activo !== false);

  return (
    <>
      <Helmet>
        <title>PANEL DE ADMINISTRACIÓN - Dulce Regalo</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">PANEL DE ADMINISTRACIÓN</h1>
              <p className="text-muted-foreground">Gestiona productos, catálogos, órdenes e inventario</p>
            </motion.div>
            <Button variant="outline" onClick={handleSignOut} className="hidden sm:flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="products" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Productos</span>
                </TabsTrigger>
                <TabsTrigger value="catalogs" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Catálogos</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Órdenes</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Inventario</span>
                </TabsTrigger>
              </TabsList>

              {/* ── PRODUCTOS ── */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Gestión de Productos</h2>
                  <Button onClick={handleCreateProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>

                {loadingProducts ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Imagen</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="text-center">Stock</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeProducts.map((product, index) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <TableCell>
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                {product.imagen_url ? (
                                  <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sin img</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-card-foreground">{product.nombre}</TableCell>
                            <TableCell><Badge variant="outline">{product.categoria}</Badge></TableCell>
                            <TableCell className="text-right font-semibold text-card-foreground">{formatCOP(product.precio)}</TableCell>
                            <TableCell className="text-center text-card-foreground">{product.inventario}</TableCell>
                            <TableCell className="text-center">
                              {product.destacado
                                ? <Badge className="bg-accent text-accent-foreground">Destacado</Badge>
                                : <Badge variant="secondary">Normal</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)} className="text-primary hover:text-primary/90 hover:bg-primary/10">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteProductClick(product.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                    {activeProducts.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>No hay productos. Crea el primero.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ── CATÁLOGOS ── */}
              <TabsContent value="catalogs" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Catálogos</h2>
                  <Button onClick={openCreateCatalog} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Catálogo
                  </Button>
                </div>

                {loadingCatalogs ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : catalogs.length === 0 ? (
                  <div className="bg-card rounded-xl p-12 text-center border border-border">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay catálogos. Crea uno para agrupar productos.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalogs.map((catalog) => {
                      const productCount = catalog.catalog_products?.length || 0;
                      const coverImage = catalog.catalog_products?.[0]?.product?.imagen_url;
                      return (
                        <motion.div
                          key={catalog.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="h-32 bg-muted overflow-hidden">
                            {coverImage ? (
                              <img src={coverImage} alt={catalog.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-card-foreground mb-1">{catalog.nombre}</h3>
                            {catalog.descripcion && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{catalog.descripcion}</p>
                            )}
                            <Badge variant="secondary" className="mb-3">{productCount} {productCount === 1 ? 'producto' : 'productos'}</Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditCatalog(catalog)}>
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteCatalogClick(catalog.id)} className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* ── ÓRDENES ── */}
              <TabsContent value="orders" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Órdenes</h2>

                {loadingOrders ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-card rounded-xl p-12 text-center border border-border">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay órdenes registradas</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Items</TableHead>
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
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}…</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-card-foreground">{order.cliente_nombre}</p>
                                <p className="text-xs text-muted-foreground">{order.cliente_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{formatDate(order.created_at)}</TableCell>
                            <TableCell className="text-center text-sm">{order.order_items?.length || 0}</TableCell>
                            <TableCell className="text-right font-semibold text-card-foreground">{formatCOP(order.total)}</TableCell>
                            <TableCell className="text-center">
                              <Select value={order.estado} onValueChange={(val) => handleOrderStatusChange(order.id, val)}>
                                <SelectTrigger className="h-8 text-xs w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATES.map((s) => (
                                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* ── INVENTARIO ── */}
              <TabsContent value="inventory">
                <AdminInventoryTable products={activeProducts} onUpdateInventory={handleUpdateInventory} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Modal producto */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <AdminProductForm
              product={selectedProduct}
              onSubmit={handleSaveProduct}
              onCancel={() => setIsProductModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Modal catálogo */}
        <Dialog open={isCatalogModalOpen} onOpenChange={setIsCatalogModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCatalog ? 'Editar Catálogo' : 'Nuevo Catálogo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveCatalog} className="space-y-5 mt-2">
              <div className="space-y-2">
                <Label htmlFor="cat-nombre">Nombre del catálogo *</Label>
                <Input
                  id="cat-nombre"
                  value={catalogForm.nombre}
                  onChange={(e) => setCatalogForm((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="Ej: San Valentín 2025"
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-desc">Descripción (opcional)</Label>
                <Textarea
                  id="cat-desc"
                  value={catalogForm.descripcion}
                  onChange={(e) => setCatalogForm((p) => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Descripción del catálogo..."
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Productos del catálogo</Label>
                <p className="text-xs text-muted-foreground">{catalogForm.productIds.length} seleccionados</p>
                <div className="border border-border rounded-xl max-h-60 overflow-y-auto divide-y divide-border">
                  {activeProducts.map((p) => {
                    const isSelected = catalogForm.productIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProductInCatalog(p.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}
                      >
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                          : <Square className="w-4 h-4 text-muted-foreground shrink-0" />}
                        {p.imagen_url && (
                          <img src={p.imagen_url} alt={p.nombre} className="w-8 h-8 rounded object-cover shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                          <p className="text-xs text-muted-foreground">{formatCOP(p.precio)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={savingCatalog} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {savingCatalog ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : selectedCatalog ? 'Actualizar' : 'Crear Catálogo'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCatalogModalOpen(false)} className="flex-1">Cancelar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmar eliminar producto */}
        <AlertDialog open={deleteProductDialog} onOpenChange={setDeleteProductDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
              <AlertDialogDescription>Esta acción no se puede deshacer. El producto quedará inactivo.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDeleteProduct} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirmar eliminar catálogo */}
        <AlertDialog open={deleteCatalogDialog} onOpenChange={setDeleteCatalogDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar catálogo?</AlertDialogTitle>
              <AlertDialogDescription>Se eliminará el catálogo. Los productos no se borran.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDeleteCatalog} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Footer />
      </div>
    </>
  );
};

export default AdminPage;
