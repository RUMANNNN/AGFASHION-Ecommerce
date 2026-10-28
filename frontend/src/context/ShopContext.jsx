import { createContext, useEffect, useMemo, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { products as seedProducts } from '../assets/assets'

export const ShopContext = createContext()

const readJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const getProductId = product => String(product?._id ?? product?.id ?? '')

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate()

  const currency = '₹'
  const delivery_fee = 0

  // Load saved products and merge them with original products.
  // Products intentionally deleted by the admin remain deleted.
  const [products, setProducts] = useState(() => {
    const deletedIds = new Set(
      readJSON('agfashion_deleted_product_ids', []).map(String)
    )

    const stored = localStorage.getItem('agfashion_products')
    const legacyStored = localStorage.getItem('forever_products')

    let savedProducts = []

    if (stored !== null) {
      savedProducts = readJSON('agfashion_products', [])
    } else if (legacyStored !== null) {
      savedProducts = readJSON('forever_products', [])
    }

    if (!Array.isArray(savedProducts)) {
      savedProducts = []
    }

    // Saved products take priority over seed products with the same ID.
    const mergedProducts = [
      ...seedProducts,
      ...savedProducts
    ]

    const uniqueProducts = Array.from(
      new Map(
        mergedProducts
          .filter(product => product && getProductId(product))
          .map(product => [getProductId(product), product])
      ).values()
    )

    return uniqueProducts.filter(
      product => !deletedIds.has(getProductId(product))
    )
  })

  // Load cart
  const [cartItems, setCartItems] = useState(() =>
    readJSON('forever_cart', {})
  )

  // Load orders
  const [orders, setOrders] = useState(() =>
    readJSON('agfashion_orders', readJSON('forever_orders', []))
  )

  // Load logged-in user
  const [user, setUser] = useState(() =>
    readJSON('forever_user', null)
  )

  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Prevent accidental duplicate clicks on the same item.
  const lastAddRef = useRef({ key: '', time: 0 })

  // Save products
  useEffect(() => {
    localStorage.setItem('agfashion_products', JSON.stringify(products))
    localStorage.setItem('forever_products', JSON.stringify(products))
  }, [products])

  // Save cart
  useEffect(() => {
    localStorage.setItem('forever_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Save orders
  useEffect(() => {
    localStorage.setItem('agfashion_orders', JSON.stringify(orders))
    localStorage.setItem('forever_orders', JSON.stringify(orders))
  }, [orders])

  // Save user
  useEffect(() => {
    if (user) {
      localStorage.setItem('forever_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('forever_user')
    }
  }, [user])

  const token = user ? 'local-demo-token' : ''

  // Add product to cart
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error('Please select a size')
      return
    }

    const key = `${String(itemId)}-${String(size)}`
    const now = Date.now()

    if (
      lastAddRef.current.key === key &&
      now - lastAddRef.current.time < 400
    ) {
      return
    }

    lastAddRef.current = { key, time: now }

    setCartItems(prev => {
      const next = { ...prev }
      const currentSizes = { ...(next[itemId] || {}) }

      currentSizes[size] = Number(currentSizes[size] || 0) + 1
      next[itemId] = currentSizes

      return next
    })

    toast.success('Added to cart')
  }

  // Update or remove product quantity
  const updateQuantity = (itemId, size, quantity) => {
    setCartItems(prev => {
      const next = { ...prev }
      const currentSizes = { ...(next[itemId] || {}) }

      if (Number(quantity) <= 0) {
        delete currentSizes[size]

        if (Object.keys(currentSizes).length === 0) {
          delete next[itemId]
        } else {
          next[itemId] = currentSizes
        }
      } else {
        currentSizes[size] = Number(quantity)
        next[itemId] = currentSizes
      }

      return next
    })
  }

  // Total number of items in cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (sum, sizes) => {
        return (
          sum +
          Object.values(sizes || {}).reduce(
            (total, quantity) =>
              total + Math.max(0, Number(quantity) || 0),
            0
          )
        )
      },
      0
    )
  }

  // Find product by ID
  const findProduct = id => {
    return products.find(
      product => getProductId(product) === String(id)
    )
  }

  // Calculate subtotal
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce(
      (total, [id, sizes]) => {
        const product = findProduct(id)

        if (!product) {
          return total
        }

        return (
          total +
          Object.values(sizes || {}).reduce(
            (sum, quantity) =>
              sum +
              Number(product.price || 0) *
                Math.max(0, Number(quantity) || 0),
            0
          )
        )
      },
      0
    )
  }

  // Return cart products that exist in the product list
  const getCartItems = () => {
    return Object.entries(cartItems).flatMap(([id, sizes]) => {
      const product = findProduct(id)

      if (!product) {
        return []
      }

      return Object.entries(sizes || {})
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([size, quantity]) => ({
          product,
          size,
          quantity: Number(quantity)
        }))
    })
  }

  // Demo login
  const login = (email, password, name = '') => {
    if (!email || !password) {
      return false
    }

    const users = readJSON('forever_users', [])

    let existing = users.find(
      savedUser =>
        savedUser.email?.toLowerCase() === email.toLowerCase()
    )

    if (!existing) {
      existing = {
        id: crypto.randomUUID(),
        name: name || email.split('@')[0],
        email,
        password
      }

      localStorage.setItem(
        'forever_users',
        JSON.stringify([...users, existing])
      )
    }

    setUser({
      id: existing.id,
      name: existing.name,
      email: existing.email
    })

    return true
  }

  // Logout
  const logout = () => {
    setUser(null)
    navigate('/')
    toast.success('Logged out')
  }

  // Place order
  const placeOrder = ({ address, method }) => {
    const items = getCartItems()

    if (!items.length) {
      toast.error('Your cart is empty')
      return null
    }

    const subtotal = getCartAmount()

    const order = {
      _id: `ORD-${Date.now()}`,
      date: Date.now(),
      status: 'Order Placed',
      payment: method !== 'cod',
      paymentMethod:
        method === 'cod'
          ? 'Cash on Delivery'
          : method === 'upi'
            ? 'UPI (Demo)'
            : 'Card (Demo)',
      amount: subtotal + delivery_fee,
      address,
      items: items.map(({ product, size, quantity }) => ({
        ...product,
        image: product.image,
        size,
        quantity
      }))
    }

    setOrders(prev => [order, ...prev])
    setCartItems({})

    return order
  }

  // Reset demo data while respecting deleted product IDs
  const resetDemoData = () => {
    const deletedIds = new Set(
      readJSON('agfashion_deleted_product_ids', []).map(String)
    )

    const safeSeeds = seedProducts.filter(
      product => !deletedIds.has(getProductId(product))
    )

    setProducts(safeSeeds)
    setCartItems({})
    setOrders([])

    toast.success('Demo data reset (deleted products stay deleted)')
  }

  const value = useMemo(
    () => ({
      products,
      setProducts,
      currency,
      delivery_fee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      cartItems,
      setCartItems,
      addToCart,
      updateQuantity,
      getCartCount,
      getCartAmount,
      getCartItems,
      navigate,
      backendUrl: '',
      token,
      user,
      setToken: () => {},
      logout,
      login,
      orders,
      setOrders,
      placeOrder,
      resetDemoData
    }),
    [products, cartItems, orders, user, search, showSearch]
  )

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider