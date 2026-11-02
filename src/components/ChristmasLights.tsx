const BULB_COUNT = 24;

/** Decorative twinkling string of holiday lights; purely visual. */
export const ChristmasLights = () => (
  <div className="xmas-lights" aria-hidden>
    {Array.from({ length: BULB_COUNT }, (_, i) => (
      <span key={i} className="xmas-lights__segment">
        <span className="xmas-lights__bulb" />
      </span>
    ))}
  </div>
);
