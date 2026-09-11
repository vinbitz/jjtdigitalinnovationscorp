import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type QuoteDetails = {
  contactName: string;
  company: string;
  email: string;
  phone: string;
  eventDate: string;
  occasion: string;
  budgetRange: string;
  sizeBreakdown: string;
  notes: string;
};

export const emptyDetails: QuoteDetails = {
  contactName: "",
  company: "",
  email: "",
  phone: "",
  eventDate: "",
  occasion: "",
  budgetRange: "",
  sizeBreakdown: "",
  notes: "",
};

export type ItemOptions = {
  type?: string;
  brand?: string;
  size?: string;
  color?: string;
  printMethod?: string;
};

type QuoteState = {
  items: Record<string, number>;
  itemOptions: Record<string, ItemOptions>;
  services: string[];
  details: QuoteDetails;
};

type QuoteContextValue = QuoteState & {
  setQuantity: (id: string, qty: number, options?: ItemOptions) => void;
  setItemOptions: (id: string, options: ItemOptions) => void;
  removeItem: (id: string) => void;
  toggleService: (id: string) => void;
  updateDetails: (patch: Partial<QuoteDetails>) => void;
  reset: () => void;
  totalPieces: number;
  lineCount: number;
};

const STORAGE_KEY = "jjt-quote-draft";

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuoteState>({
    items: {},
    itemOptions: {},
    services: [],
    details: emptyDetails,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<QuoteState>;
        setState({
          items: parsed.items ?? {},
          itemOptions: parsed.itemOptions ?? {},
          services: parsed.services ?? [],
          details: { ...emptyDetails, ...(parsed.details ?? {}) },
        });
      }
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const value = useMemo<QuoteContextValue>(() => {
    const totalPieces = Object.values(state.items).reduce((sum, n) => sum + n, 0);
    return {
      ...state,
      totalPieces,
      lineCount: Object.keys(state.items).length,
      setQuantity: (id, qty, options) =>
        setState((prev) => {
          const items = { ...prev.items };
          const itemOptions = { ...prev.itemOptions };
          if (qty > 0) {
            items[id] = qty;
            if (options) {
              itemOptions[id] = options;
            }
          } else {
            delete items[id];
            delete itemOptions[id];
          }
          return { ...prev, items, itemOptions };
        }),
      setItemOptions: (id, options) =>
        setState((prev) => ({
          ...prev,
          itemOptions: {
            ...prev.itemOptions,
            [id]: options,
          },
        })),
      removeItem: (id) =>
        setState((prev) => {
          const items = { ...prev.items };
          const itemOptions = { ...prev.itemOptions };
          delete items[id];
          delete itemOptions[id];
          return { ...prev, items, itemOptions };
        }),
      toggleService: (id) =>
        setState((prev) => ({
          ...prev,
          services: prev.services.includes(id)
            ? prev.services.filter((s) => s !== id)
            : [...prev.services, id],
        })),
      updateDetails: (patch) =>
        setState((prev) => ({ ...prev, details: { ...prev.details, ...patch } })),
      reset: () => setState({ items: {}, itemOptions: {}, services: [], details: emptyDetails }),
    };
  }, [state]);

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}
