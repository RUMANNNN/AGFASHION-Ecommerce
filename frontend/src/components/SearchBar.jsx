import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'
const SearchBar=()=>{const {search,setSearch,showSearch,setShowSearch}=useContext(ShopContext);const location=useLocation();useEffect(()=>{if(location.pathname==='/collection') setShowSearch(true)},[location.pathname]);if(!showSearch||location.pathname!=='/collection') return null;return <div className="border-t border-b bg-gray-50 text-center"><div className="inline-flex items-center border border-gray-300 bg-white px-5 py-2 my-4 rounded-full w-[85%] sm:w-1/2"><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} className="flex-1 outline-none bg-transparent text-sm" placeholder="Search products, e.g. t-shirt"/><img className="w-4" src={assets.search_icon}/></div><button onClick={()=>{setSearch('');setShowSearch(false)}} className="ml-2 text-gray-500">✕</button></div>}
export default SearchBar
