import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const CartContext = createContext(undefined)

function unitPrice(product) {
  return product.discount_price ?? product.price
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartId, setCartId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const getOrCreateCart = useCallback(async () => {
    if (!user) throw new Error('Must be signed in to use the cart')

    const { data: existing, error: fetchError } = await supabase
      .from('cart')
      .select('cart_id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (fetchError) throw fetchError
    if (existing) return existing.cart_id

    const { data: created, error: createError } = await supabase
      .from('cart')
      .insert({ user_id: user.id })
      .select('cart_id')
      .single()
    if (createError) throw createError
    return created.cart_id
  }, [user])

  const refresh = useCallback(async () => {
    if (!user) {
      setCartId(null)
      setItems([])
      return
    }
    setLoading(true)
    try {
      const { data: cart } = await supabase
        .from('cart')
        .select('cart_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!cart) {
        setCartId(null)
        setItems([])
        return
      }

      setCartId(cart.cart_id)
      const { data, error } = await supabase
        .from('cart_items')
        .select('cart_item_id, quantity, price, product:products(*)')
        .eq('cart_id', cart.cart_id)
        .order('created_at', { ascending: true })
      if (!error) setItems(data ?? [])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addToCart = async (product, quantity = 1) => {
    if (!user) throw new Error('Must be signed in to add to cart')
    const id = cartId ?? (await getOrCreateCart())
    if (!cartId) setCartId(id)

    const existing = items.find((item) => item.product.product_id === product.product_id)
    if (existing) {
      await updateQuantity(existing.cart_item_id, existing.quantity + quantity)
      return
    }

    const { error } = await supabase.from('cart_items').insert({
      cart_id: id,
      product_id: product.product_id,
      quantity,
      price: unitPrice(product),
    })
    if (error) throw error
    await refresh()
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return removeFromCart(cartItemId)
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('cart_item_id', cartItemId)
    if (error) throw error
    await refresh()
  }

  const removeFromCart = async (cartItemId) => {
    const { error } = await supabase.from('cart_items').delete().eq('cart_item_id', cartItemId)
    if (error) throw error
    await refresh()
  }

  const clearCart = async () => {
    if (!cartId) return
    const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId)
    if (error) throw error
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    items,
    loading,
    total,
    count,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refresh,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (ctx === undefined) throw new Error('useCart must be used within CartProvider')
  return ctx
}
