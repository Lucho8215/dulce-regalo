import React, { useState } from 'react';

// Rangos de precio predefinidos en COP
// Para agregar/cambiar rangos → editar este array
const RANGOS = [
  { label: 'Todos',              min: 0,      max: Infinity },
  { label: 'Menos de $50.000',  min: 0,      max: 50000    },
  { label: '$50.000 – $100.000',min: 50000,  max: 100000   },
  { label: '$100.000 – $180.000',min: 100000, max: 180000  },
  { label: '$180.000 – $300.000',min: 180000, max: 300000  },
];

// Componente de filtro de precio por botones de selección
// Props:
//   onPriceChange → función que recibe [min, max] cuando cambia la selección
const PriceFilter = ({ onPriceChange }) => {
  const [activo, setActivo] = useState(0); // índice del rango seleccionado

  const handleSelect = (idx) => {
    setActivo(idx);
    const { min, max } = RANGOS[idx];
    // Infinity se maneja en ProductsPage como sin límite superior
    onPriceChange([min, max === Infinity ? 9999999 : max]);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Precio</h3>

      <div className="flex flex-col gap-2">
        {RANGOS.map((rango, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
              activo === idx
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            {rango.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;
