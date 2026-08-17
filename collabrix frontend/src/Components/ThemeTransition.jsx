
import React from "react";

const ThemeTransition = ({ type, isAnimating }) => {
  if (!isAnimating) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        pointer-events-none
        overflow-hidden
        bg-transparent
      "
    >

      {/* ================= MOON ================= */}

      {type === "moon" && (
        <div
          className="
            absolute
            left-1/2
            bottom-[-180px]
            -translate-x-1/2
            animate-moon-rise
          "
        >

          <div
            className="
              relative
              w-36
              h-36
              rounded-full
              bg-zinc-200
              shadow-[0_0_70px_20px_rgba(255,255,255,0.25)]
            "
          >

            {/* Moon shadow */}
            <div
              className="
                absolute
                w-36
                h-36
                rounded-full
                bg-black
                -right-8
                -top-4
              "
            />

          </div>

        </div>
      )}


      {/* ================= SUN ================= */}

      {type === "sun" && (
        <div
          className="
            absolute
            left-1/2
            bottom-[-180px]
            -translate-x-1/2
            animate-sun-rise
          "
        >

          <div
            className="
              w-36
              h-36
              rounded-full
              bg-amber-300
              shadow-[0_0_100px_35px_rgba(251,191,36,0.35)]
            "
          />

        </div>
      )}

    </div>
  );
};

export default ThemeTransition;

