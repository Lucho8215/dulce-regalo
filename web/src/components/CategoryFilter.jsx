import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

// Componente de filtro por categoría con selección múltiple
const CategoryFilter = ({ categories, selectedCategories, onCategoryChange }) => {
  // Manejar clic en una categoría
  const handleCategoryClick = (category) => {
    // Si la categoría ya está seleccionada, la removemos
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(cat => cat !== category));
    } else {
      // Si no está seleccionada, la agregamos
      onCategoryChange([...selectedCategories, category]);
    }
  };

  // Limpiar todos los filtros de categoría
  const handleClearAll = () => {
    onCategoryChange([]);
  };

  return (
    // Contenedor principal del filtro
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      {/* Encabezado con título y botón de limpiar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Categorías</h3>
        
        {/* Botón para limpiar filtros (solo visible si hay categorías seleccionadas) */}
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Limpiar
          </Button>
        )}
      </div>
      
      {/* Lista de categorías disponibles */}
      <div className="space-y-2">
        {categories.map((category, index) => {
          // Verificar si la categoría está seleccionada
          const isSelected = selectedCategories.includes(category);
          
          return (
            // Botón de categoría con animación
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleCategoryClick(category)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-200 text-left
                ${isSelected 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {/* Nombre de la categoría */}
              <span className="font-medium">{category}</span>
              
              {/* Icono de check si está seleccionada */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Contador de categorías seleccionadas */}
      {selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            {selectedCategories.length} {selectedCategories.length === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryFilter;