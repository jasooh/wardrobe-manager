/**
 * wardrobe-empty-state.tsx
 *
 * Empty state component for the wardrobe manager application.
 * Displays a message when there are no items or no matching items.
 */

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface WardrobeEmptyStateProps {
    hasItems: boolean;
    onAddItem: () => void;
}

export function WardrobeEmptyState({
    hasItems,
    onAddItem,
}: WardrobeEmptyStateProps) {
    return (
        <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {hasItems
                    ? "No items match your search criteria."
                    : "No items in your wardrobe yet. Add your first item!"}
            </p>
            {!hasItems && (
                <Button onClick={onAddItem} variant="outline" className="w-full sm:w-auto">
                    <PlusIcon data-icon="inline-start" />
                    Add your first item
                </Button>
            )}
        </div>
    );
}
