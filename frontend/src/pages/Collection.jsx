import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [category,setCategory] = useState([])
  const [subCategory,setSubCategory] = useState([])
  const [sortType,setSortType] = useState('relevant')
  const [showFilter,setShowFilter] = useState(false)
  const toggle = (value,setter,current) => setter(current.includes(value) ? current.filter(x=>x!==value) : [...current,value])
  const filtered = useMemo(() => {
    let list = [...products]
    if (showSearch && search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category.length) list = list.filter(p => category.includes(p.category))
    if (subCategory.length) list = list.filter(p => subCategory.includes(p.subCategory))
    if (sortType === 'low-high') list.sort((a,b)=>a.price-b.price)
    if (sortType === 'high-low') list.sort((a,b)=>b.price-a.price)
    return list
  },[products,search,showSearch,category,subCategory,sortType])
  return <div className="border-t pt-10 flex flex-col lg:flex-row gap-8">
    <aside className="lg:w-60 shrink-0"><button onClick={()=>setShowFilter(!showFilter)} className="text-xl mb-4 flex gap-2 items-center">FILTERS <span className="lg:hidden">⌄</span></button>
      <div className={`${showFilter?'block':'hidden'} lg:block space-y-5`}>
        <div className="border p-5"><p className="font-medium mb-4">CATEGORY</p>{['Men','Women','Kids'].map(v=><label key={v} className="flex gap-2 mb-3 text-sm"><input type="checkbox" checked={category.includes(v)} onChange={()=>toggle(v,setCategory,category)}/>{v}</label>)}</div>
        <div className="border p-5"><p className="font-medium mb-4">TYPE</p>{['Topwear','Bottomwear','Winterwear'].map(v=><label key={v} className="flex gap-2 mb-3 text-sm"><input type="checkbox" checked={subCategory.includes(v)} onChange={()=>toggle(v,setSubCategory,subCategory)}/>{v}</label>)}</div>
        {(category.length||subCategory.length) ? <button onClick={()=>{setCategory([]);setSubCategory([])}} className="text-sm underline">Clear filters</button>:null}
      </div>
    </aside>
    <main className="flex-1"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7"><Title text1="ALL" text2="COLLECTIONS"/><select value={sortType} onChange={e=>setSortType(e.target.value)} className="border px-3 py-2 text-sm"><option value="relevant">Sort by: Relevant</option><option value="low-high">Price: Low to High</option><option value="high-low">Price: High to Low</option></select></div>
      {showSearch && search && <p className="text-sm text-gray-500 mb-5">Showing results for “{search}”</p>}
      {!filtered.length ? <div className="border p-12 text-center text-gray-500">No products found. Try another search or clear filters.</div> : <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">{filtered.map(p=><ProductItem key={p._id} {...p}/>)}</div>}
    </main>
  </div>
}
export default Collection
