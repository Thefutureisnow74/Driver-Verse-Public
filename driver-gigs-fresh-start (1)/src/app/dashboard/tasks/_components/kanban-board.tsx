"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasks, useMoveTask, groupTasksByStatus, Task, TaskStatus } from "@/hooks/use-tasks";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";

interface KanbanBoardProps {
  boardId: string;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const { data: tasks, isLoading, error } = useTasks(boardId);
  const moveTask = useMoveTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: TaskStatus.TODO, title: "To Do", color: "bg-gray-100" },
    { id: TaskStatus.IN_PROGRESS, title: "In Progress", color: "bg-blue-100" },
    { id: TaskStatus.PENDING, title: "Pending", color: "bg-yellow-100" },
    { id: TaskStatus.DONE, title: "Done", color: "bg-green-100" },
    { id: TaskStatus.DROPPED, title: "Dropped", color: "bg-red-100" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed to load tasks
      </div>
    );
  }

  if (!tasks) {
    return null;
  }

  const groupedTasks = groupTasksByStatus(tasks);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks?.find((t) => t.id === active.id);
    setActiveTask(task || null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over || !tasks) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // Dropping on another task
    if (overTask) {
      if (activeTask.status !== overTask.status) {
        // Moving to a different column
        const overColumn = overTask.status;
        const overIndex = groupedTasks[overColumn as keyof typeof groupedTasks].findIndex((t) => t.id === overId);
        
        moveTask.mutate({
          taskId: activeTask.id,
          newStatus: overColumn,
          newPosition: overIndex,
        });
      }
      return;
    }

    // Dropping on a column
    const overColumn = overId as TaskStatus;
    if (Object.values(TaskStatus).includes(overColumn)) {
      if (activeTask.status !== overColumn) {
        moveTask.mutate({
          taskId: activeTask.id,
          newStatus: overColumn,
          newPosition: groupedTasks[overColumn as keyof typeof groupedTasks].length,
        });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !tasks) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // If dropping on another task in the same column, reorder
    if (overTask && activeTask.status === overTask.status) {
      const columnTasks = groupedTasks[activeTask.status as keyof typeof groupedTasks];
      const activeIndex = columnTasks.findIndex((t) => t.id === activeId);
      const overIndex = columnTasks.findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex) {
        moveTask.mutate({
          taskId: activeTask.id,
          newStatus: activeTask.status,
          newPosition: overIndex,
        });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            boardId={boardId}
          >
            <SortableContext
              items={groupedTasks[column.id].map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {groupedTasks[column.id].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
