import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Holding } from "@/lib/portfolio";
import { money, priceOf, valueOf } from "@/lib/portfolio";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--popover-foreground)",
  fontSize: "0.8rem",
};

export function PortfolioCharts({ holdings }: { holdings: Holding[] }) {
  const data = holdings.map((h) => ({
    symbol: h.symbol,
    value: valueOf(h),
    quantity: h.quantity,
    price: priceOf(h.symbol),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="panel p-5">
        <header className="mb-2">
          <h2 className="text-lg font-semibold">Allocation</h2>
          <p className="text-xs text-muted-foreground">Share of total investment by symbol</p>
        </header>
        {data.length === 0 ? (
          <EmptyState label="Add a stock to see your allocation" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="symbol"
                innerRadius={62}
                outerRadius={98}
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={2}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.symbol} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, n) => [money(v), n as string]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "0.75rem" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="panel p-5">
        <header className="mb-2">
          <h2 className="text-lg font-semibold">Investment by stock</h2>
          <p className="text-xs text-muted-foreground">Price x quantity, in USD</p>
        </header>
        {data.length === 0 ? (
          <EmptyState label="Add a stock to see the breakdown" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <XAxis
                dataKey="symbol"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={(v: number) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={tooltipStyle}
                formatter={(v: number) => [money(v), "Investment"]}
              />
              <Bar dataKey="value" radius={[8, 8, 4, 4]}>
                {data.map((entry, i) => (
                  <Cell key={entry.symbol} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
