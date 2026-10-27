import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
const Hero=()=>{const navigate=useNavigate();return <div className="grid sm:grid-cols-2 border border-gray-200 bg-[#f7f6f4] overflow-hidden"><div className="flex items-center p-8 sm:p-12 lg:p-20"><div><div className="flex items-center gap-3 mb-5"><span className="w-10 h-px bg-black"/><span className="text-xs tracking-[.25em]">NEW SEASON 2026</span></div><h1 className="prata-regular text-4xl sm:text-5xl lg:text-6xl leading-tight">Style that<br/><i>defines you.</i></h1><p className="text-gray-500 mt-6 max-w-md">Discover styles that define you. Explore our latest collection and order easily through WhatsApp.</p><button onClick={()=>navigate('/collection')} className="mt-8 bg-black text-white px-8 py-4 text-sm tracking-widest">SHOP NEW ARRIVALS</button></div></div><img className="w-full h-full object-cover min-h-[420px]" src={assets.hero_img}/></div>}
export default Hero
