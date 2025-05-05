import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuerySchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session management
  const MemStoreSession = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'knowledge-base-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 86400000 }, // 24 hours
    store: new MemStoreSession({ checkPeriod: 86400000 }) // Cleanup expired sessions
  }));
  
  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
  };

  // Login route
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      // Validate request data
      const validatedData = loginSchema.parse(req.body);
      
      // Authenticate user (check employeeId and password)
      const user = await storage.getUserByEmployeeId(validatedData.employeeId);
      
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: 'Invalid employee ID or password' });
      }
      
      // Set user in session
      req.session.user = {
        id: user.id,
        employeeId: user.employeeId
      };
      
      return res.status(200).json({
        employeeId: user.employeeId
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Logout route
  app.post('/api/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  // Check auth status
  app.get('/api/auth-check', (req: Request, res: Response) => {
    if (req.session && req.session.user) {
      return res.status(200).json({
        isAuthenticated: true,
        employeeId: req.session.user.employeeId
      });
    }
    return res.status(200).json({ isAuthenticated: false });
  });

  // Get all queries
  app.get('/api/queries', requireAuth, async (req: Request, res: Response) => {
    try {
      const { search, topic, employee, date } = req.query;
      
      const queries = await storage.searchQueries(
        search as string, 
        topic as string, 
        employee as string, 
        date as string
      );
      
      return res.status(200).json(queries);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch queries' });
    }
  });

  // Add new query
  app.post('/api/queries', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.session.user!;
      
      // Validate request data
      const validatedData = insertQuerySchema.parse({
        ...req.body,
        employeeId: user.employeeId
      });
      
      // Create new query
      const newQuery = await storage.createQuery(validatedData);
      
      return res.status(201).json(newQuery);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      
      return res.status(500).json({ message: 'Failed to create query' });
    }
  });

  // Get all employees for filter dropdown
  app.get('/api/employees', requireAuth, async (req: Request, res: Response) => {
    try {
      const queries = await storage.getAllQueries();
      const employeeIds = [...new Set(queries.map(query => query.employeeId))];
      
      return res.status(200).json(employeeIds);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch employees' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
