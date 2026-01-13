import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
    const { user, isLoading } = useAuth();
    const { toast } = useToast();
    const [isPending, setIsPending] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If already logged in, go to home
    if (user) {
        return <Redirect to="/" />;
    }

    const handleEmailAuth = async (type: 'login' | 'signup') => {
        setIsPending(true);
        try {
            const { error } =
                type === 'login'
                    ? await supabase.auth.signInWithPassword({
                          email,
                          password,
                      })
                    : await supabase.auth.signUp({
                          email,
                          password,
                      });

            if (error) throw error;

            toast({
                title: type === 'login' ? 'Welcome back!' : 'Account created!',
                description:
                    type === 'signup'
                        ? 'Please check your email for a verification link.'
                        : 'Logging you in...',
            });
        } catch (error: any) {
            toast({
                title: 'Authentication Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsPending(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        });
        if (error) {
            toast({
                title: 'Google Login Failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Branding */}
                <div className="hidden md:flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight">
                            UBEC
                        </h1>
                    </div>
                    <h2 className="text-2xl font-semibold">
                        School Database System
                    </h2>
                    <p className="text-muted-foreground">
                        Access and manage the comprehensive database of 171,027
                        schools across Nigeria. Analyze data, track status, and
                        generate reports.
                    </p>
                </div>

                {/* Right Side: Auth Form */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Get Started</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full py-6 text-base"
                            onClick={handleGoogleLogin}
                        >
                            <img
                                src="https://www.google.com/favicon.ico"
                                className="w-4 h-4 mr-2"
                                alt="Google"
                            />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or use email
                                </span>
                            </div>
                        </div>

                        <Tabs defaultValue="login">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">
                                    Register
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="login"
                                className="space-y-4 pt-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => handleEmailAuth('login')}
                                    disabled={isPending}
                                >
                                    {isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}{' '}
                                    Login
                                </Button>
                            </TabsContent>

                            <TabsContent
                                value="signup"
                                className="space-y-4 pt-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        value={password}
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => handleEmailAuth('signup')}
                                    disabled={isPending}
                                >
                                    {isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}{' '}
                                    Create Account
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
