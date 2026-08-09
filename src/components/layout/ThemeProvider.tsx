"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({
  theme: "dark",
  toggle: () => {},
});

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerTheme(): Theme {
  return "dark";
}

function subscribeToThemeChange(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key !== "theme") return;
    const theme = event.newValue === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    onChange();
  }

  window.addEventListener("themechange", onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("themechange", onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getTheme, getServerTheme);

  const toggle = useCallback(() => {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
