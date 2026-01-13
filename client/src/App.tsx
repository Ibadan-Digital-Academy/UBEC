import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/use-auth'; // we don't have this
import { ProtectedRoute } from './lib/protected-route';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import Data from '@/pages/Data';
import SchoolDetails from '@/pages/SchoolDetails';
import MapPage from '@/pages/MapPage';
import Profile from '@/pages/Profile';
import AuthPage from '@/pages/AuthPage';

function Router() {
    return (
        <Switch>
            {/* Public Routes */}
            <Route path="/auth" component={AuthPage} />
            <Route path="/" component={Home} />
            <Route path="/data" component={Data} />
            <Route path="/data/:id" component={SchoolDetails} />

            {/* Protected Routes - only logged in users can see these */}
            <ProtectedRoute path="/map" component={MapPage} />
            <ProtectedRoute path="/profile" component={Profile} />

            {/* Fallback */}
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <Router />
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
