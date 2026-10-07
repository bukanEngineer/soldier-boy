import React from "react";
import { cn } from "../../lib/cn";
import "./QR.css";

const defaultUrlBuilder = (value: string, size: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

export type QRProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Value to encode in the QR code */
  value: string;
  /** QR code size in pixels */
  size?: number;
  /** Label text below the code */
  label?: React.ReactNode;
  /** Sub-label text */
  sub?: React.ReactNode;
  /** Custom URL builder for the QR image */
  urlBuilder?: (value: string, size: number) => string;
};

export function QR({
  value,
  size = 200,
  label,
  sub,
  urlBuilder = defaultUrlBuilder,
  className,
  ...rest
}: QRProps) {
  return (
    <div className={cn("qr", className)} {...rest}>
      <img
        className="qr__img"
        style={{ width: size, height: size }}
        src={urlBuilder(value, size)}
        alt={typeof label === "string" ? label : "QR code"}
        loading="lazy"
      />
      {label != null && <div className="qr__label">{label}</div>}
      {sub != null && <div className="qr__sub">{sub}</div>}
    </div>
  );
}
