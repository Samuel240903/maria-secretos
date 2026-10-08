// ------------------------------------------------------------------
// Catálogo de María Secretos.
//
// PRECIOS: todas las piezas tienen `price: null` porque las fotos no
// traían el precio. Mientras sea null, la tienda muestra "Precio a
// consultar". Para ponerlo, cambia null por el valor en pesos, por
// ejemplo: price: 647000.
//
// Para marcar una pieza como agotada: soldOut: true.
// Para cambiar la foto: reemplaza el archivo en /public/fotos o cambia
// la ruta en `image`.
// ------------------------------------------------------------------

export const CATEGORIES = [
  { id: 'cadenas', name: 'Cadenas', note: 'Oro amarillo 18k italiano, de 40 a 70 cm' },
  { id: 'con-dije', name: 'Cadenas con dije', note: 'Corazones, tréboles, bolas y serpiente' },
  { id: 'anillos', name: 'Anillos con esmeralda', note: 'Esmeraldas en monturas delicadas' },
]

// Tipos de eslabón, en el orden en que aparecen en los filtros.
export const LINKS = {
  lazo: 'Lazo',
  franco: 'Franco',
  cubana: 'Cubana',
  china: 'China',
  singapur: 'Singapur',
  rolon: 'Rolón',
  serpiente: 'Serpiente',
  figaro: 'Fígaro',
  cajon: 'Cajón',
  sedusa: 'Sedusa',
  plana: 'Plana',
  veneciana: 'Veneciana',
  crispeta: 'Crispeta',
}

export const LENGTHS = [
  { id: '45', label: '40 a 45 cm', note: 'Queda en la base del cuello', test: (l) => ['40-45', '42-45', '45'].includes(l) },
  { id: '50', label: '50 cm', note: 'Cae sobre la clavícula', test: (l) => l === '50' },
  { id: '60', label: '60 cm', note: 'Cae a la altura del pecho', test: (l) => l === '60' },
  { id: '70', label: '70 cm', note: 'Larga, para llevar sola o en capas', test: (l) => l === '70' },
]

export const WIDTHS = [
  { id: 'fina', label: 'Fina, hasta 1,2 mm', test: (mm) => mm != null && mm <= 1.25 },
  { id: 'media', label: 'Media, de 1,3 a 2,2 mm', test: (mm) => mm != null && mm > 1.25 && mm < 2.3 },
  { id: 'gruesa', label: 'Gruesa, desde 2,4 mm', test: (mm) => mm != null && mm >= 2.3 },
]

export const PRICE_RANGES = [
  { id: 'hasta-500', label: 'Hasta $500.000', min: 0, max: 500000 },
  { id: '500-1000', label: '$500.000 a $1.000.000', min: 500000, max: 1000000 },
  { id: '1000-2000', label: '$1.000.000 a $2.000.000', min: 1000000, max: 2000000 },
  { id: 'desde-2000', label: 'Más de $2.000.000', min: 2000000, max: Infinity },
]

const n = (v) => String(v).replace('.', ',')
const lengthLabel = (l) => (l.includes('-') ? `${l.replace('-', ' a ')} cm` : `${l} cm`)

function chain(id, ref, name, category, link, mm, length, grams, image, extra = {}) {
  const charmText = extra.charm ? ` con ${extra.charm.charAt(0).toLowerCase()}${extra.charm.slice(1)}` : ''
  const facts = [`mide ${lengthLabel(length)}`, mm ? `tiene ${n(mm)} mm de grosor` : null, `pesa ${n(grams)} g`].filter(Boolean)
  return {
    id,
    kind: 'chain',
    ref,
    name: `Cadena ${name.charAt(0).toLowerCase()}${name.slice(1)}${mm ? ` ${n(mm)} mm` : ''}`,
    category,
    link,
    mm,
    length,
    grams,
    image,
    price: null,
    soldOut: false,
    description:
      `Cadena de eslabón ${LINKS[link].toLowerCase()}${charmText} en oro amarillo 18k italiano. ` +
      `${facts.slice(0, -1).join(', ')} y ${facts.at(-1)}.`.replace(/^./, (c) => c.toUpperCase()),
    details: [
      ['Referencia', ref],
      ['Material', 'Oro amarillo 18k italiano'],
      ['Eslabón', LINKS[link]],
      ...(extra.charm ? [['Dije', extra.charm]] : []),
      ['Largo', lengthLabel(length)],
      ...(mm ? [['Grosor', `${n(mm)} mm`]] : []),
      ['Peso', `${n(grams)} g`],
    ],
    ...extra,
  }
}

