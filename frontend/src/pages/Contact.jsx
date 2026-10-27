import React, { useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const WHATSAPP_NUMBER = '919702050355'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', query: '' })

  const change = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const message = `Hello AGFASHION! I have a query.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nQuery: ${formData.query}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.info('WhatsApp is opening. Please press Send there to submit your query.')
  }

  return (
    <div className="border-t pt-12">
      <div className="text-2xl text-center"><Title text1="CONTACT" text2="US" /></div>
      <div className="grid md:grid-cols-2 gap-12 items-center mt-10">
        <div>
          <img src={assets.contact_img} className="w-full" alt="Contact AGFASHION" />
          <div className="mt-6 border p-5">
            <h2 className="text-xl font-medium">Get in touch with AGFASHION</h2>
            <p className="text-gray-500 text-sm mt-2">For product questions, order help, size details or returns, message us on WhatsApp.</p>
            <p className="mt-3 font-medium">WhatsApp: +91 97020 50355</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AGFASHION! I have a question.')}`} target="_blank" rel="noreferrer" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 mt-4">CHAT ON WHATSAPP</a>
          </div>
        </div>
        <form onSubmit={submit} className="border p-7 sm:p-10">
          <h2 className="text-2xl prata-regular mb-2">Send us your query</h2>
          <p className="text-gray-500 text-sm mb-7">Fill in the details below. Your query will open as a message in our WhatsApp chat.</p>
          <input name="name" value={formData.name} onChange={change} required className="w-full border px-4 py-3 mb-4" placeholder="Your name" />
          <input name="email" value={formData.email} onChange={change} required type="email" className="w-full border px-4 py-3 mb-4" placeholder="Email address" />
          <input name="phone" value={formData.phone} onChange={change} type="tel" className="w-full border px-4 py-3 mb-4" placeholder="Phone number (optional)" />
          <textarea name="query" value={formData.query} onChange={change} required className="w-full border px-4 py-3 mb-4 min-h-32" placeholder="Write your query here..." />
          <button type="submit" className="bg-black hover:bg-gray-800 text-white px-8 py-3">SEND QUERY ON WHATSAPP</button>
        </form>
      </div>
    </div>
  )
}
export default Contact
