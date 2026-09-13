import { useState, useEffect, useMemo } from "react";
import {
  categories as defaultCategories,
  bundles as defaultBundles,
  Category,
  Product,
  Bundle,
} from "./catalog";

const STORAGE_CATALOG_KEY = "jjt_live_catalog_v2";
const STORAGE_BUNDLES_KEY = "jjt_live_bundles_v2";

export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories;
  try {
    const raw = localStorage.getItem(STORAGE_CATALOG_KEY);
    if (!raw) return defaultCategories;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
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
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultBundles;
  } catch (err) {
    console.error("Failed to read bundles from storage:", err);
    return defaultBundles;
  }
}

export function saveCategoriesToStorage(categories: Category[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("jjt_catalog_updated"));
  } catch (err) {
    console.error("Failed to save categories to storage:", err);
  }
}

export function saveBundlesToStorage(bundles: Bundle[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_BUNDLES_KEY, JSON.stringify(bundles));
    window.dispatchEvent(new Event("jjt_catalog_updated"));
  } catch (err) {
    console.error("Failed to save bundles to storage:", err);
  }
}

export function useCatalogStore() {
  const [categories, setCategories] = useState<Category[]>(getStoredCategories);
  const [bundles, setBundles] = useState<Bundle[]>(getStoredBundles);

  useEffect(() => {
    function handleUpdate() {
      setCategories(getStoredCategories());
      setBundles(getStoredBundles());
    }
    window.addEventListener("jjt_catalog_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("jjt_catalog_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const allProducts = useMemo(() => {
    return categories.flatMap((c) => c.products);
  }, [categories]);

  // Update existing product
  function updateProduct(productId: string, updates: Partial<Product>) {
    setCategories((prev) => {
      const next = prev.map((cat) => ({
        ...cat,
        products: cat.products.map((p) => {
          if (p.id === productId) {
            return { ...p, ...updates };
          }
          return p;
        }),
      }));
      saveCategoriesToStorage(next);
      return next;
    });
  }

  // Add new product into specific category
  function addProduct(categoryId: string, newProduct: Product) {
    setCategories((prev) => {
      let targetCatFound = false;
      const next = prev.map((cat) => {
        if (cat.id === categoryId) {
          targetCatFound = true;
          return {
            ...cat,
            products: [newProduct, ...cat.products],
          };
        }
        return cat;
      });

      if (!targetCatFound && next.length > 0) {
        next[0].products.unshift(newProduct);
      }

      saveCategoriesToStorage(next);
      return next;
    });
  }

  // Delete product
  function deleteProduct(productId: string) {
    setCategories((prev) => {
      const next = prev.map((cat) => ({
        ...cat,
        products: cat.products.filter((p) => p.id !== productId),
      }));
      saveCategoriesToStorage(next);
      return next;
    });
  }

  // Reorder / Move product position up or down within category
  function moveProduct(categoryId: string, productId: string, direction: "up" | "down") {
    setCategories((prev) => {
      const next = prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const products = [...cat.products];
        const index = products.findIndex((p) => p.id === productId);
        if (index === -1) return cat;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= products.length) return cat;

        // Swap items
        const temp = products[index];
        products[index] = products[targetIndex];
        products[targetIndex] = temp;

        return {
          ...cat,
          products,
        };
      });

      saveCategoriesToStorage(next);
      return next;
    });
  }

  // Move product to another category
  function changeProductCategory(productId: string, oldCategoryId: string, newCategoryId: string) {
    if (oldCategoryId === newCategoryId) return;
    setCategories((prev) => {
      let movedProduct: Product | undefined;
      const withoutProduct = prev.map((cat) => {
        if (cat.id === oldCategoryId) {
          const found = cat.products.find((p) => p.id === productId);
          if (found) movedProduct = { ...found, category: newCategoryId };
          return {
            ...cat,
            products: cat.products.filter((p) => p.id !== productId),
          };
        }
        return cat;
      });

      if (!movedProduct) return prev;

      const next = withoutProduct.map((cat) => {
        if (cat.id === newCategoryId) {
          return {
            ...cat,
            products: [movedProduct, ...cat.products],
          };
        }
        return cat;
      });

      saveCategoriesToStorage(next);
      return next;
    });
  }

  // Move entire category order up or down
  function moveCategory(categoryId: string, direction: "up" | "down") {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === categoryId);
      if (index === -1) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;

      saveCategoriesToStorage(next);
      return next;
    });
  }

  // Update bundle
  function updateBundle(bundleId: string, updates: Partial<Bundle>) {
    setBundles((prev) => {
      const next = prev.map((b) => {
        if (b.id === bundleId) {
          return { ...b, ...updates };
        }
        return b;
      });
      saveBundlesToStorage(next);
      return next;
    });
  }

  // Reset entire catalog to default brochure state
  function resetCatalog() {
    localStorage.removeItem(STORAGE_CATALOG_KEY);
    localStorage.removeItem(STORAGE_BUNDLES_KEY);
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
