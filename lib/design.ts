export const BRAND = {
  name: "BeeSharing Poland",
  tagline: "Twój ul. Twój miód.",
  domain: "beesharing.pl",
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
} as const;

export const PLANS = {
  eighth: { label: "1/8 ula", price: 349, currency: "zł" },
  third: { label: "1/3 ula", price: 899, currency: "zł" },
  full: { label: "Cały ul (B2B)", price: 4900, currency: "zł" },
} as const;

export type PlanKey = keyof typeof PLANS;
