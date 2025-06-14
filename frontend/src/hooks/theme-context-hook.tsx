import { cn } from "@/lib/utils";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type themeContextType = {
  dark: boolean;
  setDark: Dispatch<SetStateAction<boolean>>;
};
const themeContext = createContext<themeContextType>(null as any);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(false);
  return (
    <themeContext.Provider value={{ dark, setDark }}>
      <div className={cn(dark ? "dark" : "", "contents")}>{children}</div>
    </themeContext.Provider>
  );
};

export const useTheme = () => useContext(themeContext);
