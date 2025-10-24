"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/hooks/use-tasks";
import { useState } from "react";
import { CreateTaskDialog } from "./create-task-dialog";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  boardId: string;
  children: React.ReactNode;
}

export function KanbanColumn({ 
  id, 
  title, 
  color, 
  boardId, 
  children 
}: KanbanColumnProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <>
      <div className="flex-shrink-0 w-80">
        <div
          ref={setNodeRef}
          className={cn(
            "bg-gray-50 rounded-lg p-4 h-full min-h-[500px] transition-colors",
            isOver && "bg-gray-100 ring-2 ring-blue-500 ring-opacity-50"
          )}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", color)} />
              <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-8 w-8 p-0 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {children}
          </div>
        </div>
      </div>

      <CreateTaskDialog
        boardId={boardId}
        defaultStatus={id}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
