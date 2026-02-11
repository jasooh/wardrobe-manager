/**
 * wardrobe-item-card.tsx
 *
 * Card component for displaying individual clothing items in the wardrobe.
 * Shows item details and provides actions for editing and deleting items.
 */

"use client";

import * as React from "react";
import Image from "next/image";
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
    const [imageError, setImageError] = React.useState(false);

    // Reset image error when item changes
    React.useEffect(() => {
        setImageError(false);
    }, [item.image_url]);

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
            <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg line-clamp-2">{item.name}</CardTitle>
                            <CardDescription className="capitalize text-xs sm:text-sm">
                                {item.category}
                            </CardDescription>
                            <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground/60 break-all leading-tight">
                                {item.id}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-xs" className="shrink-0">
                                    <MoreVerticalIcon className="size-4" />
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
                <CardContent className="flex-1 pb-3">
                    {item.image_url && !imageError && (
                        <div className="mb-3 rounded-lg overflow-hidden bg-muted aspect-square relative">
                            <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover rounded-lg"
                                unoptimized
                                onError={() => {
                                    setImageError(true);
                                }}
                            />
                        </div>
                    )}
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2">
                            <Select
                                value={item.state}
                                onValueChange={(value) =>
                                    handleStateChange(
                                        value as ClothingItemState
                                    )
                                }
                            >
                                <SelectTrigger className="h-8 sm:h-7 text-xs sm:text-sm w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLEAN">Clean</SelectItem>
                                    <SelectItem value="DIRTY">Dirty</SelectItem>
                                    <SelectItem value="CHECKED_OUT">
                                        Checked Out
                                    </SelectItem>
                                    <SelectItem value="UNKNOWN">
                                        Unknown
                                    </SelectItem>
                                    <SelectItem value="ARCHIVED">
                                        Archived
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {item.worn_at && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarIcon className="size-3 shrink-0" />
                                <span className="truncate">
                                    Last worn:{" "}
                                    {new Date(
                                        item.worn_at
                                    ).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="pt-3">
                    <div className="flex flex-col gap-1 w-full text-xs text-muted-foreground">
                        <span className="truncate">
                            Added:{" "}
                            {new Date(
                                item.created_at || ""
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </CardFooter>
            </Card>

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{item.name}
                            &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
