/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  //modo oscuro basado en una clase CSS (en este caso, "dark") en lugar de la preferencia del sistema
  content: [
    "./pages/**/*.{js,jsx}", // Analiza todos los archivos JS y JSX dentro de la carpeta pages
    "./components/**/*.{js,jsx}", // Analiza todos los archivos JS y JSX dentro de la carpeta components
    "./app/**/*.{js,jsx}",// Analiza todos los archivos JS y JSX dentro de la carpeta app
    "./src/**/*.{js,jsx}", // Analiza todos los archivos JS y JSX dentro de la carpeta src
  ],
  theme: { // Configuración del tema personalizado
    container: { // Configuración para el contenedor centralizado
      center: true, //  Centra el contenedor horizontalmente
      padding: "2rem", // Agrega un padding de 2rem a los lados del contenedor
      screens: { // Configuración de puntos de ruptura para el contenedor
        "2xl": "1400px", // Para pantallas 2xl, el contenedor tendrá un ancho máximo de 1400px
      },
    },
    extend: { // Extiende la configuración predeterminada de Tailwind
      colors: {
        border: "hsl(var(--border))", // Define el color de borde utilizando una variable CSS
        input: "hsl(var(--input))", // Define el color de entrada utilizando una variable CSS
        ring: "hsl(var(--ring))",  // Define el color del anillo utilizando una variable CSS
        background: "hsl(var(--background))", // Define el color de fondo utilizando una variable CSS
        foreground: "hsl(var(--foreground))",   // Define el color de primer plano utilizando una variable CSS
        primary: { // Define el color primario con su variante de primer plano
          DEFAULT: "hsl(var(--primary))", // Color primario principal utilizando una variable CSS
          foreground: "hsl(var(--primary-foreground))", // Color de primer plano para el color primario utilizando una variable CSS
        },
        secondary: { // Define el color secundario con su variante de primer plano
          DEFAULT: "hsl(var(--secondary))", // Color secundario principal utilizando una variable CSS
          foreground: "hsl(var(--secondary-foreground))", // Color de primer plano para el color secundario utilizando una variable CSS
        },
        destructive: { // Define el color destructivo con su variante de primer plano
          DEFAULT: "hsl(var(--destructive))", // Color destructivo principal utilizando una variable CSS
          foreground: "hsl(var(--destructive-foreground))", // Color de primer plano para el color destructivo utilizando una variable CSS
        },
        muted: { // Define el color atenuado con su variante de primer plano
          DEFAULT: "hsl(var(--muted))", // Color atenuado principal utilizando una variable CSS
          foreground: "hsl(var(--muted-foreground))", // Color de primer plano para el color atenuado utilizando una variable CSS
        },
        accent: { //  Define el color de acento con su variante de primer plano
          DEFAULT: "hsl(var(--accent))", // Color de acento principal utilizando una variable CSS
          foreground: "hsl(var(--accent-foreground))", // Color de primer plano para el color de acento utilizando una variable CSS
        },
        popover: {  //   Define el color del popover con su variante de primer plano
          DEFAULT: "hsl(var(--popover))", // Color del popover principal utilizando una variable CSS
          foreground: "hsl(var(--popover-foreground))", // Color de primer plano para el color del popover utilizando una variable CSS
        },
        card: {   // Define el color de la tarjeta con su variante de primer plano
          DEFAULT: "hsl(var(--card))", // Color de la tarjeta principal utilizando una variable CSS
          foreground: "hsl(var(--card-foreground))",  // Color de primer plano para el color de la tarjeta utilizando una variable CSS
        },
        sidebar: { // Define el color de la barra lateral con su variante de primer plano
          DEFAULT: "hsl(var(--sidebar-background))",  // Color de fondo de la barra lateral utilizando una variable CSS
          foreground: "hsl(var(--sidebar-foreground))", // Color de primer plano para la barra lateral utilizando una variable CSS
          primary: "hsl(var(--sidebar-primary))",   // Color primario para la barra lateral utilizando una variable CSS
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",  // Color de primer plano para el color primario de la barra lateral utilizando una variable CSS
          accent: "hsl(var(--sidebar-accent))",   // Color de acento para la barra lateral utilizando una variable CSS
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",   // Color de primer plano para el color de acento de la barra lateral utilizando una variable CSS
          border: "hsl(var(--sidebar-border))",   // Color de borde para la barra lateral utilizando una variable CSS
          ring: "hsl(var(--sidebar-ring))",   // Color del anillo para la barra lateral utilizando una variable CSS
        },
      },
      borderRadius: { // Define los radios de borde personalizados utilizando una variable CSS   
        lg: "var(--radius)", // Radio de borde grande utilizando una variable CSS
        md: "calc(var(--radius) - 2px)", // Radio de borde mediano calculado restando 2px a la variable CSS
        sm: "calc(var(--radius) - 4px)", // Radio de borde pequeño calculado restando 4px a la variable CSS
      },
      keyframes: { // Define las animaciones de keyframes para el acordeón
        "accordion-down": { // Animación para abrir el acordeón
          from: { /// Estado inicial del acordeón cerrado (altura 0)
            height: "0",//  El acordeón comienza con una altura de 0, lo que significa que está completamente cerrado
          },
          to: { // Estado final del acordeón abierto (altura basada en el contenido)
            height: "var(--radix-accordion-content-height)", // El acordeón se expande a la altura del contenido, utilizando una variable CSS que representa la altura del contenido del acordeón
          },
        },
        "accordion-up": { // Animación para cerrar el acordeón
          from: { //  Estado inicial del acordeón abierto (altura basada en el contenido)
            height: "var(--radix-accordion-content-height)",  // El acordeón comienza con la altura del contenido, lo que significa que está completamente abierto
          },
          to: { // Estado final del acordeón cerrado (altura 0)
            height: "0",
          },
        },
      },
      animation: { // Define las clases de animación para el acordeón utilizando las animaciones de keyframes definidas anteriormente
        "accordion-down": "accordion-down 0.2s ease-out", /// Clase de animación para abrir el acordeón, que utiliza la animación de keyframes "accordion-down" con una duración de 0.2 segundos y una función de tiempo "ease-out" para suavizar la animación al final
        "accordion-up": "accordion-up 0.2s ease-out", //  Clase de animación para cerrar el acordeón, que utiliza la animación de keyframes "accordion-up" con una duración de 0.2 segundos y una función de tiempo "ease-out" para suavizar la animación al final
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Agrega el plugin tailwindcss-animate para animaciones adicionales
};