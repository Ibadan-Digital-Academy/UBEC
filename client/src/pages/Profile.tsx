import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Bell, HelpCircle, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { user } = useAuth();
  const menuItems = [
    { icon: Bell, label: "Notifications", badge: "2" },
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help & Support" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-20 font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background relative">
        
        {/* Profile Header */}
        <div className="bg-primary pt-12 pb-20 px-6 rounded-b-[2.5rem] text-center relative mb-12 shadow-lg">
           <h2 className="text-white text-xl font-bold mb-6">My Profile</h2>
           
           <div className="absolute left-1/2 -translate-x-1/2 -bottom-10">
             <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
               <AvatarImage src="https://github.com/shadcn.png" />
               <AvatarFallback className="bg-zinc-200 text-zinc-500 text-xl font-bold">GU</AvatarFallback>
             </Avatar>
           </div>
        </div>

        <div className="text-center mb-8 px-6">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white">{user?.email || "User"}</h3>
          <p className="text-gray-500 text-sm">{user?.email || "guest@example.com"}</p>
        </div>

        <div className="px-6 space-y-3 flex-1">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              className="w-full bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-primary group-hover:bg-green-50 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
          
          <button className="w-full mt-6 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 flex items-center justify-center gap-2 text-red-600 hover:bg-red-100 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        <div className="text-center py-6 text-xs text-gray-400">
          Version 1.0.0
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
