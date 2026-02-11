/**
 * spinner.tsx
 *
 * Spinner component for displaying loading states.
 * Uses a rotating icon to indicate that content is loading.
 */

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.ComponentProps<"div"> {
    size?: "sm" | "default" | "lg";
}

const sizeClasses = {
    sm: "size-4",
    default: "size-6",
    lg: "size-8",
};

export function Spinner({
    className,
    size = "default",
    ...props
}: SpinnerProps) {
    return (
        <div
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            <Loader2Icon
                className={cn(
                    "animate-spin text-muted-foreground",
                    sizeClasses[size]
                )}
            />
        </div>
    );
}
