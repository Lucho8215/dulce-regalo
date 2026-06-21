// Importamos React para crear el componente
import React from 'react';
// Importamos motion de framer-motion para animaciones
import { motion } from 'framer-motion';
// Importamos iconos de lucide-react
import { ShoppingCart, Heart } from 'lucide-react';
// Importamos el componente Button desde nuestra librería UI
import { Button } from '@/components/ui/button';
// Importamos Link para navegación a detalle del producto
import { Link } from 'react-router-dom';

// Componente de tarjeta de producto con efectos hover y animaciones
const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  // Maneja el clic en agregar al carrito
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevenir navegación del Link
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    // Contenedor animado con motion de Framer Motion
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      {/* Link que envuelve toda la tarjeta para navegar al detalle */}
      <Link to={`/product/${product.id}`} className="block">
        {/* Tarjeta con efectos hover personalizados */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border">
          {/* Contenedor de imagen con overlay en hover */}
          <div className="relative overflow-hidden aspect-square">
            {(product.imagen_url || product.imagen || product.image) ? (
              <img
                src={product.imagen_url || product.imagen || product.image}
                alt={product.nombre || product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
            )}
            
            {/* Badge "Destacado" si el producto lo es */}
            {product.destacado && (
              <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Destacado
              </div>
            )}
            
            {/* Overlay con botones que aparece en hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
              {/* Botón de favoritos (placeholder) */}
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/90 hover:bg-white text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  // Funcionalidad de favoritos - pendiente implementar
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
              
              {/* Botón de agregar al carrito */}
              <Button
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Contenido de la tarjeta: nombre, descripción, precio, stock */}
          <div className="p-5">
            {/* Categoría en mayúsculas y pequeña */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {product.categoria || product.category}
            </p>
            
            {/* Nombre del producto */}
            <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.nombre || product.title}
            </h3>
            
            {/* Descripción corta (máximo 2 líneas) */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {product.descripcion || product.description}
            </p>
            
            {/* Contenedor de precio y stock disponible */}
            <div className="flex items-center justify-between">
              {/* Precio en rosa destacado */}
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.precio)}
              </span>
              
              {/* Indicador de stock */}
              {(product.inventario || product.inventory_quantity) > 0 ? (
                <span className="text-xs text-muted-foreground">
                  {product.inventario || product.inventory_quantity} disponibles
                </span>
              ) : (
                <span className="text-xs text-destructive font-medium">
                  Agotado
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;