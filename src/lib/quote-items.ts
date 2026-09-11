import { allProducts, bundles } from "./catalog";
import type { ItemOptions } from "./quote-store";

export type QuoteLine = {
  id: string;
  name: string;
  qty: number;
  moq: number;
  unit: string;
  apparel: boolean;
  image?: string;
  options?: ItemOptions;
};

export function resolveLine(id: string, qty: number, options?: ItemOptions): QuoteLine {
  if (id.startsWith("bundle:")) {
    const bundle = bundles.find((b) => b.id === id.slice("bundle:".length));
    return {
      id,
      name: bundle ? `${bundle.name} (bundle)` : id,
      qty,
      moq: bundle?.moq ?? 1,
      unit: "sets",
      apparel: true,
      image: bundle?.image,
      options,
    };
  }
  const product = allProducts.find((p) => p.id === id);
  return {
    id,
    name: product?.name ?? id,
    qty,
    moq: product?.moq ?? 1,
    unit: "pcs",
    apparel: Boolean(product?.apparel),
    image: product?.image,
    options,
  };
}

export function resolveLines(
  items: Record<string, number>,
  itemOptions?: Record<string, ItemOptions>
): QuoteLine[] {
  return Object.entries(items).map(([id, qty]) => resolveLine(id, qty, itemOptions?.[id]));
}

export function hasApparel(items: Record<string, number>, itemOptions?: Record<string, ItemOptions>) {
  return resolveLines(items, itemOptions).some((line) => line.apparel);
}
