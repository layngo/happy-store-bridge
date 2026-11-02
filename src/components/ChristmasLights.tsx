import type { CSSProperties } from "react";
import garland from "@/assets/christmas_light_garland.png.asset.json";

type BulbColor = "red" | "gold" | "blue" | "green";

/** Bulb centers in the garland photo, as % of its width / height. */
const BULBS: { x: number; y: number; color: BulbColor }[] = [
  { x: 2.52, y: 43.51, color: "red" },
  { x: 10.22, y: 57.48, color: "gold" },
  { x: 18.26, y: 64.89, color: "blue" },
  { x: 25.88, y: 70.83, color: "gold" },
  { x: 33.63, y: 75.43, color: "green" },
  { x: 41.67, y: 76.73, color: "red" },
  { x: 50.08, y: 78.78, color: "gold" },
  { x: 58.24, y: 76.61, color: "blue" },
  { x: 66.51, y: 72.22, color: "red" },
  { x: 74.49, y: 68.85, color: "blue" },
  { x: 82.95, y: 60.67, color: "gold" },
  { x: 90.88, y: 53.47, color: "green" },
  { x: 97.83, y: 42.08, color: "red" },
];

const COLOR_VAR: Record<BulbColor, string> = {
  red: "var(--xmas-red)",
  gold: "var(--xmas-gold)",
  blue: "var(--xmas-blue)",
  green: "var(--xmas-green)",
};

/** Small deterministic random so every bulb keeps its own rhythm between renders. */
const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const GarlandTile = ({ tile }: { tile: number }) => (
  <div className="xmas-garland__tile">
    <img className="xmas-garland__base" src={garland.url} alt="" draggable={false} />
    {BULBS.map((b, i) => {
      const seed = tile * 31 + i * 7 + 1;
      const timing = {
        "--bulb": COLOR_VAR[b.color],
        "--dur": `${(1.8 + seeded(seed) * 2.6).toFixed(2)}s`,
        "--delay": `${(-seeded(seed + 3) * 4).toFixed(2)}s`,
        "--spark-dur": `${(4 + seeded(seed + 5) * 5).toFixed(2)}s`,
        "--spark-delay": `${(-seeded(seed + 11) * 8).toFixed(2)}s`,
      } as CSSProperties;
      return (
        <span key={i} style={timing}>
          <span className="xmas-garland__halo" style={{ left: `${b.x}%`, top: `${b.y}%` }} />
          <img
            className="xmas-garland__lit"
            src={garland.url}
            alt=""
            draggable={false}
            style={{ ...timing, clipPath: `ellipse(2.9% 19.5% at ${b.x}% ${b.y}%)` }}
          />
          <span className="xmas-garland__sparkle" style={{ left: `${b.x - 0.6}%`, top: `${b.y - 4}%` }} />
        </span>
      );
    })}
  </div>
);

/** One short string of real-looking holiday lights, centered above the menu, glowing bulb by bulb. */
export const ChristmasLights = () => (
  <div className="xmas-garland" aria-hidden>
    <GarlandTile tile={0} />
  </div>
);
