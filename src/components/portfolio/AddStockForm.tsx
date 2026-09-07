import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_PRICES, STOCK_NAMES, SYMBOLS, money } from "@/lib/portfolio";

type Props = { onAdd: (symbol: string, quantity: number) => void };

export function AddStockForm({ onAdd }: Props) {
  const [symbol, setSymbol] = useState<string>(SYMBOLS[0] ?? "AAPL");
  const [quantity, setQuantity] = useState<string>("");

  const qty = Number(quantity);
  const valid = Number.isFinite(qty) && qty > 0;
  const price = DEMO_PRICES[symbol] ?? 0;
  const preview = valid ? price * qty : 0;

  return (
    <form
      className="panel p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onAdd(symbol, Math.floor(qty));
        setQuantity("");
      }}
    >
      <h2 className="text-lg font-semibold">Add a stock</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Demo prices only — not real-time market prices.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger id="symbol" className="w-full">
              <SelectValue placeholder="Select a symbol" />
            </SelectTrigger>
            <SelectContent>
              {SYMBOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="font-semibold">{s}</span>
                  <span className="ml-2 text-muted-foreground">
                    {STOCK_NAMES[s]} · {money(DEMO_PRICES[s] ?? 0)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            placeholder="e.g. 25"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" disabled={!valid} className="w-full sm:w-auto">
          <Plus className="size-4" /> Add stock
        </Button>
      </div>

      <p className="num mt-3 text-sm text-muted-foreground">
        {money(price)} × {valid ? Math.floor(qty) : 0} ={" "}
        <span className="font-semibold text-foreground">{money(preview)}</span>
      </p>
    </form>
  );
}
