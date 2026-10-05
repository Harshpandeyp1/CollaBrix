import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-[#E3F0A3] backdrop-blur-md px-4 md:px-8 py-3.5 w-full sticky top-0 z-50 border-b border-amber-900/20 shadow-sm shadow-amber-900/10 dark:bg-black dark:border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <img 
            src="https://img.icons8.com/ios-filled/50/0284c7/brain.png" 
            alt="Collabrix Logo" 
            className="h-7 w-7 object-contain" 
          />
          <h1 className="text-slate-800 text-base md:text-lg font-black tracking-wider select-none dark:text-white">
            colla
            <span className="text-sky-600">BRIX</span>
          </h1>
        </div>
        
        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <li><a href="#about" className="text-slate-600 hover:text-sky-600 transition-colors dark:text-zinc-300">About</a></li>
          <li><a href="#features" className="text-slate-600 hover:text-sky-600 transition-colors dark:text-zinc-300">How It Works</a></li>
          <li><a href="#contact" className="text-slate-600 hover:text-sky-600 transition-colors dark:text-zinc-300">Contact Us</a></li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-sky-600 text-sm font-medium px-3 py-1.5 transition-colors dark:text-zinc-300">
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
    <div className="isolate min-h-screen bg-[#FDFBD4] flex flex-col font-sans relative overflow-x-hidden text-slate-800 antialiased dark:bg-black dark:text-white">

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

      {/* Fixed so the design stays in place while the page scrolls */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        {/* Brick wall pattern, fades out toward the edges */}
        <svg
          className="absolute inset-0 w-full h-full text-indigo-900/10 dark:text-indigo-300/10"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
          }}
        >
          <defs>
            <pattern id="brick-pattern-landing" width="80" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M0 0H80 M0 20H80 M0 0V20 M40 0V20 M20 20V40 M60 20V40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brick-pattern-landing)" />
        </svg>

        {/* Soft color glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-400/30 blur-3xl dark:bg-teal-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-white/40 blur-3xl dark:bg-indigo-500/10" />

        {/* Floating bricks */}
        <div
          className="login-float absolute top-[14%] left-[6%] w-24 h-12 rounded-lg border border-indigo-500/30 bg-linear-to-br from-indigo-500/25 to-teal-500/25 backdrop-blur-sm"
          style={{ '--r': '-12deg', animationDelay: '0s' }}
        />
        <div
          className="login-float absolute top-[24%] right-[7%] w-16 h-8 rounded-md border border-teal-500/30 bg-linear-to-br from-teal-500/25 to-indigo-500/25 backdrop-blur-sm"
          style={{ '--r': '10deg', animationDelay: '1.5s' }}
        />
        <div
          className="login-float absolute bottom-[18%] left-[8%] w-20 h-10 rounded-lg border border-teal-500/30 bg-linear-to-br from-teal-500/25 to-indigo-500/25 backdrop-blur-sm"
          style={{ '--r': '8deg', animationDelay: '3s' }}
        />
        <div
          className="login-float absolute bottom-[10%] right-[9%] w-28 h-14 rounded-xl border border-indigo-500/30 bg-linear-to-br from-indigo-500/25 to-teal-500/25 backdrop-blur-sm"
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

      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[85vh] md:h-[90vh] flex flex-col justify-between overflow-hidden">
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center p-6 md:p-10 max-w-4xl mx-auto">
            <span className="inline-block bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              For Student Visionaries & Creators
            </span>
            <h1 className="text-slate-900 font-black text-4xl md:text-6xl tracking-tight leading-[1.15] dark:text-white">
              Unleash Your Ideas. <br />
              <span className="bg-linear-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">Build Together.</span>
            </h1>
            <p className="text-slate-600 text-base md:text-xl mt-6 max-w-2xl mx-auto font-normal leading-relaxed dark:text-zinc-300">
              The ultimate launchpad where students pitch raw concepts, assemble cross-functional teams, and collaborate to turn bright innovations into reality.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 text-base active:translate-y-0">
                Share Your Idea
              </button>
              <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 font-semibold py-3.5 px-8 rounded-xl shadow-sm transition-all backdrop-blur-sm text-base">
                Explore Student Projects
              </button>
            </div>
          </div>
        </div>

        {/* Shape Divider (fill made transparent so the background design shows through) */}
        <div className="relative w-full z-20 pointer-events-none translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path className="fill-transparent" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </div>

      {/* --- ABOUT / MISSION SECTION --- */}
      <section id="about" className="py-24 px-4 md:px-8 relative z-30 border-b border-sky-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
            Bridging the Gap Between <span className="text-sky-600">Concept</span> and <span className="text-emerald-600">Creation</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-normal dark:text-zinc-300">
            Every great tech giant, social movement, or design framework started as a simple student concept. 
            <strong className="text-slate-900 font-semibold dark:text-white"> collaBRIX</strong> provides the dedicated ecosystem students need to publish ideas safely, 
            receive constructive feedback, and invite multi-disciplinary peers—from writers and designers to developers—to co-build the future.
          </p>
        </div>
      </section>

      {/* --- ASYMMETRIC TIMELINE LAYOUT --- */}
      <section id="features" className="py-28 px-4 md:px-8 relative z-30">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The Blueprint</span>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mt-2 dark:text-white">Built for the Next Generation of Makers</h3>
          </div>

          <div className="space-y-16 border-l-2 border-sky-200 ml-4 md:ml-8 pl-8 md:pl-12 relative">
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center text-xs font-bold text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-md shadow-sky-500/20">1</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2 dark:text-white">
                  Pitch Your Vision <span className="text-sm font-normal text-slate-400">💡</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed dark:text-zinc-300">
                  Don't let your classroom thoughts sit idle in your notebooks. Document your vision transparently inside an active sandbox environment so others understand your ultimate objectives.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center text-xs font-bold text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-md shadow-teal-500/20">2</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2 dark:text-white">
                  Find Co-Founders <span className="text-sm font-normal text-slate-400">🤝</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed dark:text-zinc-300">
                  Need a product designer to map visual interfaces or a software engineering partner to orchestrate systems architecture? Build cross-functional teams instantly across campus lines.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-md shadow-emerald-500/20">3</div>
              <div className="max-w-2xl">
                <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2 dark:text-white">
                  Gain Real Experience <span className="text-sm font-normal text-slate-400">🚀</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed dark:text-zinc-300">
                  Graduate with a live portfolio showcasing actual collaborative cross-functional product deployments rather than relying purely on textbook case studies and solo homework assignments.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer id="contact" className="bg-sky-950 text-sky-200 text-sm py-6 px-4 md:px-8 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wide">collaBRIX</span>
            <span className="text-sky-300/70">© {new Date().getFullYear()}</span>
          </div>
          <nav aria-label="Footer navigation" className="flex items-center gap-5 text-xs text-sky-300/80">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#features" className="hover:text-white transition">How It Works</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default Landing