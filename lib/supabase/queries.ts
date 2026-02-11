// Defines CRUD operations for the clothing_items table

import { createClient } from "@/lib/supabase/client";
import { ClothingItem } from "@/lib/types";

/**
 * Get all clothing items for a user
 */
export async function getClothingItems(userId: string): Promise<ClothingItem[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('Error fetching clothing items:', error);
        throw error;
    }

    return (data as ClothingItem[]) || [];
}

/**
 * Create a new clothing item for a user
 */
export async function createClothingItem(userId: string, item: ClothingItem): Promise<ClothingItem> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('clothing_items')
        .insert({
            user_id: userId,
            name: item.name,
            category: item.category,
            image_url: item.image_url,
            state: item.state,
            worn_at: item.worn_at,
            created_at: item.created_at,
            updated_at: item.updated_at,
        })
        .select() // returns the inserted row after insert (insert on its own doesn't return data)
        .single(); // return a single row (single object, not array)

    if (error) {
        console.error('Error creating clothing item:', error);
        throw error;
    }

    return data as ClothingItem;
}

/**
 * Update a clothing item for a user
 */
export async function updateClothingItem(
    id: string, 
    updates: Partial<ClothingItem> // partial because we may only want to update some fields, not all
): Promise<ClothingItem> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('clothing_items')
        .update({
            name: updates.name,
            category: updates.category,
            image_url: updates.image_url,
            state: updates.state,
            worn_at: updates.worn_at,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating clothing item:', error);
        throw error;
    }

    return data as ClothingItem;
}

/**
 * Delete a clothing item for a user
 */
export async function deleteClothingItem(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting item:', error)
    throw error
  }
}