import React from "react";

const ThemeTransition = ({ type, isAnimating }) => {
  if (!isAnimating) return null;

  const isMoon = type === "moon";

  return (
    <div
      aria-hidden="true"
      className={`celestial-scene ${isMoon ? "celestial-scene-night" : "celestial-scene-day"}`}
    >
      {isMoon && (
        <div className="celestial-stars">
          {Array.from({ length: 12 }, (_, index) => (
            <span className={`celestial-star celestial-star-${index + 1}`} key={index} />
          ))}
        </div>
      )}

      <div className={`celestial-object ${isMoon ? "celestial-moon" : "celestial-sun"}`}>
        {isMoon ? (
          <div className="celestial-moon-surface">
            <span className="moon-crater moon-crater-one" />
            <span className="moon-crater moon-crater-two" />
            <span className="moon-crater moon-crater-three" />
            <span className="moon-crater moon-crater-four" />
          </div>
        ) : (
          <>
            <div className="sun-rays" />
            <div className="sun-core">
              <span className="sun-flare" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ThemeTransition;
