import { Link, useLocation } from "wouter";
import { Home, Map, Database, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Map", icon: Map, path: "/map" },
    { name: "Data", icon: Database, path: "/data" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 pb-safe-area shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto h-16 flex items-center justify-between px-6">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.name} href={item.path} className={cn(
              "flex flex-col items-center justify-center w-16 transition-colors duration-200",
              isActive 
                ? "text-primary" 
                : "text-gray-400 hover:text-primary dark:text-zinc-500 dark:hover:text-primary"
            )}>
              <item.icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-transform duration-200",
                  isActive ? "scale-110" : "scale-100"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
