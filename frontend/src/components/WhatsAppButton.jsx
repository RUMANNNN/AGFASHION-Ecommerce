import React from 'react'

const WHATSAPP_NUMBER = '919702050355'
const WhatsAppButton = () => {
  const message = encodeURIComponent('Hello AGFASHION! I have a question about a product or order.')
  return <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`} target="_blank" rel="noreferrer" aria-label="Chat with AGFASHION on WhatsApp" title="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg px-5 py-3 font-medium">
    WhatsApp Support
  </a>
}
export default WhatsAppButton
