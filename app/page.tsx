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
import { useWardrobe } from "@/context/wardrobe-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
    const { searchQuery, categoryFilter } = useWardrobe();
    const [items, setItems] = React.useState<ClothingItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<ClothingItem | null>(
        null
    );
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to login page if user is not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

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
            prevItems.map((item) =>
                item.id === id ? { ...item, state } : item
            )
        );
    };

    const handleMarkWorn = (id: string) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, wornAt: new Date().toISOString() }
                    : item
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

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-8 py-20 max-w-6xl">
                {/* Header */}
                <WardrobeHeader onAddItem={handleAddItem} />

                {/* Search bar */}
                <SearchBar />
                <WardrobeStats
                    filteredCount={filteredItems.length}
                    totalCount={items.length}
                />

                {/* Clothing items grid */}
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
