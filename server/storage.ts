import { db } from "./db";
import { schools, users, type InsertSchool, type School, type SchoolFilters, type PaginatedSchools, type User } from "@shared/schema";
import { eq, ilike, and, sql, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getSchools(filters: SchoolFilters): Promise<PaginatedSchools>;
  getSchool(id: number): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  getFilters(): Promise<{ states: string[], types: string[], levels: string[], lgas: string[] }>;
  bulkCreateSchools(schoolsList: InsertSchool[]): Promise<void>;
  countSchools(): Promise<number>;
  getAnalytics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getAnalytics() {
    // Adding Number() conversion to handle string/BigInt returns from Postgres count
    const totalResult = await db.select({ count: count() }).from(schools);
    const byState = await db.select({ name: schools.state, count: count() }).from(schools).groupBy(schools.state);
    const byType = await db.select({ name: schools.type, count: count() }).from(schools).groupBy(schools.type);
    const byLevel = await db.select({ name: schools.level, count: count() }).from(schools).groupBy(schools.level);

    return {
      totalSchools: Number(totalResult[0].count),
      byState: byState.map(s => ({ name: s.name || 'Unknown', count: Number(s.count) })),
      byType: byType.map(t => ({ name: t.name || 'Unknown', count: Number(t.count) })),
      byLevel: byLevel.map(l => ({ name: l.name || 'Unknown', count: Number(l.count) })),
    };
  }

  async getSchools(filters: SchoolFilters): Promise<PaginatedSchools> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    // Only add conditions if they aren't "all" or undefined
    if (filters.state && filters.state !== 'all') conditions.push(ilike(schools.state, filters.state));
    if (filters.type && filters.type !== 'all') conditions.push(ilike(schools.type, filters.type));
    if (filters.level && filters.level !== 'all') conditions.push(ilike(schools.level, filters.level));
    if (filters.lga && filters.lga !== 'all') conditions.push(ilike(schools.lga, filters.lga));
    
    if (filters.search) {
      // Using sql.raw or proper template literals to prevent SQL injection while allowing partial matches
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        sql`(${schools.name} ILIKE ${searchPattern} OR ${schools.schoolId} ILIKE ${searchPattern})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(schools)
      .where(whereClause);

    const total = Number(countResult.count);
    const totalPages = Math.ceil(total / limit);

    const data = await db
      .select()
      .from(schools)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return { data, total, page, limit, totalPages };
  }

  async getSchool(id: number): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school;
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const [newSchool] = await db.insert(schools).values(school).returning();
    return newSchool;
  }

  async bulkCreateSchools(schoolsList: InsertSchool[]): Promise<void> {
    const batchSize = 100;
    for (let i = 0; i < schoolsList.length; i += batchSize) {
      const batch = schoolsList.slice(i, i + batchSize);
      await db.insert(schools).values(batch);
    }
  }

  async countSchools(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(schools);
    return Number(result.count);
  }

  async getFilters() {
    // Distinct queries can be slow on large tables; this is fine for now
    const [states, types, levels, lgas] = await Promise.all([
      db.selectDistinct({ value: schools.state }).from(schools),
      db.selectDistinct({ value: schools.type }).from(schools),
      db.selectDistinct({ value: schools.level }).from(schools),
      db.selectDistinct({ value: schools.lga }).from(schools),
    ]);

    return {
      states: states.map(s => s.value).filter(Boolean).sort() as string[],
      types: types.map(t => t.value).filter(Boolean).sort() as string[],
      levels: levels.map(l => l.value).filter(Boolean).sort() as string[],
      lgas: lgas.map(l => l.value).filter(Boolean).sort() as string[],
    };
  }
}

export const storage = new DatabaseStorage();