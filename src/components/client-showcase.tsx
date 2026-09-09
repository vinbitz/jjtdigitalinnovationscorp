import React from "react";
import { Sparkles, Award, HeartHandshake, Gift, CheckCircle2 } from "lucide-react";

interface ClientBrand {
  name: string;
  tagline?: string;
  logo: React.ReactNode;
}

export const clientBrands: ClientBrand[] = [
  {
    name: "AWS",
    tagline: "Amazon Web Services",
    logo: (
      <svg className="h-7 w-auto fill-current" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.5 28.3c0-3.6-1.1-6.1-3.3-7.5-2.2-1.4-5.3-2.1-9.3-2.1-4.2 0-7.8.8-10.7 2.4l1.8 5.6c2.5-1.4 5.3-2.1 8.5-2.1 4.5 0 6.7 1.8 6.7 5.4v1.2c-3.1 0-6.1.4-8.8 1.3-4.5 1.4-6.8 4.1-6.8 8.1 0 2.8 1 5 3 6.6 2 1.6 4.7 2.4 8.2 2.4 3.7 0 6.6-1.1 8.7-3.3v2.8h6.2V28.3h-.7zm-6.2 13.9c-.9 1.4-2.4 2.1-4.5 2.1-2.9 0-4.3-1.4-4.3-4.1 0-1.8.6-3.1 1.8-3.9 1.2-.8 3-1.2 5.5-1.2h1.5v7.1zM58.9 19.3h-6.8l-6.3 22.8-5.7-22.8h-7.1l9.3 31.8h6.4l6.1-22 6.1 22h6.4l9.3-31.8h-7.1l-5.7 22.8-4.9-22.8zM92.4 33.7c-2.3-1.4-5.3-2.4-8.8-3-2.4-.4-4.2-1-5.3-1.7-1.1-.7-1.7-1.7-1.7-2.9 0-1.2.6-2.2 1.7-2.9 1.1-.7 2.8-1.1 5-1.1 2.5 0 5 .6 7.4 1.8l2.2-5.4c-2.9-1.4-6.3-2.1-10.1-2.1-4.4 0-7.7 1-9.9 3-2.2 2-3.3 4.6-3.3 7.8 0 2.6.9 4.7 2.6 6.3 1.7 1.6 4.3 2.7 7.7 3.3 2.6.4 4.5 1 5.6 1.7 1.1.7 1.7 1.7 1.7 3 0 1.3-.6 2.4-1.8 3.1-1.2.7-3 1.1-5.5 1.1-3.2 0-6.4-.9-9.5-2.6l-2.3 5.6c3.6 1.9 7.6 2.9 12.1 2.9 4.7 0 8.3-1 10.7-3.1 2.4-2.1 3.6-4.9 3.6-8.3-.1-3.1-1.3-5.2-3.7-6.5z" />
        <path d="M12.4 49.8c18.3 10.2 43.1 10.4 62.4.6 2.7-1.4 5.3-3 7.6-4.8l-1.9-2.3c-2.1 1.7-4.4 3.1-6.9 4.3-17.8 8.8-40.4 8.6-57.2-.6-1.5-.8-3-1.8-4.4-2.8l-2 2.1c1.8 1.4 3.7 2.5 5.6 3.5z" fill="#f59e0b" />
        <path d="M85.4 43.2c-1.3-.7-7.9-1.9-10.9-1.5l1.6 3.9c2 .5 5.6 1.4 6.7 1.8.8.4 1.5.8 2.2 1.3l.4-5.5z" fill="#f59e0b" />
      </svg>
    ),
  },
  {
    name: "Cisco",
    tagline: "Global Networking",
    logo: (
      <div className="flex items-center gap-2 font-display font-extrabold tracking-tight">
        <svg className="h-6 w-auto text-blue-500 fill-current" viewBox="0 0 54 36" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="16" width="4" height="18" rx="2" />
          <rect x="10" y="8" width="4" height="26" rx="2" />
          <rect x="18" y="2" width="4" height="32" rx="2" />
          <rect x="26" y="12" width="4" height="22" rx="2" />
          <rect x="34" y="2" width="4" height="32" rx="2" />
          <rect x="42" y="8" width="4" height="26" rx="2" />
          <rect x="50" y="16" width="4" height="18" rx="2" />
        </svg>
        <span className="text-lg tracking-widest uppercase text-foreground">CISCO</span>
      </div>
    ),
  },
  {
    name: "OutSystems",
    tagline: "High-Performance Low-Code",
    logo: (
      <div className="flex items-center gap-2 font-display font-bold">
        <span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
          ●
        </span>
        <span className="text-base tracking-tight text-foreground font-extrabold">outsystems</span>
      </div>
    ),
  },
  {
    name: "Nutanix",
    tagline: "Enterprise Cloud",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-black tracking-wider text-emerald-500">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l-10-5v11l10 5 10-5V6l-10 5z" />
        </svg>
        <span className="text-base text-foreground tracking-widest uppercase">NUTANIX</span>
      </div>
    ),
  },
  {
    name: "eCloudvalley",
    tagline: "AWS Premier Partner",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-bold">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-[11px] font-extrabold">
          e
        </div>
        <span className="text-base text-foreground font-extrabold">eCloud<span className="text-blue-600">valley</span></span>
      </div>
    ),
  },
  {
    name: "Freshworks",
    tagline: "Customer & Employee Software",
    logo: (
      <div className="flex items-center gap-2 font-display font-bold">
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-amber-400 inline-block -mr-1" />
          <span className="h-3.5 w-3.5 rounded-full bg-red-500 inline-block -mr-1" />
          <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />
        </div>
        <span className="text-base text-foreground font-extrabold">freshworks</span>
      </div>
    ),
  },
  {
    name: "Akamai",
    tagline: "Cloud & Cybersecurity",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-black tracking-tight">
        <svg className="h-6 w-auto fill-[#ff6b00]" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        <span className="text-base text-foreground font-extrabold">Akamai</span>
      </div>
    ),
  },
  {
    name: "SolarWinds",
    tagline: "IT Management & Observability",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-bold">
        <div className="h-4 w-4 rotate-45 bg-amber-500 rounded-xs shadow-xs" />
        <span className="text-base text-foreground font-extrabold">solar<span className="text-amber-600">winds</span></span>
      </div>
    ),
  },
  {
    name: "FWD Insurance",
    tagline: "Pan-Asian Life Insurer",
    logo: (
      <div className="flex items-center gap-1 font-display font-black tracking-tighter">
        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-xs text-xs font-black uppercase">
          FWD
        </span>
        <span className="text-xs text-foreground font-bold tracking-normal uppercase ml-1">insurance</span>
      </div>
    ),
  },
  {
    name: "Landbank",
    tagline: "Land Bank of the Philippines",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-bold">
        <div className="h-5 w-5 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-600 text-[10px] font-black">
          ₱
        </div>
        <span className="text-base text-emerald-800 dark:text-emerald-400 font-extrabold tracking-wide uppercase">LANDBANK</span>
      </div>
    ),
  },
  {
    name: "Hotel Sogo",
    tagline: "Hospitality Icon",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-bold">
        <span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-black">
          優
        </span>
        <span className="text-base text-red-600 font-extrabold tracking-wider uppercase">HOTEL SOGO</span>
      </div>
    ),
  },
  {
    name: "Astrotel",
    tagline: "Smart Stay Concept",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-bold">
        <span className="text-amber-500 text-base">✦</span>
        <span className="text-base text-foreground font-extrabold tracking-widest uppercase">ASTROTEL</span>
      </div>
    ),
  },
  {
    name: "Trainocate",
    tagline: "Global Tech Learning",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-bold">
        <div className="h-4 w-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin-slow" />
        <span className="text-base text-foreground font-bold">trainocate</span>
      </div>
    ),
  },
  {
    name: "M-Security",
    tagline: "Enterprise Cyber Solutions",
    logo: (
      <div className="flex items-center gap-1.5 font-display font-extrabold">
        <div className="h-5 w-5 rounded-xs bg-navy text-white flex items-center justify-center text-xs font-black border border-white/20">
          M
        </div>
        <span className="text-base text-foreground font-black tracking-wide">M-SECURITY</span>
      </div>
    ),
  },
];

