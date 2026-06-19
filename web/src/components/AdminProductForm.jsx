import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

// Componente de formulario para crear/editar productos en el panel admin
const AdminProductForm = ({ product, onSubmit, onCancel }) => {
  // Estado del formulario con valores iniciales
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen: '',
    inventario: '',
    destacado: false
  });

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio?.toString() || '',
        categoria: product.categoria || '',
        imagen: product.imagen || '',
        inventario: product.inventario?.toString() || '',
        destacado: product.destacado || false
      });
    }
  }, [product]);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambio en el select de categoría
  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      categoria: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.precio || !formData.categoria) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Convertir precio e inventario a números
    const productData = {
      ...formData,
      precio: parseFloat(formData.precio),
      inventario: parseInt(formData.inventario) || 0,
      id: product?.id || `prod_${Date.now()}` // Generar ID si es nuevo producto
    };
    
    // Llamar a la función de envío
    onSubmit(productData);
  };

  // Categorías disponibles
  const categories = [
    'Osos',
    'Regalos Personalizados',
    'Accesorios',
    'Decoraciones',
    'Servicios'
  ];

  return (
    // Formulario principal
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Encabezado del formulario */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-card-foreground">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        {/* Botón de cerrar */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Campo: Nombre del producto */}
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-sm font-medium text-card-foreground">
          Nombre del Producto *
        </Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Oso de Peluche Romántico"
          required
          className="bg-background text-foreground"
        />
      </div>
      
      {/* Campo: Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion" className="text-sm font-medium text-card-foreground">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe el producto..."
          rows={4}
          className="bg-background text-foreground resize-none"
        />
      </div>
      
      {/* Fila: Precio y Categoría */}
      <div className="grid grid-cols-2 gap-4">
        {/* Campo: Precio */}
        <div className="space-y-2">
          <Label htmlFor="precio" className="text-sm font-medium text-card-foreground">
            Precio (USD) *
          </Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={handleChange}
            placeholder="29.99"
            required
            className="bg-background text-foreground"
          />
        </div>
        
        {/* Campo: Categoría */}
        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-medium text-card-foreground">
            Categoría *
          </Label>
          <Select value={formData.categoria} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Campo: URL de imagen */}
      <div className="space-y-2">
        <Label htmlFor="imagen" className="text-sm font-medium text-card-foreground">
          URL de Imagen
        </Label>
        <Input
          id="imagen"
          name="imagen"
          type="url"
          value={formData.imagen}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          className="bg-background text-foreground"
        />
        {/* Vista previa de la imagen */}
        {formData.imagen && (
          <div className="mt-2 rounded-lg overflow-hidden border border-border">
            <img
              src={formData.imagen}
              alt="Vista previa"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      
      {/* Campo: Inventario */}
      <div className="space-y-2">
        <Label htmlFor="inventario" className="text-sm font-medium text-card-foreground">
          Inventario Disponible
        </Label>
        <Input
          id="inventario"
          name="inventario"
          type="number"
          min="0"
          value={formData.inventario}
          onChange={handleChange}
          placeholder="25"
          className="bg-background text-foreground"
        />
      </div>
      
      {/* Checkbox: Producto destacado */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="destacado"
          name="destacado"
          checked={formData.destacado}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <Label htmlFor="destacado" className="text-sm font-medium text-card-foreground cursor-pointer">
          Marcar como producto destacado
        </Label>
      </div>
      
      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        {/* Botón de guardar */}
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
        
        {/* Botón de cancelar */}
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default AdminProductForm;