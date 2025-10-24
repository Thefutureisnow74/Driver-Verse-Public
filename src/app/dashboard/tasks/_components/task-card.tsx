"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Task, getTaskPriorityColor } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { EditTaskDialog } from "./edit-task-dialog";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && !isOverdue && 
    new Date(task.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsEditDialogOpen(true)}
        className={cn(
          "bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer",
          "hover:shadow-md transition-shadow duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
          (isDragging || isSortableDragging) && "opacity-50 rotate-2 shadow-lg",
          isOverdue && "border-l-4 border-l-red-500",
          isDueSoon && !isOverdue && "border-l-4 border-l-yellow-500"
        )}
      >
        {/* Task Title */}
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Task Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {/* Priority */}
            {task.priority && (
              <Badge 
                className={cn("text-xs", getTaskPriorityColor(task.priority))}
                variant="secondary"
              >
                {task.priority.toLowerCase()}
              </Badge>
            )}

            {/* Assigned To */}
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-20">
                  {task.assignedTo}
                </span>
              </div>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              isOverdue && "text-red-600",
              isDueSoon && !isOverdue && "text-yellow-600"
            )}>
              {isOverdue ? (
                <Clock className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              <span>
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            </div>
          )}
        </div>
      </div>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
