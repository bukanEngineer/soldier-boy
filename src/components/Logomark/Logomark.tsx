import React from "react";

export type LogomarkProps = {
  /** Size in pixels */
  size?: number;
  /** Fill color */
  fill?: string;
  /** Color tone — "white" or "mono" uses currentColor */
  tone?: "default" | "white" | "mono";
  /** Alias for tone */
  variant?: "default" | "white" | "mono";
  /** Inline styles */
  style?: React.CSSProperties;
} & React.SVGAttributes<SVGSVGElement>;

export function Logomark({ size = 36, fill = "#00D37E", tone, variant, style, ...rest }: LogomarkProps) {
  const effectiveTone = tone || variant;
  const color = effectiveTone === "white" || effectiveTone === "mono" ? "currentColor" : fill;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={style} {...rest}>
      <path
        d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18 18-8.059 18-18S27.941 0 18 0Zm8.4 14.4-9.6 9.6a1.2 1.2 0 0 1-1.697 0l-5.4-5.4a1.2 1.2 0 0 1 1.697-1.697L15.95 21.5l8.752-8.752a1.2 1.2 0 0 1 1.697 1.697v-.045Z"
        fill={color}
      />
    </svg>
  );
}
