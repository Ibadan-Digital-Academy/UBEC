// shared/schema.ts
import { pgTable, text, serial, jsonb, timestamp, boolean, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schools = pgTable("NGSchools", {
  id: serial("id").primaryKey(), 
  // Changed to match Supabase 'bigint'
  schoolId: bigint("school_id", { mode: "number" }), 
  name: text("name"), // Removed .notNull() as your SQL says 'null'
  state: text("state").notNull(),
  lga: text("lga"),
  type: text("type"),
  level: text("level"),
  address: text("address"),
  data: jsonb("data").$type<Record<string, any>>().default({}),
  latitude: text("latitude"),
  longitude: text("longitude"),
  category: text("category"),
  town: text("town"),
  ownership: text("ownership"),
  ownershipCategory: text("ownership_category"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(), 
  email: text("email").notNull(),
  name: text("name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow(),
});

// Added this so Drizzle knows about your session table
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { mode: 'date' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type School = typeof schools.$inferSelect;

export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true });
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

export interface SchoolFilters {
  state?: string;
  type?: string;
  level?: string;
  lga?: string;
  search?: string;
  page?: number | string; // Allow string because URL searchParams are strings
  limit?: number | string;
}

export interface PaginatedSchools {
  data: School[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}