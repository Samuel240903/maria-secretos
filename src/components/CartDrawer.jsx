import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { ProductImage } from './ProductCard.jsx'
import { specLine } from '../data/products.js'
import { CloseIcon, MinusIcon, PlusIcon } from './Icons.jsx'
import { BRAND, formatPrice, whatsappLink } from '../config.js'

const linePrice = (l) => (l.product.price == null ? 'precio por confirmar' : formatPrice(l.product.price * l.qty))

function totals(lines) {
  const priced = lines.filter((l) => l.product.price != null)
  const pending = lines.length - priced.length
  const subtotal = priced.reduce((n, l) => n + l.qty * l.product.price, 0)
  let label
  if (priced.length === 0) label = 'Se confirma por WhatsApp'
  else if (pending > 0) label = `${formatPrice(subtotal)} + piezas por confirmar`
  else label = formatPrice(subtotal)
  return { subtotal, pending, priced: priced.length, label }
}

function buildOrderMessage(lines, form) {
  const items = lines
    .map((l) => `• ${l.qty} × ${l.product.name} (${specLine(l.product)}${l.size ? `, talla ${l.size}` : ''}): ${linePrice(l)}`)
    .join('\n')
  const who = [form.name && `Nombre: ${form.name}`, form.city && `Ciudad: ${form.city}`, form.notes && `Notas: ${form.notes}`]
    .filter(Boolean)
    .join('\n')
  const t = totals(lines)
  const total = t.priced ? `\n\nSubtotal: ${t.label}` : ''
  return `Hola, quiero hacer este pedido en ${BRAND.name}:\n\n${items}${total}${who ? `\n\n${who}` : ''}`
}

export default function CartDrawer() {
  const { lines, cartOpen, setCartOpen, setQty, removeLine, lastAdded } = useStore()
  const closeRef = useRef(null)
  const [step, setStep] = useState('cart')
  const [form, setForm] = useState({ name: '', city: '', notes: '' })

  useEffect(() => {
    if (!cartOpen) {
      setStep('cart')
      return
    }
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cartOpen, setCartOpen])

  const t = totals(lines)
  const showMeter = BRAND.freeShippingFrom != null && t.pending === 0
  const missing = showMeter ? Math.max(BRAND.freeShippingFrom - t.subtotal, 0) : 0
  const progress = showMeter ? Math.min(t.subtotal / BRAND.freeShippingFrom, 1) : 0

  return (
    <div className={`drawer-root ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
      <div className="drawer-scrim" onClick={() => setCartOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" inert={!cartOpen ? '' : undefined}>
        <header className="drawer-head">
          <h2 id="cart-title">{step === 'cart' ? 'Tu pedido' : 'Datos del pedido'}</h2>
          <button ref={closeRef} className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Cerrar pedido">
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p>Todavía no has agregado piezas.</p>
            <Link to="/catalogo" className="btn btn--solid" onClick={() => setCartOpen(false)}>
              Ver el catálogo
            </Link>
          </div>
        ) : step === 'cart' ? (
          <>
            {showMeter && (
              <div className="shipping-meter">
                <p>
                  {missing > 0
                    ? <>Te faltan <strong>{formatPrice(missing)}</strong> para el envío gratis.</>
                    : <>Tu pedido tiene <strong>envío gratis</strong>.</>}
                </p>
                <div className="meter"><span style={{ transform: `scaleX(${progress})` }} /></div>
              </div>
            )}

            <ul className="cart-lines">
              {lines.map((l) => (
                <li key={l.key} className={`cart-line ${l.key === lastAdded ? 'is-new' : ''}`}>
                  <Link to={`/pieza/${l.id}`} className="cart-thumb" onClick={() => setCartOpen(false)}>
                    <ProductImage product={l.product} />
                  </Link>
                  <div className="cart-line-info">
                    <Link to={`/pieza/${l.id}`} className="cart-line-name" onClick={() => setCartOpen(false)}>
                      {l.product.name}
                    </Link>
                    <p className="cart-line-meta">{specLine(l.product)}{l.size ? `, talla ${l.size}` : ''}</p>
                    <div className="cart-line-row">
                      <div className="stepper" role="group" aria-label={`Cantidad de ${l.product.name}`}>
                        <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Quitar una"><MinusIcon width={16} height={16} /></button>
                        <span aria-live="polite">{l.qty}</span>
                        <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Agregar una" disabled={l.qty >= 10}><PlusIcon width={16} height={16} /></button>
                      </div>
                      <span className={`cart-line-price ${l.product.price == null ? 'is-pending' : ''}`}>
                        {l.product.price == null ? 'Por confirmar' : formatPrice(l.product.price * l.qty)}
                      </span>
                    </div>
                    <button className="link-btn" onClick={() => removeLine(l.key)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="drawer-foot">
              <div className="subtotal">
                <span>Subtotal</span>
                <strong>{t.label}</strong>
              </div>
              <p className="hint">
                {t.pending > 0
                  ? 'Te confirmamos precios, envío y forma de pago por WhatsApp.'
                  : 'El envío y la forma de pago se confirman por WhatsApp.'}
              </p>
              <button className="btn btn--solid btn--wide" onClick={() => setStep('datos')}>
                Continuar con el pedido
              </button>
              <button className="btn btn--line btn--wide btn--tight" onClick={() => setCartOpen(false)}>
                Seguir viendo joyas
              </button>
            </footer>
          </>
        ) : (
          <form
            className="checkout"
            onSubmit={(e) => {
              e.preventDefault()
              window.open(whatsappLink(buildOrderMessage(lines, form)), '_blank', 'noopener')
            }}
          >
            <p className="hint hint--top">
              El pedido se abre en WhatsApp con la lista de piezas. Allí te confirmamos disponibilidad, precio, envío y pago.
            </p>
            <label className="field">
              <span>Nombre</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
            </label>
            <label className="field">
              <span>Ciudad de entrega</span>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} autoComplete="address-level2" required />
            </label>
            <label className="field">
              <span>Notas (opcional)</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Fecha en que lo necesitas, empaque de regalo…"
              />
            </label>
            <div className="subtotal">
              <span>Subtotal</span>
              <strong>{t.label}</strong>
            </div>
            <button type="submit" className="btn btn--solid btn--wide">Enviar pedido por WhatsApp</button>
            <button type="button" className="btn btn--line btn--wide btn--tight" onClick={() => setStep('cart')}>
              Volver al pedido
            </button>
          </form>
        )}
      </aside>
    </div>
  )
}
