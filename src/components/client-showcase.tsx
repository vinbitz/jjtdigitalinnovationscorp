import React from "react";
import { Sparkles, CheckCircle2, HeartHandshake, Gift, ExternalLink } from "lucide-react";

export interface ClientBrand {
  name: string;
  url: string;
  tagline?: string;
  logoUrl: string;
}

export const clientBrands: ClientBrand[] = [
  {
    name: "AWS",
    url: "https://aws.amazon.com/",
    tagline: "Amazon Web Services",
    logoUrl: "/clients/aws.png",
  },
  {
    name: "Cisco",
    url: "https://www.cisco.com/site/ph/en/index.html",
    tagline: "Global Networking & Cloud Security",
    logoUrl: "/clients/cisco.png",
  },
  {
    name: "OutSystems",
    url: "https://www.outsystems.com/",
    tagline: "Enterprise Low-Code Platform",
    logoUrl: "/clients/outsystems.png",
  },
  {
    name: "Nutanix",
    url: "https://www.nutanix.com/",
    tagline: "Hybrid Multi-Cloud Infrastructure",
    logoUrl: "/clients/nutanix.png",
  },
  {
    name: "eCloudvalley",
    url: "https://ecloudvalley.com",
    tagline: "AWS Premier Consulting Partner",
    logoUrl: "/clients/ecloudvalley.png",
  },
  {
    name: "Freshworks",
    url: "https://www.freshworks.com/",
    tagline: "Customer & Employee Engagement Software",
    logoUrl: "/clients/freshworks.png",
  },
  {
    name: "Akamai",
    url: "https://www.akamai.com/",
    tagline: "Cloud Computing & Cybersecurity",
    logoUrl: "/clients/akamai.png",
  },
  {
    name: "SolarWinds",
    url: "https://www.solarwinds.com/",
    tagline: "IT Management & Observability",
    logoUrl: "/clients/solarwinds.png",
  },
  {
    name: "FWD Insurance",
    url: "https://www.fwd.com.ph/",
    tagline: "Pan-Asian Life Insurer",
    logoUrl: "/clients/fwd-insurance.png",
  },
  {
    name: "Landbank",
    url: "https://www.landbank.com/",
    tagline: "Land Bank of the Philippines",
    logoUrl: "/clients/landbank.png",
  },
  {
    name: "Hotel Sogo",
    url: "https://www.hotelsogo.com/",
    tagline: "Nationwide Hospitality Icon",
    logoUrl: "/clients/hotel-sogo.png",
  },
  {
    name: "Astrotel",
    url: "https://astrotel.ph/home",
    tagline: "Your Place • Your Space",
    logoUrl: "/clients/astrotel.png",
  },
  {
    name: "Trainocate",
    url: "https://trainocate.com/ph",
    tagline: "Advocate • Educate • Innovate",
    logoUrl: "/clients/trainocate.png",
  },
  {
    name: "M-Security",
    url: "https://mtechpro.com",
    tagline: "Your Preferred i-Security Partner",
    logoUrl: "/clients/m-security.png",
  },
];

export function ClientShowcase() {
  // Duplicate list for a smooth, seamless infinite loop ticker
  const duplicatedBrands = [...clientBrands, ...clientBrands];

  return (
    <section className="relative overflow-hidden bg-stone-50/80 dark:bg-navy/40 border-y border-border py-14">
      <div className="mx-auto max-w-6xl px-4 text-center">
        {/* Core Value Proposition Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            High Quality & Premium Craftsmanship
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Thoughtful in Every Item
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <HeartHandshake className="h-3.5 w-3.5 text-blue-500" />
            Ideal for Corporate Events & Client Appreciation
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <Gift className="h-3.5 w-3.5 text-indigo-500" />
            Perfect for Employee Recognition & Corporate Gifting
          </span>
        </div>

        <p className="eyebrow text-muted-foreground tracking-widest text-[11px] font-bold uppercase mb-2">
          Trusted by Leading Enterprises & Industry Innovators
        </p>
        <h3 className="font-display text-lg sm:text-2xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto">
          Delivering bespoke corporate gifts and turnkey event production for top Philippine organizations
        </h3>
      </div>

      {/* Infinite Moving Line Marquee Container */}
      <div className="relative mt-8 w-full overflow-hidden mask-linear-fade">
        {/* Left and Right Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-stone-50 dark:from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-stone-50 dark:from-background to-transparent" />

        <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-3">
          {duplicatedBrands.map((brand, idx) => (
            <a
              key={`${brand.name}-${idx}`}
              href={brand.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-center shrink-0 h-16 min-w-[150px] max-w-[200px] px-5 py-2.5 rounded-lg border border-slate-200/90 dark:border-white/15 bg-white dark:bg-card shadow-2xs transition-all duration-300 hover:border-brand/60 hover:shadow-md hover:scale-105 active:scale-98"
              title={`${brand.name} — ${brand.tagline ?? "Enterprise Partner"}`}
            >
              <img
                src={brand.logoUrl}
                alt={brand.name}
                loading="lazy"
                className="max-h-9 max-w-[150px] w-auto object-contain transition-all duration-300 filter group-hover:brightness-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
