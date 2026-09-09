import { useState } from "react";
import { AlertTriangle, Check, Plus } from "lucide-react";

import { categories, bundles } from "@/lib/catalog";
import { useQuote } from "@/lib/quote-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Picked = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  moq: number;
  unit: string;
};

export function ProductPicker() {
  const { items, setQuantity } = useQuote();
  const [picked, setPicked] = useState<Picked | null>(null);
  const [qty, setQty] = useState("");

  function open(item: Picked) {
    setPicked(item);
    setQty(String(items[item.id] ?? item.moq));
  }

  function save() {
    if (!picked) return;
    const n = Number.parseInt(qty, 10);
    setQuantity(picked.id, Number.isFinite(n) && n > 0 ? n : 0);
    setPicked(null);
  }

  const parsedQty = Number.parseInt(qty, 10);
  const belowMoq = picked ? Number.isFinite(parsedQty) && parsedQty > 0 && parsedQty < picked.moq : false;

  return (
    <div className="space-y-14">
      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className="scroll-mt-20">
          <p className="eyebrow text-brand">{cat.tagline}</p>
          <h2 className="mt-1.5 font-display text-2xl font-extrabold">{cat.name}</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.products.map((p) => {
              const chosen = items[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    open({
                      id: p.id,
                      name: p.name,
                      blurb: p.blurb,
                      image: p.image,
                      moq: p.moq,
                      unit: "pcs",
                    })
                  }
                  className="group overflow-hidden rounded-sm border border-border bg-card text-left transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {chosen ? (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-brand px-2 py-1 text-xs font-bold text-brand-foreground">
                        <Check className="h-3 w-3" /> {chosen} pcs
                      </span>
                    ) : (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-card/90 px-2 py-1 text-xs font-bold text-foreground">
                        <Plus className="h-3 w-3" /> Add
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    <p className="mt-2 text-xs font-semibold text-brand">Min. {p.moq} pcs</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section id="bundles" className="scroll-mt-20">
        <p className="eyebrow text-brand">Save time with a set</p>
        <h2 className="mt-1.5 font-display text-2xl font-extrabold">Bundles</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {bundles.map((b) => {
            const key = `bundle:${b.id}`;
            const chosen = items[key];
            return (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  open({
                    id: key,
                    name: b.name,
                    blurb: `${b.blurb} Includes: ${b.contents.join(", ")}.`,
                    image: b.image,
                    moq: b.moq,
                    unit: "sets",
                  })
                }
                className="overflow-hidden rounded-sm border border-border bg-card text-left transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                  {chosen ? (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-brand px-2 py-1 text-xs font-bold text-brand-foreground">
                      <Check className="h-3 w-3" /> {chosen} sets
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-bold">{b.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.blurb}</p>
                  <p className="mt-2 text-xs font-semibold text-brand">Min. {b.moq} sets</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <Dialog open={picked !== null} onOpenChange={(o) => !o && setPicked(null)}>
        <DialogContent className="sm:max-w-md">
          {picked && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{picked.name}</DialogTitle>
                <DialogDescription>{picked.blurb}</DialogDescription>
              </DialogHeader>

              <img
                src={picked.image}
                alt={picked.name}
                width={800}
                height={800}
                className="aspect-[4/3] w-full rounded-sm bg-secondary object-cover"
              />

              <div className="space-y-2">
                <Label htmlFor="qty">How many {picked.unit} do you need?</Label>
                <Input
                  id="qty"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  autoFocus
                />
                {belowMoq && (
                  <p className="flex items-start gap-2 rounded-sm bg-accent p-2.5 text-xs text-accent-foreground">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Our minimum order for this item is {picked.moq} {picked.unit}. We can still
                    quote a smaller run, but unit cost goes up.
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2 sm:justify-between">
                {items[picked.id] ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQuantity(picked.id, 0);
                      setPicked(null);
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <span />
                )}
                <Button onClick={save}>Save to quote</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
