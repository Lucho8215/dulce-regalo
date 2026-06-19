// Importamos React y sus hooks
import React, { useState } from 'react';
// Importamos componentes UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// Importamos iconos
import { Package, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
// Importamos motion para animaciones
import { motion } from 'framer-motion';

// Componente de tabla de gestión de inventario para el panel de administración
const AdminInventoryTable = ({ products, onUpdateInventory }) => {
  // Estado para el ID del producto que se está editando
  const [editingId, setEditingId] = useState(null);
  // Estado para el nuevo valor de inventario
  const [newInventory, setNewInventory] = useState('');

  // Inicia la edición de inventario para un producto
  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setNewInventory(product.inventario?.toString() || '0');
  };

  // Cancela la edición actual
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewInventory('');
  };

  // Guarda el nuevo valor de inventario
  const handleSaveInventory = (productId) => {
    const inventory = parseInt(newInventory);
    
    // Validamos que sea un número válido
    if (isNaN(inventory) || inventory < 0) {
      alert('Por favor ingresa un número válido');
      return;
    }
    
    // Llamamos a la función de actualización del padre
    onUpdateInventory(productId, inventory);
    
    // Limpiamos el estado de edición
    setEditingId(null);
    setNewInventory('');
  };

  // Determina el estado visual del stock (agotado, bajo, disponible)
  const getStockStatus = (inventory) => {
    if (inventory === 0) {
      return { label: 'Agotado', variant: 'destructive', icon: AlertTriangle };
    } else if (inventory < 10) {
      return { label: 'Bajo', variant: 'secondary', icon: AlertTriangle };
    } else {
      return { label: 'Disponible', variant: 'default', icon: CheckCircle };
    }
  };

  // Formatea precios como moneda USD
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    // Contenedor principal de la tabla con estilo de tarjeta
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Encabezado de la sección */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-card-foreground">Gestión de Inventario</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Administra el stock disponible de cada producto
        </p>
      </div>
      
      {/* Tabla de inventario con scroll horizontal en móvil */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Imagen</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Inventario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => {
              // Obtenemos el estado del stock
              const stockStatus = getStockStatus(product.inventario);
              const StatusIcon = stockStatus.icon;
              const isEditing = editingId === product.id;
              
              return (
                // Fila animada de producto
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {/* Imagen del producto */}
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  
                  {/* Nombre del producto */}
                  <TableCell className="font-medium text-card-foreground">
                    {product.nombre}
                  </TableCell>
                  
                  {/* Categoría */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {product.categoria}
                    </span>
                  </TableCell>
                  
                  {/* Precio */}
                  <TableCell className="text-right font-semibold text-card-foreground">
                    {formatPrice(product.precio)}
                  </TableCell>
                  
                  {/* Estado del stock con badge */}
                  <TableCell className="text-center">
                    <Badge variant={stockStatus.variant} className="flex items-center gap-1 w-fit mx-auto">
                      <StatusIcon className="w-3 h-3" />
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  
                  {/* Inventario (editable) */}
                  <TableCell className="text-center">
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        value={newInventory}
                        onChange={(e) => setNewInventory(e.target.value)}
                        className="w-20 mx-auto text-center bg-background text-foreground"
                        autoFocus
                      />
                    ) : (
                      <span className="text-lg font-bold text-card-foreground">
                        {product.inventario}
                      </span>
                    )}
                  </TableCell>
                  
                  {/* Botones de acción */}
                  <TableCell className="text-right">
                    {isEditing ? (
                      // Modo edición: botones guardar y cancelar
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => handleSaveInventory(product.id)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      // Modo vista: botón editar
                      <Button size="sm" variant="ghost" onClick={() => handleStartEdit(product)} className="text-muted-foreground hover:text-primary">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Mensaje cuando no hay productos */}
      {products.length === 0 && (
        <div className="p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay productos en el inventario</p>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryTable;