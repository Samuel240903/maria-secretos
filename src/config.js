// Datos de la marca: cámbialos aquí y se actualizan en toda la página.
// Los campos marcados con PENDIENTE son de ejemplo y hay que reemplazarlos.
export const BRAND = {
  name: 'María Secretos',
  tagline: 'Detalles que hacen brillar tu esencia',
  // PENDIENTE: número de WhatsApp con indicativo de país, sin "+" ni espacios.
  whatsapp: '573000000000',
  // PENDIENTE: deja en '' lo que no tengas y desaparece de la página.
  email: '',
  instagram: '',
  // Mensajes que rotan en la barra superior.
  announcements: [
    'Joyas para los momentos que solo tú conoces',
    'Cadenas en oro amarillo 18k italiano',
    'Anillos con esmeralda',
    'Haz tu pedido y resuelve tus dudas por WhatsApp',
  ],
  // PENDIENTE: monto desde el que el envío es gratis. null = no se muestra.
  freeShippingFrom: null,
  // PENDIENTE: tiendas físicas. Si la lista está vacía, la sección no aparece.
  // Ejemplo:
  // { name: 'Tienda Centro', city: 'Cali', address: 'Calle 1 # 2-3',
  //   hours: ['Lunes a sábado, 10:00 – 19:00'], mapsUrl: 'https://maps.google.com/?q=...' }
  stores: [],
}

export function whatsappLink(message) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`
}

export function formatPrice(value) {
  if (value == null) return 'Precio a consultar'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}
