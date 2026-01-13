import type { Express, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { supabase, db } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // 1. Supabase Auth Middleware
  app.use(async (req: any, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (user && !error) {
      const dbUser = await storage.getUser(user.id);
      req.user = dbUser;
    }
    next();
  });

  // 2. Auth Guard
  const isAuthenticated = (req: any, res: any, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    next();
  };

  // === API Routes ===

  app.get(api.schools.list.path, async (req, res) => {
    try {
      // Fix: Default to empty object if query is empty to satisfy TypeScript
      const filters = api.schools.list.input.parse(req.query || {}) || {};
      const result = await storage.getSchools(filters);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: "Invalid filters" });
    }
  });

  app.get(api.schools.get.path, async (req, res) => {
    const school = await storage.getSchool(Number(req.params.id));
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  });

  app.get(api.schools.filters.path, async (req, res) => {
    const filters = await storage.getFilters();
    res.json(filters);
  });

  app.get(api.schools.analytics.path, async (req, res) => {
    const analytics = await storage.getAnalytics();
    res.json(analytics);
  });

  app.get(api.user.get.path, isAuthenticated, async (req: any, res) => {
    res.json(req.user);
  });

  app.patch(api.user.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const updates = api.user.update.input.parse(req.body);
      const [updatedUser] = await db.update(users)
        .set(updates)
        .where(eq(users.id, req.user.id))
        .returning();
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}