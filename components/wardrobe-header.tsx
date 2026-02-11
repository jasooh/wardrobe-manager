/**
 * wardrobe-header.tsx
 *
 * Header component for the wardrobe manager application.
 * Displays the title, icon, and Add Item button.
 */

import { Button } from "@/components/ui/button";
import { PlusIcon, Shirt } from "lucide-react";

interface WardrobeHeaderProps {
    onAddItem: () => void;
}

export function WardrobeHeader({ onAddItem }: WardrobeHeaderProps) {
    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex flex-row items-center gap-3 sm:gap-6">
                    <Shirt className="size-8 sm:size-10 flex-shrink-0" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
                            Wardrobe Manager
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Manage your clothing collection
                        </p>
                    </div>
                </div>
                <Button onClick={onAddItem} className="w-full sm:w-auto">
                    <PlusIcon data-icon="inline-start" />
                    Add Item
                </Button>
            </div>
        </div>
    );
}
