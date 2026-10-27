import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
const CartTotal = () => { const {currency,delivery_fee,getCartAmount}=useContext(ShopContext); const subtotal=getCartAmount(); return <div className="w-full"><div className="text-2xl"><Title text1="CART" text2="TOTALS"/></div><div className="space-y-3 mt-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{currency}{subtotal.toLocaleString('en-IN')}</span></div><hr/><div className="flex justify-between"><span>Shipping</span><span>{currency}{(subtotal?delivery_fee:0).toLocaleString('en-IN')}</span></div><hr/><div className="flex justify-between text-base"><b>Total</b><b>{currency}{(subtotal?subtotal+delivery_fee:0).toLocaleString('en-IN')}</b></div></div></div> }
export default CartTotal
