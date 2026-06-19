import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = ({ onSearch, placeholder = "Buscar productos..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleSubmit = () => {
    onSearch(searchTerm);
  };

  return (
    <div
      className="w-full"
      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
    >
      {/* Contenedor del input con iconos */}
      <div className="relative">
        {/* Icono de búsqueda a la izquierda */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input de búsqueda */}
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-6 text-base rounded-xl border-2 border-border focus:border-primary transition-colors bg-background text-foreground"
        />

        {/* Botón de limpiar (solo visible cuando hay texto) */}
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

      {/* Texto de ayuda debajo del input */}
      {searchTerm && (
        <p className="text-xs text-muted-foreground mt-2 ml-1">
          Buscando: <span className="font-medium text-foreground">{searchTerm}</span>
        </p>
      )}
    </div>
  );
};

export default SearchBar;