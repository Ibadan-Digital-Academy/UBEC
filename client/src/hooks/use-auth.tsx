import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User } from "@shared/models/auth";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchUser(): Promise<User | null> {
    // Get the authenticated user (NOT just the session)
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Fetch app-specific user data from Express
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) return null;

    const response = await fetch("/api/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) return null;
    return response.json();
}

async function logoutUser(): Promise<void> {
    await supabase.auth.signOut();
}

export function useAuthInternal() {
    const queryClient = useQueryClient();

    const query = useQuery<User | null>({
        queryKey: ["user-session"],
        queryFn: fetchUser,
        retry: false,
        staleTime: 0,
    });

    // 🔑 Listen to Supabase auth changes
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            queryClient.invalidateQueries({ queryKey: ["user-session"] });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [queryClient]);

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-session"] });
            window.location.href = "/auth";
        },
    });

    return {
        user: query.data ?? null,
        isLoading: query.isLoading,
        isAuthenticated: !!query.data,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuthInternal(); // This uses the logic you already wrote

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
