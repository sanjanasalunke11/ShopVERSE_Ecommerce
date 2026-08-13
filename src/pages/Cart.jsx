import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, total, loading, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  if (loading) return <p className="text-center py-20 text-stone-500">Loading cart...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-emerald-900 font-medium underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-stone-200">
            {items.map((item) => (
              <div key={item.cart_item_id} className="flex items-center gap-4 py-4">
                <div className="w-20 h-20 bg-stone-100 rounded-md overflow-hidden shrink-0">
                  {item.product.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-stone-900">{item.product.name}</p>
                  <p className="text-stone-500 text-sm">₹{item.price.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.cart_item_id, Number(e.target.value))}
                  className="w-16 border border-stone-300 rounded-md px-2 py-1.5"
                />
                <p className="w-20 text-right font-medium text-stone-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.cart_item_id)}
                  className="text-stone-400 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-200">
            <p className="text-lg font-semibold text-stone-900">Total: ₹{total.toFixed(2)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-emerald-900 text-white px-6 py-2 rounded-md hover:bg-emerald-800"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
