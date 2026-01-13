import { useRoute } from "wouter";
import { useSchool } from "@/hooks/use-schools";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, School as SchoolIcon, BookOpen, Share2, Star } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function SchoolDetails() {
  const [, params] = useRoute("/data/:id");
  const id = parseInt(params?.id || "0");
  const { data: school, isLoading } = useSchool(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">School Not Found</h2>
        <Link href="/data">
          <Button>Back to List</Button>
        </Link>
      </div>
    );
  }

  const isPublic = !school.type?.toLowerCase().includes("private");

  return (
    <div className="min-h-screen bg-background pb- safe-area font-sans">
      <div className="max-w-md mx-auto min-h-screen bg-background relative flex flex-col">
        
        {/* Header Image/Map Placeholder */}
        <div className="h-48 bg-gray-200 dark:bg-zinc-800 relative">
          <div className={`absolute inset-0 opacity-20 ${isPublic ? 'bg-green-600' : 'bg-blue-600'}`}></div>
          {/* Map Pattern Overlay */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)', 
            backgroundSize: '20px 20px', 
            opacity: 0.1 
          }}></div>
          
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <Link href="/data">
              <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 hover:bg-white text-gray-800">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 hover:bg-white text-gray-800">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Card - overlapping header */}
        <div className="flex-1 -mt-6 rounded-t-[2rem] bg-white dark:bg-background shadow-2xl relative z-10 px-6 pt-8 pb-10">
          
          <div className="flex justify-between items-start mb-2">
            <Badge className={isPublic ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}>
              {school.type || "Unknown Type"}
            </Badge>
            <span className="text-xs font-mono text-gray-400">#{school.schoolId}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {school.name}
          </h1>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            {school.lga ? `${school.lga}, ` : ''}{school.state}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">Level</span>
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{school.level || "N/A"}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <SchoolIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Active</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Location Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Address</span>
                  <span className="font-medium text-right">{school.address || "No address provided"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">LGA</span>
                  <span className="font-medium">{school.lga}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">State</span>
                  <span className="font-medium">{school.state}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Additional Information</h3>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-300">
                <p>This school is registered under the Universal Basic Education Commission (UBEC) database.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/25">
              Contact School
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
