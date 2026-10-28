import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  useEffect(() => {
    const found = products.find(
      item => String(item._id ?? item.id) === String(productId)
    )

    setProductData(found || null)
    setImage(found?.image?.[0] || '')
    setSize('')
  }, [productId, products])

  const handleAddToCart = () => {
    if (!productData) return

    if (!size) {
      addToCart(productData._id ?? productData.id, '')
      return
    }

    console.count('ADD TO CART CLICK HANDLER')

    addToCart(productData._id ?? productData.id, size)
  }

  if (!productData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-medium">Product not found</h2>
        <p className="text-gray-500 mt-2">
          This product may have been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="border-t-2 pt-6 sm:pt-10 transition-opacity duration-500">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-[18%]">
            {(productData.image || []).map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-20 sm:w-full flex-shrink-0 cursor-pointer border ${
                  image === item ? 'border-black' : 'border-transparent'
                }`}
                alt={`${productData.name} ${index + 1}`}
              />
            ))}
          </div>

          <div className="w-full sm:w-[82%]">
            <img
              className="w-full h-auto object-cover"
              src={image || productData.image?.[0]}
              alt={productData.name}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-xl sm:text-2xl mt-2">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            {[1, 2, 3, 4].map(star => (
              <img
                key={star}
                src={assets.star_icon}
                alt=""
                className="w-3 h-3"
              />
            ))}
            <img
              src={assets.star_dull_icon}
              alt=""
              className="w-3 h-3"
            />
            <p className="pl-2 text-sm">(122)</p>
          </div>

          <p className="mt-5 text-2xl sm:text-3xl font-medium">
            {currency}
            {Number(productData.price || 0).toLocaleString('en-IN')}
          </p>

          <p className="mt-5 text-gray-500 text-sm sm:text-base">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>

            <div className="flex flex-wrap gap-2">
              {(productData.sizes || []).map((item, index) => (
                <button
                  type="button"
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 transition ${
                    item === size
                      ? 'border-black bg-gray-100'
                      : 'border-gray-200'
                  }`}
                  key={index}
                  aria-pressed={item === size}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-2">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
            <p className="font-medium text-green-700">
              FREE SHIPPING on all orders.
            </p>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-16 sm:mt-20">
        <div className="flex">
          <b className="border px-4 sm:px-5 py-3 text-sm">Description</b>
          <p className="border px-4 sm:px-5 py-3 text-sm">
            Reviews (122)
          </p>
        </div>

        <div className="flex flex-col gap-4 border px-4 sm:px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals
            can showcase their products and conduct transactions online.
          </p>
          <p>
            Products display descriptions, images, prices, and available
            variations such as sizes and colors.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  )
}

export default Product