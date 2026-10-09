import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard, { Price, ProductImage } from '../components/ProductCard.jsx'
import { HeartIcon, MinusIcon, PlusIcon } from '../components/Icons.jsx'
import NotFound from './NotFound.jsx'
import { CATEGORIES, PRODUCTS, RING_SIZES, getProduct, needsSize } from '../data/products.js'
import { formatPrice, whatsappLink } from '../config.js'
import { useStore } from '../store/StoreContext.jsx'

function relatedFor(product) {
  const others = PRODUCTS.filter((p) => p.id !== product.id && !p.soldOut)
  if (product.kind !== 'chain') return others.filter((p) => p.kind === product.kind).slice(0, 4)
  // primero el mismo eslabón en otros largos o grosores, luego la misma categoría
  const sameLink = others.filter((p) => p.link === product.link)
  const sameCat = others.filter((p) => p.category === product.category && p.link !== product.link)
  return [...sameLink, ...sameCat].slice(0, 4)
}

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    setSize('')
    setQty(1)
    setSizeError(false)
  }, [id])

  if (!product) return <NotFound />

  const category = CATEGORIES.find((c) => c.id === product.category)
  const sized = needsSize(product)
  const fav = isFavorite(product.id)
  const related = relatedFor(product)

  const handleAdd = () => {
    if (sized && !size) {
      setSizeError(true)
      document.getElementById('talla')?.focus()
      return
    }
    addToCart(product.id, { size, qty })
  }

  const waMessage = product.soldOut
    ? `Hola, vi que la pieza "${product.name}" está agotada. ¿Me avisan si vuelve a estar disponible?`
    : `Hola, me interesa la pieza "${product.name}"` +
      (product.price != null ? ` (${formatPrice(product.price)})` : '') +
      '.' + (sized && size ? ` Mi talla es ${size}.` : '') +
      (product.price == null ? ' ¿Me pueden dar el precio y la disponibilidad?' : ' ¿Me pueden dar más información?')

  return (
    <>
      <div className="wrap product">
        <nav className="breadcrumb" aria-label="Ruta">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/catalogo?categoria=${category.id}`}>{category.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="product-layout">
          <div className="photo photo--detail">
            <ProductImage product={product} eager />
            {product.soldOut && <span className="badge badge--sold">Agotado</span>}
          </div>

          <div className="product-info">
            {product.ref && <p className="product-ref">{product.ref}</p>}
            <h1 className="page-title page-title--product">{product.name}</h1>
            <p className="product-material">
              {product.kind === 'chain' ? 'Oro amarillo 18k italiano' : product.material ? `${product.material} con esmeralda natural` : 'Anillo con esmeralda'}
            </p>
            <Price product={product} className="price--detail" />
            <p className="product-description">{product.description}</p>

            {sized && !product.soldOut && (
              <fieldset className="sizes" aria-describedby={sizeError ? 'talla-error' : undefined}>
                <legend id="talla" tabIndex={-1}>Talla</legend>
                <div className="size-grid">
                  {RING_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size ${size === s ? 'is-active' : ''}`}
                      aria-pressed={size === s}
                      onClick={() => { setSize(s); setSizeError(false) }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError ? (
                  <p id="talla-error" className="field-error">Elige una talla para agregar el anillo al pedido.</p>
                ) : (
                  <p className="hint"><Link to="/ayuda#tallas">¿No sabes tu talla? Mira la guía de tallas.</Link></p>
                )}
              </fieldset>
            )}

            {product.soldOut ? (
              <>
                <p className="sold-note">Esta pieza está agotada por ahora.</p>
                <a className="btn btn--solid btn--wide" href={whatsappLink(waMessage)} target="_blank" rel="noreferrer">
                  Avisarme por WhatsApp si vuelve
                </a>
              </>
            ) : (
              <>
                <div className="buy-row">
                  <div className="stepper stepper--large" role="group" aria-label="Cantidad">
                    <button onClick={() => setQty((v) => Math.max(1, v - 1))} aria-label="Quitar una" disabled={qty <= 1}><MinusIcon width={18} height={18} /></button>
                    <span aria-live="polite">{qty}</span>
                    <button onClick={() => setQty((v) => Math.min(10, v + 1))} aria-label="Agregar una" disabled={qty >= 10}><PlusIcon width={18} height={18} /></button>
                  </div>
                  <button className="btn btn--solid buy-main" onClick={handleAdd}>Agregar al pedido</button>
                  <button
                    className={`icon-btn icon-btn--bordered ${fav ? 'is-active' : ''}`}
                    onClick={() => toggleFavorite(product.id)}
                    aria-pressed={fav}
                    aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <HeartIcon filled={fav} />
                  </button>
                </div>
                <a className="btn btn--line btn--wide btn--tight" href={whatsappLink(waMessage)} target="_blank" rel="noreferrer">
                  {product.price == null ? 'Preguntar el precio por WhatsApp' : 'Preguntar por WhatsApp'}
                </a>
              </>
            )}

            <div className="accordion">
              <details open>
                <summary>Detalles de la pieza</summary>
                <dl className="specs">
                  {product.details.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </details>
              <details>
                <summary>Cómo se hace el pedido</summary>
                <p>
                  Agrega las piezas a tu pedido y envíalo por WhatsApp. Te confirmamos disponibilidad, precio,
                  costo de envío y forma de pago antes de que pagues.
                </p>
              </details>
              {product.kind === 'chain' && (
                <details>
                  <summary>¿Qué largo me sirve?</summary>
                  <p>
                    De 40 a 45 cm queda en la base del cuello, 50 cm cae sobre la clavícula y 60 cm a la altura del
                    pecho. <Link to="/ayuda#largos">Ver la guía de largos</Link>.
                  </p>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section--sand" aria-labelledby="relacionadas">
          <div className="wrap">
            <h2 id="relacionadas" className="section-title">
              {product.kind === 'ring' ? 'Otros anillos con esmeralda' : product.kind === 'earring' ? 'Otros topos con esmeralda' : `Más cadenas ${product.link ? 'parecidas' : ''}`.trim()}
            </h2>
            <div className="product-grid product-grid--4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
