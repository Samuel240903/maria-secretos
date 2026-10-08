import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { getProduct } from '../data/products.js'
import { useStore } from '../store/StoreContext.jsx'

export default function Favorites() {
  const { favorites } = useStore()
  const items = favorites.map(getProduct).filter(Boolean)

  return (
    <div className="wrap catalog">
      <header className="catalog-head">
        <h1 className="page-title">Favoritos</h1>
        <p className="catalog-lede">
          {items.length
            ? 'Las piezas que guardaste quedan aquí en este navegador.'
            : 'Toca el corazón de cualquier pieza para guardarla y verla aquí después.'}
        </p>
      </header>
      {items.length ? (
        <div className="product-grid product-grid--4 favorites-grid">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="empty">
          <Link to="/catalogo" className="btn btn--solid">Ver el catálogo</Link>
        </div>
      )}
    </div>
  )
}
