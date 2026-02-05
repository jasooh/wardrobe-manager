/**
 * item-form-dialog.tsx
 *
 * Dialog component for adding and editing clothing items.
 * Contains a form with all fields for clothing item details.
 */

"use client";

import * as React from "react";
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
import { ClothingItem, ClothingCategory } from "@/lib/types";

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ClothingItem | null;
  onSave: (
    item: Omit<ClothingItem, "id" | "createdAt" | "state" | "wornAt">
  ) => void;
}

const categories: ClothingCategory[] = [
  "tops",
  "bottoms",
  "outerwear",
  "shoes",
  "accessories",
  "underwear",
  "other",
];

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: ItemFormDialogProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    category: "tops" as ClothingCategory,
    image: "",
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        category: item.category || "tops",
        image: item.image || "",
      });
    } else {
      setFormData({
        name: "",
        category: "tops",
        image: "",
      });
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      category: formData.category,
      image: formData.image || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
          <DialogDescription>
            {item
              ? "Update the details of your clothing item."
              : "Add a new item to your wardrobe."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldGroup>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Blue Denim Jacket"
                  required
                />
              </FieldGroup>
            </Field>

            <Field>
              <FieldLabel>Category *</FieldLabel>
              <FieldGroup>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as ClothingCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </Field>

            <Field>
              <FieldLabel>Image URL</FieldLabel>
              <FieldGroup>
                <Input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </FieldGroup>
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
