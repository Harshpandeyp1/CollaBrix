import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, Code2, Lightbulb, Palette, Sparkles, Users } from 'lucide-react'
import PublicNavbar from '../Components/PublicNavbar'

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="light-mode-page isolate min-h-screen bg-[#FDFBD4] flex flex-col font-sans relative overflow-x-hidden text-slate-800 antialiased">

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
          className="absolute inset-0 w-full h-full text-indigo-900/10"
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
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-white/40 blur-3xl" />

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

      <PublicNavbar />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full flex flex-col justify-between overflow-hidden">
        <div className="relative z-10 flex-1 flex items-center px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-7xl mx-auto grid w-full items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-white/80 border border-sky-200/80 text-sky-700 text-xs font-bold tracking-wide px-3.5 py-2 rounded-full mb-7 shadow-sm backdrop-blur-sm">
                <Sparkles size={14} className="text-emerald-500" />
                A launchpad for student creators
              </span>
              <h1 className="text-slate-900 font-black text-5xl sm:text-6xl lg:text-6xl xl:text-7xl tracking-[-0.055em] leading-[1.03]">
                Big ideas are
                <br />
                better <span className="bg-linear-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">together.</span>
              </h1>
              <p className="text-slate-600 text-base md:text-lg mt-7 max-w-xl font-normal leading-relaxed">
                Turn the idea in your notebook into something real. Find your people, build a team, and make your next big thing happen.
              </p>
              <div className="landing-hero-actions mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button onClick={() => navigate('/login')} className="group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 text-sm">
                  Share your idea <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => navigate('/explore')} className="inline-flex items-center justify-center gap-2 bg-white/80 hover:bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all text-sm">
                  Explore projects <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="mt-9 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#F7F9FC] bg-amber-100 text-xs font-bold text-amber-800">JD</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#F7F9FC] bg-sky-100 text-xs font-bold text-sky-800">AK</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#F7F9FC] bg-violet-100 text-xs font-bold text-violet-800">MS</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-800">Made for doers</span><br />
                  Bring your next idea to life
                </p>
              </div>
            </div>

            <div aria-label="Preview of a student project workspace" className="relative mx-auto w-full max-w-[550px]">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-linear-to-br from-sky-200/60 via-white/20 to-emerald-200/60 blur-2xl" />
              <div className="relative rotate-1 rounded-[1.75rem] border border-white/80 bg-white/85 p-3 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-4">
                <div className="overflow-hidden rounded-[1.25rem] border border-slate-100 bg-[#f8fafc]">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide text-slate-400">YOUR PROJECT SPACE</span>
                    <ArrowUpRight size={15} className="text-slate-400" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> OPEN FOR COLLABORATORS
                        </span>
                        <h2 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Campus Green Map</h2>
                        <p className="mt-1 text-xs text-slate-500">A smarter way to find sustainable spots.</p>
                      </div>
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                        <Lightbulb size={20} />
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-100 bg-white p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">The dream team</span>
                        <span className="text-[10px] font-medium text-sky-600">3 of 5 spots filled</span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-violet-50 p-2.5">
                          <Palette size={15} className="text-violet-600" />
                          <p className="mt-2 text-[10px] font-bold text-slate-700">Design</p>
                          <p className="text-[9px] text-slate-400">Maya · joined</p>
                        </div>
                        <div className="rounded-lg bg-sky-50 p-2.5">
                          <Code2 size={15} className="text-sky-600" />
                          <p className="mt-2 text-[10px] font-bold text-slate-700">Engineering</p>
                          <p className="text-[9px] text-slate-400">You · joined</p>
                        </div>
                        <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/60 p-2.5">
                          <Users size={15} className="text-emerald-600" />
                          <p className="mt-2 text-[10px] font-bold text-slate-700">Your role?</p>
                          <p className="text-[9px] text-emerald-700">There’s a place</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-900 px-3.5 py-3 text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10"><Check size={14} /></span>
                        <div>
                          <p className="text-[10px] font-semibold">First milestone</p>
                          <p className="text-[9px] text-slate-300">Project brief is ready</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-emerald-400/15 px-2 py-1 text-[9px] font-bold text-emerald-300">IN MOTION</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 top-[18%] hidden items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-lg shadow-slate-900/10 sm:flex">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><Users size={16} /></span>
                <span className="text-[10px] font-bold text-slate-700">Better, together</span>
              </div>
              <div className="absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-lg shadow-slate-900/10 sm:flex">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-amber-700"><Sparkles size={16} /></span>
                <span className="text-[10px] font-bold text-slate-700">From idea to impact</span>
              </div>
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
      <section id="about" className="py-24 px-4 md:px-8 relative z-30 border-b border-sky-100">
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
      <section id="features" className="py-28 px-4 md:px-8 relative z-30">
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