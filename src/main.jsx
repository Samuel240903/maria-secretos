import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/StoreContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Product from './pages/Product.jsx'
import Favorites from './pages/Favorites.jsx'
import Help from './pages/Help.jsx'
import NotFound from './pages/NotFound.jsx'
import './styles.css'

// En Vercel se usa BrowserRouter (URLs limpias). VITE_HASH_ROUTER=1 sirve para
// hostings estáticos sin reescrituras.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="pieza/:id" element={<Product />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="ayuda" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  </React.StrictMode>,
)
