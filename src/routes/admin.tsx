import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Download,
  Trash2,
  LogOut,
  ShieldAlert,
  ChevronRight,
  User,
  Phone,
  Mail,
  Package,
  Layers,
  Save,
  Plus,
  Minus,
  AlertTriangle,
  SlidersHorizontal,
  Image,
  Edit3,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { categories, allProducts, bundles, Product } from "@/lib/catalog";
import { useInventory, StockStatus, InventoryItem } from "@/lib/inventory-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCatalogStore } from "@/lib/catalog-store";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | JJT Digital Innovative Inc." },
      { name: "description", content: "Lead and quote management dashboard." },
    ],
  }),
  component: AdminPage,
});

export interface LeadItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  moq: number;
}

export interface QuoteLead {
  id: string;
  contact_name: string;
  company: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  occasion: string | null;
  budget_range: string | null;
  items: LeadItem[] | any;
  services: string[] | any;
  size_breakdown: string | null;
  notes: string | null;
  logo_path: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-amber-100 text-amber-800 border-amber-300", text: "text-amber-700", label: "New Lead" },
  contacted: { bg: "bg-blue-100 text-blue-800 border-blue-300", text: "text-blue-700", label: "Contacted" },
  quoted: { bg: "bg-purple-100 text-purple-800 border-purple-300", text: "text-purple-700", label: "Quoted" },
  won: { bg: "bg-emerald-100 text-emerald-800 border-emerald-300", text: "text-emerald-700", label: "Won" },
  lost: { bg: "bg-stone-100 text-stone-600 border-stone-200", text: "text-stone-600", label: "Lost" },
};

