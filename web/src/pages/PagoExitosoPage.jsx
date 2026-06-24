import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';

// ─────────────────────────────────────────────────────────────────────────────
// ¿QUÉ PASA AQUÍ?
// Cuando Wompi termina el proceso de pago (exitoso, fallido o pendiente),
// redirige al cliente de vuelta a esta página.
// Wompi agrega parámetros en la URL para indicar el resultado:
//   ?id=xxx-xxx&status=APPROVED&...
// Nosotros leemos esos parámetros con useSearchParams() y mostramos el mensaje.
// ─────────────────────────────────────────────────────────────────────────────

const PagoExitosoPage = () => {
  // ── useSearchParams: lee los parámetros que vienen en la URL ──────────────
  // Ejemplo de URL que envía Wompi:
  // /pago-exitoso?id=abc123&status=APPROVED&reference=orden-1234567
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  // ── Extraer los valores de la URL ─────────────────────────────────────────
  const transactionId = searchParams.get('id');           // ID de la transacción en Wompi
  const status        = searchParams.get('status');       // APPROVED | DECLINED | PENDING
  const reference     = searchParams.get('reference');    // Tu referencia de orden

  // ── Limpiar el carrito solo si el pago fue aprobado ───────────────────────
  useEffect(() => {
    if (status === 'APPROVED') {
      clearCart(); // Vaciamos el carrito porque ya se pagó
    }
  }, [status]);

  // ── Función para determinar qué mostrar según el estado ───────────────────
  // Wompi puede devolver 3 estados:
  //   APPROVED → pago exitoso ✅
  //   DECLINED → pago rechazado ❌
  //   PENDING  → pago en proceso (PSE puede tardar unos minutos) ⏳
  const getStatusInfo = () => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: '¡Pago exitoso!',
          message: 'Tu pago fue procesado correctamente. Recibirás un correo de confirmación.',
          color: 'text-green-700',
        };
      case 'DECLINED':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Pago rechazado',
          message: 'Tu banco no autorizó el pago. Intenta con otro método de pago.',
          color: 'text-red-700',
        };
      case 'PENDING':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Pago en proceso',
          message: 'Tu pago PSE está siendo procesado por el banco. Puede tomar unos minutos.',
          color: 'text-yellow-700',
        };
      default:
        // Si no hay status (el cliente llegó directo a la URL)
        return {
          icon: <ShoppingBag className="w-16 h-16 text-primary" />,
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/20',
          title: 'Gracias por tu compra',
          message: 'Tu pedido ha sido recibido.',
          color: 'text-foreground',
        };
    }
  };

  const info = getStatusInfo();

  return (
    <>
      <Helmet>
        <title>Estado del pago - Dulce Regalo</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-20">
          <div className="max-w-lg mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`${info.bgColor} border ${info.borderColor} rounded-2xl p-10 text-center shadow-sm`}
            >
              {/* Ícono animado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="flex justify-center mb-6"
              >
                {info.icon}
              </motion.div>

              {/* Título */}
              <h1 className={`text-3xl font-bold mb-3 ${info.color}`}>
                {info.title}
              </h1>

              {/* Mensaje */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {info.message}
              </p>

              {/* Datos de la transacción (si los hay) */}
              {(transactionId || reference) && (
                <div className="bg-white/80 rounded-xl p-4 mb-6 text-sm text-left space-y-2">
                  {reference && (
                    <p><span className="font-medium">Referencia:</span> <code className="text-xs bg-muted px-1 rounded">{reference}</code></p>
                  )}
                  {transactionId && (
                    <p><span className="font-medium">ID Transacción:</span> <code className="text-xs bg-muted px-1 rounded">{transactionId}</code></p>
                  )}
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  Volver al inicio
                </Link>
                <Link
                  to="/productos"
                  className="border border-border hover:bg-muted text-foreground font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  Seguir comprando
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PagoExitosoPage;
