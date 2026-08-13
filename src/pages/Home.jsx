import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200'
const PROMO_IMAGE = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200'

const TRUST_BADGES = [
  {
    label: 'Free shipping',
    detail: 'On orders over ₹999',
    icon: (
      <path d="M3 7h11v7H3zM14 10h4l3 3v1h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    ),
  },
  {
    label: 'Secure checkout',
    detail: 'Backed by Supabase auth',
    icon: <path d="M12 2l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V5z" />,
  },
  {
    label: 'Easy returns',
    detail: '7-day return window',
    icon: <path d="M4 9V5h4M4 9l6 6M20 15v4h-4M20 15l-6-6" />,
  },
]

export default function Home() {
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [coupon, setCoupon] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [featuredMessage, setFeaturedMessage] = useState(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setCategories(data ?? []))

    const today = new Date().toISOString().slice(0, 10)
    supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .or(`expiry_date.is.null,expiry_date.gte.${today}`)
      .order('expiry_date', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setCoupon(data))

    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setAllProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  const categoryCounts = useMemo(() => {
    const counts = {}
    for (const p of allProducts) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1
    return counts
  }, [allProducts])

  const newArrivals = allProducts.slice(0, 6)
  const featuredProduct = allProducts.find((p) => p.discount_price != null) ?? allProducts[0]

  const products = activeCategory
    ? allProducts.filter((p) => p.category_id === activeCategory)
    : allProducts

  const activeCategoryName = categories.find((c) => c.category_id === activeCategory)?.name

  const handleFeaturedAdd = async () => {
    if (!user) {
      setFeaturedMessage('Log in to add items to your cart.')
      return
    }
    await addToCart(featuredProduct, 1)
    setFeaturedMessage('Added to cart.')
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-br from-rose-50 via-stone-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-800 uppercase mb-3">
            New season collection
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-stone-900 leading-tight">
            Shop Beautifully.
            <br />
            <span className="italic font-normal">Live Effortlessly.</span>
          </h1>
          <p className="text-stone-600 mt-4 max-w-sm">
            Curated electronics, fashion, and home essentials — quality you love, delivered to your door.
          </p>
          <a
            href="#shop"
            className="inline-block mt-6 bg-emerald-900 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-800 transition-colors"
          >
            Shop now →
          </a>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-start gap-1">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-emerald-800" strokeWidth="1.6">
                  {badge.icon}
                </svg>
                <p className="text-sm font-medium text-stone-900">{badge.label}</p>
                <p className="text-xs text-stone-500">{badge.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-6 -right-6 w-56 h-56 rounded-full bg-rose-100 -z-10" />
          <div className="absolute -bottom-8 -left-6 w-40 h-40 rounded-full bg-emerald-100 -z-10" />
          <div className="aspect-4/5 rounded-3xl overflow-hidden">
            <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          </div>

          {featuredProduct && (
            <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3 w-48">
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-2">
                {featuredProduct.image_url && (
                  <img
                    src={featuredProduct.image_url}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-sm font-medium text-stone-900 truncate">{featuredProduct.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-semibold text-stone-900">
                  ₹{(featuredProduct.discount_price ?? featuredProduct.price).toFixed(2)}
                </p>
                <button
                  onClick={handleFeaturedAdd}
                  className="text-xs bg-emerald-900 text-white px-2.5 py-1.5 rounded-full hover:bg-emerald-800"
                >
                  Add
                </button>
              </div>
              {featuredMessage && <p className="text-xs text-stone-500 mt-1">{featuredMessage}</p>}
            </div>
          )}
        </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Shop by category */}
        <section className="py-10 border-t border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900 mb-5">Shop by category</h2>
          <div className="flex gap-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className="shrink-0 flex flex-col items-center gap-2 group"
            >
              <span
                className={`w-20 h-20 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                  activeCategory === null
                    ? 'border-emerald-900 bg-emerald-900 text-white'
                    : 'border-stone-200 text-stone-600 group-hover:border-stone-400'
                }`}
              >
                All
              </span>
              <span className={`text-xs ${activeCategory === null ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>
                {allProducts.length} items
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => setActiveCategory(cat.category_id)}
                className="shrink-0 flex flex-col items-center gap-2 group"
              >
                <span
                  className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-colors ${
                    activeCategory === cat.category_id
                      ? 'border-emerald-900'
                      : 'border-transparent group-hover:border-stone-300'
                  }`}
                >
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full bg-stone-100" />
                  )}
                </span>
                <span
                  className={`text-xs whitespace-nowrap ${
                    activeCategory === cat.category_id ? 'text-stone-900 font-medium' : 'text-stone-500'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-xs text-stone-400">{categoryCounts[cat.category_id] ?? 0} items</span>
              </button>
            ))}
          </div>
        </section>

        {/* Promo banner */}
        {coupon && (
          <section className="relative rounded-2xl overflow-hidden mb-10 bg-emerald-900">
            <img src={PROMO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-200 mb-2">Limited time offer</p>
                <h3 className="text-2xl font-semibold text-white">{coupon.description}</h3>
                <p className="text-emerald-100 mt-1">
                  Use code <span className="font-semibold text-white">{coupon.code}</span> for {coupon.discount_percent}%
                  off orders over ₹{coupon.minimum_order?.toFixed(0) ?? '0'}
                </p>
              </div>
              <a
                href="#shop"
                className="shrink-0 bg-white text-emerald-900 px-5 py-2.5 rounded-full font-medium hover:bg-emerald-50"
              >
                Shop deals
              </a>
            </div>
          </section>
        )}

        {/* New arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-6 border-t border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">New arrivals</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {newArrivals.map((product) => (
                <div key={product.product_id} className="w-48 shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All products */}
        <section id="shop" className="py-10 border-t border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">{activeCategoryName ?? 'All products'}</h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}
          {loading ? (
            <p className="text-stone-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-stone-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
