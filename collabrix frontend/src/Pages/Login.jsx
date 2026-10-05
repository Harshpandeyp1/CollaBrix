import React, { useState } from 'react'
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
    <div className="relative min-h-screen items-center justify-center flex overflow-hidden bg-[#FDFBD4] p-4 dark:bg-black">

      {/* ===== Background design (decorative only) ===== */}
      <style>{`
        @keyframes loginFloat {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50%      { transform: translateY(-18px) rotate(var(--r, 0deg)); }
        }
        .login-float { animation: loginFloat 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .login-float { animation: none; }
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">

        {/* Brick wall pattern, fades out toward the edges */}
        <svg
          className="absolute inset-0 w-full h-full text-indigo-900/10 dark:text-indigo-300/10"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          }}
        >
          <defs>
            <pattern id="brick-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M0 0H80 M0 20H80 M0 0V20 M40 0V20 M20 20V40 M60 20V40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brick-pattern)" />
        </svg>

        {/* Soft color glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-400/30 blur-3xl dark:bg-teal-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-white/40 blur-3xl dark:bg-indigo-500/10" />

        {/* Floating bricks */}
        <div
          className="login-float absolute top-[12%] left-[8%] w-24 h-12 rounded-lg border border-indigo-500/30 bg-linear-to-br from-indigo-500/25 to-teal-500/25 backdrop-blur-sm"
          style={{ '--r': '-12deg', animationDelay: '0s' }}
        />
        <div
          className="login-float absolute top-[22%] right-[10%] w-16 h-8 rounded-md border border-teal-500/30 bg-linear-to-br from-teal-500/25 to-indigo-500/25 backdrop-blur-sm"
          style={{ '--r': '10deg', animationDelay: '1.5s' }}
        />
        <div
          className="login-float absolute bottom-[18%] left-[12%] w-20 h-10 rounded-lg border border-teal-500/30 bg-linear-to-br from-teal-500/25 to-indigo-500/25 backdrop-blur-sm"
          style={{ '--r': '8deg', animationDelay: '3s' }}
        />
        <div
          className="login-float absolute bottom-[10%] right-[14%] w-28 h-14 rounded-xl border border-indigo-500/30 bg-linear-to-br from-indigo-500/25 to-teal-500/25 backdrop-blur-sm"
          style={{ '--r': '-8deg', animationDelay: '4.5s' }}
        />
        <div
          className="login-float absolute top-[55%] left-[3%] w-12 h-6 rounded-md border border-indigo-500/30 bg-indigo-500/20 backdrop-blur-sm"
          style={{ '--r': '14deg', animationDelay: '2s' }}
        />
        <div
          className="login-float absolute top-[8%] right-[38%] w-14 h-7 rounded-md border border-teal-500/30 bg-teal-500/20 backdrop-blur-sm"
          style={{ '--r': '-6deg', animationDelay: '5.5s' }}
        />
      </div>
      {/* ===== End background design ===== */}

      {/* Form Container */}
      <form 
        onSubmit={isLogin ? handleSubmit : handleSignup}
        className="relative z-10 w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200 flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out] dark:bg-zinc-900 dark:border-zinc-800"
      >
        {/* Logo / Brand mark */}
        <div className="flex justify-center mb-1">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-teal-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-xl">C</span>
          </div>
        </div>

        <div className="text-center mb-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : (
              <span>Create <span className="bg-linear-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Account</span></span>
            )}
          </h2>
          <p className="text-sm text-slate-500 mt-2 dark:text-zinc-400">
            {isLogin ? 'Please enter your details to sign in' : 'Fill in the details to get started'}
          </p>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 ml-1 dark:text-zinc-400">Email Address</label>
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
              required
            />
          </div>
        </div>

        {/* Username Field - Only shows up if registering */}
        {!isLogin && (
          <div className="flex flex-col gap-1.5 animate-[fadeIn_0.3s_ease-out]">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 ml-1 dark:text-zinc-400">Username</label>
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input 
                type="text"
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 ml-1 dark:text-zinc-400">Password</label>
          <div className="relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input 
              type="password"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm dark:bg-zinc-950 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500"
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
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider dark:text-zinc-500">or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
        </div>

        {/* Dynamic Toggle Link */}
        <p className="text-xs text-center text-slate-600 tracking-wide dark:text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-700 transition-colors underline decoration-indigo-500/30 underline-offset-4 dark:text-indigo-400 dark:hover:text-indigo-300" 
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