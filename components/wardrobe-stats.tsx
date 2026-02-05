/**
 * wardrobe-stats.tsx
 *
 * Stats component for the wardrobe manager application.
 * Displays the count of filtered items vs total items.
 */

interface WardrobeStatsProps {
  filteredCount: number;
  totalCount: number;
}

export function WardrobeStats({
  filteredCount,
  totalCount,
}: WardrobeStatsProps) {
  return (
    <div className="mb-6 text-sm text-muted-foreground">
      Showing {filteredCount} of {totalCount} items
    </div>
  );
}
