import { useSchools } from "@/hooks/use-schools";
import { SchoolCard } from "@/components/SchoolCard";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus } from "lucide-react";

export default function Home() {
  const { data, isLoading } = useSchools({ limit: 5 });
  
  // Static stats for demonstration based on the design
  const stats = [
    { label: "Total Schools", value: "12,450", color: "border-primary" },
    { label: "States Covered", value: "36 + FCT", color: "border-yellow-500" }
  ];

  const categories = [
    { label: "All Schools", active: true },
    { label: "Primary", active: false },
    { label: "JSS", active: false },
    { label: "Special Needs", active: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-background shadow-2xl overflow-hidden">
        
        <Header />

        <main className="flex-1 overflow-y-auto pb-24 pt-6 px-6 wave-bg">
          {/* Categories Horizontal Scroll */}
          <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2 mb-4 -mx-6 px-6">
            {categories.map((cat) => (
              <Button
                key={cat.label}
                variant={cat.active ? "default" : "outline"}
                className={`rounded-full px-6 font-medium whitespace-nowrap shadow-sm h-9 ${
                  cat.active 
                    ? "bg-primary hover:bg-primary/90 text-white border-primary" 
                    : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-zinc-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                   // In a real app, this would filter the list below
                   window.location.href = `/data?type=${cat.label === 'All Schools' ? '' : cat.label}`;
                }}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className={`bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-sm border-l-4 ${stat.color} hover:shadow-md transition-shadow`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Listings Header */}
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Listings</h3>
            <Link href="/data" className="text-sm text-primary font-bold hover:underline mb-1">
              View All
            </Link>
          </div>

          {/* Listings */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm animate-pulse flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-zinc-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((school) => (
                <Link key={school.id} href={`/data/${school.id}`}>
                  <div className="mb-4">
                    <SchoolCard school={school} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-10 bg-white/50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No schools found</p>
              </div>
            )}
          </div>
          
          <div className="h-10"></div>
        </main>

        {/* Floating Action Button */}
        <Button 
          className="absolute bottom-24 right-6 w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary-dark text-white p-0 z-20 transition-transform hover:scale-105 active:scale-95"
          onClick={() => alert("Add School functionality coming soon!")}
        >
          <Plus className="w-8 h-8" />
        </Button>

        <BottomNav />
      </div>
    </div>
  );
}
