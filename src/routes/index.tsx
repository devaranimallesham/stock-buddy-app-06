import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, FileText, LineChart, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddStockForm } from "@/components/portfolio/AddStockForm";
import { PortfolioTable } from "@/components/portfolio/PortfolioTable";
import { PortfolioCharts } from "@/components/portfolio/PortfolioCharts";
import { StatCards } from "@/components/portfolio/StatCards";
import { HowItWorks } from "@/components/portfolio/HowItWorks";
import { TransactionHistory } from "@/components/portfolio/TransactionHistory";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import type { Holding, Transaction, TxKind } from "@/lib/portfolio";
import {
  HOLDINGS_KEY,
  STOCK_NAMES,
  TX_KEY,
  download,
  loadJSON,
  mergeHoldings,
  money,
  priceOf,
  saveJSON,
  toCSV,
  toTXT,
  uid,
  valueOf,
} from "@/lib/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stock Portfolio Tracker — Holdings, Charts & Exports" },
      {
        name: "description",
        content:
          "Track holdings with demo prices, auto-calculated investment, allocation charts, transaction history and CSV/TXT export.",
      },
      { property: "og:title", content: "Stock Portfolio Tracker" },
      {
        property: "og:description",
        content:
          "A fintech-style dashboard for tracking stock holdings, allocation and investment totals using demo prices.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("value-desc");

  useEffect(() => {
    setHoldings(mergeHoldings(loadJSON<Holding[]>(HOLDINGS_KEY, [])));
    setTransactions(loadJSON<Transaction[]>(TX_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(HOLDINGS_KEY, holdings);
  }, [holdings, hydrated]);

  useEffect(() => {
    if (hydrated) saveJSON(TX_KEY, transactions);
  }, [transactions, hydrated]);

  const logTx = (kind: TxKind, symbol: string, quantity: number) => {
    const price = priceOf(symbol);
    setTransactions((prev) =>
      [
        { id: uid(), kind, symbol, quantity, price, amount: price * quantity, at: Date.now() },
        ...prev,
      ].slice(0, 100),
    );
  };

  const totalInvestment = holdings.reduce((s, h) => s + valueOf(h), 0);
  const totalShares = holdings.reduce((s, h) => s + h.quantity, 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? holdings.filter(
          (h) =>
            h.symbol.toLowerCase().includes(q) ||
            (STOCK_NAMES[h.symbol] ?? "").toLowerCase().includes(q),
        )
      : holdings;
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "symbol") return a.symbol.localeCompare(b.symbol);
      if (sort === "qty-desc") return b.quantity - a.quantity;
      if (sort === "value-asc") return valueOf(a) - valueOf(b);
      return valueOf(b) - valueOf(a);
    });
    return sorted;
  }, [holdings, query, sort]);

  const handleAdd = (symbol: string, quantity: number) => {
    setHoldings((prev) => {
      const existing = prev.find((h) => h.symbol === symbol);
      if (existing) {
        toast.success(`Merged into ${symbol}`, {
          description: `${existing.quantity} + ${quantity} = ${existing.quantity + quantity} shares`,
        });
        return mergeHoldings(
          prev.map((h) => (h.symbol === symbol ? { ...h, quantity: h.quantity + quantity } : h)),
        );
      }
      toast.success(`${symbol} added`, {
        description: `${quantity} × ${money(priceOf(symbol))} = ${money(priceOf(symbol) * quantity)}`,
      });
      return mergeHoldings([...prev, { id: uid(), symbol, quantity }]);
    });
    logTx("add", symbol, quantity);
  };

  const handleEdit = (id: string, quantity: number) => {
    const target = holdings.find((h) => h.id === id);
    if (!target || target.quantity === quantity) return;
    setHoldings((prev) => prev.map((h) => (h.id === id ? { ...h, quantity } : h)));
    logTx("edit", target.symbol, quantity);
    toast.success(`${target.symbol} updated`, { description: `Now ${quantity} shares` });
  };

  const handleDelete = (id: string) => {
    const target = holdings.find((h) => h.id === id);
    if (!target) return;
    setHoldings((prev) => prev.filter((h) => h.id !== id));
    logTx("delete", target.symbol, target.quantity);
    toast(`${target.symbol} removed`, { description: `${money(valueOf(target))} freed up` });
  };

  const exportFile = (kind: "csv" | "txt") => {
    if (holdings.length === 0) {
      toast.error("Nothing to export", { description: "Add at least one holding first." });
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    if (kind === "csv") download(`portfolio-${stamp}.csv`, toCSV(holdings), "text/csv");
    else download(`portfolio-${stamp}.txt`, toTXT(holdings), "text/plain");
    toast.success(`Exported as ${kind.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="brand-gradient grid size-10 place-items-center rounded-xl text-primary-foreground">
              <LineChart className="size-5" />
            </span>
            <div>
              <h1 className="text-base font-semibold leading-tight sm:text-lg">
                Stock Portfolio Tracker
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Investment = Stock Price × Quantity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => exportFile("csv")}>
              <Download className="size-4" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportFile("txt")}>
              <FileText className="size-4" />
              <span className="hidden sm:inline">TXT</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <TriangleAlert className="size-4 shrink-0 text-warning" />
          <p className="font-medium">Demo prices only — not real-time market prices.</p>
        </div>

        <StatCards
          totalInvestment={totalInvestment}
          totalStocks={holdings.length}
          totalShares={totalShares}
        />

        <AddStockForm onAdd={handleAdd} />

        <PortfolioTable
          holdings={visible}
          totalInvestment={totalInvestment}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PortfolioCharts holdings={holdings} />

        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionHistory
            transactions={transactions}
            onClear={() => {
              setTransactions([]);
              toast.success("History cleared");
            }}
          />
          <HowItWorks />
        </div>

        <footer className="pb-4 pt-2 text-center text-xs text-muted-foreground">
          Data is stored locally in your browser. Demo prices only — not real-time market prices.
        </footer>
      </main>
    </div>
  );
}