export function ClientShowcase() {
  // Duplicate for seamless infinite loop ticker
  const duplicatedBrands = [...clientBrands, ...clientBrands];

  return (
    <section className="relative overflow-hidden bg-secondary/30 border-y border-border py-14">
      <div className="mx-auto max-w-6xl px-4 text-center">
        {/* Value Proposition Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            High Quality & Premium Craftsmanship
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Thoughtful in Every Item
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <HeartHandshake className="h-3.5 w-3.5 text-blue-500" />
            Corporate Events & Client Appreciation
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <Gift className="h-3.5 w-3.5 text-indigo-500" />
            Employee Recognition & Corporate Gifting
          </span>
        </div>

        <p className="eyebrow text-muted-foreground tracking-widest text-[11px] font-bold uppercase mb-2">
          Trusted by Leading Enterprises & Industry Innovators
        </p>
        <h3 className="font-display text-lg sm:text-xl font-bold text-foreground/90">
          Crafting branded campaigns and bespoke event solutions for the Philippines' top teams
        </h3>
      </div>

      {/* Infinite Moving Line Marquee Container */}
      <div className="relative mt-8 w-full overflow-hidden mask-linear-fade">
        {/* Left and Right Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee flex items-center gap-10 sm:gap-14 py-3">
          {duplicatedBrands.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center gap-3 shrink-0 px-4 py-2.5 rounded-md border border-border/70 bg-card/80 backdrop-blur-xs shadow-2xs transition-all duration-300 hover:border-brand/40 hover:bg-card hover:scale-105 cursor-default select-none"
              title={`${brand.name} - ${brand.tagline ?? "Enterprise Partner"}`}
            >
              <div className="text-foreground/85 transition-colors">{brand.logo}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
