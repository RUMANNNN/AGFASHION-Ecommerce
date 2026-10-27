import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const WHATSAPP_NUMBER = '919702050355'
const Footer = () => <footer className="mt-24 border-t pt-12">
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
    <div><Link to="/" className="text-2xl font-semibold tracking-wide">AGFASHION</Link><p className="text-sm text-gray-500 leading-6 mt-4">Style That Defines You. A modern fashion store built for simple shopping, dependable delivery and everyday style.</p></div>
    <div><p className="font-medium mb-4">SHOP</p><div className="flex flex-col gap-2 text-sm text-gray-500"><Link to="/collection">All Collection</Link><Link to="/collection">Men</Link><Link to="/collection">Women</Link><Link to="/collection">Kids</Link></div></div>
    <div><p className="font-medium mb-4">HELP</p><div className="flex flex-col gap-2 text-sm text-gray-500"><Link to="/contact">Contact & Send Query</Link><Link to="/about">About AGFASHION</Link><Link to="/orders">Track Orders</Link><span>7-day returns</span></div></div>
    <div><p className="font-medium mb-4">GET IN TOUCH</p><p className="text-sm text-gray-500">WhatsApp customer support</p><p className="text-sm text-gray-700 mt-2">+91 97020 50355</p><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AGFASHION! I have a query.')}`} target="_blank" rel="noreferrer" className="inline-block text-sm underline mt-3">Chat with us on WhatsApp</a><p className="text-sm text-gray-500 mt-3">Mumbai, India</p></div>
  </div>
  <div className="border-t py-5 text-center text-xs text-gray-400">© {new Date().getFullYear()} AGFASHION. All rights reserved.</div>
</footer>
export default Footer
