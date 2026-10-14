import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import {
  categories as defaultCategories,
  bundles as defaultBundles,
  type Category,
  type Product,
  type Bundle,
} from "./catalog";

const STORAGE_CATALOG_KEY = "jjt_live_catalog_v2";
const STORAGE_BUNDLES_KEY = "jjt_live_bundles_v2";

// ---------------------------------------------------------------------------
// Image healing
// Bundled images get a content hash in their URL at build time
// (e.g. /assets/item-polo-AbC123.jpg). When a photo is replaced and the site is
// redeployed, URLs saved in localStorage point at files that no longer exist.
// Here we swap any stale bundled URL back to the current default image.
// Custom uploads (data: URLs) and external links are never touched.
// ---------------------------------------------------------------------------
const defaultProductImages = new Map<string, string>(
  defaultCategories.flatMap((c) => c.products.map((p) => [p.id, p.image] as const)),
);
const defaultBundleImages = new Map<string, string>(defaultBundles.map((b) => [b.id, b.image]));
const currentBundledImages = new Set<string>([
  ...defaultProductImages.values(),
  ...defaultBundleImages.values(),
]);

function isBundledAssetUrl(url: string) {
  return url.startsWith("/assets/") || url.startsWith("/src/assets/") || url.startsWith("/@fs/");
}

function healImage(id: string, image: string | undefined, defaults: Map<string, string>) {
  const fallback = defaults.get(id);
  if (!fallback) return image ?? "";
  if (!image) return fallback;
  if (isBundledAssetUrl(image) && !currentBundledImages.has(image)) return fallback;
  return image;
}

function healCategories(list: Category[]): Category[] {
  return list.map((cat) => ({
    ...cat,
    products: (cat.products ?? []).map((p) => ({
      ...p,
      image: healImage(p.id, p.image, defaultProductImages),
    })),
  }));
}

function healBundles(list: Bundle[]): Bundle[] {
  return list.map((b) => ({ ...b, image: healImage(b.id, b.image, defaultBundleImages) }));
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories;
  try {
    const raw = localStorage.getItem(STORAGE_CATALOG_KEY);
    if (!raw) return defaultCategories;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return healCategories(parsed as Category[]);
    }
    return defaultCategories;
  } catch (err) {
    console.error("Failed to read categories from storage:", err);
    return defaultCategories;
  }
}

export function getStoredBundles(): Bundle[] {
  if (typeof window === "undefined") return defaultBundles;
  try {
    const raw = localStorage.getItem(STORAGE_BUNDLES_KEY);
    if (!raw) return defaultBundles;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return healBundles(parsed as Bundle[]);
    }
    return defaultBundles;
  } catch (err) {
    console.error("Failed to read bundles from storage:", err);
    return defaultBundles;
  }
}

function notifySaveFailed(err: unknown) {
  console.error("Failed to save catalog to storage:", err);
  toast.error(
    "Couldn't save the catalog in this browser (storage is full). Try a smaller image.",
  );
}

export function saveCategoriesToStorage(categories: Category[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("jjt_catalog_updated"));
    return true;
  } catch (err) {
    notifySaveFailed(err);
    return false;
  }
}

