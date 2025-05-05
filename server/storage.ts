import { 
  users, type User, type InsertUser,
  queries, type Query, type InsertQuery 
} from "@shared/schema";
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmployeeId(employeeId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Query operations
  getAllQueries(): Promise<Query[]>;
  getQueryById(id: number): Promise<Query | undefined>;
  createQuery(query: InsertQuery): Promise<Query>;
  searchQueries(searchTerm?: string, topic?: string, employeeId?: string, dateFilter?: string): Promise<Query[]>;
}

// JSON file storage implementation
export class JsonFileStorage implements IStorage {
  private usersPath: string;
  private queriesPath: string;
  private users: User[] = [];
  private queries: Query[] = [];
  private nextUserId = 1;
  private nextQueryId = 1;

  constructor() {
    this.usersPath = path.resolve(process.cwd(), 'data', 'users.json');
    this.queriesPath = path.resolve(process.cwd(), 'data', 'queries.json');
    this.ensureDirectoryExists();
    this.loadUsers();
    this.loadQueries();
  }

  // Helper to ensure data directory exists
  private ensureDirectoryExists() {
    const dir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create files if they don't exist
    if (!fs.existsSync(this.usersPath)) {
      fs.writeFileSync(this.usersPath, JSON.stringify([]));
    }
    
    if (!fs.existsSync(this.queriesPath)) {
      fs.writeFileSync(this.queriesPath, JSON.stringify([]));
    }
  }

  // Load users from JSON file
  private loadUsers() {
    try {
      const data = fs.readFileSync(this.usersPath, 'utf8');
      this.users = JSON.parse(data);
      
      // Set next ID based on existing users
      if (this.users.length > 0) {
        this.nextUserId = Math.max(...this.users.map(u => u.id)) + 1;
      }
      
      // If no users exist, add some seed users
      if (this.users.length === 0) {
        this.users = [
          { id: 1, employeeId: 'EMP10254', password: 'password123' },
          { id: 2, employeeId: 'EMP10842', password: 'password123' },
          { id: 3, employeeId: 'EMP10468', password: 'password123' }
        ];
        this.nextUserId = 4;
        this.saveUsers();
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  // Load queries from JSON file
  private loadQueries() {
    try {
      const data = fs.readFileSync(this.queriesPath, 'utf8');
      this.queries = JSON.parse(data);
      
      // Set next ID based on existing queries
      if (this.queries.length > 0) {
        this.nextQueryId = Math.max(...this.queries.map(q => q.id)) + 1;
      }
      
      // If no queries exist, add some seed queries
      if (this.queries.length === 0) {
        const now = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        this.queries = [
          {
            id: 1,
            title: 'How to configure the project deployment settings?',
            details: "I'm trying to set up the deployment pipeline but can't find the right settings in the project configuration.",
            answer: "Go to Project Settings > Deployment > Configuration. There you'll find all the necessary settings. Make sure to set the environment variables and deployment targets correctly.",
            topic: 'technical',
            employeeId: 'EMP10254',
            date: lastMonth
          },
          {
            id: 2,
            title: "What's the process for requesting time off?",
            details: "I need to take some vacation days next month but I'm not sure about the correct procedure.",
            answer: "Submit your request through the HR portal at least 2 weeks in advance. Navigate to My Profile > Time Off > Request Time Off. Your manager will receive an automatic notification to approve your request.",
            topic: 'hr',
            employeeId: 'EMP10842',
            date: now
          }
        ];
        this.nextQueryId = 3;
        this.saveQueries();
      }
    } catch (error) {
      console.error('Error loading queries:', error);
      this.queries = [];
    }
  }

  // Save users to JSON file
  private saveUsers() {
    try {
      fs.writeFileSync(this.usersPath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Save queries to JSON file
  private saveQueries() {
    try {
      fs.writeFileSync(this.queriesPath, JSON.stringify(this.queries, null, 2));
    } catch (error) {
      console.error('Error saving queries:', error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmployeeId(employeeId: string): Promise<User | undefined> {
    return this.users.find(user => user.employeeId === employeeId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.nextUserId++ };
    this.users.push(user);
    this.saveUsers();
    return user;
  }

  // Query operations
  async getAllQueries(): Promise<Query[]> {
    return [...this.queries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getQueryById(id: number): Promise<Query | undefined> {
    return this.queries.find(query => query.id === id);
  }

  async createQuery(insertQuery: InsertQuery): Promise<Query> {
    const query: Query = {
      ...insertQuery,
      id: this.nextQueryId++,
      date: new Date()
    };
    
    this.queries.push(query);
    this.saveQueries();
    return query;
  }

  async searchQueries(
    searchTerm?: string,
    topic?: string,
    employeeId?: string,
    dateFilter?: string
  ): Promise<Query[]> {
    let filteredQueries = [...this.queries];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredQueries = filteredQueries.filter(
        query => query.title.toLowerCase().includes(term) ||
                 query.details.toLowerCase().includes(term) ||
                 query.answer.toLowerCase().includes(term)
      );
    }
    
    // Filter by topic
    if (topic) {
      filteredQueries = filteredQueries.filter(query => query.topic === topic);
    }
    
    // Filter by employee ID
    if (employeeId) {
      filteredQueries = filteredQueries.filter(query => query.employeeId === employeeId);
    }
    
    // Filter by date
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateFilter) {
        case 'today':
          filteredQueries = filteredQueries.filter(
            query => new Date(query.date) >= today
          );
          break;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          filteredQueries = filteredQueries.filter(
            query => new Date(query.date) >= weekStart
          );
          break;
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          filteredQueries = filteredQueries.filter(
            query => new Date(query.date) >= monthStart
          );
          break;
        case 'year':
          const yearStart = new Date(today.getFullYear(), 0, 1);
          filteredQueries = filteredQueries.filter(
            query => new Date(query.date) >= yearStart
          );
          break;
      }
    }
    
    // Sort by date (newest first)
    return filteredQueries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const storage = new JsonFileStorage();
