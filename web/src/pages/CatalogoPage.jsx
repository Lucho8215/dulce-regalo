import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const CatalogoPage = () => {
  const [media, setMedia]          = useState({ images: [], videos: [] });
  const [catalogos, setCatalogos]  = useState([]);
  const [filtroActivo, setFiltro]  = useState(null); // null = todos
  const [lightbox, setLightbox]    = useState(null);
  const [playingVideo, setPlaying] = useState(null);
  const [loading, setLoading]      = useState(true);

  // Cargar imágenes/videos del JSON
  useEffect(() => {
    fetch('/media-urls.json')
      .then(r => r.json())
      .then(data => setMedia(data))
      .catch(() => {
        const images = Array.from({ length: 22 }, (_, i) => ({
          file: `${i + 1}.jpeg`,
          url:  `/img/${i + 1}.jpeg`,
          type: 'image',
        }));
        setMedia({ images, videos: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  // Cargar catálogos desde Supabase
  useEffect(() => {
    supabase
      .from('catalogs')
      .select(`*, catalog_products(product_id, products(id, nombre, imagen_url))`)
      .eq('activo', true)
      .then(({ data }) => { if (data) setCatalogos(data); });
  }, []);

  // Imágenes filtradas según catálogo seleccionado
  const imagenesFiltradas = () => {
    if (!filtroActivo) return media.images;
    const catalogo = catalogos.find(c => c.id === filtroActivo);
    if (!catalogo) return [];
    const urls = new Set(
      catalogo.catalog_products
        .map(cp => cp.products?.imagen_url)
        .filter(Boolean)
    );
    return media.images.filter(img => urls.has(img.url));
  };

  const imgs = imagenesFiltradas();

  const prevImage = () => setLightbox(i => (i - 1 + imgs.length) % imgs.length);
  const nextImage = () => setLightbox(i => (i + 1) % imgs.length);

  useEffect(() => {
    const handler = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, imgs.length]);

  return (
    <>
      <Helmet>
        <title>Catálogo — Dulce Regalo</title>
        <meta name="description" content="Conoce nuestra colección de regalos únicos con fotos y videos" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
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
          <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Filtros de catálogos ── */}
            {catalogos.length > 0 && (
              <section className="py-8 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-3 flex-wrap">
                    <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground mr-2">Colecciones:</span>

                    {/* Botón "Todos" */}
                    <button
                      onClick={() => setFiltro(null)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filtroActivo === null
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      Todos ({media.images.length})
                    </button>

                    {/* Botón por catálogo */}
                    {catalogos.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFiltro(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          filtroActivo === cat.id
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                        }`}
                      >
                        {cat.nombre} ({cat.catalog_products?.length || 0})
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Videos ── */}
            {media.videos.length > 0 && filtroActivo === null && (
              <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Videos de Productos</h2>
                    <p className="text-muted-foreground">Mira nuestros regalos en detalle</p>
                  </motion.div>

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
                          <div className="relative">
                            <video src={video.url} controls autoPlay className="w-full aspect-video object-cover" />
                            <button onClick={() => setPlaying(null)} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative aspect-video cursor-pointer" onClick={() => setPlaying(idx)}>
                            <video src={video.url} className="w-full h-full object-cover" preload="metadata" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">Video {idx + 1}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Galería de imágenes ── */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {filtroActivo ? catalogos.find(c => c.id === filtroActivo)?.nombre : 'Galería de Productos'}
                  </h2>
                  <p className="text-muted-foreground">
                    {imgs.length} productos — clic en cualquier imagen para ver en detalle
                  </p>
                </motion.div>

                {imgs.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {imgs.map((img, idx) => (
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
                            if (e.target.dataset.fallback) return;
                            e.target.dataset.fallback = '1';
                            e.target.src = `/img/${img.file.replace('.jpg', '.jpeg')}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    No hay imágenes en esta colección
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        <Footer />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={imgs[lightbox]?.url}
              alt={`Producto ${lightbox + 1}`}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-1 rounded-full">
              {lightbox + 1} / {imgs.length}
            </div>

            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors">
              <X className="w-6 h-6" />
            </button>

            <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
              {imgs.map((img, idx) => (
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
