import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { CloseIcon } from '../components/Icons.jsx'
import {
  CATEGORIES, LENGTHS, LINKS, PRICE_RANGES, PRODUCTS, WIDTHS, hasPrices,
} from '../data/products.js'

const PRICED = hasPrices()

const SORTS = {
  relevancia: { label: 'Relevancia', fn: () => 0 },
  ...(PRICED ? {
    'precio-asc': { label: 'Precio: menor a mayor', fn: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) },
    'precio-desc': { label: 'Precio: mayor a menor', fn: (a, b) => (b.price ?? -1) - (a.price ?? -1) },
  } : {}),
  'peso-asc': { label: 'Peso: menor a mayor', fn: (a, b) => (a.grams ?? Infinity) - (b.grams ?? Infinity) },
  'grosor-desc': { label: 'Grosor: mayor a menor', fn: (a, b) => (b.mm ?? -1) - (a.mm ?? -1) },
  nombre: { label: 'Nombre: A a Z', fn: (a, b) => a.name.localeCompare(b.name, 'es') },
}

const usedLinks = Object.entries(LINKS).filter(([id]) => PRODUCTS.some((p) => p.link === id))

// Grupos de filtros: clave en la URL, título y opciones.
const GROUPS = [
  { key: 'categoria', title: 'Tipo de pieza', options: CATEGORIES.map((c) => [c.id, c.name]), test: (p, v) => v.includes(p.category) },
  { key: 'eslabon', title: 'Eslabón', options: usedLinks, test: (p, v) => v.includes(p.link) },
  { key: 'largo', title: 'Largo', options: LENGTHS.map((l) => [l.id, l.label]), test: (p, v) => p.length != null && LENGTHS.some((l) => v.includes(l.id) && l.test(p.length)) },
  { key: 'grosor', title: 'Grosor', options: WIDTHS.map((w) => [w.id, w.label]), test: (p, v) => WIDTHS.some((w) => v.includes(w.id) && w.test(p.mm)) },
  ...(PRICED ? [{
    key: 'precio',
    title: 'Precio',
    options: PRICE_RANGES.map((r) => [r.id, r.label]),
    test: (p, v) => p.price != null && PRICE_RANGES.filter((r) => v.includes(r.id)).some((r) => p.price >= r.min && p.price < r.max),
  }] : []),
  { key: 'estado', title: 'Disponibilidad', options: [['disponible', 'Disponible']], test: (p) => !p.soldOut },
]

