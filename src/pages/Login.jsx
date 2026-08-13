import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, resendConfirmation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setUnconfirmed(false)
    setResent(false)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      if (error.code === 'email_not_confirmed') {
        setUnconfirmed(true)
      } else {
        setError(error.message)
      }
      return
    }
    navigate(location.state?.from?.pathname ?? '/')
  }

  const handleResend = async () => {
    await resendConfirmation(email)
    setResent(true)
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-stone-300 rounded-md px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {unconfirmed && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
            <p>Your email hasn't been confirmed yet. Check your inbox for the confirmation link.</p>
            {resent ? (
              <p className="mt-1 font-medium">Confirmation email resent.</p>
            ) : (
              <button type="button" onClick={handleResend} className="mt-1 underline font-medium">
                Resend confirmation email
              </button>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-900 text-white py-2 rounded-md hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-stone-600 mt-4">
        No account?{' '}
        <Link to="/signup" className="text-emerald-900 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
