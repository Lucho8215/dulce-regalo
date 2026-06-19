// Importamos hooks de React necesarios para crear el contexto
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Creamos el Contexto del carrito - un espacio para compartir estado entre componentes
const CartContext = createContext();

// Clave para guardar el carrito en localStorage del navegador
const CART_STORAGE_KEY = 'e-commerce-cart';

// Hook personalizado para acceder fácilmente al contexto desde cualquier componente
export const useCart = () => useContext(CartContext);

// Proveedor del carrito - envuelve la app y provee las funciones del carrito
export const CartProvider = ({ children }) => {
  // Estado inicial: obtenemos el carrito guardado o array vacío
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Intentamos leer del localStorage
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      // Si hay error, devolvemos array vacío
      return [];
    }
  });

  // Guardamos el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito - función memoizada para optimizar rendimiento
  const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
    return new Promise((resolve, reject) => {
      // Validación: la variante debe existir
      if (!variant || !variant.id) {
        reject(new Error('Variante de producto inválida o no encontrada.'));
        return;
      }

      // Validación de inventario: no agregar más de lo disponible
      if (variant.manage_inventory) {
        const existingItem = cartItems.find(item => item.variant.id === variant.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if ((currentCartQuantity + quantity) > availableQuantity) {
          const error = new Error(`No hay suficiente stock para ${product.title}. Solo quedan ${availableQuantity}.`);
          reject(error);
          return;
        }
      }

      // Actualizamos el estado: agregamos o actualizamos cantidad
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.variant.id === variant.id);
        if (existingItem) {
          // Si ya existe, sumamos la cantidad
          return prevItems.map(item =>
            item.variant.id === variant.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        // Si no existe, lo agregamos al array
        return [...prevItems, { product, variant, quantity }];
      });
      resolve(); // Operación exitosa
    });
  }, [cartItems]);

  // Eliminar producto del carrito
  const removeFromCart = useCallback((variantId) => {
    setCartItems(prevItems => prevItems.filter(item => item.variant.id !== variantId));
  }, []);

  // Actualizar cantidad de un producto existente
  const updateQuantity = useCallback((variantId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Vaciar completamente el carrito
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calcular el total del carrito formateado como moneda
  const getCartTotal = useCallback(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
      return sum + (price * item.quantity);
    }, 0);
    
    // Formateamos en pesos colombianos (COP)
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(total / 100);
  }, [cartItems]);

  // Valor del contexto - memoizado para evitar renders innecesarios
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  // Proveemos el valor a todos los componentes hijos
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
};