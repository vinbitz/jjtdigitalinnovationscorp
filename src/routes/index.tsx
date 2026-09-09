import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Phone, Mail, MapPin } from "lucide-react";

import heroTower from "@/assets/hero-tower.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { categories, bundles, services, company } from "@/lib/catalog";
import { brochureUrl, brochureFilename } from "@/lib/brochure";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JJT Digital Innovative Inc. | 2026 Corporate Marketing Catalog" },
      {
        name: "description",
        content:
          "Download the 2026 corporate marketing product catalog and build a custom quote for apparel, bags, tumblers, tech gifts and event services.",
      },
      {
        property: "og:title",
        content: "JJT Digital Innovative Inc. | 2026 Corporate Marketing Catalog",
      },
      {
        property: "og:description",
        content:
          "Customized giveaways, apparel and full event management for Philippine companies. Download the catalog or build your quote.",
      },
    ],
  }),
  component: LandingPage,
});

const steps = [
  { n: "01", title: "Pick your products", body: "Browse the catalog and set the quantity you need per item." },
  { n: "02", title: "Add services", body: "Event management, marketing, design, printing and delivery." },
  { n: "03", title: "Send your logo & event date", body: "Upload .png, .svg or .ai and tell us the occasion." },
  { n: "04", title: "Book a meeting", body: "Choose a slot and our team walks you through the quote." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img
          src={heroTower}
          alt="Modern glass office tower under a bright blue sky"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="eyebrow text-brand-soft">2026 Corporate Marketing Catalog</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Driving Innovation
            <span className="block text-brand-soft">in every branded detail.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-navy-foreground/85 sm:text-lg">
            We tailor corporate giveaways, apparel and full event solutions to your unique
            requirements — from a 20-piece executive gift set to a 5,000-piece nationwide rollout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={brochureUrl}
              download={brochureFilename}
              className="inline-flex items-center gap-2 rounded-sm bg-brand px-5 py-3 font-display text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Download the 2026 Catalog
            </a>
            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-5 py-3 font-display text-sm font-bold text-navy-foreground transition-colors hover:bg-white/10"
            >
              Build Your Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="eyebrow text-brand">How it works</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          A custom quote in four steps
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-sm border border-border bg-card p-5">
              <span className="font-display text-3xl font-extrabold text-brand-soft">{s.n}</span>
              <h3 className="mt-2 font-display text-base font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-brand">Product lines</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
                Everything in the catalog, ready to customize
              </h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand hover:underline"
            >
              View full catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/catalog"
                hash={cat.id}
                className="group overflow-hidden rounded-sm border border-border bg-background transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={cat.products[0].image}
                    alt={cat.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold">{cat.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.tagline}</p>
                  <p className="mt-2 text-xs font-semibold text-brand">
                    {cat.products.length} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="eyebrow text-brand">Ready-made bundles</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          Packages that skip the guesswork
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {bundles.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-sm border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={b.image}
                  alt={b.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-bold">{b.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.blurb}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {b.contents.map((c) => (
                    <li key={c} className="flex gap-2 text-muted-foreground">
                      <span className="text-brand">—</span>
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold text-brand">Minimum {b.moq} sets</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-navy py-16 text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <p className="eyebrow text-brand-soft">Beyond the products</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
            Services you can add to any campaign
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-sm bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="bg-navy p-5">
                <h3 className="font-display text-base font-bold">{s.name}</h3>
                <p className="mt-1.5 text-sm text-navy-foreground/80">{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-sm border border-border bg-card p-8 sm:p-10">
          <h2 className="max-w-lg font-display text-2xl font-extrabold sm:text-3xl">
            Tell us about your event and we&apos;ll price it out.
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-sm bg-brand px-5 py-3 font-display text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Start Your Campaign <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={brochureUrl}
              download={brochureFilename}
              className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 font-display text-sm font-bold transition-colors hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Get the brochure
            </a>
          </div>
          <div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand" /> {company.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" /> {company.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" /> {company.location}
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
