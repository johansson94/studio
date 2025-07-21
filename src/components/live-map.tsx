"use client";

import type { User, Job } from "@/lib/types";
import Image from "next/image";
import { Truck, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LiveMapProps {
  drivers: User[];
  jobs: Job[];
}

// Define the geographical boundaries of the map image.
// These are rough coordinates for the Stockholm area.
const mapBounds = {
  north: 60.0, 
  south: 59.2,
  west: 17.5,
  east: 18.5,
};

// Function to convert latitude/longitude to pixel coordinates (top/left percentages)
const getPositionOnMap = (lat: number, lng: number) => {
  const top = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
  const left = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;

  // Clamp values to be within 0-100
  const clampedTop = Math.max(0, Math.min(100, top));
  const clampedLeft = Math.max(0, Math.min(100, left));

  return { top: `${clampedTop}%`, left: `${clampedLeft}%` };
};

export function LiveMap({ drivers, jobs }: LiveMapProps) {
  return (
    <TooltipProvider>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-sm">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Map of Stockholm"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="city map"
        />

        {/* Render Drivers */}
        {drivers.map((driver) => {
          if (!driver.position) return null;
          const { top, left } = getPositionOnMap(driver.position.lat, driver.position.lng);
          return (
            <Tooltip key={driver.id}>
              <TooltipTrigger asChild>
                <div
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ top, left }}
                >
                  <div className="relative">
                    <Truck className="h-8 w-8 text-primary-foreground bg-primary p-1.5 rounded-full shadow-lg" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{driver.name}</p>
                <p className="text-sm text-muted-foreground">Status: Tillgänglig</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Render New Jobs */}
        {jobs.map((job) => {
          const { top, left } = getPositionOnMap(job.position.lat, job.position.lng);
          return (
            <Tooltip key={job.id}>
              <TooltipTrigger asChild>
                <div
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ top, left }}
                >
                  <AlertTriangle className="h-8 w-8 text-destructive-foreground fill-destructive animate-pulse" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Nytt Uppdrag: {job.id}</p>
                <p className="text-sm text-muted-foreground">{job.location}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
