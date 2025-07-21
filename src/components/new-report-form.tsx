"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Car, HardHat, Bike, Truck, Camera, ImagePlus, CheckCircle2, Phone, UserCircle, Users, Sparkles, Loader2, Search, Building, Fuel, GitCommitHorizontal, Cog } from "lucide-react";
import type { ActionTaken } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import { identifyVehicle } from "@/ai/flows/identify-vehicle";
import { Separator } from "./ui/separator";
import { getVehicleInfoByLicensePlate } from "@/ai/tools/vehicle-lookup-tool";

const actions: { id: ActionTaken; label: string }[] = [
    { id: "Towing", label: "Bärgning" },
    { id: "Jump Start", label: "Starthjälp" },
    { id: "Tire Change", label: "Däckbyte" },
    { id: "Unlocking", label: "Låsöppning" },
    { id: "Fuel Delivery", label: "Bränsleleverans" },
];

const formSchema = z.object({
  customerName: z.string().min(2, "Kundnamn måste vara minst 2 tecken."),
  customerPhone: z.string().min(5, "Telefonnummer måste vara minst 5 tecken."),
  vehicleMake: z.string().min(2, "Tillverkare måste vara minst 2 tecken."),
  vehicleModel: z.string().min(1, "Modell är obligatoriskt."),
  licensePlate: z
    .string()
    .min(3, "Registreringsnummer måste vara minst 3 tecken.")
    .max(10),
  vin: z.string().optional(),
  mileage: z.coerce.number().min(0, "Mätarställning kan inte vara negativ."),
  vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Van"]),
  engine: z.string().optional(),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid"]).optional(),
  drivetrain: z.enum(["FWD", "RWD", "AWD"]).optional(),
  location: z.string().min(5, "Plats måste vara minst 5 tecken."),
  destination: z.string().min(5, "Destination måste vara minst 5 tecken."),
  description: z.string().min(10, "Beskrivning måste vara minst 10 tecken."),
  assignedTo: z.string().optional(),
  insuranceCompany: z.string().optional(),
  arrivalImage: z.string().optional(),
  destinationImage: z.string().optional(),
  actionsTaken: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewReportForm() {
  const { toast } = useToast();
  const [arrivalImagePreview, setArrivalImagePreview] = useState<string | null>(null);
  const [destinationImagePreview, setDestinationImagePreview] = useState<string | null>(null);
  const [vehicleIdImage, setVehicleIdImage] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isFetchingPlate, setIsFetchingPlate] = useState(false);


  const arrivalImageRef = useRef<HTMLInputElement>(null);
  const destinationImageRef = useRef<HTMLInputElement>(null);
  const vehicleIdImageRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      vehicleMake: "",
      vehicleModel: "",
      licensePlate: "",
      vin: "",
      mileage: 0,
      location: "",
      destination: "",
      description: "",
      actionsTaken: [],
      insuranceCompany: "",
      engine: "",
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "arrivalImage" | "destinationImage" | "vehicleId",
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setter(dataUrl);
        if (field !== 'vehicleId') {
          form.setValue(field, dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyVehicle = async () => {
    if (!vehicleIdImage) {
      toast({
        variant: "destructive",
        title: "Ingen bild vald",
        description: "Ladda upp en bild på fordonet först.",
      });
      return;
    }
    setIsIdentifying(true);
    try {
      const result = await identifyVehicle({ photoDataUri: vehicleIdImage });
      form.setValue("vehicleMake", result.make);
      form.setValue("vehicleModel", result.model);
      toast({
        title: "Fordon identifierat!",
        description: `Fälten för ${result.make} ${result.model} har fyllts i.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Kunde inte identifiera fordonet",
        description: "Försök med en annan bild eller fyll i fälten manuellt.",
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleFetchVehicleInfo = async () => {
    const licensePlate = form.getValues("licensePlate");
    if (!licensePlate) {
       toast({
        variant: "destructive",
        title: "Registreringsnummer saknas",
        description: "Vänligen fyll i ett registreringsnummer.",
      });
      return;
    }
    setIsFetchingPlate(true);
    try {
      const result = await getVehicleInfoByLicensePlate({ licensePlate });
      if (result) {
        form.setValue("vehicleMake", result.make);
        form.setValue("vehicleModel", result.model);
        form.setValue("vin", result.vin);
        form.setValue("insuranceCompany", result.insuranceCompany);
        form.setValue("engine", result.engine);
        form.setValue("fuelType", result.fuelType);
        form.setValue("drivetrain", result.drivetrain);
         toast({
          title: "Fordonsinformation hämtad!",
          description: `Information för ${result.make} ${result.model} har fyllts i.`,
        });
      } else {
         toast({
            variant: "destructive",
            title: "Fordon hittades inte",
            description: "Kontrollera registreringsnumret och försök igen.",
        });
      }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Kunde inte hämta information",
            description: "Ett oväntat fel uppstod. Försök igen.",
        });
    } finally {
        setIsFetchingPlate(false);
    }
  }


  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Rapport skickad",
      description: `Uppdrag för ${values.vehicleMake} ${values.vehicleModel} har skapats.`,
    });
    form.reset();
    setArrivalImagePreview(null);
    setDestinationImagePreview(null);
    setVehicleIdImage(null);
  }
  
  const drivers = mockUsers.filter(user => user.role === 'Driver');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6" /> Kundinformation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Namn</FormLabel>
                        <FormControl>
                          <Input placeholder="t.ex. Kalle Anka" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefonnummer</FormLabel>
                        <FormControl>
                          <Input placeholder="t.ex. 070-1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Car className="h-6 w-6" /> Fordons- & Uppdragsdetaljer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormLabel>Identifiera fordon med bild</FormLabel>
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <Input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={vehicleIdImageRef}
                      onChange={(e) => handleImageChange(e, "vehicleId", setVehicleIdImage)}
                    />
                    <Button type="button" variant="outline" onClick={() => vehicleIdImageRef.current?.click()} className="w-full sm:w-auto">
                      <ImagePlus className="mr-2 h-4 w-4" /> Ladda upp bild
                    </Button>
                    <Button type="button" onClick={handleIdentifyVehicle} disabled={!vehicleIdImage || isIdentifying} className="w-full sm:w-auto">
                      {isIdentifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                      Identifiera med AI
                    </Button>
                  </div>
                  {vehicleIdImage && (
                    <div className="mt-2">
                       <img src={vehicleIdImage} alt="Förhandsgranskning av fordon" className="rounded-md aspect-video object-cover w-full max-w-sm" />
                    </div>
                  )}
                </div>

                <Separator className="my-6"/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="licensePlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registreringsnummer</FormLabel>
                           <div className="flex gap-2">
                             <FormControl>
                                <Input placeholder="t.ex. REG 123" {...field} />
                              </FormControl>
                              <Button type="button" variant="secondary" onClick={handleFetchVehicleInfo} disabled={isFetchingPlate}>
                                {isFetchingPlate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                <span className="sr-only">Hämta information</span>
                              </Button>
                           </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleMake"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tillverkare</FormLabel>
                          <FormControl>
                            <Input placeholder="t.ex. Volvo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modell</FormLabel>
                          <FormControl>
                            <Input placeholder="t.ex. XC60" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VIN-nummer</FormLabel>
                          <FormControl>
                            <Input placeholder="Fylls i automatiskt..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mätarställning (km)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="t.ex. 12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fordonstyp</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Välj en fordonstyp" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Car"><Car className="inline-block mr-2 h-4 w-4" /> Bil</SelectItem>
                              <SelectItem value="Motorcycle"><Bike className="inline-block mr-2 h-4 w-4" /> Motorcykel</SelectItem>
                              <SelectItem value="Truck"><Truck className="inline-block mr-2 h-4 w-4" /> Lastbil</SelectItem>
                              <SelectItem value="Van"><HardHat className="inline-block mr-2 h-4 w-4" /> Skåpbil</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="insuranceCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Försäkringsbolag</FormLabel>
                          <FormControl>
                             <div className="relative">
                               <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <Input placeholder="t.ex. If, Trygg-Hansa..." {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="engine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motor/Effekt</FormLabel>
                          <FormControl>
                            <div className="relative">
                               <Cog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <Input placeholder="t.ex. B4 Mild-Hybrid" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="fuelType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bränsletyp</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                 <div className="flex items-center gap-2">
                                    <Fuel className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Välj bränsletyp" />
                                 </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Gasoline">Bensin</SelectItem>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="Electric">El</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="drivetrain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drivning</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Välj drivning" />
                                 </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FWD">Framhjulsdrift (FWD)</SelectItem>
                              <SelectItem value="RWD">Bakhjulsdrift (RWD)</SelectItem>
                              <SelectItem value="AWD">Fyrhjulsdrift (AWD)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Haveriplats</FormLabel>
                          <FormControl>
                            <Input placeholder="t.ex. E4, Stockholm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <Input placeholder="t.ex. Mekonomen, Södertälje" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                 <Separator className="my-6"/>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beskrivning av händelse</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv problemet med fordonet..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>
          </div>

          {/* Right Column: Actions & Assignment */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Tilldela Förare</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Välj en förare</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tilldela uppdraget..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unassigned">Ej tilldelad</SelectItem>
                          {drivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Vidtagna åtgärder</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormDescription className="mb-4">
                    Fylls i av föraren på plats.
                  </FormDescription>
                  <FormField
                    control={form.control}
                    name="actionsTaken"
                    render={() => (
                      <FormItem className="space-y-3">
                        {actions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="actionsTaken"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </FormItem>
                    )}
                  />
                </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5"/> Bilder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    {/* Arrival Image */}
                    <div className="space-y-2">
                        <FormLabel>Bild vid ankomst</FormLabel>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={arrivalImageRef} 
                            onChange={(e) => handleImageChange(e, "arrivalImage", setArrivalImagePreview)}
                        />
                        <Button type="button" variant="outline" onClick={() => arrivalImageRef.current?.click()} className="w-full">
                            <ImagePlus className="mr-2 h-4 w-4"/> Ladda upp bild
                        </Button>
                        {arrivalImagePreview && <img src={arrivalImagePreview} alt="Förhandsgranskning ankomst" className="mt-2 rounded-md aspect-video object-cover w-full" />}
                    </div>

                    {/* Destination Image */}
                    <div className="space-y-2">
                       <FormLabel>Bild vid destination</FormLabel>
                       <Input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={destinationImageRef} 
                            onChange={(e) => handleImageChange(e, "destinationImage", setDestinationImagePreview)}
                        />
                        <Button type="button" variant="outline" onClick={() => destinationImageRef.current?.click()} className="w-full">
                            <ImagePlus className="mr-2 h-4 w-4"/> Ladda upp bild
                        </Button>
                       {destinationImagePreview && <img src={destinationImagePreview} alt="Förhandsgranskning destination" className="mt-2 rounded-md aspect-video object-cover w-full" />}
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Skapa uppdrag</Button>
        </div>
      </form>
    </Form>
  );
}
