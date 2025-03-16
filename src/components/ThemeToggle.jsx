"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-4 p-4 md:space-x-6 lg:space-x-8 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <Sun
            className={`h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              theme === "dark" ? "text-gray-400 scale-75 rotate-12" : "text-foreground scale-100 rotate-0"
            }`}
          />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle theme"
            className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110"
          />
          <Moon
            className={`h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              theme === "light" ? "text-gray-400 scale-75 rotate-12" : "text-foreground scale-100 rotate-0"
            }`}
          />
        </div>
        <div className="text-center text-white mt-8">
          <h1 className="text-2xl md:text-4xl lg:text-6xl">Welcome to Our Website</h1>
          <p className="mt-4 text-lg md:text-xl lg:text-2xl">This is a sample text on the background</p>
        </div>
      </div>
    </div>
  );
}