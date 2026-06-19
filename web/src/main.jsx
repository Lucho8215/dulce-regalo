// Importamos React (necesario para JSX)
import React from 'react';
// Importamos ReactDOM para renderizar la app en el DOM
import ReactDOM from 'react-dom/client';
// Importamos el componente principal App
import App from '@/App';
// Importamos los estilos globales de Tailwind CSS
import '@/index.css';
// Importamos el proveedor del carrito de compras (Context)
import { CartProvider } from '@/hooks/useCart';
// Importamos el componente de notificaciones toast
import { Toaster } from '@/components/ui/sonner';

// Creamos el root de React 18 y renderizamos la aplicación
// El CartProvider envuelve toda la app para compartir el estado del carrito
// El Toaster muestra notificaciones emergentes en cualquier parte de la app
ReactDOM.createRoot(document.getElementById('root')).render(
	<CartProvider>
		<App />
		<Toaster />
	</CartProvider>
);