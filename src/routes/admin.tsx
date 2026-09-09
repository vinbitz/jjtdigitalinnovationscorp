import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
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
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { categories, allProducts } from "@/lib/catalog";
import { useInventory, StockStatus, InventoryItem } from "@/lib/inventory-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Active portal tab: "leads" or "inventory"
  const [activeTab, setActiveTab] = useState<"leads" | "inventory">("leads");

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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setSessionUser(data.user);
      toast.success("Signed in successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setAuthLoading(false);
    }
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
                <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                    </>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-stone-200 pt-5 text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  Previewing locally or setting up staff access?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-medium border-stone-300"
                  onClick={() => {
                    setDemoMode(true);
                    setLeads(sampleLeads);
                    toast.info("Entering Admin Dashboard in local review mode.");
                  }}
                >
                  <Layers className="mr-2 h-3.5 w-3.5 text-brand" />
                  Explore Admin & Stock Management (Local Mode)
                </Button>
              </div>
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
