import { Bell, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onSearch?: (term: string) => void;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ onSearch, showSearch = true, title = "Find Schools", subtitle = "Access the Basic Education School List" }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Navigate to data page with search
      setLocation(`/data?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-primary dark:bg-zinc-900 pb-8 pt-6 px-6 rounded-b-[2rem] shadow-xl relative z-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="text-white font-medium text-sm">
          {isLoading ? "Loading..." : (user?.email || "Guest")}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center shadow-lg">
            {/* Coat of Arms of Nigeria */}
            <img 
              alt="Coat of Arms" 
              className="w-full h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRfyvuRTmuLf64FIFiym15A-v4t9Y-BQbOWSuV2rTErB3xgD06z9VuIlMothwEaoT4x3kZIyiyrstCOi5C8YIJ5iPU1XMiq9g8olUYo3V9pLmIcGqgrZZw94SaE77mfY_1nTM-QjIWwBbAmpyy4MSHcyUGs7rnvDQTRSyhbtACc5SkjV9Sup7lWAgqqW2rWQfJouxNXx_Svvj_PM365kiP1zQLPQtGNHpCTtfr4OSG2BVc-naC169bo7EtOfdhmfusiD5M1H2T4PLJ"
            />
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide drop-shadow-md">UBEC</h1>
        </div>

        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white rounded-full h-10 w-10 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary"></span>
        </Button>
      </div>

      {/* Hero Content */}
      <div className="space-y-6 relative z-10">
        <div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-1 drop-shadow-sm">{title}</h2>
          <p className="text-green-100 text-sm font-medium opacity-90">{subtitle}</p>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              className="w-full py-6 pl-12 pr-12 bg-white dark:bg-zinc-800 border-none shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              placeholder="Search by name, state or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button 
                type="button"
                size="sm" 
                className="bg-primary hover:bg-primary-dark text-white h-9 w-9 p-0 rounded-lg shadow-sm transition-transform active:scale-95"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
