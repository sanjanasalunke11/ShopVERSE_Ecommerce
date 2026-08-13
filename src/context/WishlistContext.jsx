import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(undefined)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(new Set())

  const refresh = useCallback(async () => {
    if (!user) {
      setIds(new Set())
      return
    }
    const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', user.id)
    setIds(new Set((data ?? []).map((row) => row.product_id)))
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const toggle = async (productId) => {
    if (!user) throw new Error('Must be signed in to use the wishlist')
    if (ids.has(productId)) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
      setIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
      setIds((prev) => new Set(prev).add(productId))
    }
  }

  return (
    <WishlistContext.Provider value={{ ids, isWishlisted: (id) => ids.has(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (ctx === undefined) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
