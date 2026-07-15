import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-white/10 backdrop-blur-md px-4 md:px-8 py-3.5 w-full sticky top-0 z-50 border-b border-white/20 shadow-lg shadow-black/5">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    
    {/* Logo */}
    <div className="flex items-center space-x-2 shrink-0">
      <img 
        src="https://img.icons8.com/ios-filled/50/ffffff/brain.png" 
        alt="Collabrix Logo" 
        className="h-7 w-7 object-contain" 
      />
      <h1 className="text-white text-base md:text-lg font-extrabold tracking-wider select-none">
        colla
        <span className="text-[#f9c5bd]">
          BRIX
        </span>
      </h1>
    </div>
    
    {/* Navigation Links */}
    <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
      <li><a href="#about" className="text-white hover:text-[#f9c5bd] transition-colors">About</a></li>
      <li><a href="#features" className="text-white hover:text-[#f9c5bd] transition-colors">How It Works</a></li>
      <li><a href="#contact" className="text-white hover:text-[#f9c5bd] transition-colors">Contact Us</a></li>
    </ul>

    {/* Action Buttons */}
    <div className="flex items-center space-x-3">
      <button onClick={() => navigate('/login')} className="text-white hover:text-[#f9c5bd] text-sm font-medium px-3 py-1.5 transition-colors">
        Log In
      </button>
      <button onClick={() => navigate('/signup')} className="bg-[#9bc400] hover:bg-[#86aa00] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg shadow transition-all transform hover:-translate-y-0.5">
        Get Started
      </button>
    </div>

  </div>
</nav>
  )
}

export default Navbar