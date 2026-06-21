import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = ['Osos', 'Regalos Personalizados', 'Accesorios', 'Decoraciones', 'Servicios'];

const AdminProductForm = ({ product, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    inventario: '',
    destacado: false,
    imagen_url: '',
    imagen_path: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio?.toString() || '',
        categoria: product.categoria || '',
        inventario: product.inventario?.toString() || '',
        destacado: product.destacado || false,
        imagen_url: product.imagen_url || '',
        imagen_path: product.imagen_path || '',
      });
      setPreviewUrl(product.imagen_url || '');
    }
  }, [product]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar preview inmediatamente
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setPendingFile(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, categoria: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio || !formData.categoria) {
      toast({ title: 'Campos requeridos', description: 'Nombre, precio y categoría son obligatorios.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);

    try {
      let imagen_url = formData.imagen_url;
      let imagen_path = formData.imagen_path;

      // Si hay un archivo pendiente, subirlo ahora
      if (pendingFile) {
        const uploaded = await uploadImage(pendingFile);
        imagen_url = uploaded.url;
        imagen_path = uploaded.path;
      }

      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseInt(formData.precio),
        categoria: formData.categoria,
        inventario: parseInt(formData.inventario) || 0,
        destacado: formData.destacado,
        imagen_url,
        imagen_path,
        // Si hubo cambio de imagen, pasar la path vieja para que api.js la elimine
        oldImagePath: pendingFile && product?.imagen_path ? product.imagen_path : undefined,
      };

      onSubmit(productData);
    } catch (error) {
      toast({ title: 'Error subiendo imagen', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-card-foreground">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Producto *</Label>
        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Oso de Peluche Romántico" required className="bg-background text-foreground" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Describe el producto..." rows={4} className="bg-background text-foreground resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="precio">Precio (COP) *</Label>
          <Input id="precio" name="precio" type="number" min="0" value={formData.precio} onChange={handleChange} placeholder="29990" required className="bg-background text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría *</Label>
          <Select value={formData.categoria} onValueChange={handleCategoryChange}>
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Imagen */}
      <div className="space-y-3">
        <Label>Imagen del Producto</Label>

        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            id="imagen-file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="imagen-file" className="cursor-pointer flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {isUploading ? 'Subiendo imagen...' : 'Haz clic para seleccionar imagen'}
            </span>
            <span className="text-xs text-muted-foreground">JPG, PNG, WEBP hasta 5MB</span>
          </label>
        </div>

        {previewUrl && (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={previewUrl} alt="Vista previa" className="w-full h-48 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            <button
              type="button"
              onClick={() => { setPreviewUrl(''); setPendingFile(null); setFormData((p) => ({ ...p, imagen_url: '', imagen_path: '' })); }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inventario">Inventario Disponible</Label>
        <Input id="inventario" name="inventario" type="number" min="0" value={formData.inventario} onChange={handleChange} placeholder="25" className="bg-background text-foreground" />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="destacado"
          name="destacado"
          checked={formData.destacado}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <Label htmlFor="destacado" className="cursor-pointer">Marcar como producto destacado</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isUploading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
          {isUploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Subiendo...</>
          ) : (
            product ? 'Actualizar Producto' : 'Crear Producto'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
      </div>
    </form>
  );
};

export default AdminProductForm;
