import { Query } from "@shared/schema";

// Define custom types used in the application

// Type for Query filter state
export interface QueryFilters {
  search?: string;
  topic?: string;
  employeeId?: string;
  dateFilter?: string;
}

// Type for API response with queries
export interface QueriesResponse {
  queries: Query[];
}

// Type for notification states
export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

// Define session types for express session
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      employeeId: string;
    };
  }
}
