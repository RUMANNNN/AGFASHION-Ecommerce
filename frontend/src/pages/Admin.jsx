import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const emptyForm = { name:'', description:'', price:'', category:'Men', subCategory:'Topwear', sizes:['S','M','L','XL'], imageUrl:'', bestseller:false }

const Admin = () => {
  const { products, setProducts, orders, setOrders } = useContext(ShopContext)
  const [isAdmin,setIsAdmin] = useState(localStorage.getItem('agfashion_admin') === '1')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [tab,setTab] = useState('dashboard')
  const [form,setForm] = useState(emptyForm)
  const [editing,setEditing] = useState(null)
  const [localProducts,setLocalProducts] = useState(products)

  const stats = useMemo(()=>({products:products.length,orders:orders.length,revenue:orders.reduce((s,o)=>s+o.amount,0)}),[products,orders])

  React.useEffect(()=>setLocalProducts(products),[products])

  const login = e => { e.preventDefault(); if(email==='AbdulGaffarPablo' && password==='Y.688442070932udr'){localStorage.setItem('agfashion_admin','1');setIsAdmin(true);toast.success('Admin login successful')} else toast.error('Invalid Admin ID or password') }
  if(!isAdmin) return <div className="min-h-[70vh] flex items-center justify-center"><form onSubmit={login} className="w-full max-w-sm border p-8"><p className="prata-regular text-3xl mb-2">AGFASHION Admin</p><p className="text-sm text-gray-500 mb-6">Sign in to manage AGFASHION products and orders.</p><input className="w-full border p-3 mb-3" type="text" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin ID" required/><input className="w-full border p-3 mb-5" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required/><button className="w-full bg-black text-white py-3">LOGIN</button></form></div>

  const saveProduct = e => {
    e.preventDefault()
    const currentProduct = products.find(p => p._id === editing)
    const image = form.imageUrl || currentProduct?.image?.[0] || ''
    if (!image) return toast.error('Please upload a product image from your gallery.')

    const item = {
      ...form,
      _id: editing || `agfashion-${Date.now()}`,
      price: Number(form.price),
      image: [image],
      date: currentProduct?.date || Date.now(),
      sizes: form.sizes?.length ? form.sizes : ['S', 'M', 'L', 'XL'],
      bestseller: Boolean(form.bestseller)
    }

    const next = editing
      ? products.map(product => product._id === editing ? item : product)
      : [item, ...products]

    setProducts(next)
    localStorage.setItem('agfashion_products', JSON.stringify(next))
    localStorage.setItem('forever_products', JSON.stringify(next))
    setLocalProducts(next)
    window.dispatchEvent(new Event('agfashion-products-updated'))
    toast.success(editing ? 'Product updated successfully' : 'Product added successfully')
    setForm(emptyForm)
    setEditing(null)
    setTab('products')
  }

  const remove = id => {
    // Keep a deletion record so a deleted starter/demo product is not restored
    // by the seed-product fallback on a later refresh in this same browser.
    const deletedIds = JSON.parse(localStorage.getItem('agfashion_deleted_product_ids') || '[]')
    if (!deletedIds.includes(id)) {
      localStorage.setItem('agfashion_deleted_product_ids', JSON.stringify([...deletedIds, id]))
    }
    const next = products.filter(product => product._id !== id)
    setProducts(next)
    localStorage.setItem('agfashion_products', JSON.stringify(next))
    localStorage.setItem('forever_products', JSON.stringify(next))
    setLocalProducts(next)
    window.dispatchEvent(new Event('agfashion-products-updated'))
    toast.success('Product deleted')
  }

  const edit = product => {
    setEditing(product._id)
    setForm({
      ...emptyForm,
      ...product,
      imageUrl: product.image?.[0] || '',
      sizes: Array.isArray(product.sizes) ? product.sizes : []
    })
    setTab('add')
  }
  const updateStatus = (id,status) => { const next=orders.map(o=>o._id===id?{...o,status}:o);localStorage.setItem('agfashion_orders',JSON.stringify(next));localStorage.setItem('forever_orders',JSON.stringify(next));setOrders(next);toast.success('Order status updated') }

  return <div className="border-t pt-8 min-h-[70vh]">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"><div><p className="prata-regular text-3xl">AGFASHION Admin</p><p className="text-sm text-gray-500">Store management dashboard</p></div><button onClick={()=>{localStorage.removeItem('agfashion_admin');setIsAdmin(false)}} className="border px-4 py-2 text-sm">LOGOUT</button></div>
    <div className="flex gap-2 border-b mb-8 overflow-x-auto">{[['dashboard','Dashboard'],['products','Products'],['add','Add Product'],['orders','Orders']].map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`px-5 py-3 text-sm whitespace-nowrap ${tab===id?'border-b-2 border-black font-medium':''}`}>{label}</button>)}</div>
    {tab==='dashboard'&&<><div className="grid sm:grid-cols-3 gap-4 mb-8"><div className="border p-6 bg-white"><p className="text-gray-500 text-sm">Total Products</p><p className="text-3xl mt-2">{stats.products}</p><p className="text-xs text-gray-400 mt-2">Products in your store</p></div><div className="border p-6 bg-white"><p className="text-gray-500 text-sm">Total Orders</p><p className="text-3xl mt-2">{stats.orders}</p><p className="text-xs text-gray-400 mt-2">Orders recorded in this browser</p></div><div className="border p-6 bg-white"><p className="text-gray-500 text-sm">Order Value</p><p className="text-3xl mt-2">₹{stats.revenue.toLocaleString('en-IN')}</p><p className="text-xs text-gray-400 mt-2">Based on locally available orders</p></div></div><div className="grid lg:grid-cols-2 gap-5"><div className="border p-6 bg-white"><p className="font-medium mb-4">Quick Actions</p><div className="flex flex-wrap gap-3"><button onClick={()=>{setEditing(null);setForm(emptyForm);setTab('add')}} className="bg-black text-white px-5 py-3">+ Add Product</button><button onClick={()=>setTab('products')} className="border px-5 py-3">Manage Products</button><button onClick={()=>setTab('orders')} className="border px-5 py-3">View Orders</button></div></div><div className="border p-6 bg-white"><p className="font-medium mb-3">Recent Orders</p>{orders.length===0?<p className="text-sm text-gray-500">No orders are available yet.</p>:orders.slice(-5).reverse().map((order,index)=><div key={order._id||index} className="flex justify-between gap-3 py-3 border-b last:border-b-0 text-sm"><div><p className="font-medium">Order #{String(order._id||index+1).slice(-6)}</p><p className="text-gray-500">{order.status||'Order received'}</p></div><p className="font-medium whitespace-nowrap">₹{Number(order.amount||0).toLocaleString('en-IN')}</p></div>)}</div></div></>}
    {tab==='products'&&<div className="space-y-3">{localProducts.length === 0 ? <div className="border p-10 text-center text-gray-500">No products yet. Use Add Product to create one.</div> : localProducts.map(p=><div key={p._id} className="border p-3 flex items-center gap-4"><img src={p.image?.[0]} className="w-16 h-20 object-cover bg-gray-100"/><div className="flex-1"><p className="font-medium">{p.name}</p><p className="text-sm text-gray-500">{p.category} · ₹{p.price}</p></div><button onClick={()=>edit(p)} className="border px-3 py-2 text-sm">Edit</button><button onClick={()=>remove(p._id)} className="text-red-600 border border-red-200 px-3 py-2 text-sm">Delete</button></div>)}</div>}
    {tab==='add'&&<form onSubmit={saveProduct} className="border p-6 max-w-3xl"><p className="text-xl font-medium mb-6">{editing?'Edit product':'Add product'}</p><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-3 mb-4" placeholder="Product name"/><textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border p-3 mb-4 min-h-28" placeholder="Description"/><div className="grid sm:grid-cols-3 gap-4 mb-4"><input required type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="border p-3" placeholder="Price"/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="border p-3"><option>Men</option><option>Women</option><option>Kids</option></select><select value={form.subCategory} onChange={e=>setForm({...form,subCategory:e.target.value})} className="border p-3"><option>Topwear</option><option>Bottomwear</option><option>Winterwear</option></select></div><div className="mb-5 w-full">
      <label className="block font-medium mb-2">Product image</label>
      <label className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 cursor-pointer">
        <span>Choose image from Gallery</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async e => {
            const file = e.target.files?.[0]
            if (!file) return
            if (!file.type.startsWith('image/')) {
              toast.error('Please select an image file')
              return
            }
            try {
              const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(file)
              })
              const compressed = await new Promise((resolve, reject) => {
                const image = new Image()
                image.onload = () => {
                  const maxSize = 1200
                  const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
                  const canvas = document.createElement('canvas')
                  canvas.width = Math.max(1, Math.round(image.width * scale))
                  canvas.height = Math.max(1, Math.round(image.height * scale))
                  const ctx = canvas.getContext('2d')
                  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                  resolve(canvas.toDataURL('image/jpeg', 0.78))
                }
                image.onerror = reject
                image.src = dataUrl
              })
              setForm(prev => ({...prev, imageUrl: compressed}))
              toast.success('Image selected')
            } catch {
              toast.error('Could not read this image. Please try another one.')
            }
            e.target.value = ''
          }}
        />
      </label>
      {form.imageUrl && <div className="mt-3 flex items-start gap-3"><img src={form.imageUrl} alt="Product preview" className="w-24 h-28 object-cover border"/><button type="button" onClick={()=>setForm(prev=>({...prev,imageUrl:''}))} className="text-sm text-red-600 underline">Remove image</button></div>}
      <p className="text-xs text-gray-500 mt-2">Select an image from your computer/gallery. The image is compressed and saved with the product in this browser.</p>
    </div><div className="flex flex-wrap gap-2 mb-6">{['S','M','L','XL','XXL'].map(s=><button type="button" key={s} onClick={()=>setForm({...form,sizes:form.sizes.includes(s)?form.sizes.filter(x=>x!==s):[...form.sizes,s]})} className={`px-4 py-2 border ${form.sizes.includes(s)?'bg-black text-white':'bg-white'}`}>{s}</button>)}</div><label className="flex gap-2 mb-6"><input type="checkbox" checked={form.bestseller} onChange={e=>setForm({...form,bestseller:e.target.checked})}/> Bestseller</label><div className="flex gap-3"><button className="bg-black text-white px-7 py-3">{editing?'UPDATE':'ADD PRODUCT'}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(emptyForm)}} className="border px-7 py-3">Cancel</button>}</div></form>}
    {tab==='orders'&&<div className="space-y-4">{!orders.length?<div className="border p-10 text-center text-gray-500">No orders yet.</div>:orders.map(o=><div key={o._id} className="border p-5 grid lg:grid-cols-[2fr_1fr_1fr] gap-5"><div><p className="font-medium">{o._id}</p><p className="text-sm text-gray-500 mt-2">{o.items.map(i=>`${i.name} × ${i.quantity}`).join(', ')}</p><p className="text-sm mt-3">Customer: {o.address.firstName} {o.address.lastName} · {o.address.phone}</p></div><div><p className="font-medium">₹{o.amount.toLocaleString('en-IN')}</p><p className="text-sm text-gray-500">{o.paymentMethod}</p></div><select value={o.status} onChange={e=>updateStatus(o._id,e.target.value)} className="border p-3 h-fit"><option>Order Placed</option><option>Packing</option><option>Shipped</option><option>Out for delivery</option><option>Delivered</option></select></div>)}</div>}
  </div>
}
export default Admin
