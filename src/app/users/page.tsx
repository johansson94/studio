import { UserCard } from "@/components/user-card";
import { mockUsers } from "@/lib/mock-data";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Användarhantering</h1>
        <p className="text-muted-foreground mt-1">
          Visa och hantera trafikledare och förare.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
