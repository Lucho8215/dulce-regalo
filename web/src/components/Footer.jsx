import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

// Componente de pie de página con información de contacto y enlaces
const Footer = () => {
  // Año actual para el copyright
  const currentYear = new Date().getFullYear();

  return (
    // Footer principal con fondo de marca
    <footer className="bg-secondary text-secondary-foreground mt-20">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Información de la marca */}
          <div className="space-y-4">
            {/* Logo y nombre */}
            <BrandLogo size="sm" showTagline={false} linkTo="/" />
            
            {/* Descripción */}
            <p className="text-sm opacity-90">
              Creamos momentos especiales con detalles únicos y personalizados. Cada regalo cuenta una historia de amor y cariño.
            </p>
            
            {/* Redes sociales */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/carrito" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información legal */}
          <div>
            <h3 className="font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terminos" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/admin" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Información de contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="opacity-90">
                  Av. Principal 123, Perdomo
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+313547859" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  +313547859
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contacto@dulceregalo.com" className="opacity-90 hover:opacity-100 hover:text-primary transition-all">
                  contacto@dulceregalo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8">
          {/* Copyright */}
          <div className="text-center text-sm opacity-90">
            <p>
              © {currentYear} Dulce Regalo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;