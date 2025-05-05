import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { topicOptions, dateFilterOptions } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

interface SearchSectionProps {
  onSearch: (search: string) => void;
  onFilterChange: (filters: Filters) => void;
}

export interface Filters {
  topic: string;
  date: string;
  employee: string;
}

export function SearchSection({ onSearch, onFilterChange }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    topic: "all_topics",
    date: "all_time",
    employee: "all_employees",
  });

  // Fetch employee list for filter dropdown
  const { data: employees = [] } = useQuery<string[]>({
    queryKey: ["/api/employees"],
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof Filters, value: string) => {
    // Convert special "all_*" values to empty strings for API filtering
    let actualValue = value;
    if (field === "employee" && value === "all_employees") actualValue = "";
    if (field === "topic" && value === "all_topics") actualValue = "";
    if (field === "date" && value === "all_time") actualValue = "";
    
    const newFilters = { ...filters, [field]: actualValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-medium text-neutral-700 mb-4">Search Knowledge Base</h2>
        
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <Input
              type="search"
              placeholder="Search for queries, keywords, or topics"
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Filter options */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Topic filter */}
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Topic
              </label>
              <Select
                value={filters.topic}
                onValueChange={(value) => handleFilterChange("topic", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  {topicOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date filter */}
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Date
              </label>
              <Select
                value={filters.date}
                onValueChange={(value) => handleFilterChange("date", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Employee filter */}
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Added By
              </label>
              <Select
                value={filters.employee}
                onValueChange={(value) => handleFilterChange("employee", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_employees">All Employees</SelectItem>
                  {employees.map((employeeId) => (
                    <SelectItem key={employeeId} value={employeeId}>
                      {employeeId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
