import { allProducts, bundles } from "./catalog";

export type QuoteLine = {
  id: string;
  name: string;
  qty: number;
  moq: number;
  unit: string;
  apparel: boolean;
  image?: string;
};

export function resolveLine(id: string, qty: number): QuoteLine {
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
  };
}

export function resolveLines(items: Record<string, number>): QuoteLine[] {
  return Object.entries(items).map(([id, qty]) => resolveLine(id, qty));
}

export function hasApparel(items: Record<string, number>) {
  return resolveLines(items).some((line) => line.apparel);
}
