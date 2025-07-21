export type JobStatus = "New" | "In Progress" | "Completed";

export interface Job {
  id: string;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    type: "Car" | "Motorcycle" | "Truck" | "Van";
  };
  location: string;
  destination: string;
  description: string;
  status: JobStatus;
  reportedAt: Date;
}

export interface Kpi {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}
