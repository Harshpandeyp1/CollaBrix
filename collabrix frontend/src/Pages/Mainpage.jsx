import React from 'react'
import Navbar from '../Components/Navbar'

import DashboardHeader from '../Components/DashBoardHeader'
import Peoplemayknow from '../Components/Peoplemayknow'
import ProfileCard from '../Components/ProfileCard'
import DiscoveryFeed from '../Components/DiscoveryFeed'

const Mainpage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-teal-100 to-blue-100">

      {/* Navbar */}
      <Navbar />


      {/* Main Dashboard */}
      <main className=" pt-6 px-6">

        <div className="max-w-7xl mx-auto">

          {/* Three Column Layout */}
          <div className="grid grid-cols-12 gap-6">


            {/* ================= LEFT COLUMN ================= */}
            <aside className="col-span-3">

              {/* This entire column stays sticky */}
              <div className="col-span-3 space-y-6 sticky top-20 self-start">

                {/* Profile */}
                <ProfileCard />


                {/* User Navigation / Saved Items */}
                <div className="
                  bg-white
                  rounded-2xl
                  border
                  border-sky-100
                  shadow-sm
                  p-5
                ">

                  <h2 className="
                    text-base
                    font-semibold
                    text-slate-800
                    mb-4
                  ">
                    Your Space
                  </h2>


                  <div className="space-y-1">

                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>🔖</span>
                      <span>Saved Ideas</span>
                    </button>


                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>📁</span>
                      <span>Saved Projects</span>
                    </button>


                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>💡</span>
                      <span>My Ideas</span>
                    </button>


                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>🚀</span>
                      <span>My Projects</span>
                    </button>


                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>👥</span>
                      <span>My Connections</span>
                    </button>

                  </div>

                </div>

              </div>

            </aside>


            {/* ================= CENTER COLUMN ================= */}
            <section className="col-span-6 space-y-6">
              
              <DashboardHeader />
              {/* Discovery Feed */}
              <DiscoveryFeed />

            </section>


            {/* ================= RIGHT COLUMN ================= */}
            <aside className="col-span-3 space-y-10 sticky top-20 self-start">


              {/* People You May Know */}
              <Peoplemayknow />


              {/* Future Box */}
                  {/* Sidebar Footer */}
        <footer className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 text-slate-500">
          {/* Footer Links */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-medium text-slate-500">
            <a href="#about" className="hover:text-sky-600 hover:underline transition-colors">About</a>
            <a href="#accessibility" className="hover:text-sky-600 hover:underline transition-colors">Accessibility</a>
            <a href="#help" className="hover:text-sky-600 hover:underline transition-colors">Help Center</a>
            <a href="#privacy" className="hover:text-sky-600 hover:underline transition-colors">Privacy & Terms</a>
            <a href="#ad-choices" className="hover:text-sky-600 hover:underline transition-colors">Ad Choices</a>
            <a href="#projects" className="hover:text-sky-600 hover:underline transition-colors">Projects</a>
          </div>

          {/* Brand Copyright */}
          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white text-[8px] font-bold">
                C
              </div>
              <span>Collabrix</span>
            </div>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </div>
        </footer>

            </aside>


          </div>

        </div>

      </main>

    </div>
  )
}

export default Mainpage