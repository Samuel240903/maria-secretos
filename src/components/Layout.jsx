import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BRAND, whatsappLink } from '../config.js'
import { CATEGORIES, LENGTHS, LINKS, PRODUCTS, getProduct } from '../data/products.js'
import { useStore } from '../store/StoreContext.jsx'
import CartDrawer from './CartDrawer.jsx'
import { BagIcon, ChevronIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from './Icons.jsx'

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

// Eslabones que tienen al menos una pieza en el catálogo.
const LINKS_IN_STOCK = Object.entries(LINKS).filter(([id]) => PRODUCTS.some((p) => p.link === id))

export function Logo({ compact = false }) {
  return (
    <span className={`logo ${compact ? 'logo--compact' : ''}`}>
      <img className="logo-mark" src="/logo/monograma.png" alt="" width="200" height="191" />
      <img className="logo-name" src="/logo/nombre.png" alt={BRAND.name} width="497" height="47" />
    </span>
  )
}

function AnnouncementBar() {
  const [i, setI] = useState(0)
  const n = BRAND.announcements.length
  useEffect(() => {
    if (reducedMotion() || n < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000)
    return () => clearInterval(t)
  }, [n])
  return (
    <div className="announce">
      <p key={i} className="announce-text">{BRAND.announcements[i]}</p>
    </div>
  )
}

function SearchForm({ id, onDone }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <form
      role="search"
      className="search"
      onSubmit={(e) => {
        e.preventDefault()
        const term = q.trim()
        navigate(term ? `/catalogo?q=${encodeURIComponent(term)}` : '/catalogo')
        setQ('')
        onDone?.()
      }}
    >
      <label htmlFor={id} className="sr-only">Buscar joyas</label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar cadena lazo, franco, esmeralda…"
        autoComplete="off"
      />
      <button type="submit" aria-label="Buscar"><SearchIcon width={19} height={19} /></button>
    </form>
  )
}

