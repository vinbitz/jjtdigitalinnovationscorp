import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Gift,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import eventLedWall from "@/assets/products/event-led-wall.jpg";
import eventBooth from "@/assets/products/event-booth.jpg";
import luxuryBundle0 from "@/assets/products/luxury-bundle-0.jpg";
import luxuryBundle1 from "@/assets/products/luxury-bundle-1.jpg";
import pUmbrella from "@/assets/p-umbrella.jpg";
import pJacket from "@/assets/p-jacket.jpg";
import { BookingModal } from "@/components/booking-modal";

export interface ProjectSample {
  id: string;
  title: string;
  category: "events" | "apparel" | "merchandise" | "executive";
  categoryLabel: string;
  description: string;
  image: string;
  highlights: string[];
  scale: string;
}

export const projectSamples: ProjectSample[] = [
  {
    id: "sample-led-stage",
    title: "Enterprise Conference & High-Res LED Wall Stage",
    category: "events",
    categoryLabel: "Event Production & Staging",
    description:
      "Full turnkey stage dressing, high-definition modular P2.6 LED video wall, intelligent truss lighting, and live multi-camera technical crew for an annual corporate summit.",
    image: eventLedWall,
    highlights: ["Modular P2.6 Video Wall", "Stage Rigging & Lighting", "Live AV Technical Crew"],
    scale: "1,200+ Attendees • Turnkey Onsite Crew",
  },
  {
    id: "sample-executive-suite",
    title: "Handcrafted Bamboo & Gold Ribbon Executive Suites",
    category: "executive",
    categoryLabel: "Executive Gifting",
    description:
      "Bespoke VIP unboxing experience featuring real bamboo vacuum thermo flasks, laser-etched journals, precision metal pens, and gold-foiled presentation boxes.",
    image: luxuryBundle0,
    highlights: ["Precision Laser Engraving", "Gold Foil Debossing", "Custom Satin Bow Packaging"],
    scale: "C-Suite & Board of Directors Gifting",
  },
  {
    id: "sample-corporate-jackets",
    title: "Custom Corporate Outerwear & Uniforming",
    category: "apparel",
    categoryLabel: "Corporate Apparel",
    description:
      "Heavyweight brushed fleece zip-up hoodies and tailored windbreaker jackets with high-density embroidered crests and custom neck tape.",
    image: pJacket,
    highlights: ["High-Density 3D Embroidery", "Retail-Grade Fleece", "XS to 5XL Extended Sizing"],
    scale: "850 Pcs Delivered Nationwide",
  },
  {
    id: "sample-weather-umbrellas",
    title: "Heavy-Duty Storm Golf & Automatic Umbrellas",
    category: "merchandise",
    categoryLabel: "Corporate Merchandise",
    description:
      "Windproof fiberglass double-canopy golf umbrellas and 3-fold automatic compact travel umbrellas with multi-panel corporate color matching and silkscreen logos.",
    image: pUmbrella,
    highlights: ["Double-Canopy Vented", "Fiberglass Windproof Shaft", "Silk-Screen Panel Print"],
    scale: "2,500 Pcs Event Giveaways",
  },
  {
    id: "sample-interactive-booths",
    title: "Modular Exhibition Booths & Registration System",
    category: "events",
    categoryLabel: "Event Production & Staging",
    description:
      "Custom fabricated 3x3m trade exhibition booth with integrated digital signage, automated QR registration check-in kiosks, and instant badge printing setup.",
    image: eventBooth,
    highlights: ["Custom Booth Fabrication", "Automated QR Check-In", "Onsite Badge Printing"],
    scale: "3-Day Industry Expo • 100% Uptime",
  },
  {
    id: "sample-black-onyx-suite",
    title: "Black Onyx VIP Desk & Tech Onboarding Suite",
    category: "executive",
    categoryLabel: "Executive Gifting",
    description:
      "Matte black insulated drinkware, debossed leatherette magnetic planners, precision-milled aluminum pens, and fast wireless charging desk mats.",
    image: luxuryBundle1,
    highlights: ["Matte Powder-Coated Tumbler", "Magnetic Leather Clasp", "Full UV Print Accents"],
    scale: "Quarterly New Hire & Partner Kit",
  },
];

export function EventsShowcase() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredSamples =
    activeTab === "all"
      ? projectSamples
      : projectSamples.filter((sample) => sample.category === activeTab);

  return (
    <section className="relative overflow-hidden bg-stone-50/80 dark:bg-navy/40 border-y border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Core Value Proposition Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            High Quality & Premium Craftsmanship
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Thoughtful in Every Item
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <HeartHandshake className="h-3.5 w-3.5 text-blue-500" />
            Turnkey Event Production & Activations
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-2xs">
            <Gift className="h-3.5 w-3.5 text-indigo-500" />
            Nationwide Corporate Gifting
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <p className="eyebrow text-brand font-extrabold uppercase tracking-widest text-[11px]">
            Real Projects • Authentic Production • Onsite Execution
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Events Done & Project Samples Showcase
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From multi-day conference stage setups to customized executive gift suites, take a look at
            the finished work and production quality we deliver for major Philippine organizations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Project Samples" },
            { id: "events", label: "Events & Staging" },
            { id: "executive", label: "Executive Gifting" },
            { id: "apparel", label: "Corporate Apparel" },
            { id: "merchandise", label: "Branded Merchandise" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-navy dark:bg-white text-white dark:text-navy shadow-xs"
                  : "bg-white dark:bg-card text-muted-foreground border border-border hover:border-brand/40 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Showcase Grid with Clean, Uncropped Images */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/50 flex flex-col justify-between"
            >
              <div>
                {/* Visual Media Container with padding to prevent any cropping */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-card/40 p-3 border-b border-border/60 flex items-center justify-center">
                  <img
                    src={sample.image}
                    alt={sample.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-navy/90 dark:bg-card/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs">
                    {sample.categoryLabel}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-brand transition-colors">
                    {sample.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {sample.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {sample.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-foreground/85 bg-secondary/80 px-2 py-0.5 rounded-xs"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 text-brand" /> {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px]">
                  <span className="font-medium text-muted-foreground">{sample.scale}</span>
                  <span className="font-bold text-brand">Delivered Quality</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Consultation Strip */}
        <div className="mt-12 rounded-xl border border-brand/20 bg-gradient-to-br from-brand/5 via-transparent to-blue-500/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-display text-lg font-bold text-foreground">
              Have an upcoming event or custom gifting requirement?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              We provide digital mockups, material swatches, and tiered volume pricing tailored to your
              exact specs and deadline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <BookingModal
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-sm bg-navy text-white px-4 py-2.5 font-display text-xs font-bold shadow-xs hover:bg-navy/90 cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5 text-brand-soft" />
                  Book Consultation
                </button>
              }
            />
            <Link
              to="/build"
              className="inline-flex items-center gap-1.5 rounded-sm bg-brand text-brand-foreground px-4 py-2.5 font-display text-xs font-bold shadow-xs hover:bg-brand/90"
            >
              Start Quote <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export as ClientShowcase so any existing imports continue to work without breaking
export { EventsShowcase as ClientShowcase };
