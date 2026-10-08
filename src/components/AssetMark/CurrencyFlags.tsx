import React from "react";

/* Circular flag marks for the fiat currencies that sit next to the StraitsX
 * stablecoins (USD ↔ XUSD, SGD ↔ XSGD, IDR ↔ XIDR). Flag colors are national
 * identities, not themeable tokens. AssetMark clips them to a circle. */

type FlagProps = React.SVGProps<SVGSVGElement>;

const RED = "#D80027";
const NAVY = "#0A3161";

function star(cx: number, cy: number, r: number) {
  const inner = r * 0.382;
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : inner;
    const angle = (-90 + i * 36) * (Math.PI / 180);
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  });
  return points.join(" ");
}

/* White flag halves vanish on a light surface, so every flag gets a hairline. */
function Rim() {
  return (
    <circle
      cx={12}
      cy={12}
      r={11.75}
      fill="none"
      strokeWidth={0.5}
      style={{ stroke: "var(--border)" }}
    />
  );
}

export function UsdFlag(props: FlagProps) {
  const stripe = 24 / 13;
  const dots = [0, 1, 2].flatMap((row) =>
    [0, 1, 2].map((col) => ({ x: 5 + col * 3, y: 4.8 + row * 2.8 })),
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <rect width={24} height={24} fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * stripe} width={24} height={stripe} fill={RED} />
      ))}
      <rect width={12} height={stripe * 7} fill={NAVY} />
      {dots.map(({ x, y }) => (
        <polygon key={`${x}-${y}`} points={star(x, y, 1)} fill="#fff" />
      ))}
      <Rim />
    </svg>
  );
}

export function SgdFlag(props: FlagProps) {
  const cx = 14.6;
  const cy = 6;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <rect width={24} height={24} fill="#fff" />
      <rect width={24} height={12} fill="#ED2939" />
      <circle cx={8.6} cy={6} r={4.6} fill="#fff" />
      <circle cx={10.4} cy={6} r={4.6} fill="#ED2939" />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (-90 + i * 72) * (Math.PI / 180);
        return (
          <polygon
            key={i}
            points={star(cx + 2.6 * Math.cos(angle), cy + 2.6 * Math.sin(angle), 1.15)}
            fill="#fff"
          />
        );
      })}
      <Rim />
    </svg>
  );
}

export function IdrFlag(props: FlagProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <rect width={24} height={24} fill="#fff" />
      <rect width={24} height={12} fill="#E70011" />
      <Rim />
    </svg>
  );
}
