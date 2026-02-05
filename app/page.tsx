/**
 * page.tsx
 *
 * Main dashboard page for the wardrobe manager application.
 * Displays all clothing items in a grid layout with filtering and search capabilities.
 * Provides functionality to add, edit, and delete clothing items.
 */

"use client";

import * as React from "react";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { ClothingItem, ClothingItemState } from "@/lib/types";
import { SearchBar } from "@/components/search-bar";
import { WardrobeHeader } from "@/components/wardrobe-header";
import { WardrobeStats } from "@/components/wardrobe-stats";
import { WardrobeEmptyState } from "@/components/wardrobe-empty-state";
import { WardrobeItemsGrid } from "@/components/wardrobe-items-grid";

export default function Page() {
  const [items, setItems] = React.useState<ClothingItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ClothingItem | null>(
    null
  );

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveItem = (
    itemData: Omit<ClothingItem, "id" | "createdAt" | "state" | "wornAt">
  ) => {
    if (editingItem) {
      // Update existing item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...itemData,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: ClothingItem = {
        ...itemData,
        id: crypto.randomUUID(),
        state: "UNKNOWN",
        createdAt: new Date().toISOString(),
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleStateChange = (id: string, state: ClothingItemState) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, state } : item))
    );
  };

  const handleMarkWorn = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, wornAt: new Date().toISOString() } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // For now, show all items (SearchBar manages its own state)
  const filteredItems = items;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-8 py-20 max-w-6xl">
        <WardrobeHeader onAddItem={handleAddItem} />

        <SearchBar />

        <WardrobeStats
          filteredCount={filteredItems.length}
          totalCount={items.length}
        />

        {filteredItems.length === 0 ? (
          <WardrobeEmptyState
            hasItems={items.length > 0}
            onAddItem={handleAddItem}
          />
        ) : (
          <WardrobeItemsGrid
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onStateChange={handleStateChange}
            onMarkWorn={handleMarkWorn}
          />
        )}
      </div>

      <ItemFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </main>
  );
}
