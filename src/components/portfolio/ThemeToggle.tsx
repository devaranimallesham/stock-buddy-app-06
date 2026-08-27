import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME_KEY } from "@/lib/portfolio";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const prefers =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefers);
    document.documentElement.classList.toggle("dark", prefers);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
