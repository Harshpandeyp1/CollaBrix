import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-slate-900/40 backdrop-blur-md px-4 md:px-8 py-3.5 w-full sticky top-0 z-50 border-b border-white/5 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <img 
            src="https://img.icons8.com/ios-filled/50/ffffff/brain.png" 
            alt="Collabrix Logo" 
            className="h-7 w-7 object-contain opacity-90" 
          />
          <h1 className="text-white text-base md:text-lg font-black tracking-wider select-none">
            colla
            <span className="text-indigo-400">BRIX</span>
          </h1>
        </div>
        
        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <li><a href="#about" className="text-slate-300 hover:text-indigo-400 transition-colors">About</a></li>
          <li><a href="#features" className="text-slate-300 hover:text-indigo-400 transition-colors">How It Works</a></li>
          <li><a href="#contact" className="text-slate-300 hover:text-indigo-400 transition-colors">Contact Us</a></li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/login')} className="text-slate-200 hover:text-indigo-400 text-sm font-medium px-3 py-1.5 transition-colors">
            Log In
          </button>
          <button onClick={() => navigate('/signup')} className="bg-[#9bc400] hover:bg-[#86aa00] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0">
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
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-x-hidden text-slate-100 antialiased">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[85vh] md:h-[90vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 opacity-20 mix-blend-overlay"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80')` 
          }}
        />

        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center p-6 md:p-10 max-w-4xl mx-auto">
            <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              For Student Visionaries & Creators
            </span>
            <h1 className="text-white font-black text-4xl md:text-6xl tracking-tight leading-[1.15]">
              Unleash Your Ideas. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Build Together.</span>
            </h1>
            <p className="text-slate-300 text-base md:text-xl mt-6 max-w-2xl mx-auto font-normal leading-relaxed">
              The ultimate launchpad where students pitch raw concepts, assemble cross-functional teams, and collaborate to turn bright innovations into reality.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/ideas')} className="w-full sm:w-auto bg-[#9bc400] hover:bg-[#86aa00] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-[#9bc400]/20 transition-all transform hover:-translate-y-0.5 text-base active:translate-y-0">
                Share Your Idea
              </button>
              <button onClick={() => navigate('/projects')} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3.5 px-8 rounded-xl transition-all backdrop-blur-sm text-base">
                Explore Student Projects
              </button>
            </div>
          </div>
        </div>

        {/* Shape Divider transitions seamlessly to pure slate-950 */}
        <div className="relative w-full z-20 pointer-events-none translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#090d16" />
          </svg>
        </div>
      </div>

      {/* --- ABOUT / MISSION SECTION --- */}
      <section id="about" className="bg-[#090d16] py-24 px-4 md:px-8 relative z-30 border-b border-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white">
            Bridging the Gap Between <span className="text-indigo-400">Concept</span> and <span className="text-purple-400">Creation</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            Every great tech giant, social movement, or design framework started as a simple student concept. 
            <strong className="text-white font-semibold"> collaBRIX</strong> provides the dedicated ecosystem students need to publish ideas safely, 
            receive constructive feedback, and invite multi-disciplinary peers—from writers and designers to developers—to co-build the future.
          </p>
        </div>
      </section>

      {/* --- ASYMMETRIC TIMELINE LAYOUT (Replaced Feature Cards) --- */}
      <section id="features" className="bg-slate-950 py-28 px-4 md:px-8 relative z-30">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9bc400]">The Blueprint</span>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-2">Built for the Next Generation of Makers</h3>
          </div>

          <div className="space-y-16 border-l-2 border-slate-800 ml-4 md:ml-8 pl-8 md:pl-12 relative">
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-xs font-bold text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shadow-indigo-500/20">1</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Pitch Your Vision <span className="text-sm font-normal text-slate-500">💡</span>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Don't let your classroom thoughts sit idle in your notebooks. Document your vision transparently inside an active sandbox environment so others understand your ultimate objectives.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-purple-500 flex items-center justify-center text-xs font-bold text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-lg shadow-purple-500/20">2</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Find Co-Founders <span className="text-sm font-normal text-slate-500">🤝</span>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Need a product designer to map visual interfaces or a software engineering partner to orchestrate systems architecture? Build cross-functional teams instantly across campus lines.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-[#9bc400] flex items-center justify-center text-xs font-bold text-[#9bc400] group-hover:bg-[#9bc400] group-hover:text-white transition-all shadow-lg shadow-[#9bc400]/20">3</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  Gain Real Experience <span className="text-sm font-normal text-slate-500">🚀</span>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Graduate with a live portfolio showcasing actual collaborative cross-functional product deployments rather than relying purely on textbook case studies and solo homework assignments.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PREMIUM HUBSITE FOOTER --- */}
      <footer id="contact" className="bg-[#070a12] border-t border-white/[0.03] text-slate-400 text-sm py-16 px-4 md:px-8 relative z-30">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: Brand & Dynamic Newsletter Action */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-12 mb-12 border-b border-white/[0.03] gap-6">
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/brain.png" alt="Logo" className="h-3.5 w-3.5 opacity-80" />
                </div>
                <span className="font-extrabold text-white tracking-wide text-base">collaBRIX</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connecting student structures, coordinating micro-dependencies, and deploying ideas.
              </p>
            </div>
            
            {/* Contextual mini sign-up field */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 bg-slate-900/50 p-2 rounded-xl border border-white/5 max-w-md lg:min-w-[400px]">
              <input 
                type="email" 
                placeholder="Enter university email" 
                className="bg-transparent px-3 py-2 text-xs text-white outline-none flex-1 placeholder-slate-600"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap">
                Join Network
              </button>
            </div>
          </div>

          {/* Middle Row: Content Navigation Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Ecosystem</h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#about" className="hover:text-white transition">Platform Roadmap</a></li>
                <li><a href="#features" className="hover:text-white transition">How it Orchestrates</a></li>
                <li><a href="#" className="hover:text-white transition">Project Directory</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Campus Grid</h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#" className="hover:text-white transition">Chapter Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition">Ambassador Registry</a></li>
                <li><a href="#" className="hover:text-white transition">Showcase Portfolios</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Inquiries</h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#" className="hover:text-white transition">Operational FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Safety Regulations</a></li>
                <li><a href="#" className="hover:text-white transition">System Status</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-4 text-xs tracking-wider uppercase">Connect</h5>
              <p className="text-xs text-slate-500 mb-2 leading-relaxed">Want your academic institution integrated?</p>
              <a href="mailto:support@collabrix.edu" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold underline decoration-indigo-500/40 underline-offset-4">
                support@collabrix.edu
              </a>
            </div>
          </div>

          {/* Bottom Row: Metadata & Legal Utilities */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} collaBRIX Network. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}

export default Landing