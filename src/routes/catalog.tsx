import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPicker } from "@/components/product-picker";
import { useQuote } from "@/lib/quote-store";
import { brochureUrl, brochureFilename } from "@/lib/brochure";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Product Catalog | JJT Digital Innovative Inc." },
      {
        name: "description",
        content:
          "Browse apparel, bags, eco tumblers, tech gifts, office essentials, rain gear and bundles. Set your quantities and send a quote request.",
      },
      { property: "og:title", content: "Product Catalog | JJT Digital Innovative Inc." },
      {
        property: "og:description",
        content: "Mockups, minimum order quantities and instant quote building for every product line.",
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { lineCount, totalPieces } = useQuote();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="bg-navy py-12 text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <p className="eyebrow text-brand-soft">2026 Catalog</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Choose products and quantities
          </h1>
          <p className="mt-3 max-w-xl text-navy-foreground/85">
            Tap any item to enter how many pieces you need. Your selections are saved as you go.
          </p>
          <a
            href={brochureUrl}
            download={brochureFilename}
            className="mt-6 inline-flex items-center gap-2 rounded-sm border border-white/25 px-4 py-2.5 font-display text-sm font-bold transition-colors hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Download the full PDF catalog
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-12 pb-28">
        <ProductPicker />
      </main>

      {lineCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
            <p className="text-sm">
              <span className="font-display font-bold">{lineCount}</span> item
              {lineCount > 1 ? "s" : ""} ·{" "}
              <span className="font-display font-bold">{totalPieces}</span> pcs
            </p>
            <Link
              to="/build"
              className="ml-auto inline-flex items-center gap-2 rounded-sm bg-brand px-4 py-2.5 font-display text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
