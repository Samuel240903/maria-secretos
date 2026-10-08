import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from './Icons.jsx'
import { getProduct } from '../data/products.js'

const SLIDES = [
  {
    tone: 'satin',
    kicker: 'Cadenas',
    title: 'Oro amarillo 18k italiano.',
    text: 'Lazo, franco, cubana, singapur y más eslabones, en largos de 40 a 70 cm.',
    cta: 'Ver cadenas',
    to: '/catalogo?categoria=cadenas',
    product: 'cadena-doble-cubano-2-46mm-45cm',
  },
  {
    tone: 'white',
    kicker: 'Anillos con esmeralda',
    title: 'El verde de la esmeralda, en tu mano.',
    text: 'Solitarios, halos y flores con esmeralda para llevar todos los días.',
    cta: 'Ver anillos',
    to: '/catalogo?categoria=anillos',
    product: 'anillo-esmeralda-ovalada',
  },
  {
    tone: 'pearl',
    kicker: 'Cadenas con dije',
    title: 'Un detalle que se nota.',
    text: 'Corazones, tréboles y bolas lisas sobre cadenas finas de 40 a 45 cm.',
    cta: 'Ver cadenas con dije',
    to: '/catalogo?categoria=con-dije',
    product: 'cadena-mini-franco-con-corazon-40-45cm',
  },
]

function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReduced())
  const [hovered, setHovered] = useState(false)
  const n = SLIDES.length

  useEffect(() => {
    if (!playing || hovered) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % n), 7000)
    return () => clearTimeout(t)
  }, [index, playing, hovered, n])

  const go = (i) => setIndex((i + n) % n)

  return (
    <section
      className="carousel"
      aria-roledescription="carrusel"
      aria-label="Destacados"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {SLIDES.map((s, i) => {
        const product = getProduct(s.product)
        const active = i === index
        return (
          <div
            key={s.kicker}
            className={`slide slide--${s.tone} ${active ? 'is-active' : ''}`}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${n}`}
            aria-hidden={!active}
            inert={!active ? '' : undefined}
          >
            <div className="wrap slide-inner">
              <div className="slide-copy">
                <p className="slide-kicker">{s.kicker}</p>
                {i === 0 ? <h1 className="slide-title">{s.title}</h1> : <h2 className="slide-title">{s.title}</h2>}
                <p className="slide-text">{s.text}</p>
                <Link to={s.to} className="btn btn--solid">{s.cta}</Link>
              </div>
              <Link to={`/pieza/${product.id}`} className="slide-art" tabIndex={-1} aria-hidden="true">
                <div className="arch">
                  <img src={product.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              </Link>
            </div>
          </div>
        )
      })}

      <div className="wrap carousel-controls">
        <div className="dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.kicker}
              className={`dot ${i === index ? 'is-active' : ''}`}
              aria-label={`Ir a ${s.kicker}`}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="carousel-buttons">
          <button className="round-btn" onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pausar carrusel' : 'Reproducir carrusel'}>
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2" width="2.5" height="10" fill="currentColor" /><rect x="8.5" y="2" width="2.5" height="10" fill="currentColor" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2l8 5-8 5z" fill="currentColor" /></svg>
            )}
          </button>
          <button className="round-btn" onClick={() => go(index - 1)} aria-label="Anterior"><ArrowIcon dir="left" width={18} height={18} /></button>
          <button className="round-btn" onClick={() => go(index + 1)} aria-label="Siguiente"><ArrowIcon width={18} height={18} /></button>
        </div>
      </div>
    </section>
  )
}
