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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-row items-center gap-6">
          <Shirt className="size-10" />
          <div>
            <h1 className="text-2xl font-semibold mb-2">Wardrobe Manager</h1>
            <p className="text-sm text-muted-foreground">
              Manage your clothing collection
            </p>
          </div>
        </div>
        <Button onClick={onAddItem}>
          <PlusIcon data-icon="inline-start" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
