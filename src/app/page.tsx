
'use client';

import React from 'react';
import { JobCard } from "@/components/job-card";
import { mockJobs, mockUsers } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractSearchFilters } from '@/ai/flows/extract-search-filters';
import type { Job } from '@/lib/types';


export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
  const [filteredJobs, setFilteredJobs] = React.useState<Job[]>(mockJobs);
  const [isSearching, setIsSearching] = React.useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredJobs(mockJobs);
      setActiveFilters({});
      return;
    }

    setIsSearching(true);
    try {
      const filters = await extractSearchFilters({ query: searchQuery });
      let jobs = mockJobs;
      const appliedFilters: Record<string, string> = {};

      if (filters.status) {
        jobs = jobs.filter(job => job.status === filters.status);
        appliedFilters['Status'] = filters.status;
      }
      if (filters.vehicleType) {
        jobs = jobs.filter(job => job.vehicle.type === filters.vehicleType);
        appliedFilters['Fordonstyp'] = filters.vehicleType;
      }
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        jobs = jobs.filter(job => job.location.toLowerCase().includes(locationLower));
        appliedFilters['Plats'] = filters.location;
      }
       if (filters.assignedToName) {
        const driverNameLower = filters.assignedToName.toLowerCase();
        const driver = mockUsers.find(user => user.name.toLowerCase().includes(driverNameLower));
        if (driver) {
            jobs = jobs.filter(job => job.assignedTo === driver.id);
            appliedFilters['Förare'] = driver.name;
        }
      }
      if (filters.category) {
        const categoryLower = filters.category.toLowerCase();
        jobs = jobs.filter(job => job.category?.toLowerCase().includes(categoryLower));
        appliedFilters['Kategori'] = filters.category;
      }
      if (filters.priority) {
        jobs = jobs.filter(job => job.priority === filters.priority);
        appliedFilters['Prioritet'] = filters.priority;
      }
       if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        jobs = jobs.filter(job => 
            job.id.toLowerCase().includes(searchLower) ||
            job.vehicle.licensePlate.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower) ||
            job.customer.name.toLowerCase().includes(searchLower)
        );
        appliedFilters['Fritext'] = filters.searchText;
      }

      setFilteredJobs(jobs);
      setActiveFilters(appliedFilters);

    } catch (error) {
      console.error("AI search failed:", error);
      toast({
        variant: "destructive",
        title: "AI-sökning misslyckades",
        description: "Försöker med en vanlig sökning istället.",
      });
      // Fallback to simple text search
      const queryLower = searchQuery.toLowerCase();
      const fallbackJobs = mockJobs.filter(job =>
        Object.values(job).some(val =>
          String(val).toLowerCase().includes(queryLower)
        ) ||
        Object.values(job.vehicle).some(val =>
          String(val).toLowerCase().includes(queryLower)
        )
      );
      setFilteredJobs(fallbackJobs);
      setActiveFilters({ Sökterm: searchQuery });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleStatusFilterChange = (status: string) => {
    if (status === 'all') {
      setFilteredJobs(mockJobs);
      setActiveFilters({});
    } else {
      setFilteredJobs(mockJobs.filter(job => job.status === status));
      setActiveFilters({ Status: status });
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Aktiva uppdrag</h1>
        <p className="text-muted-foreground mt-1">
          Realtidsuppdateringar om uppdragsstatus och plats. Använd AI-sökning för avancerad filtrering.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSearch} className="flex-grow flex gap-2 w-full sm:w-auto">
            <Input 
                placeholder="AI Search: 'nya jobb för lastbilar i uppsala'..." 
                className="max-w-xs bg-card flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" disabled={isSearching}>
                {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
            </Button>
        </form>
        <Select defaultValue="all" onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card">
            <SelectValue placeholder="Filtrera på status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla statusar</SelectItem>
            <SelectItem value="New">Ny</SelectItem>
            <SelectItem value="In Progress">Pågående</SelectItem>
            <SelectItem value="Completed">Slutförd</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
       {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">Aktiva filter:</h3>
            {Object.entries(activeFilters).map(([key, value]) => (
                <span key={key} className="text-xs bg-secondary text-secondary-foreground py-1 px-2 rounded-full">{key}: <strong>{value}</strong></span>
            ))}
            <Button variant="ghost" size="sm" onClick={() => {
                setFilteredJobs(mockJobs);
                setActiveFilters({});
                setSearchQuery('');
            }}>Rensa filter</Button>
          </div>
       )}

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            <p>Inga uppdrag matchade din sökning.</p>
        </div>
      )}
    </div>
  );
}