export function saveBundlesToStorage(bundles: Bundle[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_BUNDLES_KEY, JSON.stringify(bundles));
    window.dispatchEvent(new Event("jjt_catalog_updated"));
    return true;
  } catch (err) {
    notifySaveFailed(err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useCatalogStore() {
  // Start with the defaults so the server render and the first browser render
  // match (avoids hydration errors). Saved edits load right after mount.
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [bundles, setBundles] = useState<Bundle[]>(defaultBundles);
  const categoriesRef = useRef(categories);
  const bundlesRef = useRef(bundles);

  useEffect(() => {
    function load() {
      const nextCategories = getStoredCategories();
      const nextBundles = getStoredBundles();
      categoriesRef.current = nextCategories;
      bundlesRef.current = nextBundles;
      setCategories(nextCategories);
      setBundles(nextBundles);
    }
    load();
    window.addEventListener("jjt_catalog_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("jjt_catalog_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const allProducts = useMemo(() => categories.flatMap((c) => c.products), [categories]);

  // Apply a change, update state and persist it. Side effects stay out of
  // React's state updater functions (they must be pure).
  function commitCategories(update: (prev: Category[]) => Category[]) {
    const prev = categoriesRef.current;
    const next = update(prev);
    if (next === prev) return;
    categoriesRef.current = next;
    setCategories(next);
    saveCategoriesToStorage(next);
  }

  function commitBundles(update: (prev: Bundle[]) => Bundle[]) {
    const prev = bundlesRef.current;
    const next = update(prev);
    if (next === prev) return;
    bundlesRef.current = next;
    setBundles(next);
    saveBundlesToStorage(next);
  }

  // Update existing product
  function updateProduct(productId: string, updates: Partial<Product>) {
    commitCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        products: cat.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
      })),
    );
  }

  // Add new product into specific category (falls back to the first category)
  function addProduct(categoryId: string, newProduct: Product) {
    commitCategories((prev) => {
      if (prev.length === 0) return prev;
      const targetId = prev.some((c) => c.id === categoryId) ? categoryId : prev[0]?.id;
      return prev.map((cat) =>
        cat.id === targetId ? { ...cat, products: [newProduct, ...cat.products] } : cat,
      );
    });
  }

  // Delete product
  function deleteProduct(productId: string) {
    commitCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        products: cat.products.filter((p) => p.id !== productId),
      })),
    );
  }

  // Reorder / Move product position up or down within category
  function moveProduct(categoryId: string, productId: string, direction: "up" | "down") {
    commitCategories((prev) => {
      let changed = false;
      const next = prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const products = [...cat.products];
        const index = products.findIndex((p) => p.id === productId);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const current = products[index];
        const target = products[targetIndex];
        if (index === -1 || !current || !target) return cat;

        products[index] = target;
        products[targetIndex] = current;
        changed = true;
        return { ...cat, products };
      });
      return changed ? next : prev;
    });
  }

  // Move product to another category
  function changeProductCategory(productId: string, oldCategoryId: string, newCategoryId: string) {
    if (oldCategoryId === newCategoryId) return;
    commitCategories((prev) => {
      const found = prev
        .find((cat) => cat.id === oldCategoryId)
        ?.products.find((p) => p.id === productId);
      if (!found || !prev.some((cat) => cat.id === newCategoryId)) return prev;

      const movedProduct: Product = { ...found, category: newCategoryId };
      return prev.map((cat) => {
        if (cat.id === oldCategoryId) {
          return { ...cat, products: cat.products.filter((p) => p.id !== productId) };
        }
        if (cat.id === newCategoryId) {
          return { ...cat, products: [movedProduct, ...cat.products] };
        }
        return cat;
      });
    });
  }

  // Move entire category order up or down
  function moveCategory(categoryId: string, direction: "up" | "down") {
    commitCategories((prev) => {
      const index = prev.findIndex((c) => c.id === categoryId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      const current = prev[index];
      const target = prev[targetIndex];
      if (index === -1 || !current || !target) return prev;

      const next = [...prev];
      next[index] = target;
      next[targetIndex] = current;
      return next;
    });
  }

  // Update bundle
  function updateBundle(bundleId: string, updates: Partial<Bundle>) {
    commitBundles((prev) => prev.map((b) => (b.id === bundleId ? { ...b, ...updates } : b)));
  }

  // Reset entire catalog to default brochure state
  function resetCatalog() {
    try {
      localStorage.removeItem(STORAGE_CATALOG_KEY);
      localStorage.removeItem(STORAGE_BUNDLES_KEY);
    } catch (err) {
      console.error("Failed to clear catalog storage:", err);
    }
    categoriesRef.current = defaultCategories;
    bundlesRef.current = defaultBundles;
    setCategories(defaultCategories);
    setBundles(defaultBundles);
    window.dispatchEvent(new Event("jjt_catalog_updated"));
  }

  return {
    categories,
    bundles,
    allProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    moveProduct,
    changeProductCategory,
    moveCategory,
    updateBundle,
    resetCatalog,
  };
}
