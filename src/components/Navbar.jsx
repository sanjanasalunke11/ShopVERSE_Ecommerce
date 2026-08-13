import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-1.5 text-xl font-semibold text-stone-900">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-emerald-800">
            <path d="M12 2l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-1.5L12 2z" />
          </svg>
          ShopVerse
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-stone-700">
          <Link to="/" className="hover:text-stone-900">
            Shop
          </Link>
          <Link to="/cart" className="relative flex items-center hover:text-stone-900">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="1.8">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L4.5 3H2" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="hover:text-stone-900">
                Orders
              </Link>
              <button onClick={handleSignOut} className="hover:text-stone-900">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-stone-900">
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-emerald-900 text-white px-3 py-1.5 rounded-md hover:bg-emerald-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
