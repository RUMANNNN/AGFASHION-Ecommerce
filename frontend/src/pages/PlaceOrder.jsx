import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

// Replace this with the store owner's WhatsApp number, including country code,
// without +, spaces, or dashes. Example for India: 919876543210
const WHATSAPP_NUMBER = '919702050355'

const PlaceOrder = () => {
  const { navigate, cartItems, getCartAmount, delivery_fee, getCartItems } = useContext(ShopContext)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', street: '', city: '', state: '', zipcode: '' })
  const change = e => setFormData(v => ({ ...v, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    if (!Object.keys(cartItems).length || !getCartItems().length) {
      toast.error('Your cart is empty')
      navigate('/collection')
      return
    }
    if (WHATSAPP_NUMBER.includes('X')) {
      toast.error('Please add the store WhatsApp number in PlaceOrder.jsx first')
      return
    }

    const items = getCartItems()
    const total = getCartAmount() + delivery_fee
    const itemLines = items.map(({ product, size, quantity }) =>
      `• ${product.name} | Size: ${size} | Qty: ${quantity} | ₹${(product.price * quantity).toLocaleString('en-IN')}`
    ).join('\n')
    const message = `Hello AGFASHION! I want to place an order.\n\nCUSTOMER DETAILS\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phone}\nAddress: ${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipcode}\n\nORDER ITEMS\n${itemLines}\n\nSubtotal: ₹${getCartAmount().toLocaleString('en-IN')}\nDelivery: ₹${delivery_fee}\nTOTAL: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability and order.`
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  return <form onSubmit={submit} className="border-t pt-10 flex flex-col lg:flex-row gap-14 min-h-[70vh]">
    <div className="flex-1 max-w-2xl">
      <div className="text-2xl mb-6"><Title text1="DELIVERY" text2="INFORMATION" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) => <input key={key} required name={key} value={value} onChange={change} className="border px-4 py-3 outline-none" placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} />)}
      </div>
      <p className="text-sm text-gray-500 mt-5">Your order details will open in WhatsApp. Review the message and press Send to contact AGFASHION.</p>
    </div>
    <div className="w-full lg:max-w-md">
      <CartTotal />
      <div className="mt-8 border p-5">
        <p className="font-medium">ORDER THROUGH WHATSAPP</p>
        <p className="text-sm text-gray-500 mt-2">No online payment required. Send your order directly to our WhatsApp chat and we will confirm it with you.</p>
      </div>
      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-4 mt-6">ORDER ON WHATSAPP • ₹{(getCartAmount() + delivery_fee).toLocaleString('en-IN')}</button>
    </div>
  </form>
}

export default PlaceOrder
