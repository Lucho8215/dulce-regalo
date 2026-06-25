import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// WompiButton — Botón de pago con Wompi (pasarela colombiana de Bancolombia)
//
// ¿Cómo funciona?
//   1. Calcula SHA-256 de: referencia + monto_centavos + "COP" + secreto_integridad
//   2. Envía ese hash como "signature:integrity" a Wompi (obligatorio desde 2023)
//   3. Wompi valida la firma antes de procesar el pago
//
// Variables de entorno necesarias en .env y en Vercel:
//   VITE_WOMPI_PUBLIC_KEY       → pub_test_... o pub_prod_... (llave pública)
//   VITE_WOMPI_INTEGRITY_SECRET → test_integrity_... o prod_integrity_...
//
// Para pasar a producción: reemplazar ambas llaves por las llaves "prod_"
// ─────────────────────────────────────────────────────────────────────────────

// Calcula SHA-256 usando la API nativa del navegador (Web Crypto API)
// Entrada: string con referencia + monto + moneda + secreto concatenados
// Salida: hash en hexadecimal que Wompi valida
async function sha256hex(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ┌─────────────────────────────────────────────────────┐
// │  PROPS que recibe este componente:                  │
// │  • totalCOP    → valor total en pesos colombianos   │
// │  • referencia  → ID único de la orden (ej: DR-123)  │
// │  • email       → correo del cliente                 │
// │  • nombre      → nombre completo del cliente        │
// │  • disabled    → bloquea el botón si falta info     │
// └─────────────────────────────────────────────────────┘
const WompiButton = ({ totalCOP, referencia, email, nombre, disabled = false }) => {

  // ── Leer llaves desde .env ───────────────────────────────────────────────
  // publicKey: identifica tu cuenta en Wompi (no es secreta)
  // integritySecret: se usa solo para calcular el hash (no se envía directo)
  const publicKey       = import.meta.env.VITE_WOMPI_PUBLIC_KEY       || '';
  const integritySecret = import.meta.env.VITE_WOMPI_INTEGRITY_SECRET || '';

  // ── Convertir COP a centavos ─────────────────────────────────────────────
  // Wompi exige el monto en centavos. $50.000 COP → 5.000.000 centavos
  const amountInCents = Math.round(totalCOP * 100);

  // ── URL a donde vuelve el cliente tras pagar ─────────────────────────────
  const redirectUrl = `${window.location.origin}/pago-exitoso`;

  // ── Estado para guardar el hash calculado ───────────────────────────────
  const [signature, setSignature] = useState('');

  // ── Calcular la firma cada vez que cambian referencia o monto ───────────
  // Fórmula: SHA256( referencia + amountInCents + "COP" + integritySecret )
  useEffect(() => {
    if (!integritySecret || !referencia || !amountInCents) return;

    const cadena = `${referencia}${amountInCents}COP${integritySecret}`;
    sha256hex(cadena).then(setSignature);
  }, [referencia, amountInCents, integritySecret]);

  // ── Si falta la llave pública mostrar advertencia ────────────────────────
  if (!publicKey) {
    return (
      <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#92400e' }}>
        ⚠️ Falta <strong>VITE_WOMPI_PUBLIC_KEY</strong> en el archivo .env y en Vercel
      </div>
    );
  }

  // ── Si falta el secreto de integridad mostrar advertencia ────────────────
  if (!integritySecret) {
    return (
      <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#92400e' }}>
        ⚠️ Falta <strong>VITE_WOMPI_INTEGRITY_SECRET</strong> en el archivo .env y en Vercel.<br />
        Encuéntralo en: Wompi → Desarrolladores → Secretos → Integridad → Mostrar
      </div>
    );
  }

  // ── Formulario GET que redirige a la pantalla de pago de Wompi ──────────
  return (
    <form
      action="https://checkout.wompi.co/p/"  // URL oficial de checkout de Wompi
      method="GET"                            // GET: parámetros van en la URL
    >
      {/* Llave pública: identifica tu cuenta Wompi */}
      <input type="hidden" name="public-key"          value={publicKey} />

      {/* Moneda: siempre COP para Colombia */}
      <input type="hidden" name="currency"             value="COP" />

      {/* Monto en centavos: $50.000 COP = 5000000 centavos */}
      <input type="hidden" name="amount-in-cents"      value={amountInCents} />

      {/* Referencia única de la orden (ej: DR-1718900000000) */}
      <input type="hidden" name="reference"            value={referencia} />

      {/* Firma SHA-256 obligatoria desde 2023 — calculada arriba */}
      <input type="hidden" name="signature:integrity"  value={signature} />

      {/* Email del cliente — Wompi lo muestra en su pantalla */}
      <input type="hidden" name="customer-email"       value={email} />

      {/* Nombre del cliente */}
      <input type="hidden" name="customer-full-name"   value={nombre} />

      {/* URL de retorno tras pagar o cancelar */}
      <input type="hidden" name="redirect-url"         value={redirectUrl} />

      {/* Botón de pago — se deshabilita si aún no se calculó la firma */}
      <button
        type="submit"
        disabled={disabled || !signature}  // espera a que el hash esté listo
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: (disabled || !signature) ? '#d1d5db' : 'linear-gradient(135deg, #FF69B4, #FF1493)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '18px 24px',
          fontSize: '17px',
          fontWeight: '600',
          cursor: (disabled || !signature) ? 'not-allowed' : 'pointer',
          boxShadow: (disabled || !signature) ? 'none' : '0 4px 14px rgba(255,105,180,0.4)',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
        onMouseOver={e => { if (!disabled && signature) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <Lock size={18} />
        {!signature ? 'Preparando pago...' : 'Pagar con PSE / Tarjeta / Nequi'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
        🔒 Pago 100% seguro procesado por Wompi (Bancolombia)
      </p>
    </form>
  );
};

export default WompiButton;
