/**
 * login-form.tsx
 *
 * Login form component for the wardrobe manager application.
 * Allows users to login to their account.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAuth } from "@/context/auth-context";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, loading } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldGroup>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </FieldGroup>
            </Field>
            <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldGroup>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </FieldGroup>
            </Field>
            {error && (
                <p className="text-sm text-destructive">
                    {error} Please try again.
                </p>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
            </Button>
        </form>
    );
}
