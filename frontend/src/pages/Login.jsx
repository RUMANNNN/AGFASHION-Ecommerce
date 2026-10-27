import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const DEMO_LOGIN_ID = 'AbdulGaffarPablo'
const DEMO_LOGIN_PASSWORD = 'Y.688442070932udr'

const Login = () => {
  const { token, navigate, setToken } = useContext(ShopContext)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { if (token) navigate('/') }, [token, navigate])

  const submit = (e) => {
    e.preventDefault()
    if (loginId.trim() !== DEMO_LOGIN_ID || password !== DEMO_LOGIN_PASSWORD) {
      toast.error('Invalid ID or password')
      return
    }
    const user = { id: 'agfashion-owner', name: 'Abdul Gaffar Pablo', email: 'owner@agfashion.local' }
    localStorage.setItem('forever_user', JSON.stringify(user))
    // Reload context state through the app's exposed setter when available.
    window.location.href = '/'
  }

  return <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
    <form onSubmit={submit} className="w-full max-w-md border p-8 sm:p-10 shadow-sm bg-white">
      <div className="mb-8 text-center">
        <h1 className="prata-regular text-3xl">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Sign in to manage your AGFASHION orders.</p>
      </div>
      <input value={loginId} onChange={e => setLoginId(e.target.value)} required autoComplete="username" className="w-full border px-4 py-3 mb-4 outline-none" placeholder="Login ID" />
      <input value={password} onChange={e => setPassword(e.target.value)} required type="password" autoComplete="current-password" className="w-full border px-4 py-3 mb-6 outline-none" placeholder="Password" />
      <button type="submit" className="w-full bg-black text-white py-3 hover:bg-gray-800">SIGN IN</button>
    </form>
  </div>
}
export default Login
