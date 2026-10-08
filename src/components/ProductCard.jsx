import { Link } from 'react-router-dom'
import { HeartIcon } from './Icons.jsx'
import { needsSize, specLine } from '../data/products.js'
import { formatPrice } from '../config.js'
import { useStore } from '../store/StoreContext.jsx'

export function ProductImage({ product, className = '', eager = false }) {
  return (
    <img
      className={`product-img ${product.fit === 'contain' ? 'product-img--contain' : ''} ${className}`}
      src={product.image}
      alt={product.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export function Price({ product, className = '' }) {
  if (product.price == null) {
    return <p className={`price price--ask ${className}`}>Precio a consultar</p>
  }
  return (
    <p className={`price ${className}`}>
      {product.compareAt && (
        <s className="price-old" aria-label={`Antes ${formatPrice(product.compareAt)}`}>{formatPrice(product.compareAt)}</s>
      )}
      <span className={product.compareAt ? 'price-sale' : ''}>{formatPrice(product.price)}</span>
    </p>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const fav = isFavorite(product.id)
  const sized = needsSize(product)

  return (
    <article className={`product-card ${product.soldOut ? 'is-sold-out' : ''}`}>
      <div className="photo">
        <Link to={`/pieza/${product.id}`} className="photo-link" tabIndex={-1} aria-hidden="true">
          <ProductImage product={product} />
        </Link>
        {product.soldOut && <span className="badge badge--sold">Agotado</span>}
        <button
          className={`fav-btn ${fav ? 'is-active' : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={fav}
          aria-label={fav ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
        >
          <HeartIcon filled={fav} width={20} height={20} />
        </button>
        {!product.soldOut && (sized ? (
          <Link to={`/pieza/${product.id}`} className="quick-add">Elegir talla</Link>
        ) : (
          <button className="quick-add" onClick={() => addToCart(product.id)}>Agregar al pedido</button>
        ))}
      </div>
      <div className="product-meta">
        <h3 className="product-name"><Link to={`/pieza/${product.id}`}>{product.name}</Link></h3>
        <p className="product-material">{specLine(product)}</p>
        <Price product={product} />
      </div>
    </article>
  )
}
