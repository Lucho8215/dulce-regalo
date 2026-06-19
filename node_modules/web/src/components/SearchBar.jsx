// Importamos React y useState para manejar el estado del input
import React, { useState } from 'react';
// Importamos iconos de lucide-react
import { Search, X } from 'lucide-react';
// Importamos componentes UI
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Componente de barra de búsqueda con funcionalidad de filtrado en tiempo real
const SearchBar = ({ onSearch, placeholder = "Buscar productos..." }) => {
  // Estado local para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Maneja el cambio en el input de búsqueda
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Llamamos a onSearch en tiempo real (mientras el usuario escribe)
    onSearch(value);
  };

  // Limpia el campo de búsqueda
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  // Maneja el envío del formulario (prevenir recarga de página)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    // Formulario de búsqueda
    <form onSubmit={handleSubmit} className="w-full">
      {/* Contenedor del input con iconos a la izquierda y derecha */}
      <div className="relative">
        {/* Icono de búsqueda a la izquierda (no clickeable) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        
        {/* Input de búsqueda con padding para los iconos */}
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-6 text-base rounded-xl border-2 border-border focus:border-primary transition-colors bg-background text-foreground"
        />
        
        {/* Botón de limpiar (solo visible cuando hay texto en el input) */}
        {searchTerm && (
          <Button
            type="button"
            onClick={handleClear}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {/* Texto de ayuda que muestra lo que se está buscando */}
      {searchTerm && (
        <p className="text-xs text-muted-foreground mt-2 ml-1">
          Buscando: <span className="font-medium text-foreground">{searchTerm}</span>
        </p>
      )}
    </form>
  );
};

export default SearchBar;