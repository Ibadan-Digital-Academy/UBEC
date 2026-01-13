// shared/routes.ts
import { z } from 'zod';
import { schools, users, type User } from './schema'; // Import from schema

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  schools: {
    list: {
      method: 'GET' as const,
      path: '/api/schools',
      input: z.object({
        state: z.string().optional(),
        type: z.string().optional(),
        level: z.string().optional(),
        lga: z.string().optional(),
        search: z.string().optional(),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(100), // Default to 100 for your data page
      }).optional(),
      responses: {
        200: z.object({
          data: z.array(z.custom<typeof schools.$inferSelect>()),
          total: z.number(),
          page: z.number(),
          limit: z.number(),
          totalPages: z.number(),
        }),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/schools/:id',
      responses: {
        200: z.custom<typeof schools.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    filters: {
      method: 'GET' as const,
      path: '/api/filters',
      responses: {
        200: z.object({
          states: z.array(z.string()),
          types: z.array(z.string()),
          levels: z.array(z.string()),
          lgas: z.array(z.string()),
        }),
      },
    },
  },
  user: {
    get: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<User>(), // Uses the schema User type
        401: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/user',
      input: z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
      }),
      responses: {
        200: z.custom<User>(),
        400: errorSchemas.validation,
      },
    }
  }
};

// Helper for dynamic paths (e.g., /api/schools/123)
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}