import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useQuote } from "@/lib/quote-store";
import { company } from "@/lib/catalog";
import { BookingModal } from "@/components/booking-modal";

export function SiteHeader() {
  const { lineCount } = useQuote();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur transition-all">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/jjt-logo.png"
              alt="JJT Digital Innovative Inc."
              className="h-10 w-10 object-contain rounded-full transition-transform duration-300 group-hover:scale-105 shadow-xs"
            />
          </div>
          <span className="hidden font-display text-sm font-bold leading-tight text-foreground sm:block">
            {company.name}
            <span className="block eyebrow text-brand">{company.tagline}</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-2 text-sm font-medium">
          <Link
            to="/catalog"
            className="rounded-sm px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-secondary"
          >
            Catalog
          </Link>

          <BookingModal
            trigger={
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:border-brand/60 hover:bg-secondary hover:shadow-xs active:scale-98 cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-brand" />
                Schedule Meeting
              </button>
            }
          />

          <Link
            to="/build"
            className="inline-flex items-center gap-1.5 rounded-sm bg-brand px-3.5 py-2 text-xs sm:text-sm font-bold text-brand-foreground shadow-xs transition-all duration-200 hover:bg-brand/90 hover:shadow-md active:scale-98"
          >
            Build Your Quote
            {lineCount > 0 && (
              <span className="ml-1.5 rounded-full bg-navy px-1.5 py-0.5 text-xs font-bold text-navy-foreground">
                {lineCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
