
'use client'

import { mockJobs, mockUsers } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  PlayCircle,
  Flag,
  Check,
  KeyRound,
  FileText,
  Clock,
  ShieldAlert,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Send,
  Loader2,
  ReceiptText,
  Calculator,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Job, JobLogEntry, VehicleProblem } from "@/lib/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateReceiptMessage } from "@/ai/flows/generate-receipt-message";
import React from "react";
import { generateTripReport } from "@/ai/flows/generate-trip-report";

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

const getLogIcon = (event: JobLogEntry["event"]) => {
    switch (event) {
        case 'Job Started': return <PlayCircle className="h-4 w-4 text-blue-500" />;
        case 'Arrived at Site': return <Flag className="h-4 w-4 text-yellow-500" />;
        case 'Arrived at Destination': return <Check className="h-4 w-4 text-green-500" />;
        case 'Job Completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
}

const vehicleProblems: { id: VehicleProblem; label: string }[] = [
    { id: "Engine Failure", label: "Motorfel" },
    { id: "Flat Tire", label: "Punktering" },
    { id: "Battery Issue", label: "Batteriproblem" },
    { id: "Brake Failure", label: "Bromsfel" },
    { id: "Lockout", label: "Låsöppning" },
    { id: "Accident", label: "Olycka" },
];


export default function JobDetailPage({ params: { id } }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === id);
  const { toast } = useToast();
  const [isSending, setIsSending] = React.useState(false);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const deductibleRef = React.useRef<HTMLInputElement>(null);
  const otherFeesRef = React.useRef<HTMLInputElement>(null);


  if (!job) {
    notFound();
  }

  const assignedDriver = job.assignedTo
    ? mockUsers.find((u) => u.id === job.assignedTo)
    : null;

  const handleSendReceipt = async () => {
    setIsSending(true);
    try {
      const result = await generateReceiptMessage({
        jobId: job.id,
        customerName: job.customer.name,
        vehicleMake: job.vehicle.make,
        vehicleModel: job.vehicle.model,
        destination: job.destination,
        destinationNotes: job.destinationNotes,
        keysLocation: job.keysLocation,
        costs: job.costs,
      });
      console.log("Generated message:", result.message);
      toast({
        title: "Kvitto skickat (simulerat)",
        description: "Ett meddelande har genererats för kunden.",
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte generera meddelande.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsCalculating(true);
    try {
      const driver = mockUsers.find(u => u.id === job.assignedTo);
      const result = await generateTripReport({
        startLocation: driver?.assignedVehicle ? `${driver.name}s startposition` : "Bärgningsstation, Stockholm",
        breakdownLocation: job.location,
        destination: job.destination,
      });

      if (deductibleRef.current) {
        deductibleRef.current.value = result.costs.deductible.toString();
      }
      if (otherFeesRef.current) {
        otherFeesRef.current.value = result.costs.otherFees.toString();
      }

      toast({
        title: "Reserapport Genererad",
        description: `Beräknad sträcka: ${result.distance}. Kostnader har fyllts i.`,
      });

    } catch (e) {
       console.error(e);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte generera reserapport.",
      });
    } finally {
      setIsCalculating(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">
            Uppdrag: {job.id}
          </h1>
          <p className="text-muted-foreground mt-1">
            Detaljerad information och status för bärgningsuppdraget.
          </p>
        </div>
        <Badge className={cn("text-white text-base", getStatusClass(job.status))}>
          {job.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Status & Actions Card */}
          <Card>
            <CardHeader>
                <CardTitle>Status & Åtgärder</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {job.status === 'New' && <Button><PlayCircle /> Starta uppdrag</Button>}
                {job.status === 'In Progress' && <Button variant="outline"><Flag /> Anlänt till plats</Button>}
                {job.status === 'In Progress' && <Button variant="outline"><Check /> Klar på plats</Button>}
                {job.status === 'In Progress' && <Button variant="outline"><Truck /> Bärga till verkstad</Button>}
                {job.status === 'Completed' ? (
                     <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                        <CheckCircle2 /> Uppdrag slutfört
                    </div>
                ) : (
                    job.status !== 'New' && <Button><CheckCircle2 /> Slutför & Avsluta uppdrag</Button>
                )}
            </CardContent>
          </Card>
          
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

            {/* On-Site Assessment Card (for driver) */}
            {job.status === 'In Progress' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bedömning på plats</CardTitle>
                        <CardDescription>Fyll i efter att du anlänt och inspekterat fordonet.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                             <Label className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4"/>Problem som identifierats</Label>
                             <div className="grid grid-cols-2 gap-3">
                                {vehicleProblems.map(item => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <Checkbox id={`problem-${item.id}`} />
                                        <Label htmlFor={`problem-${item.id}`} className="font-normal">{item.label}</Label>
                                    </div>
                                ))}
                             </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label htmlFor="tma-used" className="flex items-center gap-2"><ShieldAlert className="h-4 w-4"/>TMA-bil använd?</Label>
                            <Switch id="tma-used" />
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button>Spara bedömning</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Driver Diagnosis Display Card */}
          {(job.driverDiagnosis && job.driverDiagnosis.length > 0 || job.tmaUsed !== undefined) && (
             <Card>
                <CardHeader>
                  <CardTitle>Förarens bedömning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {job.driverDiagnosis && job.driverDiagnosis.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><ClipboardCheck className="h-4 w-4"/>Identifierade problem</h4>
                            <div className="flex flex-wrap gap-2">
                            {job.driverDiagnosis.map(problem => (
                                <Badge key={problem} variant="secondary" className="text-base">{problem}</Badge>
                            ))}
                            </div>
                        </div>
                    )}
                     {job.tmaUsed !== undefined && (
                         <div>
                             <h4 className="font-semibold mb-2 flex items-center gap-2"><ShieldAlert className="h-4 w-4"/>TMA-bil användes</h4>
                             <p className="text-sm p-3 bg-secondary rounded-md">{job.tmaUsed ? "Ja" : "Nej"}</p>
                        </div>
                     )}
                </CardContent>
            </Card>
          )}

           {/* Costings Card */}
            {job.status !== 'New' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Kostnader & Betalning</CardTitle>
                        <CardDescription>Fyll i kostnader för uppdraget innan det slutförs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Button variant="outline" onClick={handleGenerateReport} disabled={isCalculating} className="w-full mb-4">
                          {isCalculating ? <Loader2 className="animate-spin" /> : <Calculator />}
                          Generera Reserapport & Kostnad
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deductible" className="flex items-center gap-2"><ReceiptText className="h-4 w-4"/>Självrisk (SEK)</Label>
                                <Input ref={deductibleRef} id="deductible" type="number" placeholder="0" defaultValue={job.costs?.deductible} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="other-fees" className="flex items-center gap-2"><DollarSign className="h-4 w-4"/>Övriga avgifter (SEK)</Label>
                                <Input ref={otherFeesRef} id="other-fees" type="number" placeholder="0" defaultValue={job.costs?.otherFees}/>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="paid-on-site" defaultChecked={job.costs?.paidOnSite} />
                            <Label htmlFor="paid-on-site">Betalat på plats?</Label>
                        </div>
                    </CardContent>
                     <CardFooter className="flex justify-between items-center">
                        <Button>Spara kostnader</Button>
                        <Button variant="outline" onClick={handleSendReceipt} disabled={isSending}>
                            {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                            Skicka kvitto till kund
                        </Button>
                    </CardFooter>
                </Card>
            )}

           {/* Completion Details Card */}
          {job.status === 'Completed' && job.costs && (
             <Card>
                <CardHeader>
                  <CardTitle>Slutfört & Betalat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Självrisk: <strong>{job.costs.deductible} SEK</strong></div>
                    <div>Övriga avgifter: <strong>{job.costs.otherFees} SEK</strong></div>
                    <div className="font-bold">Totalt: <strong>{job.costs.total} SEK</strong></div>
                    <div>Status: <strong>{job.costs.paidOnSite ? 'Betalat på plats' : 'Faktureras'}</strong></div>
                  </div>
                  <Separator/>
                  <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4"/>Anteckningar</Label>
                      <p className="text-sm p-3 bg-secondary rounded-md">{job.destinationNotes || "Inga anteckningar."}</p>
                  </div>
                  <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-muted-foreground"><KeyRound className="h-4 w-4"/>Nycklar</Label>
                       <p className="text-sm p-3 bg-secondary rounded-md">{job.keysLocation || "Ej specificerat."}</p>
                  </div>
                </CardContent>
            </Card>
          )}

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

          {/* This is a temporary card to add the completion notes, in a real app this would be part of the 'Complete Job' flow */}
          {job.status === 'In Progress' && (
            <Card>
                <CardHeader>
                    <CardTitle>Slutför uppdraget</CardTitle>
                    <CardDescription>Fyll i detaljer om avlämning innan du avslutar uppdraget.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="destination-notes">Anteckningar om avlämning</Label>
                        <Textarea id="destination-notes" placeholder="t.ex. Bilen parkerad på kundparkeringen..." />
                    </div>
                     <div>
                        <Label htmlFor="keys-location">Nycklarnas placering</Label>
                        <Textarea id="keys-location" placeholder="t.ex. I verkstadens nyckelskåp..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Spara anteckningar</Button>
                </CardFooter>
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
                  <div className="text-sm">
                    <p className="font-semibold">{assignedDriver.name}</p>
                    <p className="text-muted-foreground">{assignedDriver.role}</p>
                     {assignedDriver.assignedVehicle && (
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <Truck className="h-4 w-4" /> {assignedDriver.assignedVehicle.licensePlate}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Ej tilldelad</p>
              )}
            </CardContent>
          </Card>
          
          {/* Logbook Card */}
          {job.log && job.log.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Loggbok</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {job.log.map((entry, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="mt-1">{getLogIcon(entry.event)}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{entry.event}</p>
                                    <p className="text-xs text-muted-foreground">{format(entry.timestamp, 'yyyy-MM-dd HH:mm')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          )}

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
