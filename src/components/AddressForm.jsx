import { useState } from 'react'

const empty = {
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
}

export default function AddressForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(empty)

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-stone-200 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Full name"
          value={form.full_name}
          onChange={handleChange('full_name')}
          className="border border-stone-300 rounded-md px-3 py-2"
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange('phone')}
          className="border border-stone-300 rounded-md px-3 py-2"
        />
      </div>
      <input
        required
        placeholder="Address line 1"
        value={form.address_line1}
        onChange={handleChange('address_line1')}
        className="w-full border border-stone-300 rounded-md px-3 py-2"
      />
      <input
        placeholder="Address line 2 (optional)"
        value={form.address_line2}
        onChange={handleChange('address_line2')}
        className="w-full border border-stone-300 rounded-md px-3 py-2"
      />
      <div className="grid grid-cols-3 gap-3">
        <input
          required
          placeholder="City"
          value={form.city}
          onChange={handleChange('city')}
          className="border border-stone-300 rounded-md px-3 py-2"
        />
        <input
          required
          placeholder="State"
          value={form.state}
          onChange={handleChange('state')}
          className="border border-stone-300 rounded-md px-3 py-2"
        />
        <input
          required
          placeholder="Postal code"
          value={form.postal_code}
          onChange={handleChange('postal_code')}
          className="border border-stone-300 rounded-md px-3 py-2"
        />
      </div>
      <input
        required
        placeholder="Country"
        value={form.country}
        onChange={handleChange('country')}
        className="w-full border border-stone-300 rounded-md px-3 py-2"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-900 text-white px-4 py-2 rounded-md hover:bg-emerald-800 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save address'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 text-stone-600">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
