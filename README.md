# María Secretos, tienda en línea (React + Vite)

Tienda de cadenas en oro amarillo 18k italiano y anillos con esmeralda. Tiene catálogo con
filtros por eslabón, largo y grosor, buscador, favoritos y un pedido que se envía por WhatsApp.
No necesita servidor ni pasarela de pago.

## Correr en tu computador
```bash
npm install
npm run dev        # abre http://localhost:5173
```

## Antes de publicar: lo que falta completar
1. **Precios.** En `src/data/products.js` todas las piezas tienen `price: null`, así que la
   página muestra "Precio a consultar". Cambia `null` por el valor en pesos, sin puntos.
   Ejemplo: `price: 647000`. Cuando haya precios, se activan solos el filtro y el orden por precio.
2. **WhatsApp.** En `src/config.js`, campo `whatsapp`: número con indicativo, sin "+" ni espacios
   (ej. `573001234567`). Hoy tiene un número de ejemplo.
3. **Opcional, en `src/config.js`:** correo, Instagram, tiendas físicas y monto de envío gratis.
   Lo que dejes vacío no aparece en la página.

## Fotos y productos
- Las fotos están en `public/fotos/cadenas` y `public/fotos/anillos`. Para cambiar una,
  reemplaza el archivo con el mismo nombre.
- Cada cadena tiene en `products.js` eslabón, grosor (mm), largo (cm) y peso (g). Con esos datos
  se arman el nombre, la descripción y los filtros.
- Para marcar una pieza como agotada: `soldOut: true`. Para destacarla en la portada:
  `featured: true`.
- Logo: `public/logo/` (completo, monograma y nombre, con fondo transparente).

## Desplegar en Vercel
1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com → *Add New → Project* → importa el repositorio.
3. Vercel detecta Vite solo (build `npm run build`, salida `dist`). Pulsa *Deploy*.

`vercel.json` ya incluye la regla para que `/catalogo` y `/pieza/...` funcionen al recargar.

## Estructura
```
src/
  config.js            datos de la marca y WhatsApp
  data/products.js     catálogo (precios, medidas, fotos)
  store/               pedido y favoritos (se guardan en el navegador)
  components/          Layout (encabezado, menú y pie), CartDrawer, HeroCarousel, ProductCard, Icons
  pages/               Home, Catalog, Product, Favorites, Help, NotFound
  styles.css           colores, tipografía y diseño
public/
  fotos/               fotos de productos
  logo/                logo de María Secretos
```

## Pasar a pago en línea
El pedido sale de `src/components/CartDrawer.jsx` (función `buildOrderMessage`). Para cobrar en
línea se reemplaza ese paso por el checkout de Wompi, Mercado Pago o Stripe.
