import { School } from "@shared/schema";
import { School as SchoolIcon, BookOpen, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SchoolCardProps {
  school: School;
  onClick?: () => void;
}

export function SchoolCard({ school, onClick }: SchoolCardProps) {
  const isPrivate = school.type?.toLowerCase().includes("private");
  const isPublic = !isPrivate;

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-0.5 border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer"
    >
      <div className="flex gap-4 items-start">
        <div className={cn(
          "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
          isPublic 
            ? "bg-green-50 text-primary dark:bg-green-900/20 dark:text-green-400" 
            : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        )}>
          {school.level?.toLowerCase().includes("primary") ? (
            <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
          ) : (
            <SchoolIcon className="w-6 h-6 md:w-7 md:h-7" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-gray-800 dark:text-white text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {school.name}
            </h4>
            <Badge variant="outline" className={cn(
              "text-[10px] h-5 px-1.5 font-bold uppercase tracking-wider border-0",
              isPublic 
                ? "bg-green-100 text-primary dark:bg-green-900/40" 
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/40"
            )}>
              {school.type || "Unknown"}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {school.lga ? `${school.lga}, ` : ''}{school.state}
            </span>
          </p>
          
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {school.level && (
              <span className="text-[10px] bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md font-medium">
                {school.level}
              </span>
            )}
            {school.schoolId && (
              <span className="text-[10px] text-gray-400 font-mono">
                ID: #{school.schoolId}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
