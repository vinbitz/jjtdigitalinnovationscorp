import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Mail, Phone } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useQuote } from "@/lib/quote-store";
import { company } from "@/lib/catalog";
import { schedulingUrl } from "@/lib/scheduling";

export const Route = createFileRoute("/quote-sent")({
  head: () => ({
    meta: [
      { title: "Request Sent | JJT Digital Innovative Inc." },
      {
        name: "description",
        content: "Your quote request is in. Book a meeting with the JJT team to finalise your campaign.",
      },
      { property: "og:title", content: "Request Sent | JJT Digital Innovative Inc." },
      { property: "og:description", content: "Book a meeting to finalise your corporate campaign quote." },
    ],
  }),
  component: QuoteSentPage,
});

function QuoteSentPage() {
  const { reset } = useQuote();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16">
        <CheckCircle2 className="h-12 w-12 text-brand" />
        <h1 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">
          Your request is in.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Our team reviews it and comes back with pricing, mockups and lead times — usually within
          one business day.
        </p>

        <section className="mt-10 rounded-sm border border-border bg-card p-6">
          <p className="eyebrow text-brand">Next step</p>
          <h2 className="mt-2 flex items-center gap-2 font-display text-xl font-extrabold">
            <CalendarCheck className="h-5 w-5 text-brand" /> Book a meeting
          </h2>

          {schedulingUrl ? (
            <iframe
              src={schedulingUrl}
              title="Book a meeting with JJT Digital Innovative"
              className="mt-5 h-[680px] w-full rounded-sm border border-border"
            />
          ) : (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Pick a time with us directly — call or email and we&apos;ll lock in a slot for a
                mockup walkthrough.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2 rounded-sm border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  <Phone className="h-4 w-4 text-brand" /> {company.phone}
                </a>
                <a
                  href={`mailto:${company.email}?subject=Meeting%20request`}
                  className="flex items-center gap-2 rounded-sm border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  <Mail className="h-4 w-4 text-brand" /> {company.email}
                </a>
              </div>
            </>
          )}
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/catalog"
            className="rounded-sm bg-brand px-5 py-3 font-display text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Back to the catalog
          </Link>
          <Link
            to="/"
            className="rounded-sm border border-border px-5 py-3 font-display text-sm font-bold transition-colors hover:bg-secondary"
          >
            Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
