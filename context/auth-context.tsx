// auth-context.tsx
// Context provider for shared auth state.
// Manages user state across components.
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 * Provides the auth context to the entire app
 *
 * @param children - The children components to render
 * @returns The AuthProvider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    // Get initial session and listen for auth changes
    useEffect(() => {
        const getInitialSession = async () => {
            // Equivalent to await supabase.auth.getSession(); session = result.data.session;
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes (login, logout, etc.)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // Equivalent to await supabase.auth.getSession(); session = result.data.session;
            setUser(session?.user ?? null);
        });

        // Unsubscribe from the auth change listener when the component unmounts
        return () => subscription.unsubscribe();
    }, []);

    /**
     * Login the user
     *
     * @param email
     * @param password
     * @returns A promise that resolves when the user is logged in
     */
    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
        }

        // On successful login, redirect to home page
        // Don't set loading to false here as the redirect will unmount the component
        router.push("/");
        setLoading(false);
    };

    /**
     * Sign out the user
     * @returns A promise that resolves when the user is signed out
     */
    const signOut = async () => {
        setLoading(true);
        setError(null);
        const { error: signOutError } = await supabase.auth.signOut();

        if (signOutError) {
            setError(signOutError.message);
            setLoading(false);
            return;
        }

        // On successful sign out, redirect to login page
        // Don't set loading to false here as the redirect will unmount the component
        router.push("/login");
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access the auth context
 *
 * @returns The auth context
 * @throws An error if the context is undefined
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
