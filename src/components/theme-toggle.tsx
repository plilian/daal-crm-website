import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "تغییر به تم روشن" : "تغییر به تم تیره"}
      title={theme === "dark" ? "تم روشن" : "تم تیره"}
      className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
