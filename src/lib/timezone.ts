/** Resolve an IANA zone name, falling back to the viewer's browser zone. */
export function resolveZone(tz?: string | null): string {
  if (typeof tz === "string" && tz) return tz;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export type ZoneInfo = {
  city: string;
  abbrev: string | null;
  offset: string;
};

/**
 * Describe a zone as `{ city, abbrev, offset }` for header labels, e.g.
 * `{ city: "Jakarta", abbrev: null, offset: "GMT+7" }`.
 */
export function describeZone(zone: string, date: Date = new Date()): ZoneInfo {
  const namePart = (style: Intl.DateTimeFormatOptions["timeZoneName"]) => {
    try {
      return new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: style })
        .formatToParts(date)
        .find((p) => p.type === "timeZoneName")?.value;
    } catch {
      return undefined;
    }
  };
  const offset = namePart("shortOffset") || "";
  const abbrev = namePart("short");
  const city = zone.split("/").pop()?.replace(/_/g, " ") || zone;
  return { city, abbrev: abbrev && abbrev !== offset ? abbrev : null, offset };
}

export const hasTimeComponent = (value: unknown): boolean =>
  value instanceof Date ||
  typeof value === "number" ||
  /[T\s]\d{1,2}:\d{2}/.test(String(value));

/**
 * Format a date value for display in the given IANA `zone`. Falls back to the
 * raw value if it isn't a parseable date.
 */
export function formatDateInZone(
  value: unknown,
  zone: string,
  format?: Intl.DateTimeFormatOptions,
): unknown {
  const d = value instanceof Date ? value : new Date(value as string | number);
  if (isNaN(d.getTime())) return value;

  const opts = format || {
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
    ...(hasTimeComponent(value) ? { hour: "2-digit" as const, minute: "2-digit" as const } : {}),
  };

  try {
    return d.toLocaleString(undefined, { ...opts, timeZone: zone });
  } catch {
    return d.toLocaleString(undefined, opts);
  }
}
