import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import { Query } from "@shared/schema";

interface QueryCardProps {
  query: Query;
}

export function QueryCard({ query }: QueryCardProps) {
  const { title, details, answer, topic, employeeId, date } = query;
  
  return (
    <Card className="overflow-hidden border border-neutral-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
          <Badge variant="outline" className="bg-neutral-100 text-neutral-600">
            {capitalizeFirstLetter(topic)}
          </Badge>
        </div>
        
        <p className="text-neutral-600 mb-4">{details}</p>
        
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Answer:</h4>
          <p className="text-neutral-600">{answer}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-xs text-neutral-500">
          <span>Added by: {employeeId}</span>
          <span>{formatDate(date)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
