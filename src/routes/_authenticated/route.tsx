import { useEffect, useState } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/auth", replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth", replace: true });
      else setChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your portfolio…</p>
      </div>
    );
  }

  return <Outlet />;
}
