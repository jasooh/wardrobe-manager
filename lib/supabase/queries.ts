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