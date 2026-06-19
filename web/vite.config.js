// Configuración de Vite para el proyecto Dulce Regalo
// Define alias de importación y opciones de servidor de desarrollo

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias @ apunta a la carpeta src para importaciones limpias
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Escucha en todas las interfaces de red
    port: 3000, // Puerto del servidor de desarrollo
  },
})