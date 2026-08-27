import { ArrowDownRight, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/portfolio";
import { money } from "@/lib/portfolio";

const meta = {
  add: { icon: ArrowUpRight, label: "Added", tone: "text-success" },
  edit: { icon: Pencil, label: "Updated", tone: "text-primary" },
  delete: { icon: Trash2, label: "Removed", tone: "text-destructive" },
} as const;

type Props = { transactions: Transaction[]; onClear: () => void };

export function TransactionHistory({ transactions, onClear }: Props) {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Transaction history</h2>
          <p className="text-xs text-muted-foreground">Most recent activity first</p>
        </div>
        {transactions.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <ul className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">
          {transactions.map((t) => {
            const { icon: Icon, label, tone } = meta[t.kind];
            return (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg bg-card ${tone}`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {label} {t.quantity} × {t.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.at).toLocaleString()}
                  </p>
                </div>
                <span className="num shrink-0 text-sm font-semibold">
                  {t.kind === "delete" ? (
                    <span className="inline-flex items-center gap-1 text-destructive">
                      <ArrowDownRight className="size-3.5" />
                      {money(t.amount)}
                    </span>
                  ) : (
                    money(t.amount)
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