function ring(id, ref, name, image, description, extra = {}) {
  return {
    id,
    kind: 'ring',
    ref,
    name,
    category: 'anillos',
    image,
    price: null,
    soldOut: false,
    description,
    details: [['Referencia', ref], ['Piedra', 'Esmeralda']],
    ...extra,
  }
}

export const PRODUCTS = [
  // Anillos con esmeralda (Ref. AN-01 a AN-12)
  ring('anillo-esmeralda-ovalada', 'Ref. AN-01', 'Anillo esmeralda ovalada', '/fotos/anillos/anillo-ovalado.jpg',
    'Esmeralda ovalada en cuatro garras sobre un aro con piedras blancas a los lados.', { featured: true }),
  ring('anillo-gota', 'Ref. AN-02', 'Anillo gota', '/fotos/anillos/anillo-gota.jpg',
    'Esmeralda redonda dentro de una gota de piedras blancas.', { featured: true }),
  ring('anillo-remolino', 'Ref. AN-03', 'Anillo remolino', '/fotos/anillos/anillo-remolino.jpg',
    'Esmeralda al centro de un círculo de piedras blancas en forma de remolino.'),
  ring('anillo-orbita', 'Ref. AN-04', 'Anillo órbita', '/fotos/anillos/anillo-halo.jpg',
    'Esmeralda redonda rodeada por un aro abierto de piedras blancas.', { featured: true }),
  ring('anillo-ref-01', 'Ref. AN-05', 'Anillo halo redondo', '/fotos/anillos/anillo-ref-01.jpg',
    'Esmeralda redonda con un halo de piedras blancas sobre un aro delgado.'),
  ring('anillo-ref-02', 'Ref. AN-06', 'Anillo corazón', '/fotos/anillos/anillo-ref-02.jpg',
    'Esmeralda dentro de un corazón calado, con piedras blancas en el aro.'),
  ring('anillo-ref-03', 'Ref. AN-07', 'Anillo margarita', '/fotos/anillos/anillo-ref-03.jpg',
    'Esmeralda redonda rodeada de piedras blancas en forma de flor.'),
  ring('anillo-ref-04', 'Ref. AN-08', 'Anillo aro abierto', '/fotos/anillos/anillo-ref-04.jpg',
    'Esmeralda redonda sostenida entre dos brazos que se abren hacia la piedra.'),
  ring('anillo-ref-05', 'Ref. AN-09', 'Anillo estrella', '/fotos/anillos/anillo-ref-05.jpg',
    'Cuatro esmeraldas pequeñas agrupadas en forma de estrella, con piedras blancas en las puntas.'),
  ring('anillo-ref-06', 'Ref. AN-10', 'Anillo halo con lazo', '/fotos/anillos/anillo-ref-06.jpg',
    'Esmeralda redonda con halo de piedras blancas y un lazo que envuelve la montura.'),
  ring('anillo-ref-07', 'Ref. AN-11', 'Anillo dos piedras', '/fotos/anillos/anillo-ref-07.jpg',
    'Esmeralda acompañada de una piedra blanca sobre un aro delgado.'),
  ring('anillo-ref-08', 'Ref. AN-12', 'Anillo trenzado', '/fotos/anillos/anillo-ref-08.jpg',
    'Esmeralda en seis garras sobre un aro trenzado con piedras blancas.', { fit: 'contain' }),

  // Cadenas y cadenas con dije, oro amarillo 18k italiano
  chain("cadena-cajon-1-9mm-45cm", "Ref. CAD-01", "Cajón", 'cadenas', 'cajon', 1.9, '45', 1.02, "/fotos/cadenas/cadena-cajon-1-9mm-45cm.jpg"),
  chain("cadena-lazo-1-2mm-45cm", "Ref. CAD-02", "Lazo", 'cadenas', 'lazo', 1.2, '45', 1.37, "/fotos/cadenas/cadena-lazo-1-2mm-45cm.jpg"),
  chain("cadena-mini-serpiente-0-8mm-45cm", "Ref. CAD-03", "Mini serpiente", 'cadenas', 'serpiente', 0.8, '45', 1.07, "/fotos/cadenas/cadena-mini-serpiente-0-8mm-45cm.jpg"),
  chain("cadena-mini-crispeta-0-5mm-45cm", "Ref. CAD-04", "Mini crispeta", 'cadenas', 'crispeta', 0.5, '45', 0.31, "/fotos/cadenas/cadena-mini-crispeta-0-5mm-45cm.jpg"),
  chain("cadena-mini-lazo-1-6mm-45cm", "Ref. CAD-05", "Mini lazo", 'cadenas', 'lazo', 1.6, '45', 1.36, "/fotos/cadenas/cadena-mini-lazo-1-6mm-45cm.jpg"),
  chain("cadena-lazo-2-2mm-45cm", "Ref. CAD-06", "Lazo", 'cadenas', 'lazo', 2.2, '45', 2.1, "/fotos/cadenas/cadena-lazo-2-2mm-45cm.jpg"),
  chain("cadena-lazo-2-7mm-45cm", "Ref. CAD-07", "Lazo", 'cadenas', 'lazo', 2.7, '45', 3.95, "/fotos/cadenas/cadena-lazo-2-7mm-45cm.jpg", { featured: true }),
  chain("cadena-doble-cubano-2-46mm-45cm", "Ref. CAD-08", "Doble cubano", 'cadenas', 'cubana', 2.46, '45', 2.6, "/fotos/cadenas/cadena-doble-cubano-2-46mm-45cm.jpg", { featured: true }),
  chain("cadena-sedusa-1-7mm-45cm", "Ref. CAD-09", "Sedusa", 'cadenas', 'sedusa', 1.7, '45', 2.37, "/fotos/cadenas/cadena-sedusa-1-7mm-45cm.jpg"),
  chain("cadena-doble-cubano-1-4mm-45cm", "Ref. CAD-10", "Doble cubano", 'cadenas', 'cubana', 1.4, '45', 1.55, "/fotos/cadenas/cadena-doble-cubano-1-4mm-45cm.jpg"),
  chain("cadena-mini-franco-con-serpiente-1mm-40-45cm", "Ref. CDI-01", "Mini franco con serpiente", 'con-dije', 'franco', 1.0, '40-45', 0.8, "/fotos/cadenas/cadena-mini-franco-con-serpiente-1mm-40-45cm.jpg", { charm: "Dije de serpiente" }),
  chain("cadena-mini-rolon-con-corazones-1mm-45cm", "Ref. CDI-02", "Mini rolón con corazones", 'con-dije', 'rolon', 1.0, '45', 1.08, "/fotos/cadenas/cadena-mini-rolon-con-corazones-1mm-45cm.jpg", { charm: "Corazones" }),
  chain("cadena-mini-rolon-1-8mm-45cm", "Ref. CAD-11", "Mini rolón", 'cadenas', 'rolon', 1.8, '45', 1.25, "/fotos/cadenas/cadena-mini-rolon-1-8mm-45cm.jpg"),
  chain("cadena-china-1-6mm-50cm", "Ref. CAD-12", "China", 'cadenas', 'china', 1.6, '50', 2.2, "/fotos/cadenas/cadena-china-1-6mm-50cm.jpg"),
  chain("cadena-singapur-1-4mm-50cm", "Ref. CAD-13", "Singapur", 'cadenas', 'singapur', 1.4, '50', 1.03, "/fotos/cadenas/cadena-singapur-1-4mm-50cm.jpg"),
  chain("cadena-plana-lisa-1-25mm-45cm", "Ref. CAD-14", "Plana lisa", 'cadenas', 'plana', 1.25, '45', 1.4, "/fotos/cadenas/cadena-plana-lisa-1-25mm-45cm.jpg", { soldOut: true }),
  chain("cadena-mini-serpiente-0-8mm-50cm", "Ref. CAD-15", "Mini serpiente", 'cadenas', 'serpiente', 0.8, '50', 1.17, "/fotos/cadenas/cadena-mini-serpiente-0-8mm-50cm.jpg"),
  chain("cadena-mini-rolon-con-bolas-1mm-45cm", "Ref. CDI-03", "Mini rolón con bolas", 'con-dije', 'rolon', 1.0, '45', 1.0, "/fotos/cadenas/cadena-mini-rolon-con-bolas-1mm-45cm.jpg", { charm: "Bolas de 4 y 5 mm", featured: true }),
  chain("cadena-lazo-2-7mm-50cm", "Ref. CAD-16", "Lazo", 'cadenas', 'lazo', 2.7, '50', 4.45, "/fotos/cadenas/cadena-lazo-2-7mm-50cm.jpg"),
  chain("cadena-veneciana-1mm-50cm", "Ref. CAD-17", "Veneciana", 'cadenas', 'veneciana', 1.0, '50', 1.2, "/fotos/cadenas/cadena-veneciana-1mm-50cm.jpg", { soldOut: true }),
  chain("cadena-china-2-6mm-60cm", "Ref. CAD-18", "China", 'cadenas', 'china', 2.6, '60', 3.65, "/fotos/cadenas/cadena-china-2-6mm-60cm.jpg"),
  chain("cadena-mini-franco-0-9mm-60cm", "Ref. CAD-19", "Mini franco", 'cadenas', 'franco', 0.9, '60', 0.75, "/fotos/cadenas/cadena-mini-franco-0-9mm-60cm.jpg"),
  chain("cadena-mini-lazo-1-1mm-60cm", "Ref. CAD-20", "Mini lazo", 'cadenas', 'lazo', 1.1, '60', 1.1, "/fotos/cadenas/cadena-mini-lazo-1-1mm-60cm.jpg"),
  chain("cadena-china-2-4mm-60cm", "Ref. CAD-21", "China", 'cadenas', 'china', 2.4, '60', 4.23, "/fotos/cadenas/cadena-china-2-4mm-60cm.jpg"),
  chain("cadena-franco-1-9mm-60cm", "Ref. CAD-22", "Franco", 'cadenas', 'franco', 1.9, '60', 6.65, "/fotos/cadenas/cadena-franco-1-9mm-60cm.jpg"),
  chain("cadena-lazo-2-4mm-60cm", "Ref. CAD-23", "Lazo", 'cadenas', 'lazo', 2.4, '60', 3.28, "/fotos/cadenas/cadena-lazo-2-4mm-60cm.jpg"),
  chain("cadena-singapur-1-4mm-45cm", "Ref. CAD-24", "Singapur", 'cadenas', 'singapur', 1.4, '45', 0.95, "/fotos/cadenas/cadena-singapur-1-4mm-45cm.jpg"),
  chain("cadena-lazo-3-1mm-60cm", "Ref. CAD-25", "Lazo", 'cadenas', 'lazo', 3.1, '60', 8.3, "/fotos/cadenas/cadena-lazo-3-1mm-60cm.jpg"),
  chain("cadena-mini-rolon-con-treboles-1mm-40-45cm", "Ref. CDI-04", "Mini rolón con tréboles", 'con-dije', 'rolon', 1.0, '40-45', 0.9, "/fotos/cadenas/cadena-mini-rolon-con-treboles-1mm-40-45cm.jpg", { charm: "Tréboles en silueta" }),
  chain("cadena-cubana-martillada-2-7mm-45cm", "Ref. CAD-26", "Cubana martillada", 'cadenas', 'cubana', 2.7, '45', 2.38, "/fotos/cadenas/cadena-cubana-martillada-2-7mm-45cm.jpg", { featured: true }),
  chain("cadena-mini-franco-con-corazon-40-45cm", "Ref. CDI-05", "Mini franco con corazón", 'con-dije', 'franco', null, '40-45', 1.07, "/fotos/cadenas/cadena-mini-franco-con-corazon-40-45cm.jpg", { charm: "Corazón", featured: true }),
  chain("cadena-mini-franco-con-corazones-abrazados-40-45cm", "Ref. CDI-06", "Mini franco con corazones abrazados", 'con-dije', 'franco', null, '40-45', 1.02, "/fotos/cadenas/cadena-mini-franco-con-corazones-abrazados-40-45cm.jpg", { charm: "Corazones abrazados y bolas lisas" }),
  chain("cadena-figaro-3x1-1-6mm-45cm", "Ref. CAD-27", "Fígaro 3x1", 'cadenas', 'figaro', 1.6, '45', 1.6, "/fotos/cadenas/cadena-figaro-3x1-1-6mm-45cm.jpg"),
  chain("cadena-mini-franco-con-treboles-abrazados-42-45cm", "Ref. CDI-07", "Mini franco con tréboles abrazados", 'con-dije', 'franco', null, '42-45', 1.12, "/fotos/cadenas/cadena-mini-franco-con-treboles-abrazados-42-45cm.jpg", { charm: "Tréboles abrazados y bolas lisas, tres oros" }),
  chain("cadena-figaro-3x1-3-3mm-70cm", "Ref. CAD-28", "Fígaro 3x1", 'cadenas', 'figaro', 3.3, '70', 7.28, "/fotos/cadenas/cadena-figaro-3x1-3-3mm-70cm.jpg"),
  chain("cadena-cubana-martillada-2-5mm-60cm", "Ref. CAD-29", "Cubana martillada", 'cadenas', 'cubana', 2.5, '60', 3.03, "/fotos/cadenas/cadena-cubana-martillada-2-5mm-60cm.jpg"),
  chain("cadena-lazo-3-72mm-60cm", "Ref. CAD-30", "Lazo", 'cadenas', 'lazo', 3.72, '60', 10.7, "/fotos/cadenas/cadena-lazo-3-72mm-60cm.jpg"),
  chain("cadena-cubana-martillada-2-7mm-60cm", "Ref. CAD-31", "Cubana martillada", 'cadenas', 'cubana', 2.7, '60', 3.16, "/fotos/cadenas/cadena-cubana-martillada-2-7mm-60cm.jpg"),
  chain("cadena-franco-1-6mm-60cm", "Ref. CAD-32", "Franco", 'cadenas', 'franco', 1.6, '60', 4.35, "/fotos/cadenas/cadena-franco-1-6mm-60cm.jpg"),
]

export const RING_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']

export function getProduct(id) {
  return PRODUCTS.find((x) => x.id === id)
}

export function needsSize(product) {
  return product.kind === 'ring'
}

export function hasPrices() {
  return PRODUCTS.some((p) => p.price != null)
}

// Línea corta que acompaña el nombre en las tarjetas.
export function specLine(p) {
  if (p.kind === 'ring') return p.ref ? `${p.ref} • Con esmeralda` : 'Con esmeralda'
  const parts = [lengthLabel(p.length), `${n(p.grams)} g`]
  return `${p.ref} • Oro 18k, ${parts.join(', ')}`
}
