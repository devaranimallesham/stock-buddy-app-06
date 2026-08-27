import { Wallet, Layers, PieChart as PieIcon } from "lucide-react";
import { money } from "@/lib/portfolio";

type Props = { totalInvestment: number; totalStocks: number; totalShares: number };

const cards = [
  { key: "inv", label: "Total Investment", icon: Wallet, hint: "Sum of price x quantity" },
  { key: "stocks", label: "Total Stocks", icon: Layers, hint: "Unique symbols held" },
  { key: "shares", label: "Total Shares", icon: PieIcon, hint: "Shares across all holdings" },
] as const;

export function StatCards({ totalInvestment, totalStocks, totalShares }: Props) {
  const values: Record<string, string> = {
    inv: money(totalInvestment),
    stocks: String(totalStocks),
    shares: totalShares.toLocaleString("en-US"),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, hint }, i) => (
        <div
          key={key}
          className="panel group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
          style={{ animation: `fade-in 420ms ease-out ${i * 70}ms both` }}
        >
          <div className="brand-gradient absolute inset-x-0 top-0 h-1 opacity-80" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="num mt-2 text-3xl font-semibold tracking-tight">{values[key]}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </div>
            <span className="brand-gradient grid size-11 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Icon className="size-5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
