import { Link } from "@tanstack/react-router";
import { useQuote } from "@/lib/quote-store";
import { company } from "@/lib/catalog";

export function SiteHeader() {
  const { lineCount } = useQuote();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy font-display text-sm font-extrabold tracking-tight text-navy-foreground">
            JJT
          </span>
          <span className="hidden font-display text-sm font-bold leading-tight text-foreground sm:block">
            {company.name}
            <span className="block eyebrow text-brand">{company.tagline}</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
          <Link
            to="/catalog"
            className="rounded-sm px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Catalog
          </Link>
          <Link
            to="/build"
            className="rounded-sm bg-brand px-3.5 py-2 text-brand-foreground transition-opacity hover:opacity-90"
          >
            Build Your Quote
            {lineCount > 0 && (
              <span className="ml-2 rounded-full bg-navy px-1.5 py-0.5 text-xs font-bold text-navy-foreground">
                {lineCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
