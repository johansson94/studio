import type { Job, Kpi, User } from "@/lib/types";
import { ClipboardList, CheckCircle, Clock, Truck } from "lucide-react";

export const mockJobs: Job[] = [
  {
    id: "RA-8463",
    vehicle: {
      make: "Volvo",
      model: "XC60",
      licensePlate: "REG 123",
      type: "Car",
      mileage: 123456
    },
    location: "E4, Stockholm",
    destination: "Mekonomen, Södertälje",
    description: "Engine failure, car won't start. Blocking right lane.",
    status: "New",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    actionsTaken: ["Towing"],
  },
  {
    id: "RA-8464",
    vehicle: {
      make: "Audi",
      model: "A4",
      licensePlate: "AUD 456",
      type: "Car",
      mileage: 89012
    },
    location: "Drottninggatan 5, Uppsala",
    destination: "Vianor, Uppsala",
    description: "Flat tire, requires towing to the nearest workshop.",
    status: "In Progress",
    reportedAt: new Date(new Date().setHours(new Date().getHours() - 3)),
    actionsTaken: ["Tire Change", "Towing"],
  },
  {
    id: "RA-8465",
    vehicle: {
      make: "Scania",
      model: "R-series",
      licensePlate: "TRU 789",
      type: "Truck",
      mileage: 450678
    },
    location: "Rv70, Enköping",
    destination: "Scania Service, Västerås",
    description: "Brake system malfunction. Heavy vehicle recovery needed.",
    status: "New",
    reportedAt: new Date(new Date().setHours(new Date().getHours() - 1)),
    actionsTaken: ["Towing"],
  },
  {
    id: "RA-8466",
    vehicle: {
      make: "Ford",
      model: "Transit",
      licensePlate: "VAN 101",
      type: "Van",
      mileage: 210345
    },
    location: "Arlanda Airport",
    destination: "Ford Workshop, Märsta",
    description: "Lost keys, vehicle locked.",
    status: "Completed",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    actionsTaken: ["Unlocking", "Towing"],
  },
  {
    id: "RA-8467",
    vehicle: {
      make: "Kawasaki",
      model: "Ninja 400",
      licensePlate: "MC 202",
      type: "Motorcycle",
      mileage: 15890
    },
    location: "Gamla Uppsala",
    destination: "Home address, requested by owner",
    description: "Chain snapped.",
    status: "Completed",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    actionsTaken: ["Towing"],
  },
  {
    id: "RA-8468",
    vehicle: {
      make: "Tesla",
      model: "Model Y",
      licensePlate: "TES 303",
      type: "Car",
      mileage: 45000
    },
    location: "Gränby Centrum, Uppsala",
    destination: "Tesla Supercharger, Uppsala",
    description: "Out of battery.",
    status: "New",
    reportedAt: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
    actionsTaken: ["Towing"],
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
    avatar: "https://placehold.co/100x100.png"
  },
  {
    id: "user-3",
    name: "Maria Nilsson",
    role: "Driver",
    avatar: "https://placehold.co/100x100.png"
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
    avatar: "https://placehold.co/100x100.png"
  }
];
