import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LineChart, Lock, PieChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stock Portfolio Tracker — Private Holdings Dashboard" },
      {
        name: "description",
        content:
          "Sign in to track stock holdings with demo prices, allocation charts, transaction history and CSV/TXT export.",
      },
      { property: "og:title", content: "Stock Portfolio Tracker" },
      {
        property: "og:description",
        content: "A private, fintech-style dashboard for tracking your stock holdings.",
      },
    ],
  }),
  component: Landing,
});

const points = [
  { icon: PieChart, title: "Clear allocation", body: "Donut and bar views of every position." },
  { icon: LineChart, title: "Simple math", body: "Investment = Stock Price × Quantity." },
  { icon: Lock, title: "Private to you", body: "Your portfolio opens only after you sign in." },
];

function Landing() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
      else setReady(true);
    });
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        <span className="brand-gradient mx-auto grid size-14 place-items-center rounded-2xl text-primary-foreground">
          <LineChart className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Stock Portfolio Tracker</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          Track holdings, allocation and totals in a clean fintech dashboard. Demo prices only —
          not real-time market prices.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => navigate({ to: "/auth" })}>
            <ShieldCheck className="size-4" /> Sign in to your portfolio
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="panel p-5 text-left">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </span>
              <h2 className="mt-3 text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
