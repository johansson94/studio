import type { User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const getRoleClass = (role: User["role"]) => {
    switch (role) {
      case "Dispatcher":
        return "bg-accent text-accent-foreground";
      case "Driver":
        return "bg-primary/80 text-primary-foreground";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{user.name}</h3>
        <Badge className={getRoleClass(user.role)}>{user.role}</Badge>
      </CardHeader>
      {user.role === 'Driver' && user.assignedVehicle && (
        <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">{user.assignedVehicle.model}</p>
            <p className="text-sm font-semibold">{user.assignedVehicle.licensePlate}</p>
        </CardContent>
      )}
       {user.role === 'Driver' && (
         <CardFooter className="flex justify-center pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-5 w-5" />
                <span className="text-sm">Bärgningsbil</span>
            </div>
        </CardFooter>
       )}
    </Card>
  );
}
