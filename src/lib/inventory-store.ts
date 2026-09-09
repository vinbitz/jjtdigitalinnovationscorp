import { useState, useEffect } from "react";
import { allProducts, categories, Product } from "./catalog";

export type StockStatus = "in_stock" | "low_stock" | "made_to_order" | "out_of_stock";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  image: string;
  specs?: string;
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
    const parsed = JSON.parse(raw);
    const defaults = getInitialInventory();
    // Merge in case catalog was expanded
    return { ...defaults, ...parsed };
  } catch (err) {
    console.error("Failed reading inventory from storage:", err);
    return getInitialInventory();
  }
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

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>(getStoredInventory());

  useEffect(() => {
    function handleUpdate() {
      setInventory(getStoredInventory());
    }
    window.addEventListener("jjt_inventory_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("jjt_inventory_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  function updateItem(id: string, updates: Partial<InventoryItem>) {
    setInventory((prev) => {
      const current = prev[id] || {
        id,
        name: id,
        category: "General",
        image: "",
        moq: 1,
        stock: 100,
        status: "in_stock",
        updatedAt: new Date().toISOString(),
      };
      const updated = {
        ...prev,
        [id]: {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      };
      saveInventoryToStorage(updated);
      return updated;
    });
  }

  function bulkUpdateStock(categoryName: string, addAmount: number) {
    setInventory((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (next[id].category === categoryName) {
          next[id] = {
            ...next[id],
            stock: Math.max(0, next[id].stock + addAmount),
            updatedAt: new Date().toISOString(),
          };
        }
      });
      saveInventoryToStorage(next);
      return next;
    });
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
