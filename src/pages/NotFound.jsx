import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap empty empty--page">
      <h1 className="page-title">No encontramos esta página</h1>
      <p>Puede que la pieza ya no esté en el catálogo o que el enlace tenga un error.</p>
      <Link to="/catalogo" className="btn btn--solid">Ir al catálogo</Link>
    </div>
  )
}
