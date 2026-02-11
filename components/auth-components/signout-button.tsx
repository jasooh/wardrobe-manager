/**
 * signout-button.tsx
 *
 * Sign out button component for the wardrobe manager application.
 * Allows users to sign out of their account.
 */

"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function SignoutButton() {
    const { signOut, error, loading } = useAuth();

    const handleSignOut = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent page reload
        await signOut();
    };

    return (
        <form onSubmit={handleSignOut} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
                {loading ? "Signing out..." : "Sign Out"}
            </Button>
        </form>
    );
}
