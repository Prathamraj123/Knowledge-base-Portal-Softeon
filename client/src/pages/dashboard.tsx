import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SearchSection, type Filters } from "@/components/search-section";
import { QueryCard } from "@/components/query-card";
import { AddQueryForm } from "@/components/add-query-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Query } from "@shared/schema";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const { isAuthenticated, checkAuthStatus, employeeId } = useAuth();
  const [, navigate] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    topic: "all_topics",
    date: "all_time",
    employee: "all_employees",
  });
  
  // Check authentication when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch queries with search and filters
  const { data: queries = [], isLoading } = useQuery<Query[]>({
    queryKey: [
      "/api/queries", 
      { search: searchTerm, ...filters }
    ],
  });

  // Handle search change
  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  // Handle filter change 
  const handleFilterChange = (newFilters: Filters) => {
    // Convert the special placeholder values back to empty strings for API filtering
    const apiFilters = {
      topic: newFilters.topic === "all_topics" ? "" : newFilters.topic,
      date: newFilters.date === "all_time" ? "" : newFilters.date,
      employee: newFilters.employee === "all_employees" ? "" : newFilters.employee
    };
    setFilters(apiFilters);
  };

  // Toggle add query form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchSection 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange}
        />
        
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-neutral-700">Results</h2>
            <Button 
              onClick={toggleAddForm}
              className="inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Query
            </Button>
          </div>

          {showAddForm && <AddQueryForm onClose={() => setShowAddForm(false)} />}
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-48 animate-pulse" />
              ))}
            </div>
          ) : queries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <i className="fas fa-search text-neutral-300 text-4xl mb-2"></i>
              <p className="text-neutral-500">No queries found matching your search criteria.</p>
              <p className="text-neutral-400 text-sm mt-1">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((query) => (
                <QueryCard key={query.id} query={query} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
