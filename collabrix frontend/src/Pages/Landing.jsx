import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-linear-to-b from-sky-50 via-teal-50/50 to-white backdrop-blur-md px-4 md:px-8 py-3.5 w-full sticky top-0 z-50 border-b border-sky-100 shadow-sm shadow-sky-900/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <img 
            src="https://img.icons8.com/ios-filled/50/0284c7/brain.png" 
            alt="Collabrix Logo" 
            className="h-7 w-7 object-contain" 
          />
          <h1 className="text-slate-800 text-base md:text-lg font-black tracking-wider select-none">
            colla
            <span className="text-sky-600">BRIX</span>
          </h1>
        </div>
        
        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <li><a href="#about" className="text-slate-600 hover:text-sky-600 transition-colors">About</a></li>
          <li><a href="#features" className="text-slate-600 hover:text-sky-600 transition-colors">How It Works</a></li>
          <li><a href="#contact" className="text-slate-600 hover:text-sky-600 transition-colors">Contact Us</a></li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-sky-600 text-sm font-medium px-3 py-1.5 transition-colors">
            Log In
          </button>
          <button onClick={() => navigate('/signup')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  )
}

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden text-slate-800 antialiased">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[85vh] md:h-[90vh] flex flex-col justify-between overflow-hidden bg-linear-to-b from-sky-100 via-teal-200 to-slate-50">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 opacity-10 mix-blend-multiply"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80')` 
          }}
        />

        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center p-6 md:p-10 max-w-4xl mx-auto">
            <span className="inline-block bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              For Student Visionaries & Creators
            </span>
            <h1 className="text-slate-900 font-black text-4xl md:text-6xl tracking-tight leading-[1.15]">
              Unleash Your Ideas. <br />
              <span className="bg-linear-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">Build Together.</span>
            </h1>
            <p className="text-slate-600 text-base md:text-xl mt-6 max-w-2xl mx-auto font-normal leading-relaxed">
              The ultimate launchpad where students pitch raw concepts, assemble cross-functional teams, and collaborate to turn bright innovations into reality.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/ideas')} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 text-base active:translate-y-0">
                Share Your Idea
              </button>
              <button onClick={() => navigate('/projects')} className="w-full sm:w-auto bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 font-semibold py-3.5 px-8 rounded-xl shadow-sm transition-all backdrop-blur-sm text-base">
                Explore Student Projects
              </button>
            </div>
          </div>
        </div>

        {/* Shape Divider transitions seamlessly to pure white/light slate */}
        <div className="relative w-full z-20 pointer-events-none translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* --- ABOUT / MISSION SECTION --- */}
      <section id="about" className="bg-white py-24 px-4 md:px-8 relative z-30 border-b border-sky-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-slate-900">
            Bridging the Gap Between <span className="text-sky-600">Concept</span> and <span className="text-emerald-600">Creation</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            Every great tech giant, social movement, or design framework started as a simple student concept. 
            <strong className="text-slate-900 font-semibold"> collaBRIX</strong> provides the dedicated ecosystem students need to publish ideas safely, 
            receive constructive feedback, and invite multi-disciplinary peers—from writers and designers to developers—to co-build the future.
          </p>
        </div>
      </section>

      {/* --- ASYMMETRIC TIMELINE LAYOUT --- */}
      <section id="features" className="bg-slate-50 py-28 px-4 md:px-8 relative z-30">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The Blueprint</span>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mt-2">Built for the Next Generation of Makers</h3>
          </div>

          <div className="space-y-16 border-l-2 border-sky-200 ml-4 md:ml-8 pl-8 md:pl-12 relative">
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center text-xs font-bold text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-md shadow-sky-500/20">1</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Pitch Your Vision <span className="text-sm font-normal text-slate-400">💡</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Don't let your classroom thoughts sit idle in your notebooks. Document your vision transparently inside an active sandbox environment so others understand your ultimate objectives.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center text-xs font-bold text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-md shadow-teal-500/20">2</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Find Co-Founders <span className="text-sm font-normal text-slate-400">🤝</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Need a product designer to map visual interfaces or a software engineering partner to orchestrate systems architecture? Build cross-functional teams instantly across campus lines.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-md shadow-emerald-500/20">3</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  Gain Real Experience <span className="text-sm font-normal text-slate-400">🚀</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Graduate with a live portfolio showcasing actual collaborative cross-functional product deployments rather than relying purely on textbook case studies and solo homework assignments.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- HUBSITE FOOTER --- */}
      <footer id="contact" className="bg-sky-950 text-sky-200 text-sm py-16 px-4 md:px-8 relative z-30">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-12 mb-12 border-b border-sky-900 gap-6">
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/brain.png" alt="Logo" className="h-3.5 w-3.5 opacity-90" />
                </div>
                <span className="font-extrabold text-white tracking-wide text-base">collaBRIX</span>
              </div>
              <p className="text-xs text-sky-300/70 leading-relaxed">
                Connecting student structures, coordinating micro-dependencies, and deploying ideas.
              </p>
            </div>
            
            {/* Contextual mini sign-up field */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 bg-sky-900/40 p-2 rounded-xl border border-sky-800/60 max-w-md lg:min-w-[400px]">
              <input 
                type="email" 
                placeholder="Enter university email" 
                className="bg-transparent px-3 py-2 text-xs text-white outline-none flex-1 placeholder-sky-300/50"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap">
                Join Network
              </button>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Ecosystem</h5>
              <ul className="space-y-2.5 text-xs text-sky-300/70">
                <li><a href="#about" className="hover:text-white transition">Platform Roadmap</a></li>
                <li><a href="#features" className="hover:text-white transition">How it Orchestrates</a></li>
                <li><a href="#" className="hover:text-white transition">Project Directory</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Campus Grid</h5>
              <ul className="space-y-2.5 text-xs text-sky-300/70">
                <li><a href="#" className="hover:text-white transition">Chapter Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition">Ambassador Registry</a></li>
                <li><a href="#" className="hover:text-white transition">Showcase Portfolios</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Inquiries</h5>
              <ul className="space-y-2.5 text-xs text-sky-300/70">
                <li><a href="#" className="hover:text-white transition">Operational FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Safety Regulations</a></li>
                <li><a href="#" className="hover:text-white transition">System Status</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Connect</h5>
              <p className="text-xs text-sky-300/70 mb-2 leading-relaxed">Want your academic institution integrated?</p>
              <a href="mailto:support@collabrix.edu" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold underline decoration-emerald-500/40 underline-offset-4">
                support@collabrix.edu
              </a>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-400/60">
            <p>&copy; {new Date().getFullYear()} collaBRIX Network. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-sky-200 transition">Privacy Policy</a>
              <a href="#" className="hover:text-sky-200 transition">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}

export default Landing
