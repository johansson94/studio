import type { Job, Kpi, User } from "@/lib/types";
import { ClipboardList, CheckCircle, Clock, Truck } from "lucide-react";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Anna Svensson",
    role: "Dispatcher",
    avatar: "https://placehold.co/100x100.png"
  },
  {
    id: "user-2",
    name: "Erik Johansson",
    role: "Driver",
    avatar: "https://placehold.co/100x100.png",
    position: { lat: 59.33258, lng: 18.0649 }, // Stockholm City
    assignedVehicle: {
      licensePlate: "TRW 111",
      model: "Scania R450",
    }
  },
  {
    id: "user-3",
    name: "Maria Nilsson",
    role: "Driver",
    avatar: "https://placehold.co/100x100.png",
    position: { lat: 59.8586, lng: 17.6389 }, // Uppsala
    assignedVehicle: {
      licensePlate: "TRW 222",
      model: "Volvo FH16",
    }
  },
  {
    id: "user-4",
    name: "Lars Andersson",
    role: "Dispatcher",
    avatar: "https://placehold.co/100x100.png"
  },
   {
    id: "user-5",
    name: "Sofia Karlsson",
    role: "Driver",
    avatar: "https://placehold.co/100x100.png",
    position: { lat: 59.6519, lng: 17.9383 }, // Arlanda
     assignedVehicle: {
      licensePlate: "TRW 333",
      model: "Mercedes Actros",
    }
  }
];

