import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const navigate = useNavigate()

  const hasDiscount = product.discount_price != null && product.discount_price < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0
  const wishlisted = isWishlisted(product.product_id)

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    toggle(product.product_id)
  }

  return (
    <Link
      to={`/products/${product.product_id}`}
      className="group relative border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
    >
      <div className="aspect-square bg-stone-100 overflow-hidden relative">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 ${wishlisted ? 'fill-rose-600 stroke-rose-600' : 'fill-none stroke-stone-500'}`}
            strokeWidth="2"
          >
            <path d="M12 21s-7.5-4.6-10-9.1C.4 8.5 2 5 5.4 5 7.6 5 9.4 6.2 12 9c2.6-2.8 4.4-4 6.6-4C22 5 23.6 8.5 22 11.9 19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-medium text-stone-700">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-3">
        {product.brand && <p className="text-xs text-stone-400 uppercase tracking-wide">{product.brand}</p>}
        <h3 className="font-medium text-stone-900 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-stone-900 text-sm font-semibold">
            ₹{(hasDiscount ? product.discount_price : product.price).toFixed(2)}
          </p>
          {hasDiscount && <p className="text-stone-400 text-sm line-through">₹{product.price.toFixed(2)}</p>}
        </div>
      </div>
    </Link>
  )
}
