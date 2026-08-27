import { useState } from "react";
import { Check, Pencil, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Holding } from "@/lib/portfolio";
import { STOCK_NAMES, money, priceOf, valueOf } from "@/lib/portfolio";

type Props = {
  holdings: Holding[];
  totalInvestment: number;
  query: string;
  onQueryChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  onEdit: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
};

export function PortfolioTable({
  holdings,
  totalInvestment,
  query,
  onQueryChange,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (h: Holding) => {
    setEditingId(h.id);
    setDraft(String(h.quantity));
  };

  const commit = (id: string) => {
    const q = Math.floor(Number(draft));
    if (Number.isFinite(q) && q > 0) onEdit(id, q);
    setEditingId(null);
  };

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Holdings</h2>
          <p className="text-xs text-muted-foreground">
            {holdings.length} {holdings.length === 1 ? "position" : "positions"} shown
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search symbol or company"
              className="pl-9 sm:w-64"
              aria-label="Search stocks"
            />
          </div>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="sm:w-44" aria-label="Sort holdings">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value-desc">Value: high to low</SelectItem>
              <SelectItem value="value-asc">Value: low to high</SelectItem>
              <SelectItem value="symbol">Symbol: A–Z</SelectItem>
              <SelectItem value="qty-desc">Quantity: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {holdings.length === 0 ? (
        <p className="p-10 text-center text-sm text-muted-foreground">
          No holdings match your search yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">Qty</th>
                <th className="px-5 py-3 text-right font-medium">Investment</th>
                <th className="px-5 py-3 text-right font-medium">Weight</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const value = valueOf(h);
                const weight = totalInvestment ? (value / totalInvestment) * 100 : 0;
                const editing = editingId === h.id;
                return (
                  <tr key={h.id} className="border-t border-border transition-colors hover:bg-surface">
                    <td className="px-5 py-3">
                      <div className="font-semibold">{h.symbol}</div>
                      <div className="text-xs text-muted-foreground">{STOCK_NAMES[h.symbol]}</div>
                    </td>
                    <td className="num px-5 py-3 text-right">{money(priceOf(h.symbol))}</td>
                    <td className="num px-5 py-3 text-right">
                      {editing ? (
                        <Input
                          autoFocus
                          type="number"
                          min={1}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commit(h.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="ml-auto h-9 w-24 text-right"
                          aria-label={`Quantity for ${h.symbol}`}
                        />
                      ) : (
                        h.quantity
                      )}
                    </td>
                    <td className="num px-5 py-3 text-right font-semibold">{money(value)}</td>
                    <td className="px-5 py-3">
                      <div className="ml-auto flex w-28 items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="brand-gradient h-full rounded-full transition-all duration-500"
                            style={{ width: `${weight}%` }}
                          />
                        </div>
                        <span className="num text-xs text-muted-foreground">
                          {weight.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {editing ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => commit(h.id)}
                              aria-label="Save quantity"
                            >
                              <Check className="size-4 text-success" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancel edit"
                            >
                              <X className="size-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEdit(h)}
                              aria-label={`Edit ${h.symbol}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onDelete(h.id)}
                              aria-label={`Delete ${h.symbol}`}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
