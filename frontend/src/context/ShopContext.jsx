import { createContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { products as seedProducts } from '../assets/assets'

export const ShopContext = createContext()

const readJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const currency = '₹'
  const delivery_fee = 99

  const [products, setProducts] = useState(() => readJSON('agfashion_products', readJSON('forever_products', seedProducts)))
  const [cartItems, setCartItems] = useState(() => readJSON('forever_cart', {}))
  const [orders, setOrders] = useState(() => readJSON('agfashion_orders', readJSON('forever_orders', [])))
  const [user, setUser] = useState(() => readJSON('forever_user', null))
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => { localStorage.setItem('agfashion_products', JSON.stringify(products)); localStorage.setItem('forever_products', JSON.stringify(products)) }, [products])
  useEffect(() => localStorage.setItem('forever_cart', JSON.stringify(cartItems)), [cartItems])
  useEffect(() => { localStorage.setItem('agfashion_orders', JSON.stringify(orders)); localStorage.setItem('forever_orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => {
    if (user) localStorage.setItem('forever_user', JSON.stringify(user))
    else localStorage.removeItem('forever_user')
  }, [user])

  const token = user ? 'local-demo-token' : ''

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error('Please select a size')
      return
    }
    setCartItems(prev => {
      const next = structuredClone(prev)
      if (!next[itemId]) next[itemId] = {}
      next[itemId][size] = (next[itemId][size] || 0) + 1
      return next
    })
    toast.success('Added to cart')
  }

  const updateQuantity = (itemId, size, quantity) => {
    setCartItems(prev => {
      const next = structuredClone(prev)
      if (!next[itemId]) return next
      if (quantity <= 0) {
        delete next[itemId][size]
        if (Object.keys(next[itemId]).length === 0) delete next[itemId]
      } else {
        next[itemId][size] = quantity
      }
      return next
    })
  }

  const getCartCount = () => Object.values(cartItems).reduce(
    (sum, sizes) => sum + Object.values(sizes).reduce((a, b) => a + Number(b || 0), 0), 0
  )

  const getCartAmount = () => Object.entries(cartItems).reduce((total, [id, sizes]) => {
    const product = products.find(p => p._id === id)
    if (!product) return total
    return total + Object.values(sizes).reduce((sum, qty) => sum + product.price * Number(qty || 0), 0)
  }, 0)

  const getCartItems = () => Object.entries(cartItems).flatMap(([id, sizes]) => {
    const product = products.find(p => p._id === id)
    if (!product) return []
    return Object.entries(sizes).filter(([, qty]) => qty > 0).map(([size, quantity]) => ({ product, size, quantity }))
  })

  const login = (email, password, name = '') => {
    if (!email || !password) return false
    const users = readJSON('forever_users', [])
    let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!existing) {
      existing = { id: crypto.randomUUID(), name: name || email.split('@')[0], email, password }
      localStorage.setItem('forever_users', JSON.stringify([...users, existing]))
    }
    setUser({ id: existing.id, name: existing.name, email: existing.email })
    return true
  }

  const logout = () => {
    setUser(null)
    navigate('/')
    toast.success('Logged out')
  }

  const placeOrder = ({ address, method }) => {
    const items = getCartItems()
    if (!items.length) return null
    const subtotal = getCartAmount()
    const order = {
      _id: `ORD-${Date.now()}`,
      date: Date.now(),
      status: 'Order Placed',
      payment: method !== 'cod',
      paymentMethod: method === 'cod' ? 'Cash on Delivery' : method === 'upi' ? 'UPI (Demo)' : 'Card (Demo)',
      amount: subtotal + delivery_fee,
      address,
      items: items.map(({ product, size, quantity }) => ({ ...product, image: product.image, size, quantity }))
    }
    setOrders(prev => [order, ...prev])
    setCartItems({})
    return order
  }

  const resetDemoData = () => {
    setProducts(seedProducts)
    setCartItems({})
    setOrders([])
    toast.success('Demo store reset')
  }

  const value = useMemo(() => ({
    products, setProducts, currency, delivery_fee, search, setSearch, showSearch, setShowSearch,
    cartItems, setCartItems, addToCart, updateQuantity, getCartCount, getCartAmount, getCartItems,
    navigate, backendUrl: '', token, user, setToken: () => {}, logout, login, orders, setOrders,
    placeOrder, resetDemoData
  }), [products, cartItems, orders, user, search, showSearch])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export default ShopContextProvider
