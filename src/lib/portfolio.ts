export const DEMO_PRICES: Record<string, number> = {
  AAPL: 180,
  TSLA: 250,
  GOOGL: 140,
  MSFT: 420,
  AMZN: 185,
  META: 500,
  NFLX: 650,
  NVDA: 120,
};

export const STOCK_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.",
  TSLA: "Tesla, Inc.",
  GOOGL: "Alphabet Inc.",
  MSFT: "Microsoft Corp.",
  AMZN: "Amazon.com, Inc.",
  META: "Meta Platforms",
  NFLX: "Netflix, Inc.",
  NVDA: "NVIDIA Corp.",
};

export const SYMBOLS = Object.keys(DEMO_PRICES);

export type Holding = {
  id: string;
  symbol: string;
  quantity: number;
};

export type TxKind = "add" | "edit" | "delete";

export type Transaction = {
  id: string;
  kind: TxKind;
  symbol: string;
  quantity: number;
  price: number;
  amount: number;
  at: number;
};

export const HOLDINGS_KEY = "spt.holdings.v1";
export const TX_KEY = "spt.transactions.v1";
export const THEME_KEY = "spt.theme";

export const priceOf = (symbol: string) => DEMO_PRICES[symbol] ?? 0;
export const valueOf = (h: Holding) => priceOf(h.symbol) * h.quantity;

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const uid = () => Math.random().toString(36).slice(2, 10);

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function mergeHoldings(list: Holding[]): Holding[] {
  const map = new Map<string, Holding>();
  for (const h of list) {
    const existing = map.get(h.symbol);
    if (existing) existing.quantity += h.quantity;
    else map.set(h.symbol, { ...h });
  }
  return [...map.values()].sort((a, b) => valueOf(b) - valueOf(a));
}

export function toCSV(holdings: Holding[]): string {
  const rows = [
    ["Symbol", "Company", "Price (USD)", "Quantity", "Investment (USD)"],
    ...holdings.map((h) => [
      h.symbol,
      STOCK_NAMES[h.symbol] ?? h.symbol,
      String(priceOf(h.symbol)),
      String(h.quantity),
      String(valueOf(h)),
    ]),
    [],
    ["Total", "", "", String(holdings.reduce((s, h) => s + h.quantity, 0)), String(holdings.reduce((s, h) => s + valueOf(h), 0))],
  ];
  return rows.map((r) => r.join(",")).join("\n");
}

export function toTXT(holdings: Holding[]): string {
  const lines = [
    "STOCK PORTFOLIO SUMMARY",
    "Demo prices only - not real-time market prices.",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    ...holdings.map(
      (h) =>
        `${h.symbol.padEnd(6)} ${String(h.quantity).padStart(6)} sh  x ${money(priceOf(h.symbol)).padStart(10)}  =  ${money(valueOf(h))}`,
    ),
    "",
    `Total stocks:  ${holdings.length}`,
    `Total shares:  ${holdings.reduce((s, h) => s + h.quantity, 0)}`,
    `Total invested: ${money(holdings.reduce((s, h) => s + valueOf(h), 0))}`,
  ];
  return lines.join("\n");
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
