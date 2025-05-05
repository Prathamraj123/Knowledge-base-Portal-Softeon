// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import fs from "fs";
import path from "path";
var JsonFileStorage = class {
  usersPath;
  queriesPath;
  users = [];
  queries = [];
  nextUserId = 1;
  nextQueryId = 1;
  constructor() {
    this.usersPath = path.resolve(process.cwd(), "data", "users.json");
    this.queriesPath = path.resolve(process.cwd(), "data", "queries.json");
    this.ensureDirectoryExists();
    this.loadUsers();
    this.loadQueries();
  }
  // Helper to ensure data directory exists
  ensureDirectoryExists() {
    const dir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.usersPath)) {
      fs.writeFileSync(this.usersPath, JSON.stringify([]));
    }
    if (!fs.existsSync(this.queriesPath)) {
      fs.writeFileSync(this.queriesPath, JSON.stringify([]));
    }
  }
  // Load users from JSON file
  loadUsers() {
    try {
      const data = fs.readFileSync(this.usersPath, "utf8");
      this.users = JSON.parse(data);
      if (this.users.length > 0) {
        this.nextUserId = Math.max(...this.users.map((u) => u.id)) + 1;
      }
      if (this.users.length === 0) {
        this.users = [
          { id: 1, employeeId: "EMP10254", password: "password123" },
          { id: 2, employeeId: "EMP10842", password: "password123" },
          { id: 3, employeeId: "EMP10468", password: "password123" }
        ];
        this.nextUserId = 4;
        this.saveUsers();
      }
    } catch (error) {
      console.error("Error loading users:", error);
      this.users = [];
    }
  }
  // Load queries from JSON file
  loadQueries() {
    try {
      const data = fs.readFileSync(this.queriesPath, "utf8");
      this.queries = JSON.parse(data);
      if (this.queries.length > 0) {
        this.nextQueryId = Math.max(...this.queries.map((q) => q.id)) + 1;
      }
      if (this.queries.length === 0) {
        const now = /* @__PURE__ */ new Date();
        const lastMonth = /* @__PURE__ */ new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        this.queries = [
          {
            id: 1,
            title: "How to configure the project deployment settings?",
            details: "I'm trying to set up the deployment pipeline but can't find the right settings in the project configuration.",
            answer: "Go to Project Settings > Deployment > Configuration. There you'll find all the necessary settings. Make sure to set the environment variables and deployment targets correctly.",
            topic: "technical",
            employeeId: "EMP10254",
            date: lastMonth
          },
          {
            id: 2,
            title: "What's the process for requesting time off?",
            details: "I need to take some vacation days next month but I'm not sure about the correct procedure.",
            answer: "Submit your request through the HR portal at least 2 weeks in advance. Navigate to My Profile > Time Off > Request Time Off. Your manager will receive an automatic notification to approve your request.",
            topic: "hr",
            employeeId: "EMP10842",
            date: now
          }
        ];
        this.nextQueryId = 3;
        this.saveQueries();
      }
    } catch (error) {
      console.error("Error loading queries:", error);
      this.queries = [];
    }
  }
  // Save users to JSON file
  saveUsers() {
    try {
      fs.writeFileSync(this.usersPath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }
  // Save queries to JSON file
  saveQueries() {
    try {
      fs.writeFileSync(this.queriesPath, JSON.stringify(this.queries, null, 2));
    } catch (error) {
      console.error("Error saving queries:", error);
    }
  }
  // User operations
  async getUser(id) {
    return this.users.find((user) => user.id === id);
  }
  async getUserByEmployeeId(employeeId) {
    return this.users.find((user) => user.employeeId === employeeId);
  }
  async createUser(insertUser) {
    const user = { ...insertUser, id: this.nextUserId++ };
    this.users.push(user);
    this.saveUsers();
    return user;
  }
  // Query operations
  async getAllQueries() {
    return [...this.queries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async getQueryById(id) {
    return this.queries.find((query) => query.id === id);
  }
  async createQuery(insertQuery) {
    const query = {
      ...insertQuery,
      id: this.nextQueryId++,
      date: /* @__PURE__ */ new Date()
    };
    this.queries.push(query);
    this.saveQueries();
    return query;
  }
  async searchQueries(searchTerm, topic, employeeId, dateFilter) {
    let filteredQueries = [...this.queries];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredQueries = filteredQueries.filter(
        (query) => query.title.toLowerCase().includes(term) || query.details.toLowerCase().includes(term) || query.answer.toLowerCase().includes(term)
      );
    }
    if (topic) {
      filteredQueries = filteredQueries.filter((query) => query.topic === topic);
    }
    if (employeeId) {
      filteredQueries = filteredQueries.filter((query) => query.employeeId === employeeId);
    }
    if (dateFilter) {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      switch (dateFilter) {
        case "today":
          filteredQueries = filteredQueries.filter(
            (query) => new Date(query.date) >= today
          );
          break;
        case "week":
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          filteredQueries = filteredQueries.filter(
            (query) => new Date(query.date) >= weekStart
          );
          break;
        case "month":
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          filteredQueries = filteredQueries.filter(
            (query) => new Date(query.date) >= monthStart
          );
          break;
        case "year":
          const yearStart = new Date(today.getFullYear(), 0, 1);
          filteredQueries = filteredQueries.filter(
            (query) => new Date(query.date) >= yearStart
          );
          break;
      }
    }
    return filteredQueries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};
var storage = new JsonFileStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  employeeId: true,
  password: true
});
var queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  details: text("details").notNull(),
  answer: text("answer").notNull(),
  topic: text("topic").notNull(),
  employeeId: text("employee_id").notNull(),
  date: timestamp("date").defaultNow().notNull()
});
var insertQuerySchema = createInsertSchema(queries).pick({
  title: true,
  details: true,
  answer: true,
  topic: true,
  employeeId: true
});
var loginSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required").regex(/^EMP\d{5}$/, "Employee ID must be in format EMP followed by 5 digits"),
  password: z.string().min(1, "Password is required"),
  captcha: z.string().min(1, "Please enter the CAPTCHA code")
});
var querySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  details: z.string().min(1, "Details are required").max(500, "Details are too long"),
  answer: z.string().min(1, "Answer is required").max(1e3, "Answer is too long"),
  topic: z.enum(["technical", "process", "hr", "tools"], {
    errorMap: () => ({ message: "Please select a topic" })
  })
});

