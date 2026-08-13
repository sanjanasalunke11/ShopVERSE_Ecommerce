import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import AddressForm from '../components/AddressForm'

const FREE_SHIPPING_THRESHOLD = 999
const FLAT_SHIPPING_CHARGE = 49
const PAYMENT_METHODS = ['COD', 'UPI', 'Card', 'NetBanking', 'Wallet']

export default function Checkout() {
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [addressId, setAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  useEffect(() => {
    supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .then(({ data }) => {
        const list = data ?? []
        setAddresses(list)
        setAddressId(list[0]?.address_id ?? null)
        setShowAddressForm(list.length === 0)
        setLoadingAddresses(false)
      })
  }, [user])

  const handleAddAddress = async (form) => {
    setSavingAddress(true)
    setError(null)
    const { data, error } = await supabase
      .from('shipping_addresses')
      .insert({ ...form, user_id: user.id, is_default: addresses.length === 0 })
      .select()
      .single()
    setSavingAddress(false)
    if (error) {
      setError(error.message)
      return
    }
    setAddresses((prev) => [...prev, data])
    setAddressId(data.address_id)
    setShowAddressForm(false)
  }

  const shippingCharge = total >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_CHARGE
  const discount = 0
  const finalAmount = total - discount + shippingCharge

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (items.length === 0 || !addressId) return
    setPlacing(true)
    setError(null)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: addressId,
        total_amount: total,
        discount,
        shipping_charge: shippingCharge,
        final_amount: finalAmount,
      })
      .select()
      .single()

    if (orderError) {
      setError(orderError.message)
      setPlacing(false)
      return
    }

    const orderItems = items.map((item) => ({
      order_id: order.order_id,
      product_id: item.product.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      setError(itemsError.message)
      setPlacing(false)
      return
    }

    const { error: paymentError } = await supabase.from('payments').insert({
      order_id: order.order_id,
      payment_method: paymentMethod,
      payment_status: 'Pending',
    })
    if (paymentError) {
      setError(paymentError.message)
      setPlacing(false)
      return
    }

    await clearCart()
    setPlacing(false)
    navigate('/orders')
  }

  if (items.length === 0) {
    return <p className="text-center py-20 text-stone-500">Your cart is empty.</p>
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <div>
          <h2 className="font-medium text-stone-900 mb-2">Shipping address</h2>

          {loadingAddresses ? (
            <p className="text-sm text-stone-500">Loading addresses...</p>
          ) : (
            <>
              {addresses.length > 0 && !showAddressForm && (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.address_id}
                      className="flex items-start gap-2 border border-stone-200 rounded-md p-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={addressId === addr.address_id}
                        onChange={() => setAddressId(addr.address_id)}
                        className="mt-1"
                      />
                      <span className="text-sm text-stone-700">
                        <span className="font-medium text-stone-900">{addr.full_name}</span>, {addr.phone}
                        <br />
                        {addr.address_line1}
                        {addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state}{' '}
                        {addr.postal_code}, {addr.country}
                      </span>
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm text-emerald-900 underline"
                  >
                    Add a new address
                  </button>
                </div>
              )}

              {showAddressForm && (
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={addresses.length > 0 ? () => setShowAddressForm(false) : undefined}
                  submitting={savingAddress}
                />
              )}
            </>
          )}
        </div>

        <div>
          <h2 className="font-medium text-stone-900 mb-2">Payment method</h2>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method}
                className={`px-3 py-1.5 rounded-full text-sm border cursor-pointer ${
                  paymentMethod === method ? 'bg-emerald-900 text-white border-emerald-900' : 'border-stone-300 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="hidden"
                />
                {method}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Shipping</span>
            <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-stone-900 pt-1">
            <span>Total</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={placing || !addressId || showAddressForm}
          className="w-full bg-emerald-900 text-white py-2 rounded-md hover:bg-emerald-800 disabled:opacity-50"
        >
          {placing ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  )
}
