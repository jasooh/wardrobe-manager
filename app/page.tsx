/**
 * page.tsx
 *
 * Main dashboard page for the wardrobe manager application.
 * Displays all clothing items in a grid layout with filtering and search capabilities.
 * Provides functionality to add, edit, and delete clothing items.
 */

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WardrobeItemCard } from "@/components/wardrobe-item-card";
import { ItemFormDialog } from "@/components/item-form-dialog";
import { PlusIcon, SearchIcon, Shirt } from "lucide-react";
import { ClothingItem, ClothingCategory, ClothingItemState } from "@/lib/types";

export default function Page() {
  const [items, setItems] = React.useState<ClothingItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ClothingItem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    ClothingCategory | "all"
  >("all");

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

  // Filter items based on search query and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories: (ClothingCategory | "all")[] = [
    "all",
    "tops",
    "bottoms",
    "outerwear",
    "shoes",
    "accessories",
    "underwear",
    "other",
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-8 py-20 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-row items-center gap-6">
              <Shirt className="size-10" />
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Wardrobe Manager
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your clothing collection
                </p>
              </div>
            </div>
            <Button onClick={handleAddItem}>
              <PlusIcon data-icon="inline-start" />
              Add Item
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as ClothingCategory | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length} items
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {items.length === 0
                ? "No items in your wardrobe yet. Add your first item!"
                : "No items match your search criteria."}
            </p>
            {items.length === 0 && (
              <Button onClick={handleAddItem} variant="outline">
                <PlusIcon data-icon="inline-start" />
                Add Your First Item
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <WardrobeItemCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onStateChange={handleStateChange}
                onMarkWorn={handleMarkWorn}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <ItemFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </main>
  );
}
