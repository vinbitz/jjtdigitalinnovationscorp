import { useState, useMemo } from "react";
import { Check, Plus, Search, Layers, Package, CheckCircle2 } from "lucide-react";

import { categories, bundles } from "@/lib/catalog";
import { useQuote } from "@/lib/quote-store";
import { useInventory } from "@/lib/inventory-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  unit: string;
  specs?: string;
};

export function ProductPicker() {
  const { items, setQuantity } = useQuote();
  const { inventory } = useInventory();
  const [picked, setPicked] = useState<Picked | null>(null);
  const [qty, setQty] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  function open(item: Picked) {
    setPicked(item);
    setQty(String(items[item.id] ?? 50));
  }

  function save() {
    if (!picked) return;
    const n = Number.parseInt(qty, 10);
    setQuantity(picked.id, Number.isFinite(n) && n > 0 ? n : 0);
    setPicked(null);
  }

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
      .map((cat) => {
        if (!searchQuery.trim()) return cat;
        const q = searchQuery.toLowerCase();
        const matchingProducts = cat.products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.blurb.toLowerCase().includes(q) ||
            (p.specs && p.specs.toLowerCase().includes(q))
        );
        return { ...cat, products: matchingProducts };
      })
      .filter((cat) => cat.products.length > 0);
  }, [activeCategory, searchQuery]);

  const filteredBundles = useMemo(() => {
    if (activeCategory !== "all" && activeCategory !== "bundles") return [];
    if (!searchQuery.trim()) return bundles;
    const q = searchQuery.toLowerCase();
    return bundles.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.blurb.toLowerCase().includes(q) ||
        b.contents.some((c) => c.toLowerCase().includes(q))
    );
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-b border-border shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between max-w-6xl mx-auto">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, umbrellas, apparel, tumblers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          {/* Flexible Quantity Badge */}
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              No Minimums • Any Quantity Welcome
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-3 max-w-6xl mx-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              activeCategory === "all"
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeCategory === c.id
                  ? "bg-brand text-brand-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {c.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveCategory("bundles")}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === "bundles"
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Bundles & Curated Sets ({bundles.length})
          </button>
        </div>
      </div>

      {/* Categories Listing */}
      <div className="space-y-14">
        {filteredCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-36">
            <p className="eyebrow text-brand">{cat.tagline}</p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold">{cat.name}</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.products.map((p) => {
                const chosen = items[p.id];
                const itemInv = inventory[p.id];
                const stockCount = itemInv?.stock ?? 250;
                const status = itemInv?.status ?? "in_stock";

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
                        unit: "pcs",
                        specs: p.specs,
                      })
                    }
                    className="group overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/50 flex flex-col justify-between"
                  >
                    <div>
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
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-brand px-2.5 py-1 text-xs font-bold text-brand-foreground shadow-xs">
                            <Check className="h-3 w-3" /> {chosen} pcs
                          </span>
                        ) : (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs">
                            <Plus className="h-3 w-3" /> Add
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-base font-bold leading-tight group-hover:text-brand transition-colors">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.blurb}</p>
                        {p.specs && (
                          <p className="mt-2 text-[11px] text-muted-foreground/80 font-mono bg-muted/50 rounded-xs px-1.5 py-0.5 inline-block">
                            {p.specs}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-xs border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {status === "made_to_order" ? "Custom Production" : `${stockCount.toLocaleString()} in stock`}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          No Minimum
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Bundles Section */}
        {filteredBundles.length > 0 && (
          <section id="bundles" className="scroll-mt-36">
            <p className="eyebrow text-brand">Save time with a curated package</p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold">Bundles & Curated Sets</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBundles.map((b) => {
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
                        unit: "sets",
                      })
                    }
                    className="overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/50 flex flex-col justify-between"
                  >
                    <div>
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
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-brand px-2.5 py-1 text-xs font-bold text-brand-foreground shadow-xs">
                            <Check className="h-3 w-3" /> {chosen} sets
                          </span>
                        ) : (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs">
                            <Plus className="h-3 w-3" /> Add Set
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-base font-bold">{b.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{b.blurb}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {b.contents.slice(0, 3).map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] font-normal py-0">
                              {item}
                            </Badge>
                          ))}
                          {b.contents.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{b.contents.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-xs border border-blue-200">
                          Package Ready
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Custom Quantities
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {filteredCategories.length === 0 && filteredBundles.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-base font-semibold">No products found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs mt-1">Try searching for &ldquo;tote&rdquo;, &ldquo;polo&rdquo;, &ldquo;tumbler&rdquo;, or reset your filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Quantity Modal without MOQ Restrictions */}
      <Dialog open={picked !== null} onOpenChange={(o) => !o && setPicked(null)}>
        <DialogContent className="sm:max-w-md">
          {picked && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-lg font-bold">{picked.name}</DialogTitle>
                <DialogDescription>{picked.blurb}</DialogDescription>
              </DialogHeader>

              <img
                src={picked.image}
                alt={picked.name}
                width={800}
                height={800}
                className="aspect-[4/3] w-full rounded-sm bg-secondary object-cover"
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-sm border border-border">
                  <span className="text-muted-foreground">
                    Available Stock:{" "}
                    <strong className="text-foreground">
                      {inventory[picked.id]?.status === "made_to_order"
                        ? "Custom Production"
                        : `${(inventory[picked.id]?.stock ?? 250).toLocaleString()} ${picked.unit}`}
                    </strong>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    No Minimum
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qty">Enter how many {picked.unit} you need:</Label>
                  <Input
                    id="qty"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder="Enter any quantity (e.g. 25, 50, 200)"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    autoFocus
                    className="text-base font-bold"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Order any amount. Our team will prepare tiered volume pricing for your exact quantity.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:justify-between pt-2">
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
                <Button onClick={save} className="bg-brand hover:bg-brand/90 font-bold">
                  Save to quote
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
