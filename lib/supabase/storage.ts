// Defines functions for uploading and deleting images from Supabase Storage

import { createClient } from "./client";

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
    file: File, 
    userId: string, 
    itemId: string
): Promise<string> {
    const supabase = createClient();

    // Create file path: userId/itemId/image.jpg
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${itemId}/image.${fileExt}`;
    const filePath = fileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false, // don't overwrite if exists
        })
    
        if (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw uploadError;
        }

    // Get public URL
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);

    console.log('Image uploaded successfully:', data.publicUrl);
    return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    const supabase = createClient();

    // Extract file path from image URL
    // URL format: https://xxxxx.supabase.co/storage/v1/object/public/images/userId/itemId/image.jpg
    const urlParts = imageUrl.split('/images/')
    if (urlParts.length !== 2) return

    const filePath = urlParts[1]  // this is the file path we need to delete
    
    // Delete file
    const { error } = await supabase.storage
        .from('images')
        .remove([filePath])

    if (error) {
        console.error('Error deleting image:', error);
        throw error;
    }

    console.log(`Image ${filePath} deleted successfully`);
}