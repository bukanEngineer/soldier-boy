import React from "react";
import { cn } from "../../lib/cn";
import "./OtcBanner.css";

import {
  ArrowArt,
  Pattern141Art,
  Pattern142Art,
  Pattern143Art,
  Pattern145Art,
} from "./art/index";

export type OtcBannerProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  amount?: React.ReactNode;
  body?: React.ReactNode;
  ctaLabel?: React.ReactNode;
  onCtaClick?: () => void;
  href?: string;
};

export function OtcBanner({
  title = "StraitsX OTC Desk",
  amount = "100,000 USD",
  body,
  ctaLabel = "Request for a Quote",
  onCtaClick,
  href,
  className,
  ...rest
}: OtcBannerProps) {
  const defaultBody = (
    <>
      We offer deep liquidity to institutions and high net-worth individuals. Starting from{" "}
      <span className="num">{amount}</span>.
    </>
  );

  return (
    <section className={cn("otc", className)} {...rest}>
      <div className="otc__deco" aria-hidden="true">
        <div className="otc__pattern otc__pattern--a">
          <Pattern141Art />
        </div>
        <div className="otc__pattern otc__pattern--b">
          <Pattern143Art />
        </div>
        <div className="otc__pattern otc__pattern--c">
          <Pattern142Art />
        </div>
        <div className="otc__pattern otc__pattern--d">
          <Pattern145Art />
        </div>
      </div>
      <div className="otc__text">
        <div className="otc__title">{title}</div>
        <p className="otc__body">{body ?? defaultBody}</p>
      </div>
      {href ? (
        <a className="otc__cta" href={href}>
          {ctaLabel}
          <ArrowArt className="otc__cta-arrow" aria-hidden="true" focusable="false" />
        </a>
      ) : (
        <button type="button" className="otc__cta" onClick={onCtaClick}>
          {ctaLabel}
          <ArrowArt className="otc__cta-arrow" aria-hidden="true" focusable="false" />
        </button>
      )}
    </section>
  );
}
