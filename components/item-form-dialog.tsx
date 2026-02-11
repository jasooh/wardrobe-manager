/**
 * item-form-dialog.tsx
 *
 * Dialog component for adding and editing clothing items.
 * Contains a form with all fields for clothing item details.
 */

"use client";

import * as React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ClothingItem, ClothingCategory, categories } from "@/lib/types";
import { UploadIcon, XIcon, ImageIcon } from "lucide-react";

interface ItemFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: ClothingItem | null;
    onSave: (
        item: Omit<ClothingItem, "id" | "created_at" | "state" | "worn_at" | "user_id" | "updated_at">,
        imageFile?: File | null
    ) => void;
}

export function ItemFormDialog({
    open,
    onOpenChange,
    item,
    onSave,
}: ItemFormDialogProps) {
    const [formData, setFormData] = React.useState({
        name: "",
        category: "tops" as ClothingCategory,
        image_url: "",
    });
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || "",
                category: item.category || "tops",
                image_url: item.image_url || "",
            });
            setImagePreview(item.image_url || null);
        } else {
            setFormData({
                name: "",
                category: "tops",
                image_url: "",
            });
            setImagePreview(null);
        }
    }, [item, open]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB");
                return;
            }

            // Store the file for upload later
            setSelectedFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setImagePreview(previewUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image_url: "" });
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB");
                return;
            }
            // Store the file for upload later
            setSelectedFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setImagePreview(previewUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Determine image_url value
        let imageUrl: string | null = null;
        
        if (selectedFile) {
            // New file selected - will be uploaded by parent, so pass null for now
            imageUrl = null;
        } else if (item) {
            // Editing existing item
            if (imagePreview) {
                // Image still exists (either existing or was previewed)
                imageUrl = formData.image_url;
            } else {
                // Image was removed
                imageUrl = null;
            }
        } else {
            // New item, no file selected
            imageUrl = null;
        }
        
        onSave({
            name: formData.name,
            category: formData.category,
            image_url: imageUrl,
        }, selectedFile);
        
        // Reset form state
        setSelectedFile(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="lg">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        {item ? "Edit Item" : "Add New Item"}
                    </DialogTitle>
                    <DialogDescription>
                        {item
                            ? "Update the details of your clothing item."
                            : "Add a new item to your wardrobe."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Name & Category */}
                            <div className="space-y-4">
                                {/* Name Field */}
                                <Field>
                                    <FieldLabel>Name *</FieldLabel>
                                    <FieldGroup>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., Blue Denim Jacket"
                                            required
                                        />
                                    </FieldGroup>
                                </Field>

                                {/* Category Field */}
                                <Field>
                                    <FieldLabel>Category *</FieldLabel>
                                    <FieldGroup>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    category:
                                                        value as ClothingCategory,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {category
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            category.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldGroup>
                                </Field>
                            </div>

                            {/* Right Column: Image Upload */}
                            <Field>
                                <FieldLabel>Image</FieldLabel>
                                <FieldGroup>
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <div className="relative w-full h-48 rounded-none border border-border overflow-hidden bg-muted">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 p-1.5 rounded-none bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:border-destructive z-10"
                                                >
                                                    <XIcon className="size-4 text-foreground" />
                                                </button>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="mt-2 w-full"
                                            >
                                                <UploadIcon data-icon="inline-start" />
                                                Change Image
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            className="relative w-full h-48 rounded-none border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                                <div className="p-3 rounded-none bg-background/50 border border-border group-hover:bg-background transition-colors">
                                                    <ImageIcon className="size-8 text-muted-foreground" />
                                                </div>
                                                <div className="text-center px-4">
                                                    <p className="text-sm font-medium text-foreground mb-1">
                                                        Click to upload or drag
                                                        and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PNG, JPG, GIF up to 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </FieldGroup>
                            </Field>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {item ? "Update" : "Add"} Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
