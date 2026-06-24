import React from 'react';
import { Lock } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ¿QUÉ ES WOMPI?
// Wompi es una pasarela de pagos colombiana (de Bancolombia) que permite
// recibir pagos por PSE, tarjeta de crédito/débito, Nequi y Daviplata.
// Su forma más sencilla de usar es un formulario HTML que redirige al
// cliente a la página de pago de Wompi — sin necesidad de servidor propio.
// ─────────────────────────────────────────────────────────────────────────────

// ┌─────────────────────────────────────────────────────┐
// │  PROPS que recibe este componente:                  │
// │  • totalCOP    → valor total en pesos colombianos   │
// │  • referencia  → ID único de la orden               │
// │  • email       → correo del cliente                 │
// │  • nombre      → nombre del cliente                 │
// │  • disabled    → bloquea el botón si falta info     │
// └─────────────────────────────────────────────────────┘
const WompiButton = ({ totalCOP, referencia, email, nombre, disabled = false }) => {

  // ── 1. Leer la llave pública desde el archivo .env ──────────────────────
  // La llave pública (pub_test_ o pub_prod_) identifica tu negocio en Wompi.
  // NUNCA uses la llave privada (prv_...) aquí — esa es solo para el servidor.
  const publicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY || '';

  // ── 2. Convertir COP a centavos ──────────────────────────────────────────
  // Wompi exige que el monto llegue en CENTAVOS (no en pesos completos).
  // Ejemplo: $50.000 COP → 5.000.000 centavos
  const amountInCents = Math.round(totalCOP * 100);

  // ── 3. URL de retorno ────────────────────────────────────────────────────
  // Después de que el cliente paga (o cancela), Wompi lo redirige aquí.
  // En desarrollo usamos localhost; en producción cambia por tu dominio real.
  const redirectUrl = `${window.location.origin}/pago-exitoso`;

  // ── 4. Si no hay llave configurada, mostrar advertencia ──────────────────
  if (!publicKey) {
    return (
      <div style={{
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '13px',
        color: '#92400e'
      }}>
        ⚠️ Falta <strong>VITE_WOMPI_PUBLIC_KEY</strong> en el archivo .env
      </div>
    );
  }

  // ── 5. El formulario que hace la magia ───────────────────────────────────
  // Este formulario usa method="GET" y action apuntando a Wompi.
  // Cuando el cliente hace clic en "Pagar", el navegador envía todos los
  // campos como parámetros en la URL y Wompi muestra su pantalla de pago.
  return (
    <form
      action="https://checkout.wompi.co/p/"  // ← URL de pago de Wompi
      method="GET"                            // ← GET porque son parámetros de URL
    >
      {/* ── Llave pública: identifica tu cuenta Wompi ── */}
      <input type="hidden" name="public-key"       value={publicKey} />

      {/* ── Moneda: siempre COP para Colombia ── */}
      <input type="hidden" name="currency"          value="COP" />

      {/* ── Monto total en centavos ── */}
      <input type="hidden" name="amount-in-cents"   value={amountInCents} />

      {/* ── Referencia única: para identificar esta orden en tu dashboard ── */}
      <input type="hidden" name="reference"         value={referencia} />

      {/* ── Email del cliente: Wompi lo muestra en su pantalla de pago ── */}
      <input type="hidden" name="customer-email"    value={email} />

      {/* ── Nombre del cliente (opcional pero útil) ── */}
      <input type="hidden" name="customer-full-name" value={nombre} />

      {/* ── URL de retorno: a dónde vuelve el cliente tras pagar ── */}
      <input type="hidden" name="redirect-url"      value={redirectUrl} />

      {/* ── Botón de envío: estilizado para que se vea igual al resto ── */}
      <button
        type="submit"
        disabled={disabled}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: disabled ? '#d1d5db' : 'linear-gradient(135deg, #FF69B4, #FF1493)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '18px 24px',
          fontSize: '17px',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: disabled ? 'none' : '0 4px 14px rgba(255,105,180,0.4)',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
        onMouseOver={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Ícono de candado = seguridad */}
        <Lock size={18} />
        Pagar con PSE / Tarjeta
      </button>

      {/* Texto de seguridad debajo del botón */}
      <p style={{
        textAlign: 'center',
        fontSize: '11px',
        color: '#9ca3af',
        marginTop: '8px',
      }}>
        🔒 Pago 100% seguro procesado por Wompi (Bancolombia)
      </p>
    </form>
  );
};

export default WompiButton;
