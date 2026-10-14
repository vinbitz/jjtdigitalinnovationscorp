import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

/**
 * Shared website content edited from /admin, stored in the Supabase
 * `site_content` table so every visitor and device sees the same thing.
 * Everyone can read it; only admin accounts can change it (database policies).
 */
export type SiteContentKey = "catalog_categories" | "catalog_bundles" | "inventory";

/** Returns the saved rows, or null when the server can't be reached / isn't set up yet. */
export async function fetchSiteContent(
  keys: SiteContentKey[],
): Promise<Partial<Record<SiteContentKey, unknown>> | null> {
  try {
    const { data, error } = await supabase.from("site_content").select("key, value").in("key", keys);
    if (error) {
      console.warn("Couldn't read site content:", error.message);
      return null;
    }
    const rows: Partial<Record<SiteContentKey, unknown>> = {};
    for (const row of data ?? []) rows[row.key as SiteContentKey] = row.value;
    return rows;
  } catch (err) {
    console.warn("Couldn't read site content:", err);
    return null;
  }
}

function reportSaveError(message: string) {
  console.error("Couldn't save site content:", message);
  toast.error(`Couldn't save to the server (${message}). This change is only in this browser for now.`, {
    id: "site-content-save-error",
  });
}

// Saves run one after another so quick successive edits arrive in order.
let saveQueue: Promise<unknown> = Promise.resolve();

export function saveSiteContent(key: SiteContentKey, value: unknown): Promise<boolean> {
  const run = async () => {
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: value as Json }, { onConflict: "key" });
      if (error) {
        reportSaveError(error.message);
        return false;
      }
      return true;
    } catch (err) {
      reportSaveError(err instanceof Error ? err.message : String(err));
      return false;
    }
  };
  const result = saveQueue.then(run, run);
  saveQueue = result.catch(() => undefined);
  return result;
}

export function deleteSiteContent(keys: SiteContentKey[]): Promise<boolean> {
  const run = async () => {
    const { error } = await supabase.from("site_content").delete().in("key", keys);
    if (error) {
      reportSaveError(error.message);
      return false;
    }
    return true;
  };
  const result = saveQueue.then(run, run);
  saveQueue = result.catch(() => undefined);
  return result;
}

/**
 * Upload a product photo to the public "product-images" storage bucket and
 * return its public URL, or null if the upload failed.
 */
export async function uploadProductImage(file: Blob): Promise<string | null> {
  const ext =
    { "image/webp": "webp", "image/png": "png", "image/gif": "gif", "image/svg+xml": "svg" }[file.type] ?? "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  try {
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type || "image/jpeg",
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      console.error("Product image upload failed:", error.message);
      return null;
    }
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.error("Product image upload failed:", err);
    return null;
  }
}
