import { supabase } from './supabase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BUCKET = 'product-images';

export function formatCOP(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export async function uploadImage(file) {
  const ext = file.name.split('.').pop();
  const path = `products/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImage(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error('Error eliminando imagen:', error);
}

// ─── Productos ────────────────────────────────────────────────────────────────

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProductsDestacados() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('activo', true)
    .eq('destacado', true)
    .limit(3);

  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('activo', true)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProductsAdmin() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProduct({ file, ...productData }) {
  let imagen_url = productData.imagen_url || null;
  let imagen_path = productData.imagen_path || null;

  if (file) {
    const uploaded = await uploadImage(file);
    imagen_url = uploaded.url;
    imagen_path = uploaded.path;
  }

  const { data, error } = await supabase
    .from('products')
    .insert({ ...productData, imagen_url, imagen_path })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id, { file, oldImagePath, ...productData }) {
  let imagen_url = productData.imagen_url;
  let imagen_path = productData.imagen_path;

  if (file) {
    if (oldImagePath) await deleteImage(oldImagePath);
    const uploaded = await uploadImage(file);
    imagen_url = uploaded.url;
    imagen_path = uploaded.path;
  }

  const { data, error } = await supabase
    .from('products')
    .update({ ...productData, imagen_url, imagen_path })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id, imagePath) {
  if (imagePath) await deleteImage(imagePath);

  const { error } = await supabase
    .from('products')
    .update({ activo: false })
    .eq('id', id);

  if (error) throw error;
}

export async function updateInventory(id, inventario) {
  const { error } = await supabase
    .from('products')
    .update({ inventario })
    .eq('id', id);

  if (error) throw error;
}

// ─── Catálogos ────────────────────────────────────────────────────────────────

export async function getCatalogs() {
  const { data, error } = await supabase
    .from('catalogs')
    .select(`
      *,
      catalog_products (
        position,
        product:product_id (*)
      )
    `)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllCatalogsAdmin() {
  const { data, error } = await supabase
    .from('catalogs')
    .select(`
      *,
      catalog_products (
        position,
        product:product_id (id, nombre, imagen_url, precio, activo)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCatalog({ nombre, descripcion, productIds = [] }) {
  const { data: catalog, error } = await supabase
    .from('catalogs')
    .insert({ nombre, descripcion })
    .select()
    .single();

  if (error) throw error;

  if (productIds.length > 0) {
    const relations = productIds.map((product_id, i) => ({
      catalog_id: catalog.id,
      product_id,
      position: i,
    }));
    const { error: relError } = await supabase.from('catalog_products').insert(relations);
    if (relError) throw relError;
  }

  return catalog;
}

export async function updateCatalog(id, { nombre, descripcion, productIds = [] }) {
  const { error } = await supabase
    .from('catalogs')
    .update({ nombre, descripcion })
    .eq('id', id);

  if (error) throw error;

  // Re-sync productos del catálogo
  await supabase.from('catalog_products').delete().eq('catalog_id', id);

  if (productIds.length > 0) {
    const relations = productIds.map((product_id, i) => ({
      catalog_id: id,
      product_id,
      position: i,
    }));
    const { error: relError } = await supabase.from('catalog_products').insert(relations);
    if (relError) throw relError;
  }
}

export async function deleteCatalog(id) {
  const { error } = await supabase.from('catalogs').delete().eq('id', id);
  if (error) throw error;
}

// ─── Órdenes ──────────────────────────────────────────────────────────────────

export async function createOrder(orderData, cartItems) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      cliente_nombre: orderData.nombre,
      cliente_email: orderData.email,
      cliente_telefono: orderData.telefono,
      direccion: orderData.direccion,
      ciudad: orderData.ciudad,
      codigo_postal: orderData.codigoPostal,
      subtotal: Math.round(orderData.subtotal),
      envio: Math.round(orderData.envio),
      iva: Math.round(orderData.iva),
      total: Math.round(orderData.total),
    })
    .select()
    .single();

  if (error) throw error;

  const items = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    nombre: item.product.title,
    precio: Math.round((item.variant.price_in_cents ?? item.variant.sale_price_in_cents) / 100),
    cantidad: item.quantity,
    variant_id: item.variant.id,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(items);
  if (itemsError) throw itemsError;

  return order;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, estado) {
  const { error } = await supabase.from('orders').update({ estado }).eq('id', id);
  if (error) throw error;
}
