import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Orders = () => {
  const { orders, currency, token, navigate } = useContext(ShopContext)
  if (!token) return <div className="py-24 text-center"><p className="text-gray-500 mb-4">Please login to view your orders.</p><button onClick={() => navigate('/login')} className="bg-black text-white px-7 py-3">LOGIN</button></div>
  return <div className="border-t pt-14 min-h-[60vh]">
    <div className="text-2xl mb-8"><Title text1="MY" text2="ORDERS" /></div>
    {!orders.length ? <div className="border p-10 text-center text-gray-500">No orders yet. Start shopping to see them here.</div> : <div className="space-y-4">
      {orders.map(order => <div key={order._id} className="border p-5 grid md:grid-cols-[1fr_2fr_1fr_auto] gap-5 items-center">
        <img src={order.items[0]?.image?.[0]} className="w-24 h-28 object-cover bg-gray-100" />
        <div><p className="font-medium">{order.items.map(i => `${i.name} × ${i.quantity} (${i.size})`).join(', ')}</p><p className="text-sm text-gray-500 mt-2">Order ID: {order._id}</p><p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p></div>
        <div><p className="font-medium">{currency}{order.amount.toLocaleString('en-IN')}</p><p className="text-sm text-gray-500">{order.paymentMethod}</p></div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />{order.status}</div>
      </div>)}
    </div>}
  </div>
}
export default Orders
