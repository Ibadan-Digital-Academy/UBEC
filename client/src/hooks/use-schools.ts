import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type SchoolsListResponse, type SchoolResponse } from "@shared/routes";
import { z } from "zod";

// Filter type definition matching the API input
export interface SchoolFilters {
  state?: string;
  type?: string;
  level?: string;
  lga?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Hook to fetch schools with filters
export function useSchools(filters: SchoolFilters = {}) {
  // Construct query key that changes when filters change
  const queryKey = [api.schools.list.path, filters];
  
  // Construct URL with query parameters
  const params: Record<string, string | number> = { ...filters };
  // Remove undefined/null values
  Object.keys(params).forEach(key => 
    (params[key] === undefined || params[key] === null || params[key] === '') && delete params[key]
  );
  
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${api.schools.list.path}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch schools");
      return api.schools.list.responses[200].parse(await res.json());
    },
    // Keep previous data while fetching new page for smooth transitions
    placeholderData: (previousData) => previousData,
  });
}

// Hook to fetch a single school by ID
export function useSchool(id: number) {
  return useQuery({
    queryKey: [api.schools.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.schools.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch school");
      return api.schools.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Hook to fetch available filter options (states, types, etc.)
export function useSchoolFilters() {
  return useQuery({
    queryKey: [api.schools.filters.path],
    queryFn: async () => {
      const res = await fetch(api.schools.filters.path);
      if (!res.ok) throw new Error("Failed to fetch filter options");
      return api.schools.filters.responses[200].parse(await res.json());
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since these rarely change
  });
}
