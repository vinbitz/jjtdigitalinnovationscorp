import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import heroArchitecture from "@/assets/products/hero-architecture.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { categories, bundles, services, company } from "@/lib/catalog";
import { brochureUrl, brochureFilename } from "@/lib/brochure";
import { BookingModal } from "@/components/booking-modal";
import { EventsShowcase } from "@/components/events-showcase";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JJT Digital Innovative Inc. | 2026 Corporate Marketing Catalog" },
      {
        name: "description",
        content:
          "Download the 2026 corporate marketing product catalog, schedule a consultation or build a custom quote for apparel, bags, tumblers, tech gifts and event solutions.",
      },
      {
        property: "og:title",
        content: "JJT Digital Innovative Inc. | 2026 Corporate Marketing Catalog",
      },
      {
        property: "og:description",
        content:
          "Tailored corporate merchandise, apparel, executive gift sets and full event production for Philippine companies.",
      },
    ],
  }),
  component: LandingPage,
});

const steps = [
  { n: "01", title: "Select items from catalog", body: "Explore popular essentials, bags, drinkware, apparel, and tech accessories." },
  { n: "02", title: "Specify branding & quantities", body: "Upload your high-res logo and configure quantities per product line." },
  { n: "03", title: "Choose service options", body: "Add event staging, booth installations, photo booths, or direct nationwide kitting." },
  { n: "04", title: "Schedule or review quote", body: "Book a live 30-minute consultation or receive a detailed PDF proposal in 24 hours." },
];