function MegaMenu({ onNavigate }) {
  const promo = getProduct('cadena-doble-cubano-2-46mm-45cm')
  return (
    <div className="mega" id="mega-joyeria">
      <div className="wrap mega-inner">
        <div className="mega-col">
          <h3>Categorías</h3>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}><Link to={`/catalogo?categoria=${c.id}`} onClick={onNavigate}>{c.name}</Link></li>
            ))}
            <li><Link to="/catalogo" onClick={onNavigate}>Ver todo</Link></li>
          </ul>
        </div>
        <div className="mega-col">
          <h3>Cadenas por eslabón</h3>
          <ul className="mega-two-cols">
            {LINKS_IN_STOCK.map(([id, name]) => (
              <li key={id}><Link to={`/catalogo?eslabon=${id}`} onClick={onNavigate}>{name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="mega-col">
          <h3>Cadenas por largo</h3>
          <ul>
            {LENGTHS.map((l) => (
              <li key={l.id}><Link to={`/catalogo?largo=${l.id}`} onClick={onNavigate}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <Link to={`/pieza/${promo.id}`} className="mega-promo" onClick={onNavigate}>
          <img src={promo.image} alt="" loading="lazy" />
          <p><span className="mega-promo-name">{promo.name}</span>Oro amarillo 18k italiano, 45 cm</p>
        </Link>
      </div>
    </div>
  )
}

function Header() {
  const { count, favorites, setCartOpen } = useStore()
  const { pathname, search } = useLocation()
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMegaOpen(false)
    setMobileOpen(false)
  }, [pathname, search])

  useEffect(() => {
    if (!megaOpen && !mobileOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [megaOpen, mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  return (
    <header className="site-header">
      <AnnouncementBar />
      <div className="wrap header-main">
        <button className="icon-btn only-mobile" aria-label="Abrir menú" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </button>
        <Link to="/" className="brand-link" aria-label={`${BRAND.name}, inicio`}><Logo /></Link>
        <div className="header-search only-desktop"><SearchForm id="search-desktop" /></div>
        <div className="header-icons">
          <Link to="/favoritos" className="icon-btn icon-btn--count" aria-label={`Favoritos (${favorites.length})`}>
            <HeartIcon />
            {favorites.length > 0 && <span className="count">{favorites.length}</span>}
          </Link>
          <button className="icon-btn icon-btn--count" onClick={() => setCartOpen(true)} aria-label={`Pedido (${count} piezas)`}>
            <BagIcon />
            {count > 0 && <span className="count">{count}</span>}
          </button>
        </div>
      </div>

      <nav className="main-nav only-desktop" aria-label="Principal" onMouseLeave={() => setMegaOpen(false)}>
        <div className="wrap nav-inner">
          <button
            className={`nav-item nav-item--trigger ${megaOpen ? 'is-open' : ''}`}
            aria-expanded={megaOpen}
            aria-controls="mega-joyeria"
            onClick={() => setMegaOpen((v) => !v)}
            onMouseEnter={() => setMegaOpen(true)}
          >
            Joyería <ChevronIcon width={16} height={16} />
          </button>
          <div className="nav-links" onMouseEnter={() => setMegaOpen(false)}>
            <Link className="nav-item" to="/catalogo?categoria=cadenas">Cadenas</Link>
            <Link className="nav-item" to="/catalogo?categoria=con-dije">Cadenas con dije</Link>
            <Link className="nav-item" to="/catalogo?categoria=anillos">Anillos con esmeralda</Link>
            <Link className="nav-item" to="/#historia">Nuestra historia</Link>
            {BRAND.stores.length > 0 && <Link className="nav-item" to="/#tiendas">Tiendas</Link>}
            <Link className="nav-item" to="/ayuda">Ayuda</Link>
          </div>
        </div>
        {megaOpen && <MegaMenu onNavigate={() => setMegaOpen(false)} />}
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="drawer-scrim" onClick={() => setMobileOpen(false)} />
        <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Menú" inert={!mobileOpen ? '' : undefined}>
          <div className="drawer-head">
            <Logo compact />
            <button className="icon-btn" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}><CloseIcon /></button>
          </div>
          <SearchForm id="search-mobile" onDone={() => setMobileOpen(false)} />
          <ul className="mobile-links">
            {CATEGORIES.map((c) => <li key={c.id}><Link to={`/catalogo?categoria=${c.id}`}>{c.name}</Link></li>)}
            <li><Link to="/catalogo">Ver todo</Link></li>
          </ul>
          <details className="mobile-group">
            <summary>Cadenas por eslabón <ChevronIcon width={18} height={18} /></summary>
            <ul>
              {LINKS_IN_STOCK.map(([id, name]) => <li key={id}><Link to={`/catalogo?eslabon=${id}`}>{name}</Link></li>)}
            </ul>
          </details>
          <details className="mobile-group">
            <summary>Cadenas por largo <ChevronIcon width={18} height={18} /></summary>
            <ul>
              {LENGTHS.map((l) => <li key={l.id}><Link to={`/catalogo?largo=${l.id}`}>{l.label}</Link></li>)}
            </ul>
          </details>
          <ul className="mobile-links">
            <li><Link to="/favoritos">Favoritos</Link></li>
            <li><Link to="/#historia">Nuestra historia</Link></li>
            {BRAND.stores.length > 0 && <li><Link to="/#tiendas">Tiendas</Link></li>}
            <li><Link to="/ayuda">Ayuda</Link></li>
          </ul>
          <a className="btn btn--line btn--wide" href={whatsappLink('Hola, quiero información sobre sus joyas.')} target="_blank" rel="noreferrer">
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <img className="footer-logo" src="/logo/maria-secretos.png" alt={`${BRAND.name}. ${BRAND.tagline}`} width="497" height="497" loading="lazy" />
          <p className="footer-note">
            Hay momentos que merecen ser recordados. Y hay recuerdos que merecen llevarse puestos.{' '}
            <Link to="/#historia">Nuestra historia</Link>
          </p>
          <a className="btn btn--solid" href={whatsappLink('Hola, quiero recibir novedades de María Secretos.')} target="_blank" rel="noreferrer">
            Recibir novedades por WhatsApp
          </a>
        </div>
        <div className="footer-cols">
          <div>
            <h2 className="footer-title">Tienda</h2>
            <ul>
              {CATEGORIES.map((c) => <li key={c.id}><Link to={`/catalogo?categoria=${c.id}`}>{c.name}</Link></li>)}
              <li><Link to="/favoritos">Favoritos</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Cadenas por largo</h2>
            <ul>
              {LENGTHS.map((l) => <li key={l.id}><Link to={`/catalogo?largo=${l.id}`}>{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Ayuda</h2>
            <ul>
              <li><Link to="/ayuda#pedidos">Cómo hacer un pedido</Link></li>
              <li><Link to="/ayuda#largos">Guía de largos</Link></li>
              <li><Link to="/ayuda#tallas">Guía de tallas</Link></li>
              <li><Link to="/ayuda#cuidado">Cuidado de tus joyas</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Contacto</h2>
            <ul>
              <li><a href={whatsappLink('Hola, quiero información sobre sus joyas.')} target="_blank" rel="noreferrer">WhatsApp</a></li>
              {BRAND.email && <li><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>}
              {BRAND.instagram && <li><a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer">Instagram</a></li>}
              {BRAND.stores.length > 0 && <li><Link to="/#tiendas">Tiendas</Link></li>}
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap footer-legal">
        <p>© {new Date().getFullYear()} {BRAND.name}. Precios en pesos colombianos.</p>
        <p><Link to="/ayuda#privacidad">Tratamiento de datos personales</Link></p>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname, hash, search } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    if (pathname === '/catalogo') return
    window.scrollTo(0, 0)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <a href="#contenido" className="skip-link">Ir al contenido</a>
      <Header />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
