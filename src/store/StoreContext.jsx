import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProduct } from '../data/products.js'

const StoreContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible: el carrito vive sólo en memoria */
  }
}

// Cada línea del carrito: { key, id, size, qty }
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('ms-pedido', []))
  const [favorites, setFavorites] = useState(() => load('ms-favoritos', []))
  const [cartOpen, setCartOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(null)

  useEffect(() => save('ms-pedido', cart), [cart])
  useEffect(() => save('ms-favoritos', favorites), [favorites])

  const addToCart = useCallback((id, { size = '', qty = 1 } = {}) => {
    const key = `${id}|${size}`
    setCart((lines) => {
      const found = lines.find((l) => l.key === key)
      if (found) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
      return [...lines, { key, id, size, qty }]
    })
    setLastAdded(key)
    setCartOpen(true)
  }, [])

  const setQty = useCallback((key, qty) => {
    setCart((lines) =>
      qty <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 10) } : l)),
    )
  }, [])

  const removeLine = useCallback((key) => setCart((lines) => lines.filter((l) => l.key !== key)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const toggleFavorite = useCallback((id) => {
    setFavorites((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
  }, [])

  const value = useMemo(() => {
    const lines = cart
      .map((l) => ({ ...l, product: getProduct(l.id) }))
      .filter((l) => l.product)
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
    return {
      lines, count, subtotal, favorites, cartOpen, lastAdded,
      setCartOpen, addToCart, setQty, removeLine, clearCart, toggleFavorite,
      isFavorite: (id) => favorites.includes(id),
    }
  }, [cart, favorites, cartOpen, lastAdded, addToCart, setQty, removeLine, clearCart, toggleFavorite])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
