import { useTheme } from "@/hooks/theme-context-hook";
import { UserAvatar } from "./user-avatar";
import { Moon, Sun } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="h-14 bg-primary w-full shadow flex items-center p-4">
      <ThemeSetter />
      <div className="select-none absolute text-primary-foreground text-2xl font-bold w-full h-14 top-0 left-0 flex items-center justify-center">
        WeatherWise 🌤️
      </div>
      <div className="w-full"></div>
      <UserAvatar />
    </div>
  );
};

const ThemeSetter = () => {
  const { dark, setDark } = useTheme();
  console.log("Dark", dark)
  return (
    <div
      className="size-10 shrink-0 flex items-center justify-center cursor-pointer text-foreground bg-background rounded-sm z-50"
      onClick={() => setDark(!dark)}
    >
      {dark ? <Moon className="" /> : <Sun className="" />}
    </div>
  );
};
