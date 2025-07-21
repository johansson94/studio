import type { Job, JobPriority } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Car, MapPin, Truck, Bike, HardHat, AlertTriangle, ChevronsUp, ChevronUp } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: Job;
}

const getStatusClass = (status: Job["status"]) => {
  switch (status) {
    case "New":
      return "bg-blue-500 hover:bg-blue-600";
    case "In Progress":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "Completed":
      return "bg-green-500 hover:bg-green-600";
  }
};

const getVehicleIcon = (type: Job["vehicle"]["type"]) => {
  switch (type) {
    case "Car":
      return <Car className="h-4 w-4" />;
    case "Truck":
      return <Truck className="h-4 w-4" />;
    case "Motorcycle":
      return <Bike className="h-4 w-4" />;
    case "Van":
      return <HardHat className="h-4 w-4" />;
    default:
      return <Car className="h-4 w-4" />;
  }
};

const PriorityIndicator = ({ priority }: { priority: JobPriority }) => {
    switch (priority) {
        case "Hög":
            return <div className="flex items-center gap-1 text-destructive font-semibold">
                <AlertTriangle className="h-4 w-4" /> <span>Hög Prioritet</span>
            </div>
        case "Normal":
            return <div className="flex items-center gap-1 text-amber-600">
                <ChevronsUp className="h-4 w-4" /> <span>Normal Prioritet</span>
            </div>
        case "Låg":
             return <div className="flex items-center gap-1 text-green-600">
                <ChevronUp className="h-4 w-4" /> <span>Låg Prioritet</span>
            </div>
        default:
            return null;
    }
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/job/${job.id}`} className="block h-full">
      <Card className="flex flex-col h-full hover:border-primary transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-lg">{job.id}</CardTitle>
            <Badge
              className={cn(
                "text-white",
                getStatusClass(job.status)
              )}
            >
              {job.status}
            </Badge>
          </div>
          <CardDescription>
            {job.vehicle.make} {job.vehicle.model} - {job.vehicle.licensePlate}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          {job.priority && job.status === "New" && (
            <div className="text-sm">
                <PriorityIndicator priority={job.priority} />
            </div>
          )}
           {job.category && (
              <Badge variant="secondary">{job.category}</Badge>
          )}

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              {getVehicleIcon(job.vehicle.type)}
              <span>{job.vehicle.type}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="font-medium">{job.location}</p>
          </div>

          <p className="text-sm text-muted-foreground pt-2 italic line-clamp-2">
            "{job.description}"
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline" asChild>
            {/* The wrapping Link component makes the button functional */}
            <div className="w-full">View Details</div>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
