import type { User } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{user.name}</h3>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Badge className={getRoleClass(user.role)}>{user.role}</Badge>
      </CardContent>
    </Card>
  );
}
