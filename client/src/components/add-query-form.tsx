import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { querySchema, topicOptions } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";

type FormValues = z.infer<typeof querySchema>;

interface AddQueryFormProps {
  onClose: () => void;
}

export function AddQueryForm({ onClose }: AddQueryFormProps) {
  const { toast } = useToast();
  const { employeeId } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      title: "",
      details: "",
      answer: "",
      topic: "" as any,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/queries", data);
      return response.json();
    },
    onSuccess: () => {
      // Show success message
      toast({
        title: "Success",
        description: "Your query has been added to the knowledge base.",
        variant: "default",
      });
      
      // Reset form
      form.reset();
      
      // Close form
      onClose();
      
      // Invalidate queries cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/queries"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add query",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-neutral-700">Add New Query</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-700 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a clear, specific title for your query" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your question or issue in detail" 
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a clear, complete answer to the query" 
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {topicOptions.slice(1).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit Query"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
