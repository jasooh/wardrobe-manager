/**
 * wardrobe-items-grid.tsx
 *
 * Items grid component for the wardrobe manager application.
 * Displays clothing items in a responsive grid layout.
 */

import { WardrobeItemCard } from "@/components/wardrobe-item-card";
import { ClothingItem, ClothingItemState } from "@/lib/types";

interface WardrobeItemsGridProps {
    items: ClothingItem[];
    onEdit: (item: ClothingItem) => void;
    onDelete: (id: string) => void;
    onStateChange: (id: string, state: ClothingItemState) => void;
    onMarkWorn: (id: string) => void;
}

export function WardrobeItemsGrid({
    items,
    onEdit,
    onDelete,
    onStateChange,
    onMarkWorn,
}: WardrobeItemsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
                <WardrobeItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStateChange={onStateChange}
                    onMarkWorn={onMarkWorn}
                />
            ))}
        </div>
    );
}
