import { Calculator, Database, Layers3 } from "lucide-react";

const steps = [
  {
    icon: Layers3,
    title: "Add a holding",
    body: "Pick a symbol and enter how many shares you own. Duplicate symbols merge into one row automatically.",
  },
  {
    icon: Calculator,
    title: "We do the math",
    body: "Investment = Stock Price x Quantity. Every card, chart and total is derived from that one formula.",
  },
  {
    icon: Database,
    title: "Saved on your device",
    body: "Holdings and transaction history live in your browser's localStorage, so they persist across reloads.",
  },
];

export function HowItWorks() {
  return (
    <section className="panel p-6">
      <h2 className="text-lg font-semibold">How it works</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A transparent, three-step model with no hidden calculations.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-border bg-surface p-4">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="size-4" />
            </span>
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="num mt-5 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4 text-center text-sm font-medium">
        Investment = Stock Price × Quantity
      </div>
    </section>
  );
}
