import { useState, useMemo } from "react";
import { Check, Plus, Search, Layers, Package, CheckCircle2, Sparkles, SlidersHorizontal } from "lucide-react";

import { categories, bundles, allProducts, Product } from "@/lib/catalog";
import { useQuote, ItemOptions } from "@/lib/quote-store";
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

const COLOR_MAP: Record<string, string> = {
  Black: "#111827",
  White: "#f9fafb",
  Beige: "#e7d7c1",
  Blue: "#1d4ed8",
  Brown: "#78350f",
  Red: "#dc2626",
  Green: "#15803d",
  Violet: "#7c3aed",
  Yellow: "#eab308",
  Pink: "#ec4899",
  "Gunmetal Gray": "#4b5563",
  "Navy Blue": "#1e3a8a",
};

type Picked = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  unit: string;
  specs?: string | undefined;
  product?: Product | undefined;
  isPremium?: boolean | undefined;
};

export function ProductPicker() {
  const { items, itemOptions, setQuantity } = useQuote();
  const { inventory } = useInventory();
  const [picked, setPicked] = useState<Picked | null>(null);
  const [qty, setQty] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<"all" | "under_500" | "under_1000">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Variant selections in modal
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrintMethod, setSelectedPrintMethod] = useState<string>("");

  function open(item: Picked) {
    setPicked(item);
    setQty(String(items[item.id] ?? 50));

    // Pre-populate or initialize options
    const existing = itemOptions?.[item.id];
    const variants = item.product?.variants;

    setSelectedType(existing?.type ?? variants?.types?.[0] ?? "");
    setSelectedBrand(existing?.brand ?? variants?.brands?.[0] ?? "");
    setSelectedSize(existing?.size ?? variants?.sizes?.[0] ?? "");
    setSelectedColor(existing?.color ?? variants?.colors?.[0] ?? "");
    setSelectedPrintMethod(existing?.printMethod ?? variants?.printMethods?.[0] ?? "");
  }

  function save() {
    if (!picked) return;
    const n = Number.parseInt(qty, 10);
    const quantity = Number.isFinite(n) && n > 0 ? n : 0;

    const options: ItemOptions = {
      ...(selectedType ? { type: selectedType } : {}),
      ...(selectedBrand ? { brand: selectedBrand } : {}),
      ...(selectedSize ? { size: selectedSize } : {}),
      ...(selectedColor ? { color: selectedColor } : {}),
      ...(selectedPrintMethod ? { printMethod: selectedPrintMethod } : {}),
    };

    setQuantity(picked.id, quantity, Object.keys(options).length > 0 ? options : undefined);
    setPicked(null);
  }

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
      .map((cat) => {
        let matchingProducts = cat.products;

        // Apply budget filter
        if (budgetFilter === "under_500") {
          matchingProducts = matchingProducts.filter((p) => p.priceTier === "under_500");
        } else if (budgetFilter === "under_1000") {
          matchingProducts = matchingProducts.filter(
            (p) => p.priceTier === "under_500" || p.priceTier === "under_1000"
          );
        }

        // Apply text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          matchingProducts = matchingProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.blurb.toLowerCase().includes(q) ||
              (p.specs && p.specs.toLowerCase().includes(q))
          );
        }

        return { ...cat, products: matchingProducts };
      })
      .filter((cat) => cat.products.length > 0);
  }, [activeCategory, budgetFilter, searchQuery]);

  const filteredBundles = useMemo(() => {
    if (activeCategory !== "all" && activeCategory !== "bundles") return [];
    let list = bundles;

    // Apply budget filter
    if (budgetFilter === "under_500") {
      list = list.filter((b) => b.priceTier === "under_500");
    } else if (budgetFilter === "under_1000") {
      list = list.filter((b) => b.priceTier === "under_500" || b.priceTier === "under_1000");
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.blurb.toLowerCase().includes(q) ||
        b.contents.some((c) => c.toLowerCase().includes(q))
    );
  }, [activeCategory, budgetFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search, Budget Filters, and Category Filter Bar */}
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

          {/* Quick Budget Tiers */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Budget:
            </span>
            <button
              type="button"
              onClick={() => setBudgetFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                budgetFilter === "all"
                  ? "bg-navy text-white shadow-2xs"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Prices
            </button>
            <button
              type="button"
              onClick={() => setBudgetFilter("under_500")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                budgetFilter === "under_500"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              Under ₱500
            </button>
            <button
              type="button"
              onClick={() => setBudgetFilter("under_1000")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                budgetFilter === "under_1000"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              Under ₱1,000
            </button>
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
                const savedOpts = itemOptions?.[p.id];

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
                        product: p,
                      })
                    }
                    className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/50 flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image Box with padding to prevent any crop */}
                      <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-card/40 p-4 border-b border-border/50 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          width={800}
                          height={800}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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

                        {/* Price tier badge */}
                        {p.priceTier && (
                          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-stone-900/80 text-white backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold">
                            {p.priceTier === "under_500"
                              ? "Under ₱500"
                              : p.priceTier === "under_1000"
                              ? "Under ₱1,000"
                              : "Executive"}
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-display text-base font-bold leading-tight group-hover:text-brand transition-colors">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.blurb}</p>

                        {/* Specs or Active Variants preview */}
                        {savedOpts && (
                          <div className="mt-2 text-[11px] text-brand font-medium bg-brand/10 border border-brand/20 rounded-xs px-2 py-0.5">
                            Selected:{" "}
                            {[savedOpts.type, savedOpts.brand, savedOpts.size, savedOpts.color]
                              .filter(Boolean)
                              .join(" • ")}
                          </div>
                        )}

                        {p.specs && !savedOpts && (
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

        {/* Bundles Section with Gold Background for Premium Suites */}
        {filteredBundles.length > 0 && (
          <section id="bundles" className="scroll-mt-36">
            <p className="eyebrow text-brand">Save time with a curated package</p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold">Bundles & Curated Sets</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBundles.map((b) => {
                const key = `bundle:${b.id}`;
                const chosen = items[key];
                const isPremium = Boolean(b.isPremium);

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
                        isPremium: Boolean(b.isPremium),
                      })
                    }
                    className={`overflow-hidden rounded-xl border text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between ${
                      isPremium
                        ? "bg-gradient-to-b from-amber-100/90 via-amber-50/70 to-yellow-100/80 dark:from-amber-950/40 dark:via-stone-900/60 dark:to-amber-950/40 border-2 border-amber-400/80 shadow-lg shadow-amber-500/10 hover:border-amber-400"
                        : "bg-card border-border hover:border-brand/50 hover:shadow-xl"
                    }`}
                  >
                    <div>
                      {/* Bundle image with gold background for premium suites */}
                      <div
                        className={`relative aspect-[4/3] overflow-hidden p-4 flex items-center justify-center ${
                          isPremium
                            ? "bg-gradient-to-br from-amber-300/40 via-yellow-200/50 to-amber-400/40 dark:from-amber-950/90 dark:via-yellow-900/60 dark:to-amber-900/80 border-b border-amber-300/50 shadow-inner"
                            : "bg-stone-100 dark:bg-card/40 border-b border-border/50"
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
                        {chosen ? (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-brand px-2.5 py-1 text-xs font-bold text-brand-foreground shadow-xs">
                            <Check className="h-3 w-3" /> {chosen} sets
                          </span>
                        ) : (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-card/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-xs">
                            <Plus className="h-3 w-3" /> Add Set
                          </span>
                        )}

                        {/* Gold Badge for Premium Bundles */}
                        {isPremium ? (
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1 shadow-md border border-amber-200/40">
                            <Sparkles className="h-3 w-3 text-yellow-100" /> Premium Suite
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 bg-navy/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            Curated Set
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3
                          className={`font-display text-base font-bold ${
                            isPremium ? "text-amber-950 dark:text-amber-100" : ""
                          }`}
                        >
                          {b.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">{b.blurb}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {b.contents.slice(0, 3).map((item, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className={`text-[10px] font-normal py-0 ${
                                isPremium ? "bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300/40" : ""
                              }`}
                            >
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
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-xs border ${
                            isPremium
                              ? "text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/40 border-amber-300/60"
                              : "text-blue-700 bg-blue-50 border-blue-200"
                          }`}
                        >
                          {isPremium ? "24K Gold Ribbon Presentation" : "Package Ready"}
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
            <p className="text-xs mt-1">Try resetting your filters or search keywords.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setBudgetFilter("all");
                setActiveCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Comprehensive Customizer Modal with Variant Options & Uncropped Image */}
      <Dialog open={picked !== null} onOpenChange={(o) => !o && setPicked(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {picked && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-lg font-bold">{picked.name}</DialogTitle>
                <DialogDescription>{picked.blurb}</DialogDescription>
              </DialogHeader>

              {/* Uncropped Image Display with Gold Background for Premium Suites */}
              <div
                className={`relative aspect-[4/3] w-full rounded-lg border p-4 flex items-center justify-center overflow-hidden ${
                  picked.isPremium
                    ? "bg-gradient-to-br from-amber-300/40 via-yellow-200/50 to-amber-400/40 dark:from-amber-950/90 dark:via-yellow-900/60 dark:to-amber-900/80 border-amber-300/60 shadow-inner"
                    : "bg-stone-100 dark:bg-card/40 border-border/60"
                }`}
              >
                <img
                  src={picked.image}
                  alt={picked.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Interactive Variant Selectors */}
              <div className="space-y-4 pt-1">
                {/* 1. Type Selector (e.g. Umbrella Type, Jacket Style, Dri-Fit Sublimation) */}
                {picked.product?.variants?.types && picked.product.variants.types.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Type / Style:
                    </Label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {picked.product.variants.types.map((typeOption) => (
                        <button
                          key={typeOption}
                          type="button"
                          onClick={() => setSelectedType(typeOption)}
                          className={`text-left text-xs font-medium px-3 py-2 rounded-md border transition-all cursor-pointer ${
                            selectedType === typeOption
                              ? "bg-brand text-brand-foreground border-brand font-bold shadow-xs"
                              : "bg-secondary/60 hover:bg-secondary border-border"
                          }`}
                        >
                          {typeOption}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Brand Selector (e.g. T-Shirt, Polo Shirt brands) */}
                {picked.product?.variants?.brands && picked.product.variants.brands.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Brand Blank:
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {picked.product.variants.brands.map((brandOption) => (
                        <button
                          key={brandOption}
                          type="button"
                          onClick={() => setSelectedBrand(brandOption)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            selectedBrand === brandOption
                              ? "bg-navy dark:bg-white text-white dark:text-navy border-navy font-bold shadow-xs"
                              : "bg-secondary/60 hover:bg-secondary border-border text-foreground"
                          }`}
                        >
                          {brandOption}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Size Selector (Standard XS-XXL + Special 3XL-5XL, or Mini / Standard for Umbrellas) */}
                {picked.product?.variants?.sizes && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Size:
                      </Label>
                      {picked.product.variants.specialSizes && (
                        <span className="text-[11px] text-brand font-semibold">
                          Special sizes (3XL-5XL) available
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {picked.product.variants.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-[38px] text-xs font-bold py-1.5 px-2.5 rounded-md border transition-all cursor-pointer ${
                            selectedSize === s
                              ? "bg-brand text-brand-foreground border-brand shadow-xs"
                              : "bg-secondary/60 hover:bg-secondary border-border text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}

                      {/* Special Sizes */}
                      {picked.product.variants.specialSizes?.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-[42px] text-xs font-bold py-1.5 px-2.5 rounded-md border transition-all cursor-pointer ${
                            selectedSize === s
                              ? "bg-brand text-brand-foreground border-brand shadow-xs"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300/70 hover:bg-amber-100"
                          }`}
                          title="Special Extended Sizing"
                        >
                          {s}*
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Color Swatches Selector (10 Colors) */}
                {picked.product?.variants?.colors && picked.product.variants.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Available Color:</span>
                      <span className="font-bold text-foreground">{selectedColor || "None chosen"}</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {picked.product.variants.colors.map((c) => {
                        const hex = COLOR_MAP[c] ?? "#64748b";
                        const isSelected = selectedColor === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`group flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? "border-brand bg-brand/10 font-bold text-brand shadow-xs"
                                : "border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span
                              className="h-3 w-3 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span>{c}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Print Method / Finish */}
                {picked.product?.variants?.printMethods && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Branding / Print Method:
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {picked.product.variants.printMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setSelectedPrintMethod(method)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                            selectedPrintMethod === method
                              ? "bg-brand text-brand-foreground border-brand font-bold"
                              : "bg-secondary/60 hover:bg-secondary border-border"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Input */}
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="qty" className="font-bold text-sm">
                    Enter how many {picked.unit} you need:
                  </Label>
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
                    Order any amount. Our team will prepare tiered volume pricing for your exact specifications.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:justify-between pt-3 border-t border-border/60">
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
