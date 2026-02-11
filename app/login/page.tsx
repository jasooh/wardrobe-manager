"use client";

/**
 * login/page.tsx
 *
 * Login page for the wardrobe manager application.
 * Allows users to login to their account.
 */

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth-components/login-form";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to home page if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner size="lg" />
            </div>
        );
    }

    if (user) {
        return null;
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-2">WardrobeOS</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Your wardrobe digitalized.
                    </p>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
