/**
 * types.ts
 *
 * Type definitions for the wardrobe manager application.
 * Defines the structure of clothing items and related data types.
 */

export type ClothingCategory =
  | "tops"
  | "bottoms"
  | "outerwear"
  | "shoes"
  | "accessories"
  | "underwear"
  | "other";

export type ClothingItemState =
  | "CLEAN"
  | "DIRTY"
  | "CHECKED_OUT"
  | "UNKNOWN"
  | "ARCHIVED";

export const categories: ClothingCategory[] = [
  "tops",
  "bottoms",
  "outerwear",
  "shoes",
  "accessories",
  "underwear",
  "other",
];

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  image?: string;
  state: ClothingItemState;
  createdAt: string;
  wornAt?: string;
}
