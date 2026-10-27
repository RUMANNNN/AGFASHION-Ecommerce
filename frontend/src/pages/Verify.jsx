import React from 'react'
import { useNavigate } from 'react-router-dom'
const Verify=()=>{const navigate=useNavigate();return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center"><h1 className="prata-regular text-3xl">Payment complete</h1><p className="text-gray-500 mt-2 mb-6">Your demo payment flow has returned successfully.</p><button onClick={()=>navigate('/orders')} className="bg-black text-white px-7 py-3">VIEW ORDERS</button></div>}
export default Verify
