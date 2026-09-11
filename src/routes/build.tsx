import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductPicker } from "@/components/product-picker";
import { useQuote } from "@/lib/quote-store";
import { resolveLines, hasApparel } from "@/lib/quote-items";
import { services, occasions, budgetRanges, apparelSizes } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Build Your Quote | JJT Digital Innovative Inc." },
      {
        name: "description",
        content:
          "Pick products and quantities, add event and marketing services, upload your logo and send a custom quote request.",
      },
      { property: "og:title", content: "Build Your Quote | JJT Digital Innovative Inc." },
      {
        property: "og:description",
        content: "A guided four-step request: products, services, branding and event details.",
      },
    ],
  }),
  component: BuildPage,
});

const stepTitles = ["Products & quantities", "Services", "Branding & event details", "Review & send"];

const MAX_LOGO_BYTES = 10 * 1024 * 1024;

function BuildPage() {
  const navigate = useNavigate();
  const quote = useQuote();
  const { items, itemOptions, details, updateDetails, setQuantity } = quote;
  const [step, setStep] = useState(1);
  const [logo, setLogo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const lines = useMemo(() => resolveLines(items, itemOptions), [items, itemOptions]);
  const showSizes = hasApparel(items, itemOptions);

  const canContinue =
    step === 1 ? lines.length > 0 : step === 3 ? details.contactName && details.company && details.email : true;

  function pickLogo(file: File | null) {
    if (!file) return setLogo(null);
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("That file is larger than 10MB. Please send a smaller version.");
      return;
    }
    setLogo(file);
  }

  async function submit() {
    if (!details.contactName || !details.company || !details.email) {
      toast.error("Please fill in your name, company and email.");
      setStep(3);
      return;
    }
    setSubmitting(true);
    try {
      let logoPath: string | null = null;
      if (logo) {
        const safeName = logo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("quote-logos")
          .upload(path, logo, { contentType: logo.type || "application/octet-stream" });
        if (uploadError) throw uploadError;
        logoPath = path;
      }

      const { error } = await supabase.from("quote_requests").insert({
        contact_name: details.contactName,
        company: details.company,
        email: details.email,
        phone: details.phone || null,
        event_date: details.eventDate || null,
        occasion: details.occasion || null,
        budget_range: details.budgetRange || null,
        size_breakdown: details.sizeBreakdown || null,
        notes: details.notes || null,
        logo_path: logoPath,
        items: lines.map((l) => ({
          id: l.id,
          name: l.name,
          qty: l.qty,
          unit: l.unit,
          moq: l.moq,
          options: l.options || null,
        })),
        services: quote.services.map((id) => services.find((s) => s.id === id)?.name ?? id),
      });
      if (error) throw error;

      navigate({ to: "/quote-sent" });
    } catch (err) {
      console.error(err);
      toast.error("We couldn't send your request. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="bg-navy py-10 text-navy-foreground">
        <div className="mx-auto max-w-4xl px-4">
          <p className="eyebrow text-brand-soft">Step {step} of 4</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">{stepTitles[step - 1]}</h1>
          <div className="mt-6 flex gap-1.5">
            {stepTitles.map((t, i) => (
              <div
                key={t}
                className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-brand" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10">
        {step === 1 && <ProductPicker />}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Tick anything you want us to handle beyond producing the items.
            </p>
            {services.map((s) => {
              const active = quote.services.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer gap-3 rounded-sm border p-4 transition-colors ${
                    active ? "border-brand bg-brand-soft" : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <Checkbox
                    checked={active}
                    onCheckedChange={() => quote.toggleService(s.id)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block font-display text-sm font-bold">{s.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{s.blurb}</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <section className="space-y-4 rounded-sm border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold">Your logo</h2>
              <p className="text-sm text-muted-foreground">
                Upload a .png, .svg or .ai file (max 10MB). Vector files give the sharpest print.
              </p>
              <input
                ref={fileInput}
                type="file"
                accept=".png,.svg,.ai,image/png,image/svg+xml,application/postscript"
                className="hidden"
                onChange={(e) => pickLogo(e.target.files?.[0] ?? null)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Choose file
                </Button>
                {logo && (
                  <span className="flex items-center gap-2 text-sm">
                    {logo.name}
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove logo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            </section>

            <section className="grid gap-4 rounded-sm border border-border bg-card p-5 sm:grid-cols-2">
              <h2 className="font-display text-base font-bold sm:col-span-2">Event details</h2>
              <div className="space-y-1.5">
                <Label htmlFor="eventDate">Event date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={details.eventDate}
                  onChange={(e) => updateDetails({ eventDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Occasion</Label>
                <Select
                  value={details.occasion || ""}
                  onValueChange={(v) => updateDetails({ occasion: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Budget range</Label>
                <Select
                  value={details.budgetRange || ""}
                  onValueChange={(v) => updateDetails({ budgetRange: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {showSizes && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="sizes">Apparel size breakdown</Label>
                  <Textarea
                    id="sizes"
                    rows={3}
                    placeholder={`e.g. ${apparelSizes.map((s) => `${s} 10`).join(", ")}`}
                    value={details.sizeBreakdown}
                    onChange={(e) => updateDetails({ sizeBreakdown: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Anything else we should know?</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Delivery address, print colours, deadlines…"
                  value={details.notes}
                  onChange={(e) => updateDetails({ notes: e.target.value })}
                />
              </div>
            </section>

            <section className="grid gap-4 rounded-sm border border-border bg-card p-5 sm:grid-cols-2">
              <h2 className="font-display text-base font-bold sm:col-span-2">Your contact details</h2>
              <div className="space-y-1.5">
                <Label htmlFor="contactName">Full name *</Label>
                <Input
                  id="contactName"
                  value={details.contactName}
                  onChange={(e) => updateDetails({ contactName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={details.company}
                  onChange={(e) => updateDetails({ company: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={details.email}
                  onChange={(e) => updateDetails({ email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile number</Label>
                <Input
                  id="phone"
                  value={details.phone}
                  onChange={(e) => updateDetails({ phone: e.target.value })}
                />
              </div>
            </section>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <section className="rounded-sm border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold">Items</h2>
              {lines.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No items selected yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {lines.map((l) => (
                    <li key={l.id} className="flex items-center gap-3 py-2.5">
                      {l.image && (
                        <div className="h-12 w-12 rounded-md bg-stone-100 dark:bg-card/40 border border-border/40 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={l.image}
                            alt=""
                            loading="lazy"
                            width={100}
                            height={100}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-foreground block">{l.name}</span>
                        {l.options && (
                          <p className="text-xs text-brand font-medium">
                            {[
                              l.options.type,
                              l.options.brand,
                              l.options.size ? `Size: ${l.options.size}` : null,
                              l.options.color ? `Color: ${l.options.color}` : null,
                              l.options.printMethod,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        )}
                      </div>
                      <span className="ml-auto font-display text-sm font-bold">
                        {l.qty} {l.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(l.id, 0)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer"
                        aria-label={`Remove ${l.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-sm border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold">Services</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {quote.services.length === 0
                  ? "None selected."
                  : quote.services
                      .map((id) => services.find((s) => s.id === id)?.name ?? id)
                      .join(", ")}
              </p>
            </section>

            <section className="rounded-sm border border-border bg-card p-5 text-sm">
              <h2 className="font-display text-base font-bold">Details</h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                <Detail label="Contact" value={details.contactName} />
                <Detail label="Company" value={details.company} />
                <Detail label="Email" value={details.email} />
                <Detail label="Mobile" value={details.phone} />
                <Detail label="Event date" value={details.eventDate} />
                <Detail label="Occasion" value={details.occasion} />
                <Detail label="Budget" value={details.budgetRange} />
                <Detail label="Logo file" value={logo?.name ?? ""} />
                <Detail label="Sizes" value={details.sizeBreakdown} />
                <Detail label="Notes" value={details.notes} />
              </dl>
            </section>
          </div>
        )}

        <div className="mt-10 flex items-center gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={submitting}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
          )}

          {step < 4 ? (
            <Button className="ml-auto" onClick={() => setStep(step + 1)} disabled={!canContinue}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button className="ml-auto" onClick={submit} disabled={submitting || lines.length === 0}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send quote request
            </Button>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value || "—"}</dd>
    </div>
  );
}
