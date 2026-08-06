import React from "react";
import "./QR.css";

const defaultUrlBuilder = (value: string, size: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

export type QRProps = {
  /** Value to encode in the QR code */
  value: string;
  /** QR code size in pixels */
  size?: number;
  /** Label text below the code */
  label?: string;
  /** Sub-label text */
  sub?: string;
  /** Custom URL builder for the QR image */
  urlBuilder?: (value: string, size: number) => string;
  /** Additional CSS class names */
  className?: string;
};

export function QR({
  value,
  size = 200,
  label,
  sub,
  urlBuilder = defaultUrlBuilder,
  className = "",
}: QRProps) {
  return (
    <div className={"qr " + className}>
      <img
        className="qr__img"
        style={{ width: size, height: size }}
        src={urlBuilder(value, size)}
        alt={label || "QR code"}
        loading="lazy"
      />
      {label && <div className="qr__label">{label}</div>}
      {sub && <div className="qr__sub">{sub || value}</div>}
    </div>
  );
}
