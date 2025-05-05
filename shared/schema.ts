import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  employeeId: true,
  password: true,
});

// Query schema
export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  details: text("details").notNull(),
  answer: text("answer").notNull(),
  topic: text("topic").notNull(),
  employeeId: text("employee_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertQuerySchema = createInsertSchema(queries).pick({
  title: true,
  details: true,
  answer: true,
  topic: true,
  employeeId: true,
});

// Define schema types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuery = z.infer<typeof insertQuerySchema>;
export type Query = typeof queries.$inferSelect;

// Define validation schemas for forms
export const loginSchema = z.object({
  employeeId: z.string()
    .min(1, "Employee ID is required")
    .regex(/^EMP\d{5}$/, "Employee ID must be in format EMP followed by 5 digits"),
  password: z.string().min(1, "Password is required"),
  captcha: z.string().min(1, "Please enter the CAPTCHA code"),
});

export const querySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  details: z.string().min(1, "Details are required").max(500, "Details are too long"),
  answer: z.string().min(1, "Answer is required").max(1000, "Answer is too long"),
  topic: z.enum(["technical", "process", "hr", "tools"], {
    errorMap: () => ({ message: "Please select a topic" }),
  }),
});

// Define filter types
export const topicOptions = [
  { value: "all_topics", label: "All Topics" },
  { value: "technical", label: "Technical" },
  { value: "process", label: "Process" },
  { value: "hr", label: "HR" },
  { value: "tools", label: "Tools" },
];

export const dateFilterOptions = [
  { value: "all_time", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];
