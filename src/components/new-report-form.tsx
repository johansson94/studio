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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, HardHat, Bike, Truck, Camera, ImagePlus, CheckCircle2 } from "lucide-react";
import type { ActionTaken } from "@/lib/types";

const actions: { id: ActionTaken; label: string }[] = [
    { id: "Towing", label: "Bärgning" },
    { id: "Jump Start", label: "Starthjälp" },
    { id: "Tire Change", label: "Däckbyte" },
    { id: "Unlocking", label: "Låsöppning" },
    { id: "Fuel Delivery", label: "Bränsleleverans" },
];

const formSchema = z.object({
  vehicleMake: z.string().min(2, "Tillverkare måste vara minst 2 tecken."),
  vehicleModel: z.string().min(1, "Modell är obligatoriskt."),
  licensePlate: z
    .string()
    .min(3, "Registreringsnummer måste vara minst 3 tecken.")
    .max(10),
  mileage: z.coerce.number().min(0, "Mätarställning kan inte vara negativ."),
  vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Van"]),
  location: z.string().min(5, "Plats måste vara minst 5 tecken."),
  destination: z.string().min(5, "Destination måste vara minst 5 tecken."),
  description: z.string().min(10, "Beskrivning måste vara minst 10 tecken."),
  arrivalImage: z.string().optional(),
  destinationImage: z.string().optional(),
  actionsTaken: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewReportForm() {
  const { toast } = useToast();
  const [arrivalImagePreview, setArrivalImagePreview] = useState<string | null>(null);
  const [destinationImagePreview, setDestinationImagePreview] = useState<string | null>(null);

  const arrivalImageRef = useRef<HTMLInputElement>(null);
  const destinationImageRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleMake: "",
      vehicleModel: "",
      licensePlate: "",
      mileage: 0,
      location: "",
      destination: "",
      description: "",
      actionsTaken: [],
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "arrivalImage" | "destinationImage",
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setter(dataUrl);
        form.setValue(field, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Rapport skickad",
      description: `Uppdrag för ${values.vehicleMake} ${values.vehicleModel} har skapats.`,
    });
    form.reset();
    setArrivalImagePreview(null);
    setDestinationImagePreview(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Vehicle & Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold">Fordonsdetaljer</h3>
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
                      name="licensePlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registreringsnummer</FormLabel>
                          <FormControl>
                            <Input placeholder="t.ex. REG 123" {...field} />
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
                    <h3 className="font-headline text-lg font-semibold">Uppdragsdetaljer</h3>
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
                              rows={8}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Actions & Images */}
          <div className="space-y-8">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Vidtagna åtgärder</h3>
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
                    </div>
                </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-6">
                 <div>
                    <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2"><Camera className="h-5 w-5"/> Bilder</h3>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Skicka rapport</Button>
        </div>
      </form>
    </Form>
  );
}
