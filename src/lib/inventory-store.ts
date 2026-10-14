import { useState, useEffect, useRef } from "react";
import { categories } from "./catalog";
import { fetchSiteContent, saveSiteContent } from "./site-content";

export type StockStatus = "in_stock" | "low_stock" | "made_to_order" | "out_of_stock";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  image: string;
  specs?: string | undefined;
  moq: number; // Editable in admin, default is 1 (no minimum enforced for customer)
  stock: number; // Available inventory count
  status: StockStatus;
  updatedAt: string;
}

const STORAGE_KEY = "jjt_inventory_catalog_v1";

// Default inventory numbers initialized from the catalog
function getInitialInventory(): Record<string, InventoryItem> {
  const initial: Record<string, InventoryItem> = {};

  categories.forEach((cat) => {
    cat.products.forEach((p) => {
      // Sensible initial stock figures based on item category
      let defaultStock = 250;
      let defaultStatus: StockStatus = "in_stock";

      if (p.id.includes("banner") || p.id.includes("booth") || p.id.includes("led") || p.id.includes("plaques")) {
        defaultStock = 50;
        defaultStatus = "made_to_order";
      } else if (p.id.includes("pen") || p.id.includes("lanyard") || p.id.includes("pin") || p.id.includes("ecobag")) {
        defaultStock = 1500;
      } else if (p.id.includes("tumbler") || p.id.includes("mug") || p.id.includes("tote")) {
        defaultStock = 500;
      } else if (p.id.includes("powerbank") || p.id.includes("speaker") || p.id.includes("jacket")) {
        defaultStock = 180;
      }

      initial[p.id] = {
        id: p.id,
        name: p.name,
        category: cat.name,
        image: p.image,
        specs: p.specs,
        moq: 1, // Default to 1 so no artificial minimum limits customers
        stock: defaultStock,
        status: defaultStatus,
        updatedAt: new Date().toISOString(),
      };
    });
  });

  return initial;
}

export function getStoredInventory(): Record<string, InventoryItem> {
  if (typeof window === "undefined") return getInitialInventory();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialInventory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return mergeInventory(JSON.parse(raw) as Record<string, InventoryItem>);
  } catch (err) {
    console.error("Failed reading inventory from storage:", err);
    return getInitialInventory();
  }
}

function mergeInventory(parsed: Record<string, InventoryItem>): Record<string, InventoryItem> {
  const defaults = getInitialInventory();
  // Merge in case catalog was expanded. Name, image, category and specs always
  // come from the current catalog so they never go stale (e.g. image URLs
  // change after a redeploy); stock, MOQ and status keep the saved values.
  const merged: Record<string, InventoryItem> = { ...defaults };
  for (const [id, saved] of Object.entries(parsed ?? {})) {
    const base = defaults[id];
    merged[id] = base
      ? {
          ...base,
          ...saved,
          name: base.name,
          image: base.image,
          category: base.category,
          specs: base.specs,
        }
      : saved;
  }
  return merged;
}

// Shared copy saved from /admin (Supabase `site_content` table), fetched once per page load
let remoteInventory: Promise<Record<string, InventoryItem> | null> | null = null;
let inventoryEdited = false;
function loadRemoteInventory() {
  if (!remoteInventory) {
    remoteInventory = fetchSiteContent(["inventory"]).then((rows) => {
      if (!rows) return null;
      const saved = rows.inventory;
      return saved && typeof saved === "object"
        ? mergeInventory(saved as Record<string, InventoryItem>)
        : getInitialInventory();
    });
  }
  return remoteInventory;
}

export function saveInventoryToStorage(data: Record<string, InventoryItem>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("jjt_inventory_updated"));
  } catch (err) {
    console.error("Failed saving inventory to storage:", err);
  }
}

// Computed once; used for the first render on both server and browser so the
// markup matches during hydration. Saved values load right after mount.
let initialInventoryCache: Record<string, InventoryItem> | undefined;
function getDefaultInventory() {
  if (!initialInventoryCache) initialInventoryCache = getInitialInventory();
  return initialInventoryCache;
}

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>(getDefaultInventory);
  const inventoryRef = useRef(inventory);

  useEffect(() => {
    function load() {
      const next = getStoredInventory();
      inventoryRef.current = next;
      setInventory(next);
    }
    load();
    window.addEventListener("jjt_inventory_updated", load);
    window.addEventListener("storage", load);

    let cancelled = false;
    void loadRemoteInventory().then((remote) => {
      if (cancelled || !remote || inventoryEdited) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      } catch {
        /* cache only */
      }
      inventoryRef.current = remote;
      setInventory(remote);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("jjt_inventory_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Apply a change, update state and persist it (kept outside React's
  // state updater functions, which must be pure).
  function commit(next: Record<string, InventoryItem>) {
    inventoryRef.current = next;
    setInventory(next);
    inventoryEdited = true;
    saveInventoryToStorage(next);
    void saveSiteContent("inventory", next);
  }

  function updateItem(id: string, updates: Partial<InventoryItem>) {
    const prev = inventoryRef.current;
    const current: InventoryItem = prev[id] || {
      id,
      name: id,
      category: "General",
      image: "",
      moq: 1,
      stock: 100,
      status: "in_stock",
      updatedAt: new Date().toISOString(),
    };
    commit({
      ...prev,
      [id]: {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  function bulkUpdateStock(categoryName: string, addAmount: number) {
    const next = { ...inventoryRef.current };
    Object.keys(next).forEach((id) => {
      const item = next[id];
      if (item && item.category === categoryName) {
        next[id] = {
          ...item,
          stock: Math.max(0, item.stock + addAmount),
          updatedAt: new Date().toISOString(),
        };
      }
    });
    commit(next);
  }

  return {
    inventory,
    updateItem,
    bulkUpdateStock,
    getItemStock: (id: string) => inventory[id]?.stock ?? 100,
    getItemMoq: (id: string) => inventory[id]?.moq ?? 1,
    getItemStatus: (id: string) => inventory[id]?.status ?? "in_stock",
  };
}
