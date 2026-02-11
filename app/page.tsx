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
import { SignoutButton } from "@/components/auth-components/signout-button";
import { useWardrobe } from "@/context/wardrobe-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getClothingItems, createClothingItem, updateClothingItem, deleteClothingItem } from "@/lib/supabase/queries";
import { deleteImage, uploadImage } from "@/lib/supabase/storage";

export default function Page() {
    const { searchQuery, categoryFilter } = useWardrobe();
    const [items, setItems] = React.useState<ClothingItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<ClothingItem | null>(
        null
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to login page if user is not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.id) {
            setIsLoading(true);
            getClothingItems(user.id)
                .then((items) => {
                    setItems(items);
                })
                .catch((error) => {
                    console.error("Error fetching clothing items:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user?.id]);

    if (loading || isLoading) {
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

    const handleSaveItem = async (
        itemData: Omit<ClothingItem, "id" | "created_at" | "state" | "worn_at" | "user_id" | "updated_at">,
        imageFile?: File | null
    ) => {
        if (!user?.id) return;

        setIsLoading(true);
        try {
            if (editingItem) {
                // Update existing item
                let finalImageUrl = itemData.image_url;
                const oldImageUrl = editingItem.image_url;
                
                // If a new image file was provided, upload it
                if (imageFile) {
                    finalImageUrl = await uploadImage(imageFile, user.id, editingItem.id);
                    
                    // Delete old image if it exists
                    if (oldImageUrl) {
                        try {
                            await deleteImage(oldImageUrl);
                        } catch (deleteError) {
                            console.error("Error deleting old image:", deleteError);
                        }
                    }
                }
                
                // If image was removed (image_url is null and no new file)
                if (!imageFile && itemData.image_url === null && oldImageUrl) {
                    try {
                        await deleteImage(oldImageUrl);
                    } catch (deleteError) {
                        console.error("Error deleting old image:", deleteError);
                    }
                }
                
                const updatedItem = await updateClothingItem(editingItem.id, {
                    ...itemData,
                    image_url: finalImageUrl,
                });
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === editingItem.id ? updatedItem : item
                    )
                );
            } else {
                // Create new item first (without image URL if we have a file to upload)
                const newItem: ClothingItem = {
                    ...itemData,
                    id: crypto.randomUUID(), // Temporary ID, will be replaced by database
                    state: "UNKNOWN",
                    created_at: new Date().toISOString(),
                    worn_at: null,
                    user_id: user.id,
                    updated_at: null,
                    image_url: imageFile ? null : itemData.image_url, // Will be updated after upload
                };
                const createdItem = await createClothingItem(user.id, newItem);
                
                // If we have an image file, upload it and update the item
                if (imageFile) {
                    const imageUrl = await uploadImage(imageFile, user.id, createdItem.id);
                    const updatedItem = await updateClothingItem(createdItem.id, { image_url: imageUrl });
                    setItems((prevItems) => [updatedItem, ...prevItems]);
                } else {
                    setItems((prevItems) => [createdItem, ...prevItems]);
                }
            }
            setIsDialogOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStateChange = async (id: string, state: ClothingItemState) => {
        setIsLoading(true);
        try {
            await updateClothingItem(id, { state });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, state } : item
                )
            );
        } catch (error) {
            console.error("Error updating item state:", error);
            alert("Failed to update item state. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkWorn = async (id: string) => {
        setIsLoading(true);
        try {
            const wornAt = new Date().toISOString();
            await updateClothingItem(id, { worn_at: wornAt });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, worn_at: wornAt } : item
                )
            );
        } catch (error) {
            console.error("Error marking item as worn:", error);
            alert("Failed to mark item as worn. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        setIsLoading(true);
        try {
            // Find the item to get its image URL
            const itemToDelete = items.find((item) => item.id === id);
            
            // Delete the item from database
            await deleteClothingItem(id);
            
            // Delete the associated image from storage if it exists
            if (itemToDelete?.image_url) {
                try {
                    await deleteImage(itemToDelete.image_url);
                } catch (imageError) {
                    console.error("Error deleting image:", imageError);
                    // Continue even if image deletion fails
                }
            }
            
            // Update local state
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                {/* Signout button */}
                <div className="flex justify-end mb-4">
                    <SignoutButton />
                </div>

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