// server/routes.ts
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
async function registerRoutes(app2) {
  const MemStoreSession = MemoryStore(session);
  app2.use(session({
    secret: process.env.SESSION_SECRET || "knowledge-base-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 864e5 },
    // 24 hours
    store: new MemStoreSession({ checkPeriod: 864e5 })
    // Cleanup expired sessions
  }));
  const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
  app2.post("/api/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.getUserByEmployeeId(validatedData.employeeId);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid employee ID or password" });
      }
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
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth-check", (req, res) => {
    if (req.session && req.session.user) {
      return res.status(200).json({
        isAuthenticated: true,
        employeeId: req.session.user.employeeId
      });
    }
    return res.status(200).json({ isAuthenticated: false });
  });
  app2.get("/api/queries", requireAuth, async (req, res) => {
    try {
      const { search, topic, employee, date } = req.query;
      const queries2 = await storage.searchQueries(
        search,
        topic,
        employee,
        date
      );
      return res.status(200).json(queries2);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch queries" });
    }
  });
  app2.post("/api/queries", requireAuth, async (req, res) => {
    try {
      const user = req.session.user;
      const validatedData = insertQuerySchema.parse({
        ...req.body,
        employeeId: user.employeeId
      });
      const newQuery = await storage.createQuery(validatedData);
      return res.status(201).json(newQuery);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to create query" });
    }
  });
  app2.get("/api/employees", requireAuth, async (req, res) => {
    try {
      const queries2 = await storage.getAllQueries();
      const employeeIds = [...new Set(queries2.map((query) => query.employeeId))];
      return res.status(200).json(employeeIds);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch employees" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared"),
      "@assets": path2.resolve(__dirname, "attached_assets")
    }
  },
  root: path2.resolve(__dirname, "client"),
  build: {
    outDir: path2.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "..", "dist", "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
