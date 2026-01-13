import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background relative h-screen">
        <Header showSearch={false} title="School Map" subtitle="Visualize school distribution" />
        
        <div className="flex-1 bg-gray-200 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center">
          {/* Map Placeholder Graphic */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', 
            backgroundSize: '10px 10px' 
          }}></div>
          
          <div className="text-center p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-2xl shadow-xl max-w-xs mx-4 z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Interactive Map</h3>
            <p className="text-sm text-gray-500 mb-6">
              The geospatial visualization of schools across the 36 states is coming soon.
            </p>
            <Button className="w-full">Notify Me</Button>
          </div>

          {/* Decorative pins */}
          <div className="absolute top-1/4 left-1/4 animate-bounce duration-[2000ms]">
            <MapPin className="text-red-500 w-8 h-8 drop-shadow-md" fill="currentColor" />
          </div>
          <div className="absolute top-1/2 right-1/4 animate-bounce duration-[2500ms] delay-75">
            <MapPin className="text-blue-500 w-8 h-8 drop-shadow-md" fill="currentColor" />
          </div>
          <div className="absolute bottom-1/3 left-1/2 animate-bounce duration-[1800ms] delay-150">
            <MapPin className="text-green-500 w-8 h-8 drop-shadow-md" fill="currentColor" />
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
