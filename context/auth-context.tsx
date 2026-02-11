// auth-context.tsx
// Context provider for shared auth state.
// Manages user state across components.
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
    user: User | null;
    loading: boolean;
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
    const supabase = createClient();

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
     * Sign out the user
     * @returns A promise that resolves when the user is signed out
     */
    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
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
