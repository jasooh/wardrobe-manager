/**
 * search-bar.tsx
 *
 * Search bar component for the wardrobe manager application.
 * Provides a search input for filtering clothing items.
 */

import { Input } from "@/components/ui/input";
import { ClothingCategory } from "@/lib/types";
import { SearchIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/types";
import { useWardrobe } from "@/context/wardrobe-context";

export function SearchBar() {
    const { searchQuery, categoryFilter, setSearchQuery, setCategoryFilter } =
        useWardrobe();

    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-sm sm:text-base"
                />
            </div>
            <Select
                value={categoryFilter}
                onValueChange={(value) =>
                    setCategoryFilter(value as ClothingCategory | "all")
                }
            >
                <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
