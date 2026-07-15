import React, { useState } from 'react'
import login from '../assets/login.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    // If it's a login, you only need to send email and password
    if (isLogin) {
      console.log('Logging in with:', { email, password })
    } else {
      console.log('Registering with:', { email, username, password })
    }
    // TODO: call your API here
  }

  return (
    <div className="relative min-h-screen items-center justify-center flex bg-gray-100 p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 blur-xs"
        style={{ backgroundImage: `url(${login})` }}
      />
      
    {/* Form Container */}
<form 
  onSubmit={handleSubmit}
  className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl border border-white/5 flex flex-col gap-5"
>
  <div className="text-center mb-2">
    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
      {isLogin ? 'Welcome Back' : (
        <span>Create <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Account</span></span>
      )}
    </h2>
    <p className="text-sm text-slate-400 mt-2">
      {isLogin ? 'Please enter your details to sign in' : 'Fill in the details to get started'}
    </p>
  </div>

  {/* Email Field */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
    <input 
      type="email" 
      placeholder="you@example.com" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)}
      className="px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl outline-none text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
      required
    />
  </div>

  {/* Username Field - Only shows up if registering */}
  {!isLogin && (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</label>
      <input 
        type="text"
        placeholder="Enter your username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        className="px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl outline-none text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
        required={!isLogin}
      />
    </div>
  )}

  {/* Password Field */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
    <input 
      type="password"
      placeholder="••••••••" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)}
      className="px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl outline-none text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
      required
    />
  </div>

  {/* Submit Button */}
  <button 
    type="submit"
    className="w-full bg-[#9bc400] hover:bg-[#86aa00] text-white font-bold py-3 rounded-xl mt-3 shadow-lg shadow-[#9bc400]/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
  >
    {isLogin ? 'Login to collaBRIX' : 'Register Account'}
  </button>

  {/* Dynamic Toggle Link */}
  <p className="text-xs text-center text-slate-500 mt-2 tracking-wide">
    {isLogin ? "Don't have an account? " : "Already have an account? "}
    <span 
      className="text-indigo-400 font-bold cursor-pointer hover:text-indigo-300 transition-colors underline decoration-indigo-500/30 underline-offset-4" 
      onClick={() => setIsLogin(!isLogin)}
    >
      {isLogin ? 'Sign up' : 'Log in'}
    </span>
  </p>
</form>
    </div>
  )
}

export default Login