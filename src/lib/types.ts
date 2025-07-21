export type JobStatus = "New" | "In Progress" | "Completed";
export type UserRole = "Dispatcher" | "Driver";

export type ActionTaken = "Jump Start" | "Tire Change" | "Towing" | "Unlocking" | "Fuel Delivery";

export interface JobLogEntry {
    event: 'Job Reported' | 'Job Started' | 'Arrived at Site' | 'Arrived at Destination' | 'Job Completed';
    timestamp: Date;
}

export interface Job {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    type: "Car" | "Motorcycle" | "Truck" | "Van";
    mileage: number;
  };
  location: string;
  destination: string;
  description: string;
  status: JobStatus;
  reportedAt: Date;
  assignedTo?: string; // User ID of the driver
  arrivalImage?: string;
  destinationImage?: string;
  actionsTaken?: ActionTaken[];
  destinationNotes?: string;
  keysLocation?: string;
  log?: JobLogEntry[];
}

export interface Kpi {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
}
