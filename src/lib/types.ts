export type JobStatus = "New" | "In Progress" | "Completed";
export type UserRole = "Dispatcher" | "Driver";

export type ActionTaken = string;

export type VehicleProblem = "Engine Failure" | "Flat Tire" | "Battery Issue" | "Brake Failure" | "Lockout" | "Accident";

export interface JobLogEntry {
    event: 'Job Reported' | 'Job Started' | 'Arrived at Site' | 'Arrived at Destination' | 'Job Completed';
    timestamp: Date;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface JobCosts {
    deductible: number;
    otherFees: number;
    total: number;
    paidOnSite: boolean;
}

export interface Job {
  id: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    type: "Car" | "Motorcycle" | "Truck" | "Van";
    mileage: number;
  };
  location: string;
  position: Position;
  destination: string;
  description: string;
  status: JobStatus;
  reportedAt: Date;
  assignedTo?: string; // User ID of the driver
  arrivalImage?: string;
  destinationImage?: string;
  actionsTaken?: ActionTaken[];
  driverDiagnosis?: VehicleProblem[];
  tmaUsed?: boolean;
  destinationNotes?: string;
  keysLocation?: string;
  log?: JobLogEntry[];
  costs?: JobCosts;
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
    position?: Position;
    assignedVehicle?: {
        licensePlate: string;
        model: string;
    };
}
