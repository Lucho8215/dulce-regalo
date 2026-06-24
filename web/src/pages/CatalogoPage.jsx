import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA DE CATÁLOGO
// Muestra:
//   1. Sección de VIDEOS — reproducción inline con controles
//   2. Galería de IMÁGENES — con lightbox (ver imagen grande al hacer clic)
//
// Los archivos vienen de public/media-urls.json (generado por upload-media.mjs)
// Si no existe ese archivo, usa las imágenes locales de /img/ como fallback.
// ─────────────────────────────────────────────────────────────────────────────

const CatalogoPage = () => {
  // ── Estado principal ───────────────────────────────────────────────────────
  const [media, setMedia]           = useState({ images: [], videos: [] });
  const [lightbox, setLightbox]     = useState(null); // índice de imagen abierta
  const [playingVideo, setPlaying]  = useState(null); // índice de video activo
  const [loading, setLoading]       = useState(true);

  // ── Cargar el JSON de medios al montar ────────────────────────────────────
  useEffect(() => {
    fetch('/media-urls.json')
      .then(r => r.json())
      .then(data => setMedia(data))
      .catch(() => {
        // Fallback: usar imágenes locales mientras no se haya corrido el script
        const images = Array.from({ length: 22 }, (_, i) => ({
          file: `${i + 1}.jpeg`,
          url:  `/img/${i + 1}.jpeg`,
          type: 'image',
        }));
        setMedia({ images, videos: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Navegar en el lightbox (imagen anterior / siguiente) ──────────────────
  const prevImage = () => setLightbox(i => (i - 1 + media.images.length) % media.images.length);
  const nextImage = () => setLightbox(i => (i + 1) % media.images.length);

  // ── Cerrar lightbox con tecla Escape o flechas ────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, media.images.length]);

  return (
    <>
      <Helmet>
        <title>Catálogo — Dulce Regalo</title>
        <meta name="description" content="Conoce nuestra colección de regalos únicos con fotos y videos" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* ── Hero ── */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Catálogo de Productos
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubre nuestra colección completa de regalos únicos y personalizados
              </p>
            </motion.div>
          </div>
        </section>

        {loading ? (
          // Skeleton de carga
          <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════════════════
                SECCIÓN 1: VIDEOS DE PRODUCTOS
            ══════════════════════════════════════════════ */}
            {media.videos.length > 0 && (
              <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Videos de Productos</h2>
                    <p className="text-muted-foreground">Mira nuestros regalos en detalle</p>
                  </motion.div>

                  {/* Grid de videos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {media.videos.map((video, idx) => (
                      <motion.div
                        key={video.file}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative rounded-2xl overflow-hidden bg-black shadow-lg group"
                      >
                        {playingVideo === idx ? (
                          // Video reproduciéndose
                          <div className="relative">
                            <video
                              src={video.url}
                              controls
                              autoPlay
                              className="w-full aspect-video object-cover"
                            />
                            {/* Botón para cerrar el video */}
                            <button
                              onClick={() => setPlaying(null)}
                              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          // Thumbnail del video (primer frame como poster)
                          <div
                            className="relative aspect-video cursor-pointer"
                            onClick={() => setPlaying(idx)}
                          >
                            <video
                              src={video.url}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                            {/* Overlay con botón de play */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                Video {idx + 1}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════════
                SECCIÓN 2: GALERÍA DE IMÁGENES
            ══════════════════════════════════════════════ */}
            {media.images.length > 0 && (
              <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Galería de Productos</h2>
                    <p className="text-muted-foreground">
                      {media.images.length} productos disponibles — clic en cualquier imagen para ver en detalle
                    </p>
                  </motion.div>

                  {/* Grid de imágenes tipo masonry */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {media.images.map((img, idx) => (
                      <motion.div
                        key={img.file}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (idx % 10) * 0.05 }}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-muted"
                        onClick={() => setLightbox(idx)}
                      >
                        <img
                          src={img.url}
                          alt={`Producto ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={e => {
                            // Evitar loop infinito: solo intentar fallback una vez
                            if (e.target.dataset.fallback) return;
                            e.target.dataset.fallback = '1';
                            // Intentar con extensión .jpeg si falla Supabase
                            const localFile = img.file.replace('.jpg', '.jpeg');
                            e.target.src = `/img/${localFile}`;
                          }}
                        />
                        {/* Overlay hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <Footer />
      </div>

      {/* ══════════════════════════════════════════════════
          LIGHTBOX — imagen a pantalla completa
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)} // clic fuera cierra
          >
            {/* Imagen principal */}
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={media.images[lightbox]?.url}
              alt={`Producto ${lightbox + 1}`}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()} // clic en imagen no cierra
            />

            {/* Contador */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-1 rounded-full">
              {lightbox + 1} / {media.images.length}
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Botón anterior */}
            <button
              onClick={e => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Botón siguiente */}
            <button
              onClick={e => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Miniaturas en la parte inferior */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
              {media.images.map((img, idx) => (
                <img
                  key={img.file}
                  src={img.url}
                  alt=""
                  onClick={e => { e.stopPropagation(); setLightbox(idx); }}
                  className={`w-12 h-12 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${
                    idx === lightbox ? 'ring-2 ring-primary scale-110' : 'opacity-50 hover:opacity-100'
                  }`}
                  onError={e => {
                    if (e.target.dataset.fallback) return;
                    e.target.dataset.fallback = '1';
                    e.target.src = `/img/${img.file.replace('.jpg', '.jpeg')}`;
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CatalogoPage;
