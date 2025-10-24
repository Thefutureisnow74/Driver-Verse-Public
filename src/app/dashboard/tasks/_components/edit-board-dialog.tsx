"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useUpdateBoard, Board } from "@/hooks/use-boards";
import { cn } from "@/lib/utils";

const editBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(100, "Board name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  tags: z.array(z.string()).default([]),
  color: z.string().optional(),
});

type EditBoardFormData = z.infer<typeof editBoardSchema>;

interface EditBoardDialogProps {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-500", class: "bg-blue-500" },
  { name: "Green", value: "bg-green-500", class: "bg-green-500" },
  { name: "Purple", value: "bg-purple-500", class: "bg-purple-500" },
  { name: "Red", value: "bg-red-500", class: "bg-red-500" },
  { name: "Yellow", value: "bg-yellow-500", class: "bg-yellow-500" },
  { name: "Pink", value: "bg-pink-500", class: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500", class: "bg-indigo-500" },
  { name: "Gray", value: "bg-gray-500", class: "bg-gray-500" },
];

export function EditBoardDialog({ board, open, onOpenChange }: EditBoardDialogProps) {
  const [tagInput, setTagInput] = useState("");
  const updateBoard = useUpdateBoard();

  const form = useForm({
    resolver: zodResolver(editBoardSchema),
    defaultValues: {
      name: board.name,
      description: board.description || "",
      tags: board.tags,
      color: board.color || "",
    },
  });

  // Reset form when board changes
  useEffect(() => {
    form.reset({
      name: board.name,
      description: board.description || "",
      tags: board.tags,
      color: board.color || "",
    });
  }, [board, form]);

  const tags = form.watch("tags") || [];

  function onSubmit(data: any) {
    updateBoard.mutate({
      boardId: board.id,
      data,
    }, {
      onSuccess: () => {
        setTagInput("");
        onOpenChange(false);
      },
    });
  }

  function handleAddTag() {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      form.setValue("tags", [...tags, tag]);
      setTagInput("");
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    form.setValue("tags", tags.filter(tag => tag !== tagToRemove));
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Board Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter board name"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter board description (optional)"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="pr-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 ml-1 hover:bg-transparent"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Color</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                          field.value === color.value
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        } transition-all duration-200`}
                        onClick={() => field.onChange(color.value)}
                        title={color.name}
                      />
                    ))}
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 bg-white ${
                        !field.value
                          ? "border-gray-900 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      } transition-all duration-200`}
                      onClick={() => field.onChange("")}
                      title="No color"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateBoard.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateBoard.isPending}
              >
                {updateBoard.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
