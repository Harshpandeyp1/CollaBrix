import React, { useState } from 'react'
import login from '../assets/login.jpg'
import api from '../Services/api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    data.preventDefault();
    setErrorMessage('')
    try {
        const response = await api.post("/auth/login", {
            email,
            password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        console.log("Login successful");
        navigate('/mainpage');
    } catch (error) {
        const serverMessage = error?.response?.data?.message || error?.response?.data || error?.message || 'Unknown server error';
        setErrorMessage(serverMessage);
        console.error("Error submitting form:", {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        });
    }
  };

  const handleSignup = async (data) => {
    data.preventDefault();
    setErrorMessage('')
    try {
        const response = await api.post("/auth/register", {
            username,
            email,
            password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate('/mainpage');
        console.log("Signup successful");
    } catch (error) {
        const serverMessage = error?.response?.data?.message || error?.response?.data || error?.message || 'Unknown server error';
        setErrorMessage(serverMessage);
        console.error("Error submitting form:", {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        });
    }
  };

  return (
    <div className="relative min-h-screen items-center justify-center flex overflow-hidden bg-slate-950 p-4">

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 scale-110 blur-sm"
        style={{ backgroundImage: `url(${login})` }}
      />

      {/* Dark gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-br from-teal-500/70 via-slate-950/70 to-blue-400 z-0" />

      {/* Ambient glow blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl z-0" />

      {/* Form Container */}
      <form 
        onSubmit={isLogin ? handleSubmit : handleSignup}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/40 border border-white/10 flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out]"
      >
        {/* Logo / Brand mark */}
        <div className="flex justify-center mb-1">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-teal-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-xl">C</span>
          </div>
        </div>

        <div className="text-center mb-1">
          <h2 className="text-3xl font-black tracking-tight text-white">
            {isLogin ? 'Welcome Back' : (
              <span>Create <span className="bg-linear-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Account</span></span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {isLogin ? 'Please enter your details to sign in' : 'Fill in the details to get started'}
          </p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-white/10 rounded-xl outline-none text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-white/20 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Username Field - Only shows up if registering */}
        {!isLogin && (
          <div className="flex flex-col gap-1.5 animate-[fadeIn_0.3s_ease-out]">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Username</label>
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input 
                type="text"
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-white/10 rounded-xl outline-none text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-white/20 transition-all text-sm"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Password</label>
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input 
              type="password"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-white/10 rounded-xl outline-none text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-white/20 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-linear-to-r from-indigo-500 to-teal-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl mt-2 shadow-lg shadow-indigo-500/20 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 active:translate-y-0 active:scale-[0.98] text-sm tracking-wide"
        >
          {isLogin ? 'Login to collaBRIX' : 'Register Account'}
        </button>

        {errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Dynamic Toggle Link */}
        <p className="text-xs text-center text-slate-500 tracking-wide">
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