export const mockJobs: Job[] = [
  {
    id: "RA-8463",
    customer: { name: "Kalle Anka", phone: "070-1234567" },
    vehicle: {
      make: "Volvo",
      model: "XC60",
      licensePlate: "REG 123",
      type: "Car",
      mileage: 123456
    },
    location: "E4, Stockholm",
    position: { lat: 59.3498, lng: 18.0291 }, // Near Vasastan
    destination: "Mekonomen, Södertälje",
    description: "Engine failure, car won't start. Blocking right lane.",
    status: "New",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    assignedTo: "user-2",
    actionsTaken: ["Towing"],
    driverDiagnosis: ["Engine Failure"],
    tmaUsed: true,
    log: [
      { event: 'Job Reported', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) }
    ]
  },
  {
    id: "RA-8464",
    customer: { name: "Musse Pigg", phone: "070-2345678" },
    vehicle: {
      make: "Audi",
      model: "A4",
      licensePlate: "AUD 456",
      type: "Car",
      mileage: 89012
    },
    location: "Drottninggatan 5, Uppsala",
    position: { lat: 59.8581, lng: 17.6465 }, // Uppsala Central
    destination: "Vianor, Uppsala",
    description: "Flat tire, requires towing to the nearest workshop.",
    status: "In Progress",
    reportedAt: new Date(new Date().setHours(new Date().getHours() - 3)),
    assignedTo: "user-3",
    actionsTaken: ["Tire Change", "Towing"],
    driverDiagnosis: ["Flat Tire"],
    tmaUsed: false,
    arrivalImage: 'https://placehold.co/600x400.png',
    log: [
      { event: 'Job Reported', timestamp: new Date(new Date().setHours(new Date().getHours() - 3)) },
      { event: 'Job Started', timestamp: new Date(new Date().setHours(new Date().getHours() - 2.5)) },
      { event: 'Arrived at Site', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)) }
    ]
  },
  {
    id: "RA-8465",
    customer: { name: "Långben", phone: "070-3456789" },
    vehicle: {
      make: "Scania",
      model: "R-series",
      licensePlate: "TRU 789",
      type: "Truck",
      mileage: 450678
    },
    location: "Rv70, Enköping",
    position: { lat: 59.6364, lng: 17.0788 }, // Enköping
    destination: "Scania Service, Västerås",
    description: "Brake system malfunction. Heavy vehicle recovery needed.",
    status: "New",
    reportedAt: new Date(new Date().setHours(new Date().getHours() - 1)),
    actionsTaken: ["Towing"],
    log: [
        { event: 'Job Reported', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)) }
    ]
  },
  {
    id: "RA-8466",
    customer: { name: "Kajsa Anka", phone: "070-4567890" },
    vehicle: {
      make: "Ford",
      model: "Transit",
      licensePlate: "VAN 101",
      type: "Van",
      mileage: 210345
    },
    location: "Arlanda Airport",
    position: { lat: 59.6498, lng: 17.9238 }, // Arlanda
    destination: "Ford Workshop, Märsta",
    description: "Lost keys, vehicle locked.",
    status: "Completed",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    assignedTo: "user-5",
    actionsTaken: ["Unlocking", "Towing"],
    driverDiagnosis: ["Lockout"],
    tmaUsed: false,
    arrivalImage: 'https://placehold.co/600x400.png',
    destinationImage: 'https://placehold.co/600x400.png',
    destinationNotes: "Vehicle parked in bay 7. Keys handed over to reception.",
    keysLocation: "Reception desk.",
    log: [
      { event: 'Job Reported', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
      { event: 'Job Started', timestamp: new Date(new Date().setDate(new Date().getDate() - 2) + 1000 * 60 * 5) },
      { event: 'Arrived at Site', timestamp: new Date(new Date().setDate(new Date().getDate() - 2) + 1000 * 60 * 30) },
      { event: 'Arrived at Destination', timestamp: new Date(new Date().setDate(new Date().getDate() - 2) + 1000 * 60 * 90) },
      { event: 'Job Completed', timestamp: new Date(new Date().setDate(new Date().getDate() - 2) + 1000 * 60 * 95) }
    ]
  },
  {
    id: "RA-8467",
    customer: { name: "Joakim von Anka", phone: "070-5678901" },
    vehicle: {
      make: "Kawasaki",
      model: "Ninja 400",
      licensePlate: "MC 202",
      type: "Motorcycle",
      mileage: 15890
    },
    location: "Gamla Uppsala",
    position: { lat: 59.8988, lng: 17.6332 }, // Gamla Uppsala
    destination: "Home address, requested by owner",
    description: "Chain snapped.",
    status: "Completed",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    assignedTo: "user-2",
    actionsTaken: ["Towing"],
    destinationNotes: "Motorcycle parked in owner's garage.",
    keysLocation: "Handed directly to owner.",
    log: [
        { event: 'Job Reported', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)) },
        { event: 'Job Started', timestamp: new Date(new Date().setDate(new Date().getDate() - 3) + 1000 * 60 * 10) },
        { event: 'Arrived at Site', timestamp: new Date(new Date().setDate(new Date().getDate() - 3) + 1000 * 60 * 25) },
        { event: 'Arrived at Destination', timestamp: new Date(new Date().setDate(new Date().getDate() - 3) + 1000 * 60 * 55) },
        { event: 'Job Completed', timestamp: new Date(new Date().setDate(new Date().getDate() - 3) + 1000 * 60 * 60) },
    ]
  },
  {
    id: "RA-8468",
    customer: { name: "Pluto", phone: "070-6789012" },
    vehicle: {
      make: "Tesla",
      model: "Model Y",
      licensePlate: "TES 303",
      type: "Car",
      mileage: 45000
    },
    location: "Gränby Centrum, Uppsala",
    position: { lat: 59.873, lng: 17.662 }, // Gränby
    destination: "Tesla Supercharger, Uppsala",
    description: "Out of battery.",
    status: "New",
    reportedAt: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
    assignedTo: "user-3",
    actionsTaken: ["Towing"],
    driverDiagnosis: ["Battery Issue"],
    log: [
        { event: 'Job Reported', timestamp: new Date(new Date().setMinutes(new Date().getMinutes() - 15)) }
    ]
  },
];

export const mockKpis: Kpi[] = [
  {
    title: "Total Jobs (Month)",
    value: "128",
    description: "+5% from last month",
    icon: ClipboardList,
  },
  {
    title: "Completed Today",
    value: "6",
    description: "2 more than yesterday",
    icon: CheckCircle,
  },
  {
    title: "Avg. Response Time",
    value: "22 min",
    description: "-3 min from last week",
    icon: Clock,
  },
  {
    title: "Active Trucks",
    value: "14",
    description: "2 currently on a job",
    icon: Truck,
  },
];

export const jobsChartData = [
  { date: "Mon", jobs: 7 },
  { date: "Tue", jobs: 9 },
  { date: "Wed", jobs: 6 },
  { date: "Thu", jobs: 11 },
  { date: "Fri", jobs: 14 },
  { date: "Sat", jobs: 12 },
  { date: "Sun", jobs: 8 },
];
