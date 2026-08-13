import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [rating, setRating] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single()
      .then(({ data }) => {
        setProduct(data)
        setLoading(false)
      })

    supabase
      .from('product_ratings')
      .select('average_rating, total_reviews')
      .eq('product_id', id)
      .maybeSingle()
      .then(({ data }) => setRating(data))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setAdding(true)
    setMessage(null)
    try {
      await addToCart(product, quantity)
      setMessage('Added to cart.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = () => {
    if (!user) {
      navigate('/login')
      return
    }
    toggle(product.product_id)
  }

  if (loading) return <p className="text-center py-20 text-stone-500">Loading...</p>
  if (!product) return <p className="text-center py-20 text-stone-500">Product not found.</p>

  const hasDiscount = product.discount_price != null && product.discount_price < product.price
  const displayPrice = hasDiscount ? product.discount_price : product.price
  const wishlisted = isWishlisted(product.product_id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden relative">
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        )}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-5 h-5 ${wishlisted ? 'fill-rose-600 stroke-rose-600' : 'fill-none stroke-stone-500'}`}
            strokeWidth="2"
          >
            <path d="M12 21s-7.5-4.6-10-9.1C.4 8.5 2 5 5.4 5 7.6 5 9.4 6.2 12 9c2.6-2.8 4.4-4 6.6-4C22 5 23.6 8.5 22 11.9 19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div>
        {product.brand && <p className="text-sm text-stone-500">{product.brand}</p>}
        <h1 className="text-2xl font-semibold text-stone-900">{product.name}</h1>

        <div className="flex items-center gap-2 mt-2">
          <p className="text-xl text-stone-900 font-medium">₹{displayPrice.toFixed(2)}</p>
          {hasDiscount && <p className="text-stone-400 line-through">₹{product.price.toFixed(2)}</p>}
        </div>

        {rating?.total_reviews > 0 && (
          <p className="text-sm text-stone-500 mt-1">
            ★ {rating.average_rating} ({rating.total_reviews} review{rating.total_reviews === 1 ? '' : 's'})
          </p>
        )}

        <p className="text-stone-600 mt-4">{product.description}</p>
        <p className="text-sm text-stone-500 mt-2">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <div className="flex items-center gap-3 mt-6">
          <input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 border border-stone-300 rounded-md px-2 py-1.5"
          />
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="bg-emerald-900 text-white px-5 py-2 rounded-md hover:bg-emerald-800 disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
        {message && <p className="text-sm text-stone-600 mt-3">{message}</p>}
      </div>
    </div>
  )
}
