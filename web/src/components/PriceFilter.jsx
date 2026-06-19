import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Componente de filtro por rango de precio con slider y inputs
const PriceFilter = ({ minPrice = 0, maxPrice = 100, onPriceChange }) => {
  // Estado local para los valores del rango de precio
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  
  // Estado para los inputs manuales
  const [minInput, setMinInput] = useState(minPrice.toString());
  const [maxInput, setMaxInput] = useState(maxPrice.toString());

  // Actualizar inputs cuando cambia el slider
  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  // Manejar cambio en el slider
  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  // Manejar cambio en input mínimo
  const handleMinInputChange = (e) => {
    const value = e.target.value;
    setMinInput(value);
    
    // Validar y actualizar el rango si el valor es válido
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= minPrice && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  // Manejar cambio en input máximo
  const handleMaxInputChange = (e) => {
    const value = e.target.value;
    setMaxInput(value);
    
    // Validar y actualizar el rango si el valor es válido
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue <= maxPrice && numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  // Aplicar el filtro de precio
  const handleApplyFilter = () => {
    onPriceChange(priceRange);
  };

  // Resetear el filtro a valores por defecto
  const handleReset = () => {
    setPriceRange([minPrice, maxPrice]);
    setMinInput(minPrice.toString());
    setMaxInput(maxPrice.toString());
    onPriceChange([minPrice, maxPrice]);
  };

  // Formatear precio a moneda
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    // Contenedor principal del filtro de precio
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      {/* Título del filtro */}
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Rango de Precio</h3>
      
      {/* Slider de rango de precio */}
      <div className="mb-6 px-2">
        <Slider
          value={priceRange}
          onValueChange={handleSliderChange}
          min={minPrice}
          max={maxPrice}
          step={1}
          className="w-full"
        />
        
        {/* Mostrar valores actuales del rango */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
      
      {/* Inputs manuales para precio mínimo y máximo */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Input de precio mínimo */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Mínimo
          </label>
          <Input
            type="number"
            value={minInput}
            onChange={handleMinInputChange}
            min={minPrice}
            max={priceRange[1]}
            className="text-sm"
          />
        </div>
        
        {/* Input de precio máximo */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Máximo
          </label>
          <Input
            type="number"
            value={maxInput}
            onChange={handleMaxInputChange}
            min={priceRange[0]}
            max={maxPrice}
            className="text-sm"
          />
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex gap-2">
        {/* Botón para aplicar filtro */}
        <Button
          onClick={handleApplyFilter}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Aplicar
        </Button>
        
        {/* Botón para resetear filtro */}
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
        >
          Resetear
        </Button>
      </div>
    </div>
  );
};

export default PriceFilter;