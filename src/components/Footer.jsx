import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className="mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-rose-50 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-stone-900">Join the ShopVerse circle</p>
            <p className="text-sm text-stone-600">New arrivals and offers, straight to your inbox.</p>
          </div>
          {subscribed ? (
            <p className="text-sm font-medium text-emerald-800">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 sm:w-56 border border-stone-300 rounded-full px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="bg-emerald-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-800"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-stone-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p className="font-semibold text-stone-900">ShopVerse</p>
          <p>© {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
