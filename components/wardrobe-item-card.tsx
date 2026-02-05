/**
 * wardrobe-item-card.tsx
 *
 * Card component for displaying individual clothing items in the wardrobe.
 * Shows item details and provides actions for editing and deleting items.
 */

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
} from "lucide-react";
import { ClothingItem, ClothingItemState } from "@/lib/types";

interface WardrobeItemCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  onStateChange: (id: string, state: ClothingItemState) => void;
  onMarkWorn: (id: string) => void;
}

export function WardrobeItemCard({
  item,
  onEdit,
  onDelete,
  onStateChange,
  onMarkWorn,
}: WardrobeItemCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDelete = () => {
    onDelete(item.id);
    setShowDeleteDialog(false);
  };

  const handleStateChange = (newState: ClothingItemState) => {
    onStateChange(item.id, newState);
  };

  const handleMarkWorn = () => {
    onMarkWorn(item.id);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle>{item.name}</CardTitle>
              <CardDescription className="capitalize">
                {item.category}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <EditIcon />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkWorn}>
                  Mark as Worn
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {item.image && (
            <div className="mb-3 rounded-none overflow-hidden bg-muted aspect-square">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select
                value={item.state}
                onValueChange={(value) =>
                  handleStateChange(value as ClothingItemState)
                }
              >
                <SelectTrigger className="h-7 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLEAN">Clean</SelectItem>
                  <SelectItem value="DIRTY">Dirty</SelectItem>
                  <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {item.wornAt && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="size-3" />
                <span>
                  Last worn: {new Date(item.wornAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{item.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
