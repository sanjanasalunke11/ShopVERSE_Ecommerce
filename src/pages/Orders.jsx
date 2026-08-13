import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, order_items(*, product:products(name)), payments(*), shipping_addresses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setLoading(false)
      })
  }, [user])

  if (loading) return <p className="text-center py-20 text-stone-500">Loading orders...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Your orders</h1>

      {orders.length === 0 ? (
        <p className="text-stone-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.order_id} className="border border-stone-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-stone-900">Order #{order.order_id}</p>
                  <p className="text-sm text-stone-500">{new Date(order.created_at).toLocaleString()}</p>
                  {order.shipping_addresses && (
                    <p className="text-sm text-stone-500 mt-1">
                      Shipping to {order.shipping_addresses.city}, {order.shipping_addresses.state}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium uppercase bg-stone-100 text-stone-700 px-2 py-1 rounded">
                    {order.order_status}
                  </span>
                  <span className="text-xs text-stone-500">
                    {order.payments?.[0]?.payment_method} · {order.payment_status}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-stone-100">
                {order.order_items.map((item) => (
                  <div key={item.order_item_id} className="flex justify-between text-sm py-1.5">
                    <span className="text-stone-700">
                      {item.product?.name ?? `Product #${item.product_id}`} × {item.quantity}
                    </span>
                    <span className="text-stone-900">₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-2 border-t border-stone-200 font-semibold text-stone-900">
                <span>Total</span>
                <span>₹{order.final_amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
