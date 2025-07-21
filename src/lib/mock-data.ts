import type { Job, Kpi } from "@/lib/types";
import { ClipboardList, CheckCircle, Clock, Truck } from "lucide-react";

export const mockJobs: Job[] = [
  {
    id: "RA-8463",
    vehicle: {
      make: "Volvo",
      model: "XC60",
      licensePlate: "REG 123",
      type: "Car",
    },
    location: "E4, Stockholm",
    destination: "Mekonomen, Södertälje",
    description: "Engine failure, car won't start. Blocking right lane.",
    status: "New",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: "RA-8464",
    vehicle: {
      make: "Audi",
      model: "A4",
      licensePlate: "AUD 456",
      type: "Car",
    },
    location: "Drottninggatan 5, Uppsala",
    destination: "Vianor, Uppsala",
    description: "Flat tire, requires towing to the nearest workshop.",
    status: "In Progress",
    reportedAt: new Date(new Date().setHours(new Date().getHours() - 3)),
  },
  {
    id: "RA-8465",
    vehicle: {
      make: "Scania",
      model: "R-series",
      licensePlate: "TRU 789",
      type: "Truck",
    },
    location: "Rv70, Enköping",
    destination: "Scania Service, Västerås",
    description: "Brake system malfunction. Heavy vehicle recovery needed.",
    status: "New",
    reportedAt: new Date(new Date().setHours(new Date().getHours() - 1)),
  },
  {
    id: "RA-8466",
    vehicle: {
      make: "Ford",
      model: "Transit",
      licensePlate: "VAN 101",
      type: "Van",
    },
    location: "Arlanda Airport",
    destination: "Ford Workshop, Märsta",
    description: "Lost keys, vehicle locked.",
    status: "Completed",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: "RA-8467",
    vehicle: {
      make: "Kawasaki",
      model: "Ninja 400",
      licensePlate: "MC 202",
      type: "Motorcycle",
    },
    location: "Gamla Uppsala",
    destination: "Home address, requested by owner",
    description: "Chain snapped.",
    status: "Completed",
    reportedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: "RA-8468",
    vehicle: {
      make: "Tesla",
      model: "Model Y",
      licensePlate: "TES 303",
      type: "Car",
    },
    location: "Gränby Centrum, Uppsala",
    destination: "Tesla Supercharger, Uppsala",
    description: "Out of battery.",
    status: "New",
    reportedAt: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
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
