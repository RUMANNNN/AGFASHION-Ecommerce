import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItem = ({ _id, id, image, name, price, category }) => {
  const { currency } = useContext(ShopContext)
  const productId = _id || id

  return (
    <Link
      onClick={() => window.scrollTo(0, 0)}
      className="group text-gray-700 block"
      to={productId ? `/product/${productId}` : '/collection'}
    >
      <div className="overflow-hidden bg-gray-50 aspect-[4/5]">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          src={image?.[0]}
          alt={name || 'Product'}
        />
      </div>
      <div className="pt-3">
        <p className="text-[10px] uppercase tracking-widest text-gray-400">{category}</p>
        <p className="pt-1 pb-1 text-sm line-clamp-2 min-h-10">{name}</p>
        <p className="text-sm font-medium">{currency}{Number(price || 0).toLocaleString('en-IN')}</p>
      </div>
    </Link>
  )
}

export default ProductItem
