import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sectionHref = (section) =>
    pathname === "/" ? `#${section}` : `/#${section}`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-900/20 bg-[#E3F0A3] px-4 py-3.5 shadow-sm shadow-amber-900/10 backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center gap-2"
          aria-label="Collabrix home"
        >
          <img
            src="https://img.icons8.com/ios-filled/50/0284c7/brain.png"
            alt=""
            className="h-7 w-7 object-contain"
          />
          <span className="select-none text-base font-black tracking-wider text-slate-800 md:text-lg">
            colla<span className="text-sky-600">BRIX</span>
          </span>
        </button>

        <ul className="landing-nav-links hidden items-center space-x-8 text-sm font-medium">
          <li>
            <a href={sectionHref("about")} className="text-slate-600 transition-colors hover:text-sky-600">
              About
            </a>
          </li>
          <li>
            <a href={sectionHref("features")} className="text-slate-600 transition-colors hover:text-sky-600">
              How It Works
            </a>
          </li>
          <li>
            <a href={sectionHref("contact")} className="text-slate-600 transition-colors hover:text-sky-600">
              Contact Us
            </a>
          </li>
        </ul>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0 md:text-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