const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function matchesQuery(p, q) {
  const hay = normalize(
    [p.name, p.description, p.ref, p.charm, LINKS[p.link], CATEGORIES.find((c) => c.id === p.category)?.name, p.kind === 'ring' ? 'anillo esmeralda' : 'cadena oro 18k']
      .filter(Boolean).join(' '),
  )
  return normalize(q).split(/\s+/).filter(Boolean).every((w) => hay.includes(w.length > 3 ? w.replace(/(es|s)$/, '') : w))
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [panelOpen, setPanelOpen] = useState(false)
  const q = params.get('q') || ''
  const sort = SORTS[params.get('orden')] ? params.get('orden') : 'relevancia'

  const selected = useMemo(
    () => Object.fromEntries(GROUPS.map((g) => [g.key, (params.get(g.key) || '').split(',').filter(Boolean)])),
    [params],
  )

  const toggle = (key, value) => {
    const next = new URLSearchParams(params)
    const current = selected[key]
    const list = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    if (list.length) next.set(key, list.join(','))
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const clearAll = () => {
    const next = new URLSearchParams()
    if (params.get('orden')) next.set('orden', params.get('orden'))
    setParams(next, { replace: true })
  }

  const removeQuery = () => {
    const next = new URLSearchParams(params)
    next.delete('q')
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const list = PRODUCTS.filter((p) => GROUPS.every((g) => !selected[g.key].length || g.test(p, selected[g.key])))
      .filter((p) => !q || matchesQuery(p, q))
    return [...list].sort(SORTS[sort].fn)
  }, [selected, q, sort])

  // Cuántas piezas quedan al marcar cada opción (respetando los demás grupos).
  const countFor = (group, value) =>
    PRODUCTS.filter((p) =>
      GROUPS.every((g) => {
        const vals = g.key === group.key ? [value] : selected[g.key]
        return !vals.length || g.test(p, vals)
      }) && (!q || matchesQuery(p, q)),
    ).length

  const active = GROUPS.flatMap((g) =>
    selected[g.key].map((v) => ({ key: g.key, value: v, label: g.options.find(([id]) => id === v)?.[1] || v })),
  )

  useEffect(() => {
    document.body.style.overflow = panelOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [panelOpen])

  const singleCategory = selected.categoria.length === 1 && CATEGORIES.find((c) => c.id === selected.categoria[0])
  const singleLink = selected.eslabon.length === 1 && LINKS[selected.eslabon[0]]
  const singleLength = selected.largo.length === 1 && LENGTHS.find((l) => l.id === selected.largo[0])
  const title = q
    ? `Resultados para “${q}”`
    : (singleLink && `Cadenas ${singleLink.toLowerCase()}`) ||
      (singleLength && !singleCategory && `Cadenas de ${singleLength.label}`) ||
      singleCategory?.name || 'Toda la joyería'
  const lede = singleLink
    ? `Cadenas de eslabón ${singleLink.toLowerCase()} en oro amarillo 18k italiano.`
    : singleCategory?.note || 'Cadenas en oro amarillo 18k italiano y anillos con esmeralda.'

  return (
    <div className="wrap catalog">
      <header className="catalog-head">
        <h1 className="page-title">{title}</h1>
        <p className="catalog-lede">{lede}</p>
      </header>

      <div className="catalog-toolbar">
        <button className="btn btn--line btn--small only-mobile" onClick={() => setPanelOpen(true)}>
          Filtros{active.length ? ` (${active.length})` : ''}
        </button>
        <p className="results-count" aria-live="polite">
          {results.length} {results.length === 1 ? 'pieza' : 'piezas'}
        </p>
        <label className="sort">
          <span>Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              if (e.target.value === 'relevancia') next.delete('orden')
              else next.set('orden', e.target.value)
              setParams(next, { replace: true })
            }}
          >
            {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {(active.length > 0 || q) && (
        <ul className="active-filters" aria-label="Filtros aplicados">
          {q && (
            <li>
              <button className="chip chip--remove" onClick={removeQuery}>
                Búsqueda: {q} <CloseIcon width={14} height={14} />
              </button>
            </li>
          )}
          {active.map((f) => (
            <li key={`${f.key}-${f.value}`}>
              <button className="chip chip--remove" onClick={() => toggle(f.key, f.value)} aria-label={`Quitar filtro ${f.label}`}>
                {f.label} <CloseIcon width={14} height={14} />
              </button>
            </li>
          ))}
          {active.length > 0 && <li><button className="link-btn" onClick={clearAll}>Limpiar filtros</button></li>}
        </ul>
      )}

      <div className="catalog-body">
        <div className={`filters-panel ${panelOpen ? 'is-open' : ''}`}>
          <div className="drawer-scrim only-mobile" onClick={() => setPanelOpen(false)} />
          <aside className="filters" aria-label="Filtros">
            <div className="drawer-head only-mobile">
              <h2>Filtros</h2>
              <button className="icon-btn" onClick={() => setPanelOpen(false)} aria-label="Cerrar filtros"><CloseIcon /></button>
            </div>
            {GROUPS.map((g) => (
              <fieldset key={g.key} className="filter-group">
                <legend>{g.title}</legend>
                {g.options.map(([id, label]) => {
                  const n = countFor(g, id)
                  const checked = selected[g.key].includes(id)
                  return (
                    <label key={id} className={`check ${n === 0 && !checked ? 'is-disabled' : ''}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggle(g.key, id)} disabled={n === 0 && !checked} />
                      <span className="check-box" aria-hidden="true" />
                      <span className="check-label">{label}</span>
                      <span className="check-count">{n}</span>
                    </label>
                  )
                })}
              </fieldset>
            ))}
            <div className="filters-foot only-mobile">
              <button className="btn btn--solid btn--wide" onClick={() => setPanelOpen(false)}>
                Ver {results.length} {results.length === 1 ? 'pieza' : 'piezas'}
              </button>
            </div>
          </aside>
        </div>

        <div className="catalog-results">
          {results.length > 0 ? (
            <div className="product-grid product-grid--3">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty">
              <p>No encontramos piezas con esa combinación. Prueba quitando algún filtro o con otra búsqueda.</p>
              <button className="btn btn--line" onClick={() => setParams({}, { replace: true })}>Ver toda la joyería</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
