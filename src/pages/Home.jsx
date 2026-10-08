import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroCarousel from '../components/HeroCarousel.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { ChatIcon, ShieldIcon, PenIcon } from '../components/Icons.jsx'
import { CATEGORIES, LENGTHS, LINKS, PRODUCTS, getProduct } from '../data/products.js'
import { BRAND } from '../config.js'

const CATEGORY_COVER = {
  cadenas: 'cadena-doble-cubano-2-46mm-45cm',
  'con-dije': 'cadena-mini-franco-con-corazones-abrazados-40-45cm',
  anillos: 'anillo-gota',
}

const LINK_COVER = {
  lazo: 'cadena-lazo-2-7mm-50cm',
  franco: 'cadena-franco-1-9mm-60cm',
  cubana: 'cadena-cubana-martillada-2-7mm-45cm',
  china: 'cadena-china-2-6mm-60cm',
  singapur: 'cadena-singapur-1-4mm-50cm',
  rolon: 'cadena-mini-rolon-1-8mm-45cm',
}

function LengthTabs() {
  const [tab, setTab] = useState('45')
  const current = LENGTHS.find((l) => l.id === tab)
  const all = PRODUCTS.filter((p) => p.kind === 'chain' && !p.soldOut && current.test(p.length))
  const items = [...all.filter((p) => p.featured), ...all.filter((p) => !p.featured)].slice(0, 4)
  return (
    <section className="section" aria-labelledby="largos-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 id="largos-title" className="section-title">Encuentra tu largo</h2>
            <p className="section-lede" aria-live="polite">{current.note}.</p>
          </div>
          <div className="tabs" role="tablist" aria-label="Largo de la cadena">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                role="tab"
                id={`tab-${l.id}`}
                aria-selected={tab === l.id}
                aria-controls="tab-panel"
                className={`tab ${tab === l.id ? 'is-active' : ''}`}
                onClick={() => setTab(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="product-grid product-grid--4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <Link to={`/catalogo?largo=${tab}`} className="text-link more-link">
          Ver las {all.length} cadenas de {current.label}
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  const rings = PRODUCTS.filter((p) => p.kind === 'ring')
  const featuredRings = rings.filter((p) => p.featured)
  const chainCount = PRODUCTS.filter((p) => p.kind === 'chain').length

  return (
    <>
      <HeroCarousel />

      <ul className="benefits">
        <li><ShieldIcon /><span><strong>Oro amarillo 18k</strong> italiano en todas las cadenas</span></li>
        <li><PenIcon /><span><strong>Peso y medidas</strong> publicados en cada pieza</span></li>
        <li><ChatIcon /><span><strong>Pedido y asesoría</strong> por WhatsApp</span></li>
      </ul>

      <section id="historia" className="section story" aria-labelledby="historia-title">
        <div className="wrap story-inner">
          <div className="story-aside">
            <h2 id="historia-title" className="story-kicker">Historia de María Secretos</h2>
            <blockquote className="story-quote">
              <p>Hay momentos que merecen ser recordados. Y hay recuerdos que merecen llevarse puestos.</p>
            </blockquote>
            <p className="story-sign">
              <span>María Secretos</span>
              Joyas para los momentos que solo tú conoces.
            </p>
          </div>
          <div className="story-text">
            <p>
              <strong>María Secretos</strong> nació de una idea sencilla, pero profundamente especial: cada vida está
              hecha de momentos que merecen ser recordados.
            </p>
            <p>
              Hay momentos que celebramos con todos y otros que guardamos solamente para nosotros. Un nuevo comienzo, un
              sueño cumplido, una decisión que nos costó tomar, una etapa que logramos cerrar, una persona que amamos, un
              día cualquiera que decidimos convertir en especial.
            </p>
            <p>Y pensamos que algunos de esos momentos merecen algo más que un recuerdo. <em>Merecen una joya.</em></p>
            <p>
              Porque una joya no es solamente un objeto bonito. Es una forma de decirnos: “esto que estoy viviendo
              también importa”.
            </p>
            <p>
              María Secretos nace para celebrar esa parte de nosotros que pocas veces mostramos. Esa que sueña, que
              espera, que se esfuerza, que vuelve a empezar y que también aprende que no todo lo hermoso tiene que ser
              para después.
            </p>
            <p>
              Creemos en el lujo de poder darnos un gusto. En elegir una joya no solamente para una ocasión especial,
              sino porque nosotras mismas podemos ser la ocasión especial.
            </p>
            <p>
              Por eso seleccionamos piezas que buscan transmitir elegancia, exclusividad y personalidad; joyas capaces
              de acompañar una historia y convertirse, con el tiempo, en parte de ella.
            </p>
            <p>María Secretos es ese pequeño lujo que nos permitimos por nosotros mismos.</p>
            <p className="story-close">
              Porque hay secretos que no necesitan palabras.
              <br />
              A veces, se llevan puestos.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="categorias">
        <div className="wrap">
          <h2 id="categorias" className="section-title">Compra por categoría</h2>
          <ul className="collection-grid">
            {CATEGORIES.map((c) => {
              const cover = getProduct(CATEGORY_COVER[c.id])
              const count = PRODUCTS.filter((p) => p.category === c.id).length
              return (
                <li key={c.id}>
                  <Link to={`/catalogo?categoria=${c.id}`} className="collection-card">
                    <div className="photo photo--wide">
                      <img src={cover.image} alt="" loading="lazy" />
                    </div>
                    <h3>{c.name}</h3>
                    <p>{c.note}. {count} piezas.</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="emerald-feature" aria-labelledby="esmeraldas-title">
        <div className="wrap emerald-inner">
          <div className="emerald-copy">
            <h2 id="esmeraldas-title" className="section-title">Anillos con esmeralda</h2>
            <p>
              Esmeraldas en monturas delicadas: solitarios, halos, flores y gotas. Elige tu talla y te confirmamos
              disponibilidad por WhatsApp.
            </p>
            <Link to="/catalogo?categoria=anillos" className="btn btn--solid">
              Ver los {rings.length} anillos
            </Link>
          </div>
          <ul className="emerald-strip">
            {featuredRings.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Link to={`/pieza/${p.id}`} className="emerald-item">
                  <div className="emerald-photo"><img src={p.image} alt="" loading="lazy" /></div>
                  <span className="emerald-name">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LengthTabs />

      <section className="section section--sand" aria-labelledby="eslabon-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="eslabon-title" className="section-title">Compra por eslabón</h2>
            <Link to="/catalogo?categoria=cadenas" className="text-link">Ver las {chainCount} cadenas</Link>
          </div>
          <ul className="category-tiles">
            {Object.entries(LINK_COVER).map(([id, pid]) => {
              const cover = getProduct(pid)
              const count = PRODUCTS.filter((p) => p.link === id).length
              return (
                <li key={id}>
                  <Link to={`/catalogo?eslabon=${id}`} className="category-tile">
                    <div className="photo photo--round"><img src={cover.image} alt="" loading="lazy" /></div>
                    <span className="category-tile-name">{LINKS[id]}</span>
                    <span className="category-tile-count">{count} {count === 1 ? 'cadena' : 'cadenas'}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {BRAND.stores.length > 0 && (
        <section id="tiendas" className="section" aria-labelledby="tiendas-title">
          <div className="wrap stores">
            <div>
              <h2 id="tiendas-title" className="section-title">Nuestras tiendas</h2>
              <p className="stores-lede">Ven a ver las piezas en persona y a medir tu talla.</p>
            </div>
            <ul className="store-list">
              {BRAND.stores.map((s) => (
                <li key={s.name} className="store">
                  <h3>{s.name}</h3>
                  <p>{s.address}, {s.city}</p>
                  {s.hours.map((h) => <p key={h} className="store-hours">{h}</p>)}
                  <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="text-link">Cómo llegar</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
