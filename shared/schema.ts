// shared/schema.ts
import { pgTable, text, serial, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schools = pgTable("NGSchools", {
  // Use 'serial' only if you are okay with Drizzle trying to create it
  id: serial("id").primaryKey(), 
  name: text("name").notNull(),
  state: text("state").notNull(),
  lga: text("lga"),
  type: text("type"),
  level: text("level"),
  schoolId: text("school_id"),
  address: text("address"),
  data: jsonb("data").$type<Record<string, any>>().default({}),
  latitude: text("latitude"),
  longitude: text("longitude"),
  // ADD THESE TO PREVENT DATA LOSS:
  category: text("category"),
  town: text("town"),
  ownership: text("ownership"),
  ownershipCategory: text("ownership_category"),
});

// Replace the current User type and users table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Supabase uses UUID strings
  email: text("email").unique().notNull(),
  name: text("name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;

export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true });

export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

export interface SchoolFilters {
  state?: string;
  type?: string;
  level?: string;
  lga?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSchools {
  data: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