const stockStatusInfo: Record<StockStatus, { label: string; badge: string }> = {
  in_stock: { label: "In Stock", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  low_stock: { label: "Low Stock", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  made_to_order: { label: "Made to Order", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  out_of_stock: { label: "Out of Stock", badge: "bg-red-100 text-red-800 border-red-300" },
};

function AdminPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active portal tab: "leads", "inventory", or "catalog"
  const [activeTab, setActiveTab] = useState<"leads" | "inventory" | "catalog">("leads");

  // Leads data
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeLead, setActiveLead] = useState<QuoteLead | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Inventory management hook
  const { inventory, updateItem, bulkUpdateStock } = useInventory();
  const [inventorySearch, setInventorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>("all");

  // Local draft state for inventory edits
  const [draftEdits, setDraftEdits] = useState<Record<string, { stock: number; moq: number; status: StockStatus }>>({});

  // Live Catalog Store Hook
  const {
    categories: liveCategories,
    bundles: liveBundles,
    allProducts: liveProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    moveProduct,
    changeProductCategory,
    resetCatalog,
  } = useCatalogStore();

  // Catalog Manager state
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>("all");

  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editBlurb, setEditBlurb] = useState("");
  const [editSpecs, setEditSpecs] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editMoq, setEditMoq] = useState<number>(1);
  const [editPriceTier, setEditPriceTier] = useState<string>("under_500");
  const [editTypes, setEditTypes] = useState<string>("");

  // Adding product state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newCatId, setNewCatId] = useState<string>("popular");
  const [newName, setNewName] = useState("");
  const [newBlurb, setNewBlurb] = useState("");
  const [newSpecs, setNewSpecs] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newMoq, setNewMoq] = useState<number>(25);
  const [newPriceTier, setNewPriceTier] = useState<string>("under_500");
  const [newTypes, setNewTypes] = useState<string>("");

  function openEditModal(p: Product, catId: string) {
    setEditingProduct(p);
    setEditCategoryId(catId);
    setEditName(p.name);
    setEditBlurb(p.blurb);
    setEditSpecs(p.specs || "");
    setEditImage(p.image);
    setEditMoq(p.moq || 1);
    setEditPriceTier(p.priceTier || "under_500");
    setEditTypes(p.variants?.types ? p.variants.types.join(", ") : "");
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        if (isNew) {
          setNewImage(base64);
        } else {
          setEditImage(base64);
        }
        toast.success("Image selected successfully!");
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProductEdit() {
    if (!editingProduct) return;
    if (!editName.trim()) {
      toast.error("Product name is required.");
      return;
    }

    const typesArray = editTypes
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const updates: Partial<Product> = {
      name: editName.trim(),
      blurb: editBlurb.trim(),
      specs: editSpecs.trim() || undefined,
      image: editImage || editingProduct.image,
      moq: Math.max(1, editMoq),
      priceTier: (editPriceTier as any) || undefined,
      variants: {
        ...editingProduct.variants,
        ...(typesArray.length > 0 ? { types: typesArray } : {}),
      },
    };

    updateProduct(editingProduct.id, updates);

    // If category was changed
    const currentCat = liveCategories.find((c) =>
      c.products.some((p) => p.id === editingProduct.id)
    );
    if (currentCat && editCategoryId && currentCat.id !== editCategoryId) {
      changeProductCategory(editingProduct.id, currentCat.id, editCategoryId);
    }

    toast.success(`Updated "${editName}" successfully!`);
    setEditingProduct(null);
  }

  function handleCreateProduct() {
    if (!newName.trim()) {
      toast.error("Please enter a product name.");
      return;
    }
    const slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const id = `item-${slug}-${Date.now().toString().slice(-4)}`;

    const typesArray = newTypes
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const newProd: Product = {
      id,
      name: newName.trim(),
      blurb: newBlurb.trim() || "High-quality corporate branded merchandise.",
      specs: newSpecs.trim() || undefined,
      image: newImage || "/placeholder.svg",
      moq: Math.max(1, newMoq),
      priceTier: (newPriceTier as any) || undefined,
      variants: typesArray.length > 0 ? { types: typesArray } : undefined,
    };

    addProduct(newCatId, newProd);
    toast.success(`Added "${newName}" to catalog!`);
    setIsAddingProduct(false);
    setNewName("");
    setNewBlurb("");
    setNewSpecs("");
    setNewImage("");
    setNewTypes("");
  }

  // Check initial authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setSessionUser(data.user);
        }
      } catch (err) {
        console.warn("Auth check:", err);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch leads when authenticated or in demo mode
  useEffect(() => {
    if (sessionUser || demoMode) {
      loadLeads();
    }
  }, [sessionUser, demoMode]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password.");
      return;
    }
    setAuthLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Default admin / staff bypass credentials
    if (
      (cleanEmail === "admin@jjt-digital.com" || cleanEmail === "staff@jjt-digital.com" || cleanEmail === "admin") &&
      (cleanPass === "admin123" || cleanPass === "admin" || cleanPass === "jjt2026")
    ) {
      setDemoMode(true);
      setSessionUser({
        id: "admin-master",
        email: cleanEmail.includes("@") ? cleanEmail : "admin@jjt-digital.com",
        user_metadata: { role: "admin", name: "JJT Administrator" },
      });
      toast.success("Welcome back, Administrator!");
      setAuthLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });
      if (error) {
        // Fallback for local demo preview
        if (cleanPass === "admin123" || cleanPass === "admin") {
          setDemoMode(true);
          setSessionUser({
            id: "admin-fallback",
            email: cleanEmail,
            user_metadata: { role: "admin" },
          });
          toast.success("Signed in with local admin access.");
          return;
        }
        throw error;
      }
      setSessionUser(data.user);
      toast.success("Signed in successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleQuickDemoAccess() {
    setEmail("admin@jjt-digital.com");
    setPassword("admin123");
    setDemoMode(true);
    setSessionUser({
      id: "admin-master",
      email: "admin@jjt-digital.com",
      user_metadata: { role: "admin", name: "JJT Administrator" },
    });
    toast.success("Quick Access Granted! Welcome to JJT Admin Portal.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSessionUser(null);
    setDemoMode(false);
    toast.success("Signed out.");
  }

  async function loadLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Fetch quote_requests notice:", error.message);
        if (demoMode && leads.length === 0) {
          setLeads(sampleLeads);
        }
      } else if (data && data.length > 0) {
        setLeads(data as QuoteLead[]);
      } else if (demoMode && leads.length === 0) {
        setLeads(sampleLeads);
      }
    } catch (err) {
      console.error(err);
      if (demoMode && leads.length === 0) {
        setLeads(sampleLeads);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        toast.info(`Updated status to "${newStatus}" locally.`);
      } else {
        toast.success(`Status updated to ${newStatus}.`);
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
      );

      if (activeLead && activeLead.id === id) {
        setActiveLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  }

  // Inventory handling
  function handleDraftChange(id: string, field: "stock" | "moq" | "status", value: any) {
    setDraftEdits((prev) => {
      const current = prev[id] || {
        stock: inventory[id]?.stock ?? 100,
        moq: inventory[id]?.moq ?? 1,
        status: inventory[id]?.status ?? "in_stock",
      };
      return {
        ...prev,
        [id]: {
          ...current,
          [field]: value,
        },
      };
    });
  }

  function handleSaveInventoryItem(item: InventoryItem) {
    const draft = draftEdits[item.id];
    if (!draft) {
      toast.info("No modifications detected.");
      return;
    }
    updateItem(item.id, {
      stock: draft.stock,
      moq: draft.moq,
      status: draft.status,
    });
    toast.success(`Saved inventory & MOQ for ${item.name}!`);
    setDraftEdits((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
  }

  function handleQuickStockStep(id: string, delta: number) {
    const currentStock = draftEdits[id]?.stock ?? inventory[id]?.stock ?? 100;
    const newStock = Math.max(0, currentStock + delta);
    handleDraftChange(id, "stock", newStock);
  }

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        lead.company.toLowerCase().includes(query) ||
        lead.contact_name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.occasion && lead.occasion.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [leads, selectedStatus, searchQuery]);

  // Filtered Inventory
  const filteredInventoryList = useMemo(() => {
    return Object.values(inventory).filter((item) => {
      const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
      const currentStatus = draftEdits[item.id]?.status ?? item.status;
      const matchesStatus = selectedStockFilter === "all" || currentStatus === selectedStockFilter;
      const q = inventorySearch.toLowerCase();
      const matchesQuery =
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.specs && item.specs.toLowerCase().includes(q));
      return matchesCat && matchesStatus && matchesQuery;
    });
  }, [inventory, selectedCategory, selectedStockFilter, inventorySearch, draftEdits]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "new").length;
    const contacted = leads.filter((l) => l.status === "contacted").length;
    const quoted = leads.filter((l) => l.status === "quoted").length;
    const won = leads.filter((l) => l.status === "won").length;
    return { total, newCount, contacted, quoted, won };
  }, [leads]);

  const inventoryStats = useMemo(() => {
    const items = Object.values(inventory);
    const totalSkus = items.length;
    const totalStock = items.reduce((acc, cur) => acc + (cur.stock || 0), 0);
    const lowStockCount = items.filter((i) => i.stock > 0 && i.stock < 100).length;
    const customProdCount = items.filter((i) => i.status === "made_to_order").length;
    return { totalSkus, totalStock, lowStockCount, customProdCount };
  }, [inventory]);

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-brand" />
          <p className="mt-3 text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not signed in & not in demo preview
  if (!sessionUser && !demoMode) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/jjt-logo.png"
                alt="JJT Digital Innovative"
                className="h-12 w-12 object-contain rounded-full shadow-sm bg-white p-0.5"
              />
              <span className="font-display text-xl font-extrabold text-foreground">
                JJT Digital Innovative
              </span>
            </Link>
            <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">
              Staff & Admin Portal
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in with your staff account to manage quotes, leads, and stock inventory.
            </p>
          </div>

          <Card className="border-stone-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Staff Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Staff Email
                  </label>
                  <Input
                    type="email"
                    placeholder="staff@jjt-digital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold cursor-pointer" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                    </>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground text-[10px] font-bold">Or Instant Preview</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQuickDemoAccess}
                  className="w-full border-brand/40 text-brand hover:bg-brand/10 font-bold text-xs cursor-pointer"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-brand" />
                  One-Click Quick Access
                </Button>

                <div className="mt-4 p-3 bg-stone-100 dark:bg-stone-900/60 rounded-md text-xs border border-stone-200 dark:border-stone-800">
                  <p className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> Admin Login Credentials:
                  </p>
                  <p className="text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">Email:</span>{" "}
                    <code className="bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
                      admin@jjt-digital.com
                    </code>
                  </p>
                  <p className="text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">Password:</span>{" "}
                    <code className="bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-foreground">
                      admin123
                    </code>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              &larr; Return to main website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-navy text-navy-foreground shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-white group">
              <img
                src="/jjt-logo.png"
                alt="JJT"
                className="h-9 w-9 object-contain rounded-full bg-white p-0.5 transition-transform group-hover:scale-105"
              />
              <div>
                <span className="font-display text-base font-bold leading-none block">
                  JJT Admin Portal
                </span>
                <span className="text-[10px] text-white/60 tracking-wider uppercase font-semibold">
                  CRM & Inventory Controls
                </span>
              </div>
            </Link>

            {/* Tab Switcher */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-sm p-0.5 ml-2 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("leads")}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <FileText className="inline mr-1.5 h-3.5 w-3.5" />
                Quotes & Leads ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "inventory"
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Package className="inline mr-1.5 h-3.5 w-3.5" />
                Stocks & MOQs ({inventoryStats.totalSkus})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Layers className="inline mr-1.5 h-3.5 w-3.5" />
                Catalog Manager
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (activeTab === "leads") loadLeads();
                else toast.success("Inventory reloaded.");
              }}
              className="text-xs text-white/80 hover:text-white hover:bg-white/10"
              disabled={loading}
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm" className="text-xs border-white/20 bg-transparent text-white hover:bg-white/10">
                View Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-t border-white/10 bg-navy-foreground/5 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xs text-center ${
              activeTab === "leads" ? "bg-brand text-white" : "text-white/70"
            }`}
          >
            Quotes & Leads
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xs text-center ${
              activeTab === "inventory" ? "bg-brand text-white" : "text-white/70"
            }`}
          >
            Stocks & MOQs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xs text-center ${
              activeTab === "catalog" ? "bg-brand text-white" : "text-white/70"
            }`}
          >
            Catalog
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ================= TAB 1: LEADS & CRM ================= */}
        {activeTab === "leads" && (
          <div>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <Card className="border-stone-200 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Leads</p>
                  <CardTitle className="text-2xl font-bold font-display">{stats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">New Requests</p>
                  <CardTitle className="text-2xl font-bold font-display text-amber-800">{stats.newCount}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Quotes Sent</p>
                  <CardTitle className="text-2xl font-bold font-display text-purple-800">{stats.quoted}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Won / Closed</p>
                  <CardTitle className="text-2xl font-bold font-display text-emerald-800">{stats.won}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search company, contact, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Status:</span>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-44 text-xs font-medium">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses ({leads.length})</SelectItem>
                    <SelectItem value="new">New Requests ({stats.newCount})</SelectItem>
                    <SelectItem value="contacted">Contacted ({stats.contacted})</SelectItem>
                    <SelectItem value="quoted">Quoted ({stats.quoted})</SelectItem>
                    <SelectItem value="won">Won ({stats.won})</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Received</th>
                      <th className="px-5 py-3">Company & Contact</th>
                      <th className="px-5 py-3">Event Date & Occasion</th>
                      <th className="px-5 py-3">Budget</th>
                      <th className="px-5 py-3">Items Requested</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                          <FileText className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                          No quote requests match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const statusInfo = statusColors[lead.status] || {
                          bg: "bg-stone-100 text-stone-700 border-stone-200",
                          label: lead.status,
                        };
                        const itemsArray = Array.isArray(lead.items) ? lead.items : [];
                        const totalQty = itemsArray.reduce((acc: number, cur: any) => acc + (cur.qty || 0), 0);

                        return (
                          <tr key={lead.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                              {new Date(lead.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-semibold text-foreground">{lead.company}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <User className="h-3 w-3" /> {lead.contact_name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3" /> {lead.email}
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              {lead.event_date ? (
                                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                  {new Date(lead.event_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Not set</span>
                              )}
                              {lead.occasion && (
                                <div className="text-[11px] text-muted-foreground mt-0.5 capitalize">
                                  {lead.occasion}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-foreground">
                              {lead.budget_range || "Undisclosed"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-xs font-medium text-foreground">
                                {itemsArray.length} product{itemsArray.length !== 1 ? "s" : ""}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {totalQty.toLocaleString()} units total
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <Badge variant="outline" className={`text-[11px] font-semibold ${statusInfo.bg}`}>
                                {statusInfo.label}
                              </Badge>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-right">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-xs font-medium"
                                onClick={() => setActiveLead(lead)}
                              >
                                <Eye className="mr-1 h-3.5 w-3.5" />
                                View Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INVENTORY & STOCK MANAGEMENT ================= */}
        {activeTab === "inventory" && (
          <div>
            {/* Inventory Metric Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <Card className="border-stone-200 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catalog SKUs</p>
                  <CardTitle className="text-2xl font-bold font-display">{inventoryStats.totalSkus}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">In-Stock Units</p>
                  <CardTitle className="text-2xl font-bold font-display text-emerald-800">
                    {inventoryStats.totalStock.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Low Stock Items</p>
                  <CardTitle className="text-2xl font-bold font-display text-amber-800">
                    {inventoryStats.lowStockCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Custom Production</p>
                  <CardTitle className="text-2xl font-bold font-display text-blue-800">
                    {inventoryStats.customProdCount}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SKU name, specs, category..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 text-xs font-medium">
                    <SelectValue placeholder="Category Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories ({categories.length})</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStockFilter} onValueChange={setSelectedStockFilter}>
                  <SelectTrigger className="w-full sm:w-40 text-xs font-medium">
                    <SelectValue placeholder="Status Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="made_to_order">Made to Order</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                {selectedCategory !== "all" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs font-bold text-brand"
                    onClick={() => {
                      bulkUpdateStock(selectedCategory, 100);
                      toast.success(`Added +100 stock units across ${selectedCategory}!`);
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    +100 to Category
                  </Button>
                )}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Product / SKU</th>
                      <th className="px-5 py-3">Category & Specs</th>
                      <th className="px-5 py-3 w-52">Current Stock</th>
                      <th className="px-5 py-3 w-36">Min. Order (MOQ)</th>
                      <th className="px-5 py-3 w-40">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredInventoryList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                          <Package className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                          No items match your inventory query.
                        </td>
                      </tr>
                    ) : (
                      filteredInventoryList.map((item) => {
                        const draft = draftEdits[item.id];
                        const currentStock = draft?.stock !== undefined ? draft.stock : item.stock;
                        const currentMoq = draft?.moq !== undefined ? draft.moq : item.moq;
                        const currentStatus = draft?.status !== undefined ? draft.status : item.status;
                        const hasChanges = draft !== undefined;
                        const statusBadge = stockStatusInfo[currentStatus] || stockStatusInfo.in_stock;

                        return (
                          <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-11 w-11 rounded-sm bg-secondary object-cover shrink-0 border border-stone-200"
                                />
                                <div>
                                  <p className="font-bold text-foreground text-xs leading-snug">{item.name}</p>
                                  <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <span className="text-xs font-semibold text-foreground block">{item.category}</span>
                              {item.specs && (
                                <span className="text-[11px] text-muted-foreground font-mono block mt-0.5">
                                  {item.specs}
                                </span>
                              )}
                            </td>

                            {/* Editable Stock Level */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 rounded-sm shrink-0"
                                  onClick={() => handleQuickStockStep(item.id, -50)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min={0}
                                  value={currentStock}
                                  onChange={(e) =>
                                    handleDraftChange(
                                      item.id,
                                      "stock",
                                      Math.max(0, Number.parseInt(e.target.value, 10) || 0)
                                    )
                                  }
                                  className="h-7 w-20 text-xs text-center font-bold"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 rounded-sm shrink-0"
                                  onClick={() => handleQuickStockStep(item.id, 50)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>

                            {/* Editable Minimum Order Quantity */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <Input
                                  type="number"
                                  min={1}
                                  value={currentMoq}
                                  onChange={(e) =>
                                    handleDraftChange(
                                      item.id,
                                      "moq",
                                      Math.max(1, Number.parseInt(e.target.value, 10) || 1)
                                    )
                                  }
                                  className="h-7 w-16 text-xs text-center font-semibold"
                                />
                                <span className="text-[10px] text-muted-foreground">
                                  {currentMoq === 1 ? "(No min)" : "pcs"}
                                </span>
                              </div>
                            </td>

                            {/* Status Selector */}
                            <td className="px-5 py-3.5">
                              <Select
                                value={currentStatus}
                                onValueChange={(val: StockStatus) =>
                                  handleDraftChange(item.id, "status", val)
                                }
                              >
                                <SelectTrigger className="h-7 text-xs font-semibold w-36">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_stock">In Stock</SelectItem>
                                  <SelectItem value="low_stock">Low Stock</SelectItem>
                                  <SelectItem value="made_to_order">Made to Order</SelectItem>
                                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>

                            {/* Action / Save */}
                            <td className="px-5 py-3.5 text-right">
                              {hasChanges ? (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs font-bold bg-brand text-brand-foreground hover:bg-brand/90 animate-pulse"
                                  onClick={() => handleSaveInventoryItem(item)}
                                >
                                  <Save className="mr-1 h-3 w-3" />
                                  Save
                                </Button>
                              ) : (
                                <span className="text-[11px] text-muted-foreground font-mono">Synced</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CATALOG & MEDIA MANAGER ================= */}
        {activeTab === "catalog" && (
          <div>
            {/* Catalog Overview Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <Card className="border-stone-200 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
                  <CardTitle className="text-2xl font-bold font-display">{liveCategories.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Single Items</p>
                  <CardTitle className="text-2xl font-bold font-display text-blue-800">{liveProducts.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Bundles & Sets</p>
                  <CardTitle className="text-2xl font-bold font-display text-amber-800">{liveBundles.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-stone-200 shadow-sm border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">With Variants</p>
                  <CardTitle className="text-2xl font-bold font-display text-emerald-800">
                    {liveProducts.filter((p) => p.variants && (p.variants.types?.length || p.variants.brands?.length || p.variants.sizes?.length)).length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Action & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, specs..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <Select value={catalogCategoryFilter} onValueChange={setCatalogCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 text-xs font-medium">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories ({liveCategories.length})</SelectItem>
                    {liveCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.products.length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Add New Product Button */}
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setNewCatId(catalogCategoryFilter !== "all" ? catalogCategoryFilter : liveCategories[0]?.id || "popular");
                    setIsAddingProduct(true);
                  }}
                  className="bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs cursor-pointer shadow-xs"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add New Product
                </Button>

                {/* Reset to Brochure Defaults */}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Reset catalog and sequence order back to original factory brochure defaults?")) {
                      resetCatalog();
                      toast.success("Catalog restored to factory brochure defaults.");
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-red-600 border-stone-200 cursor-pointer"
                  title="Reset to Defaults"
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset Defaults
                </Button>
              </div>
            </div>

            {/* Product Grid by Category with Sequence Reordering */}
            <div className="space-y-12">
              {liveCategories
                .filter((cat) => catalogCategoryFilter === "all" || cat.id === catalogCategoryFilter)
                .map((cat) => {
                  const q = catalogSearch.toLowerCase();
                  const matchingProducts = q
                    ? cat.products.filter(
                        (p) =>
                          p.name.toLowerCase().includes(q) ||
                          p.blurb.toLowerCase().includes(q) ||
                          (p.specs && p.specs.toLowerCase().includes(q))
                      )
                    : cat.products;

                  if (matchingProducts.length === 0 && q) return null;

                  return (
                    <section key={cat.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-extrabold text-foreground">{cat.name}</h3>
                            <Badge variant="secondary" className="text-xs font-bold bg-brand/10 text-brand">
                              {cat.products.length} item{cat.products.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{cat.tagline}</p>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewCatId(cat.id);
                            setIsAddingProduct(true);
                          }}
                          className="text-xs font-semibold text-brand border-brand/30 hover:bg-brand/10 shrink-0 self-start sm:self-auto cursor-pointer"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add to {cat.name.split(" ")[0]}
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {matchingProducts.map((p, idx) => {
                          const hasVariants =
                            p.variants &&
                            ((p.variants.types && p.variants.types.length > 0) ||
                              (p.variants.brands && p.variants.brands.length > 0) ||
                              (p.variants.sizes && p.variants.sizes.length > 0) ||
                              (p.variants.colors && p.variants.colors.length > 0));

                          return (
                            <div
                              key={p.id}
                              className="bg-stone-50/60 rounded-lg border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                            >
                              <div>
                                {/* Photo Box with Change Photo Quick Action */}
                                <div className="aspect-square bg-white relative overflow-hidden p-3 flex items-center justify-center border-b border-stone-200">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                  />

                                  {/* Sequence Rank Badge */}
                                  <span className="absolute top-2 left-2 bg-stone-900/85 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                                    #{idx + 1}
                                  </span>

                                  {/* Price tier badge */}
                                  {p.priceTier && (
                                    <span className="absolute bottom-2 left-2 bg-white/95 text-stone-800 border border-stone-200 text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
                                      {p.priceTier === "under_500"
                                        ? "Under ₱500"
                                        : p.priceTier === "under_1000"
                                        ? "Under ₱1,000"
                                        : "Executive"}
                                    </span>
                                  )}

                                  {/* Hover overlay with Edit Photo button */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => openEditModal(p, cat.id)}
                                      className="bg-white text-stone-900 hover:bg-white/90 text-xs font-bold shadow-md cursor-pointer"
                                    >
                                      <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                                      Edit & Photo
                                    </Button>
                                  </div>
                                </div>

                                {/* Info */}
                                <div className="p-3.5">
                                  <h4 className="font-display text-xs font-bold text-foreground leading-snug line-clamp-2">
                                    {p.name}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                    {p.blurb}
                                  </p>

                                  {p.specs && (
                                    <p className="text-[10px] font-mono text-muted-foreground/80 mt-2 bg-white px-1.5 py-0.5 rounded-xs border border-stone-200/60 inline-block line-clamp-1">
                                      {p.specs}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                                    {hasVariants && (
                                      <Badge className="text-[9px] bg-blue-100 text-blue-800 border-blue-200 py-0">
                                        <SlidersHorizontal className="h-2.5 w-2.5 mr-0.5" />
                                        Configurable Options
                                      </Badge>
                                    )}
                                    <span className="text-[9px] font-mono text-muted-foreground">MOQ: {p.moq || 1}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Card Footer: Reorder Sequence & Edit/Delete Controls */}
                              <div className="p-3 pt-2 bg-white border-t border-stone-200 flex items-center justify-between">
                                {/* Sequence Move Controls */}
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 rounded-xs cursor-pointer border-stone-200 hover:bg-stone-100 disabled:opacity-30"
                                    title="Move Earlier in Store Sequence"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      moveProduct(cat.id, p.id, "up");
                                      toast.info(`Moved "${p.name}" earlier in display order.`);
                                    }}
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 rounded-xs cursor-pointer border-stone-200 hover:bg-stone-100 disabled:opacity-30"
                                    title="Move Later in Store Sequence"
                                    disabled={idx === matchingProducts.length - 1}
                                    onClick={() => {
                                      moveProduct(cat.id, p.id, "down");
                                      toast.info(`Moved "${p.name}" later in display order.`);
                                    }}
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </Button>
                                </div>

                                {/* Edit & Delete Buttons */}
                                <div className="flex items-center gap-1.5">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => openEditModal(p, cat.id)}
                                    className="h-7 px-2.5 text-xs font-semibold cursor-pointer"
                                  >
                                    <Edit3 className="mr-1 h-3 w-3" />
                                    Edit
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete "${p.name}" from the store?`)) {
                                        deleteProduct(p.id);
                                        toast.success(`Deleted "${p.name}".`);
                                      }
                                    }}
                                    className="h-7 w-7 text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
            </div>

            {/* Bundles & Curated Sets Overview */}
            {catalogCategoryFilter === "all" && (
              <section className="mt-12 bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">Bundles, Sets & Occasion Kits</h3>
                    <p className="text-xs text-muted-foreground">Pre-curated corporate gift packages and VIP suites</p>
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold">
                    {liveBundles.length} bundles
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {liveBundles
                    .filter((b) => {
                      if (!catalogSearch.trim()) return true;
                      const q = catalogSearch.toLowerCase();
                      return b.name.toLowerCase().includes(q) || b.blurb.toLowerCase().includes(q);
                    })
                    .slice(0, 12)
                    .map((b) => (
                      <div
                        key={b.id}
                        className={`bg-white rounded-lg border shadow-xs overflow-hidden ${
                          b.isPremium ? "border-amber-300" : "border-stone-200"
                        }`}
                      >
                        <div
                          className={`aspect-[4/3] relative overflow-hidden p-3 flex items-center justify-center ${
                            b.isPremium
                              ? "bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100"
                              : "bg-stone-100"
                          }`}
                        >
                          <img src={b.image} alt={b.name} className="h-full w-full object-contain" loading="lazy" />
                          {b.isPremium && (
                            <span className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-xs shadow-xs">
                              Premium Suite
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-display text-xs font-bold line-clamp-1">{b.name}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{b.blurb}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {b.contents.slice(0, 3).map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[9px] py-0">
                                {item}
                              </Badge>
                            ))}
                            {b.contents.length > 3 && (
                              <span className="text-[9px] text-muted-foreground self-center">
                                +{b.contents.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Lead Detail Modal */}
      <Dialog open={!!activeLead} onOpenChange={(open) => !open && setActiveLead(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {activeLead && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="text-xl font-bold font-display">
                    Quote Request #{activeLead.id.slice(0, 8)}
                  </DialogTitle>
                  <Select
                    value={activeLead.status}
                    onValueChange={(val) => updateLeadStatus(activeLead.id, val)}
                  >
                    <SelectTrigger className="w-36 text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Lead</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="won">Won / Closed</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogDescription>
                  Submitted on {new Date(activeLead.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Client & Company Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Company</span>
                    <p className="font-semibold text-foreground text-base mt-0.5">{activeLead.company}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> {activeLead.contact_name}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <a href={`mailto:${activeLead.email}`} className="text-brand underline">
                          {activeLead.email}
                        </a>
                      </p>
                      {activeLead.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <a href={`tel:${activeLead.phone}`} className="text-brand underline">
                            {activeLead.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Campaign Details</span>
                    <div className="mt-2 space-y-1 text-xs">
                      <p>
                        <span className="text-muted-foreground">Event Date:</span>{" "}
                        <strong className="text-foreground">
                          {activeLead.event_date ? new Date(activeLead.event_date).toLocaleDateString() : "Flexible"}
                        </strong>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Occasion:</span>{" "}
                        <strong className="text-foreground capitalize">{activeLead.occasion || "General"}</strong>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Target Budget:</span>{" "}
                        <strong className="text-foreground">{activeLead.budget_range || "Undisclosed"}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requested Products */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Requested Products ({Array.isArray(activeLead.items) ? activeLead.items.length : 0})
                  </h4>
                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                        <tr>
                          <th className="px-3 py-2">Item Name</th>
                          <th className="px-3 py-2 text-right">Quantity</th>
                          <th className="px-3 py-2 text-right">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {Array.isArray(activeLead.items) && activeLead.items.length > 0 ? (
                          activeLead.items.map((item: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-3 py-2 font-medium text-foreground">{item.name}</td>
                              <td className="px-3 py-2 text-right font-bold text-brand">
                                {item.qty} {item.unit || "pcs"}
                              </td>
                              <td className="px-3 py-2 text-right text-muted-foreground">
                                {item.unit || "pcs"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-3 py-2 text-center text-muted-foreground">
                              No items recorded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Size Breakdown */}
                {activeLead.size_breakdown && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Apparel Size Breakdown
                    </h4>
                    <p className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-foreground whitespace-pre-line">
                      {activeLead.size_breakdown}
                    </p>
                  </div>
                )}

                {/* Services */}
                {Array.isArray(activeLead.services) && activeLead.services.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Additional Services Requested
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeLead.services.map((svc: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {svc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Notes */}
                {activeLead.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Client Notes & Special Instructions
                    </h4>
                    <p className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-foreground whitespace-pre-line">
                      {activeLead.notes}
                    </p>
                  </div>
                )}

                {/* Uploaded Logo File */}
                {activeLead.logo_path && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Uploaded Client Logo
                    </h4>
                    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                      <span className="truncate max-w-sm text-foreground font-mono">
                        {activeLead.logo_path}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={async () => {
                          const { data } = supabase.storage
                            .from("quote-logos")
                            .getPublicUrl(activeLead.logo_path!);
                          if (data?.publicUrl) {
                            window.open(data.publicUrl, "_blank");
                          } else {
                            toast.error("Could not fetch logo URL.");
                          }
                        }}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download Logo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 1: EDIT PRODUCT & CHANGE PHOTO ================= */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
          {editingProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-brand" /> Edit Product & Photo
                </DialogTitle>
                <DialogDescription>
                  Modify photo, name, description, category, and options. Changes update across the store instantly.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* 1. Photo Section: Live Preview, File Upload & URL input */}
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Product Picture:
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    {/* Live Preview Box */}
                    <div className="h-28 w-28 rounded-md bg-white border border-stone-200 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                      <img
                        src={editImage || editingProduct.image}
                        alt="Product preview"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      {/* Local File Upload Button */}
                      <div>
                        <label className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer hover:bg-brand/90 shadow-xs transition-colors">
                          <Upload className="h-3.5 w-3.5" /> Upload New Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, false)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-muted-foreground ml-2">PNG, JPG, WEBP</span>
                      </div>

                      {/* Or enter Image URL */}
                      <div>
                        <Label className="text-[11px] text-muted-foreground">Or paste Image URL:</Label>
                        <Input
                          placeholder="https://... or /assets/..."
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                          className="text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Product Name */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Product Title / Name:</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Product name"
                    className="text-sm font-semibold"
                  />
                </div>

                {/* 3. Description / Blurb */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Description / Blurb:</Label>
                  <Textarea
                    value={editBlurb}
                    onChange={(e) => setEditBlurb(e.target.value)}
                    placeholder="Product description and marketing details..."
                    rows={3}
                    className="text-xs leading-relaxed"
                  />
                </div>

                {/* 4. Category & Price Tier Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Category:</Label>
                    <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                      <SelectTrigger className="text-xs h-8 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {liveCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Price Tier:</Label>
                    <Select value={editPriceTier} onValueChange={setEditPriceTier}>
                      <SelectTrigger className="text-xs h-8 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_500">Under ₱500</SelectItem>
                        <SelectItem value="under_1000">Under ₱1,000</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 5. Specifications & MOQ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-xs font-bold">Specifications / Dimensions:</Label>
                    <Input
                      value={editSpecs}
                      onChange={(e) => setEditSpecs(e.target.value)}
                      placeholder="e.g. 100% Combed Cotton • XS to 5XL"
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Min. Order (MOQ):</Label>
                    <Input
                      type="number"
                      min={1}
                      value={editMoq}
                      onChange={(e) => setEditMoq(Number.parseInt(e.target.value, 10) || 1)}
                      className="text-xs h-8 font-bold"
                    />
                  </div>
                </div>

                {/* 6. Configurable Variant Types */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold flex items-center justify-between">
                    <span>Configurable Types / Styles (comma-separated):</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Shown as customer selectors</span>
                  </Label>
                  <Input
                    value={editTypes}
                    onChange={(e) => setEditTypes(e.target.value)}
                    placeholder="e.g. A4 Hardbound, A5 Journal, Spiral Binder"
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveProductEdit}
                  className="bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs cursor-pointer shadow-xs"
                >
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Save Product & Photo
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= MODAL 2: ADD NEW PRODUCT ================= */}
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-brand" /> Add New Product to Catalog
            </DialogTitle>
            <DialogDescription>
              Create a new product with custom photo, specifications, and options. It will immediately appear in the catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Photo Section */}
            <div className="space-y-2 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Product Image:
              </Label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="h-28 w-28 rounded-md bg-white border border-stone-200 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                  {newImage ? (
                    <img src={newImage} alt="New item preview" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground text-center">No image chosen</span>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div>
                    <label className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer hover:bg-brand/90 shadow-xs transition-colors">
                      <Upload className="h-3.5 w-3.5" /> Choose Image File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e, true)}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-muted-foreground ml-2">PNG, JPG, WEBP</span>
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Or paste Image URL:</Label>
                    <Input
                      placeholder="https://... or /assets/..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="text-xs h-8 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Target Category */}
            <div className="space-y-1">
              <Label className="text-xs font-bold">Target Category:</Label>
              <Select value={newCatId} onValueChange={setNewCatId}>
                <SelectTrigger className="text-xs h-8 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {liveCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label className="text-xs font-bold">Product Title / Name:</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Executive Matte Wireless Powerbank"
                className="text-sm font-semibold"
              />
            </div>

            {/* Blurb */}
            <div className="space-y-1">
              <Label className="text-xs font-bold">Description / Blurb:</Label>
              <Textarea
                value={newBlurb}
                onChange={(e) => setNewBlurb(e.target.value)}
                placeholder="Describe the product features, quality, and gifting appeal..."
                rows={3}
                className="text-xs leading-relaxed"
              />
            </div>

            {/* Price Tier & MOQ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Price Tier:</Label>
                <Select value={newPriceTier} onValueChange={setNewPriceTier}>
                  <SelectTrigger className="text-xs h-8 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_500">Under ₱500</SelectItem>
                    <SelectItem value="under_1000">Under ₱1,000</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Min. Order Quantity (MOQ):</Label>
                <Input
                  type="number"
                  min={1}
                  value={newMoq}
                  onChange={(e) => setNewMoq(Number.parseInt(e.target.value, 10) || 1)}
                  className="text-xs h-8 font-bold"
                />
              </div>
            </div>

            {/* Specs */}
            <div className="space-y-1">
              <Label className="text-xs font-bold">Specifications / Technical Details:</Label>
              <Input
                value={newSpecs}
                onChange={(e) => setNewSpecs(e.target.value)}
                placeholder="e.g. 10,000mAh • 22.5W Fast Charge • Anodized Aluminum"
                className="text-xs h-8 font-mono"
              />
            </div>

            {/* Variant Types */}
            <div className="space-y-1">
              <Label className="text-xs font-bold flex items-center justify-between">
                <span>Configurable Styles / Types (comma-separated):</span>
                <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
              </Label>
              <Input
                value={newTypes}
                onChange={(e) => setNewTypes(e.target.value)}
                placeholder="e.g. 350ml Matte, 500ml Glossy, 800ml Explorer"
                className="text-xs h-8"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingProduct(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreateProduct}
              className="bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs cursor-pointer shadow-xs"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Product to Store
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sample mock data for quick local testing and demonstration
const sampleLeads: QuoteLead[] = [
  {
    id: "99194812-9290-4917-b9fa-d4b4fd4ab060",
    company: "Acme Global Tech",
    contact_name: "Sarah Jenkins",
    email: "s.jenkins@acmeglobal.io",
    phone: "+63 917 555 1234",
    event_date: "2026-10-15",
    occasion: "annual-summit",
    budget_range: "₱250,000 – ₱500,000",
    status: "new",
    items: [
      { id: "p-hoodie", name: "Heavyweight Cotton Hoodie", qty: 250, unit: "pcs", moq: 50 },
      { id: "p-notebook", name: "Hardcover Executive Notebook", qty: 300, unit: "pcs", moq: 100 },
      { id: "p-umbrella", name: "Auto-Open Inverted Umbrella", qty: 250, unit: "pcs", moq: 50 },
    ],
    services: ["Custom Logo Mockups & Vectorization", "Kitting & Custom Gift Box Packaging"],
    size_breakdown: "S: 30, M: 90, L: 80, XL: 40, 2XL: 10",
    notes: "Please prioritize navy blue fabric matching Pantone 289 C. Delivery needed in BGC by Oct 1.",
    logo_path: "logos/acme-brandmark-2026.png",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "c6940baa-d8ba-41b2-b0e9-f7b24db48976",
    company: "Metro Financial Innovations",
    contact_name: "Carlos Rivera",
    email: "carlos.r@metrofin.ph",
    phone: "+63 928 444 8899",
    event_date: "2026-11-20",
    occasion: "client-gifting",
    budget_range: "₱500,000+",
    status: "quoted",
    items: [
      { id: "p-giftset", name: "Premium Onboarding VIP Gift Set", qty: 150, unit: "sets", moq: 30 },
      { id: "p-laptop-bag", name: "Padded Water-Resistant Laptop Sleeve", qty: 150, unit: "pcs", moq: 50 },
    ],
    services: ["Door-to-Door Recipient Delivery across NCR", "Kitting & Custom Gift Box Packaging"],
    size_breakdown: null,
    notes: "Individual VIP packaging for executive partners.",
    logo_path: null,
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];
