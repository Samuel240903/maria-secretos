import { Link } from 'react-router-dom'
import { BRAND, whatsappLink } from '../config.js'
import { LENGTHS } from '../data/products.js'

// Si tienes políticas de envío, cambios o garantía, agrégalas aquí como
// una sección más, con el mismo formato.
const SIZES = [
  ['5', '15,7'], ['6', '16,5'], ['7', '17,3'], ['8', '18,1'], ['9', '18,9'], ['10', '19,8'],
  ['11', '20,6'], ['12', '21,4'], ['13', '22,2'], ['14', '23,0'], ['15', '23,8'], ['16', '24,6'],
]

export default function Help() {
  return (
    <div className="wrap help">
      <header className="catalog-head">
        <h1 className="page-title">Ayuda</h1>
        <p className="catalog-lede">
          Si no encuentras lo que buscas,{' '}
          <a href={whatsappLink('Hola, tengo una pregunta.')} target="_blank" rel="noreferrer">escríbenos por WhatsApp</a>.
        </p>
      </header>

      <nav className="help-nav" aria-label="Temas de ayuda">
        <a href="#pedidos">Cómo hacer un pedido</a>
        <a href="#largos">Guía de largos</a>
        <a href="#tallas">Guía de tallas</a>
        <a href="#cuidado">Cuidado</a>
        <a href="#privacidad">Datos personales</a>
      </nav>

      <section id="pedidos" className="help-section">
        <h2>Cómo hacer un pedido</h2>
        <ol className="help-steps">
          <li>Agrega las piezas que te gusten a tu pedido. En los anillos, elige tu talla.</li>
          <li>Abre el pedido, escribe tu nombre y la ciudad de entrega y toca “Enviar pedido por WhatsApp”.</li>
          <li>Te respondemos por WhatsApp con la disponibilidad, el precio, el costo del envío y la forma de pago.</li>
        </ol>
      </section>

      <section id="largos" className="help-section">
        <h2>Guía de largos de cadena</h2>
        <p>
          El largo se mide de punta a punta con la cadena abierta. Si dudas entre dos, mide una cadena que ya tengas.
        </p>
        <dl className="length-guide">
          {LENGTHS.map((l) => (
            <div key={l.id}>
              <dt><Link to={`/catalogo?largo=${l.id}`}>{l.label}</Link></dt>
              <dd>{l.note}.</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="tallas" className="help-section">
        <h2>Guía de tallas de anillo</h2>
        <p>
          Mide por dentro un anillo que te quede bien y busca su diámetro en la tabla. Si estás entre dos tallas,
          escoge la mayor.
        </p>
        <table className="size-table">
          <thead><tr><th scope="col">Talla</th><th scope="col">Diámetro interior (mm)</th></tr></thead>
          <tbody>{SIZES.map(([t, d]) => <tr key={t}><td>{t}</td><td>{d}</td></tr>)}</tbody>
        </table>
      </section>

      <section id="cuidado" className="help-section">
        <h2>Cuidado de tus joyas</h2>
        <p>
          Quítatelas para nadar, hacer ejercicio o usar productos de limpieza. Guarda cada pieza por separado para que
          las cadenas no se enreden ni se rayen. Límpialas con agua tibia, jabón suave y un paño seco. Con las
          esmeraldas, evita los limpiadores ultrasónicos y los cambios bruscos de temperatura.
        </p>
      </section>

      <section id="privacidad" className="help-section">
        <h2>Tratamiento de datos personales</h2>
        <p>
          Esta página no guarda tus datos: el pedido y los favoritos se quedan en tu navegador, y el pedido se envía
          directamente a nuestro WhatsApp. Usamos tu nombre y ciudad sólo para gestionar tu compra.
          {BRAND.email && <> Escribe a <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> para consultar o borrar tus datos.</>}
        </p>
      </section>
    </div>
  )
}
