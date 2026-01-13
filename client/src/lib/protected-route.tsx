import { useAuth } from "@/hooks/use-auth"; // Changed this
import { Loader2 } from "lucide-react";
import { Route, Redirect } from "wouter";

export function ProtectedRoute({
    path,
    component: Component,
}: {
    path: string;
    component: React.ComponentType<any>;
}) {
    // Use the context instead of the hook directly to avoid redundant fetches
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Redirect to="/auth" />;
    }

    return <Route path={path} component={Component} />;
}