function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }

  return (
    <div className="min-h-screen bg-background selection:bg-brand selection:text-white">
      <SiteHeader />

      {/* Hero Section with Interactive Cursor Illumination */}
      <section
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden bg-navy text-navy-foreground border-b border-white/10"
      >
        {/* Authentic 2026 Catalog Architectural Facade */}
        <img
          src={heroArchitecture}
          alt="JJT Corporate Architectural Innovation"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-25 filter contrast-125 transition-transform duration-1000 ease-out"
        />

        {/* Dynamic Cursor Spotlight Effect - Soft Outer Ambient Aura */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            opacity: isHovered ? 0.85 : 0.25,
            background: `radial-gradient(850px circle at ${mousePos.x}% ${mousePos.y}%, rgba(59, 130, 246, 0.22), rgba(30, 58, 138, 0.08) 45%, transparent 75%)`,
          }}
        />

        {/* Dynamic Cursor Spotlight Effect - Concentrated Core Sheen */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: isHovered ? 0.65 : 0.1,
            background: `radial-gradient(320px circle at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.3), transparent 70%)`,
          }}
        />

        {/* Dynamic Cursor-Illuminated High-Tech Grid Matrix */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] transition-opacity duration-300"
          style={{
            maskImage: `radial-gradient(420px circle at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(420px circle at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 80%)`,
            opacity: isHovered ? 1 : 0.3,
          }}
        />

        {/* Ambient Base Subtle Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_65%,transparent_100%)] pointer-events-none" />

        {/* Floating Luminous Ambient Particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 rounded-full bg-blue-400/50 blur-[1px] animate-pulse" />
          <div className="absolute top-1/3 right-1/5 w-2 h-2 rounded-full bg-sky-300/40 blur-[1px] animate-pulse delay-700" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-indigo-300/40 blur-[1px] animate-pulse delay-1000" />
          <div className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full bg-white/60 blur-[0.5px] animate-pulse delay-500" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-32">
          {/* Bespoke Corporate Brand Lockup */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand/60 via-blue-400/40 to-white/30 opacity-70 blur-md group-hover:opacity-100 transition-all duration-500" />
              <img
                src="/jjt-logo.png"
                alt="JJT Digital Innovative Inc."
                className="relative h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-full bg-white p-1.5 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-display text-sm sm:text-base font-extrabold tracking-widest text-white uppercase">
                  JJT Digital Innovative Inc.
                </span>
                <span className="text-[10px] font-mono tracking-widest text-brand-soft border border-white/20 bg-white/10 px-2 py-0.5 rounded-xs font-semibold">
                  EST. 2020
                </span>
              </div>
              <div className="font-display text-xs font-bold text-brand-soft/90 tracking-widest uppercase">
                Corporate Marketing • Merchandising • Event Solutions
              </div>
            </div>
          </div>

          {/* Headline with interactive cursor sheen */}
          <h1 className="max-w-3xl font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.04] text-white">
            <span
              className="inline-block transition-all duration-300"
              style={{
                textShadow: isHovered
                  ? `0 0 35px rgba(96, 165, 250, 0.4)`
                  : "none",
              }}
            >
              Driving Innovation
            </span>
            <span
              className="block text-transparent bg-clip-text transition-all duration-300"
              style={{
                backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #ffffff 0%, #bfdbfe 30%, #60a5fa 65%, #3b82f6 100%)`,
              }}
            >
              in every branded detail.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-navy-foreground/85 leading-relaxed font-normal">
            From single bespoke executive gift sets to nationwide 5,000-piece conference campaigns, we
            craft high-impact corporate merchandise, premium apparel, and full event experiences tailored
            around your exact schedule and budget.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            {/* Direct Calendar Booking Trigger */}
            <BookingModal
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 rounded-sm bg-brand px-6 py-3.5 font-display text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition-all duration-300 hover:bg-brand/90 hover:scale-102 hover:shadow-brand/50 active:scale-98 cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule a Consultation
                </button>
              }
            />

            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-white/10 backdrop-blur-xs px-6 py-3.5 font-display text-sm font-bold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:scale-98"
            >
              Build Your Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={brochureUrl}
              download={brochureFilename}
              className="inline-flex items-center gap-2 rounded-sm px-5 py-3.5 font-display text-sm font-semibold text-white/80 transition-colors hover:text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Download 2026 Catalog (PDF)
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl text-left">
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">70+</p>
              <p className="text-xs text-white/70 mt-0.5">Catalog Products</p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-white/70 mt-0.5">Custom Branding</p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">24h</p>
              <p className="text-xs text-white/70 mt-0.5">Fast Quote Turnaround</p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">NCR & PH</p>
              <p className="text-xs text-white/70 mt-0.5">Nationwide Door-to-Door</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Events & Project Samples Showcase */}
      <EventsShowcase />

      {/* Interactive Meeting Schedule Banner */}
      <section className="bg-gradient-to-r from-blue-950 via-navy to-slate-900 py-10 border-b border-border/80 text-white">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-soft uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-brand" />
              Skip the manual form
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white">
              Prefer a direct consultation with our strategy team?
            </h2>
            <p className="text-sm text-white/80 max-w-2xl">
              Select an open slot on our calendar to inspect material swatches, compare bulk volume tiers,
              and receive personalized mockup recommendations.
            </p>
          </div>

          <BookingModal
            trigger={
              <button
                type="button"
                className="whitespace-nowrap inline-flex items-center gap-2 rounded-sm bg-white text-navy px-6 py-3 font-display text-sm font-extrabold shadow-md transition-all duration-200 hover:bg-brand-soft hover:scale-105 active:scale-98 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-brand" />
                Book 30-Min Meeting
              </button>
            }
          />
        </div>
      </section>

      {/* Steps Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow text-brand">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
              A custom corporate campaign in four simple steps
            </h2>
          </div>
          <Link
            to="/build"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
          >
            Start configurator <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand/50 flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-4xl font-extrabold text-brand/30 group-hover:text-brand transition-colors duration-300">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-brand transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="bg-card py-20 border-y border-border">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow text-brand">Product Lines</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                Everything in the 2026 catalog, ready to brand
              </h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand hover:underline"
            >
              Browse all {categories.reduce((acc, c) => acc + c.products.length, 0)} products{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/catalog"
                hash={cat.id}
                className="group overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/50"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-card/40 p-4 border-b border-border/40 relative flex items-center justify-center">
                  <img
                    src={cat.products[0]?.image ?? ""}
                    alt={cat.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 bg-navy/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-xs shadow-xs">
                    {cat.products.length} items
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold group-hover:text-brand transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {cat.tagline}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-brand group-hover:translate-x-1 transition-transform">
                    View line &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ready-Made Bundles Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow text-brand">Curated Packages</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
              Ready-made kits that skip the guesswork
            </h2>
          </div>
          <Link
            to="/catalog"
            hash="bundles"
            className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand hover:underline"
          >
            See all {bundles.length} bundles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {bundles.slice(0, 3).map((b) => {
            const isPremium = Boolean(b.isPremium);
            return (
              <div
                key={b.id}
                className={`group overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${
                  isPremium
                    ? "bg-gradient-to-b from-amber-100/90 via-amber-50/70 to-yellow-100/80 dark:from-amber-950/40 dark:via-stone-900/60 dark:to-amber-950/40 border-2 border-amber-400/80 shadow-lg shadow-amber-500/10 hover:border-amber-400"
                    : "bg-card border-border hover:border-brand/50 hover:shadow-xl"
                }`}
              >
                <div>
                  <div
                    className={`aspect-[4/3] overflow-hidden p-4 relative flex items-center justify-center ${
                      isPremium
                        ? "bg-gradient-to-br from-amber-300/40 via-yellow-200/50 to-amber-400/40 dark:from-amber-950/90 dark:via-yellow-900/60 dark:to-amber-900/80 border-b border-amber-300/50 shadow-inner"
                        : "bg-stone-100 dark:bg-card/40 border-b border-border/40"
                    }`}
                  >
                    <img
                      src={b.image}
                      alt={b.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    {isPremium ? (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-sm flex items-center gap-1.5 shadow-md border border-amber-200/40">
                        <Sparkles className="h-3 w-3 text-yellow-100" /> Premium Suite
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-navy/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-sm">
                        <Package className="h-3 w-3 text-brand-soft" /> Curated Set
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      className={`font-display text-base font-bold transition-colors ${
                        isPremium ? "text-amber-950 dark:text-amber-100" : "text-foreground group-hover:text-brand"
                      }`}
                    >
                      {b.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{b.blurb}</p>
                    <ul className="mt-3 space-y-1.5 text-xs">
                      {b.contents.slice(0, 4).map((c) => (
                        <li key={c} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link
                    to="/build"
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm border text-xs font-bold transition-all ${
                      isPremium
                        ? "border-amber-400 bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                        : "border-border bg-secondary/50 text-foreground hover:bg-brand hover:text-white hover:border-brand"
                    }`}
                  >
                    Configure This Set
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-navy py-20 text-navy-foreground border-y border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="eyebrow text-brand-soft">Beyond the products</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-white">
            Custom Event Solutions & Execution
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-navy-foreground/80">
            From planning to execution: booths, LED walls, technical crew, and nationwide recipient kitting.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="group rounded-lg border border-white/15 bg-white/5 p-5 backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1"
              >
                <h3 className="font-display text-base font-bold text-white group-hover:text-brand-soft transition-colors">
                  {s.name}
                </h3>
                <p className="mt-2 text-xs text-navy-foreground/80 leading-relaxed">{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Meeting Consultation Box */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="eyebrow text-brand font-bold">Connect With JJT</span>
              <h2 className="font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                Ready to build your next corporate campaign?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Tell us about your event, product selection, or budget. Book a call directly or submit a
                detailed quote request. We respond with mockups and lead times within one business day.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <BookingModal
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-sm bg-navy px-6 py-3 font-display text-sm font-bold text-white shadow-md transition-all hover:bg-navy/90 hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      <Calendar className="h-4 w-4 text-brand-soft" />
                      Schedule Meeting
                    </button>
                  }
                />
                <Link
                  to="/build"
                  className="inline-flex items-center gap-2 rounded-sm bg-brand px-6 py-3 font-display text-sm font-bold text-brand-foreground shadow-sm transition-all hover:bg-brand/90 hover:scale-102 active:scale-98"
                >
                  Start Your Custom Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={brochureUrl}
                  download={brochureFilename}
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-3 font-display text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  <Download className="h-4 w-4" /> 2026 Brochure
                </a>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="lg:col-span-4 bg-stone-50 p-6 rounded-lg border border-stone-200 text-xs space-y-3.5">
              <p className="font-display font-bold text-sm text-foreground uppercase tracking-wide">
                Direct Contact
              </p>
              <div className="space-y-2.5">
                <p className="flex items-center gap-2 text-foreground font-medium">
                  <Mail className="h-4 w-4 text-brand shrink-0" />
                  <a href="mailto:sales@jjt-digital.com" className="hover:underline text-brand">
                    sales@jjt-digital.com
                  </a>
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    +(63) 917-143-5890 <br />
                    +(63) 968-231-4096
                  </span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-brand shrink-0" />
                  Parañaque City, Metro Manila
                </p>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-stone-200">
                <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Follow Our Work</p>
                <div className="flex gap-2">
                  <a
                    href={company.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-600 hover:text-pink-600 hover:border-pink-300 transition-colors shadow-2xs"
                  >
                    Instagram
                  </a>
                  <a
                    href={company.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-600 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-2xs"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={company.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-2xs"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
