/**
 * wardrobe-context.tsx
 *
 * Context provider for shared wardrobe state.
 * Manages search query and category filter state across components.
 */

"use client";

import * as React from "react";
import { ClothingCategory } from "@/lib/types";

interface WardrobeContextType {
  searchQuery: string;
  categoryFilter: ClothingCategory | "all";
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (filter: ClothingCategory | "all") => void;
}

const WardrobeContext = React.createContext<WardrobeContextType | undefined>(
  undefined
);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    ClothingCategory | "all"
  >("all");

  return (
    <WardrobeContext.Provider
      value={{
        searchQuery,
        categoryFilter,
        setSearchQuery,
        setCategoryFilter,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = React.useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error("useWardrobe must be used within a WardrobeProvider");
  }
  return context;
}
