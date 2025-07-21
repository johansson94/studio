import { mockJobs, mockUsers } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  MapPin,
  Truck,
  Bike,
  HardHat,
  Tag,
  Gauge,
  Calendar,
  Wrench,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  UserCircle,
  Phone,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      return <Car className="h-5 w-5 text-muted-foreground" />;
    case "Truck":
      return <Truck className="h-5 w-5 text-muted-foreground" />;
    case "Motorcycle":
      return <Bike className="h-5 w-5 text-muted-foreground" />;
    case "Van":
      return <HardHat className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Car className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  const assignedDriver = job.assignedTo
    ? mockUsers.find((u) => u.id === job.assignedTo)
    : null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            Uppdrag: {job.id}
          </h1>
          <p className="text-muted-foreground mt-1">
            Detaljerad information om bärgningsuppdraget.
          </p>
        </div>
        <Badge className={cn("text-white text-base", getStatusClass(job.status))}>
          {job.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6"/>Kundinformation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>Namn: <strong>{job.customer.name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>Telefon: <strong>{job.customer.phone}</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Fordonsdetaljer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {getVehicleIcon(job.vehicle.type)}
                <span className="text-2xl font-semibold">
                  {job.vehicle.make} {job.vehicle.model}
                </span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>Reg.nr: <strong>{job.vehicle.licensePlate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span>Mätarställning: <strong>{job.vehicle.mileage.toLocaleString()} km</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Rapporterad: <strong>{format(job.reportedAt, "yyyy-MM-dd HH:mm")}</strong></span>
                </div>
                 <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span>Fordonstyp: <strong>{job.vehicle.type}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location and Description Card */}
          <Card>
             <CardHeader>
              <CardTitle>Uppdragsinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="font-medium">{job.location}</div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                        <div className="font-medium">{job.destination}</div>
                    </div>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Beskrivning av händelse</h4>
                    <p className="text-muted-foreground italic">"{job.description}"</p>
                </div>
            </CardContent>
          </Card>

           {/* Actions Taken Card */}
          {job.actionsTaken && job.actionsTaken.length > 0 && (
             <Card>
                <CardHeader>
                  <CardTitle>Vidtagna åtgärder</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                   {job.actionsTaken.map(action => (
                     <Badge key={action} variant="secondary" className="flex items-center gap-2 py-1 px-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{action}</span>
                    </Badge>
                   ))}
                </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column: Driver & Images */}
        <div className="space-y-6">
          {/* Assigned Driver Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5" />Tilldelad Förare</CardTitle>
            </CardHeader>
            <CardContent>
              {assignedDriver ? (
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={assignedDriver.avatar} data-ai-hint="person portrait" />
                    <AvatarFallback>{assignedDriver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{assignedDriver.name}</p>
                    <p className="text-sm text-muted-foreground">{assignedDriver.role}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Ej tilldelad</p>
              )}
            </CardContent>
          </Card>

          {/* Image Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Bilder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Vid ankomst</h4>
                {job.arrivalImage ? (
                   <Image src={job.arrivalImage} alt="Ankomstbild" width={400} height={225} className="rounded-md object-cover aspect-video w-full" data-ai-hint="car breakdown" />
                ) : (
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">Ingen bild</div>
                )}
              </div>
               <div>
                <h4 className="font-medium text-sm mb-2">Vid destination</h4>
                {job.destinationImage ? (
                   <Image src={job.destinationImage} alt="Destinationsbild" width={400} height={225} className="rounded-md object-cover aspect-video w-full" data-ai-hint="car workshop" />
                ) : (
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">Ingen bild</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
