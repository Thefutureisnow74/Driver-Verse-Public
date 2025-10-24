"use client";

import { useState, useEffect } from "react";
import { useBoards } from "@/hooks/use-boards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Plus } from "lucide-react";
import { BoardSelector } from "./_components/board-selector";
import { KanbanBoard } from "./_components/kanban-board";
import { TaskListView } from "./_components/task-list-view";
import { CreateTaskDialog } from "./_components/create-task-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type ViewMode = "kanban" | "list";

export default function TasksPage() {
  const { data: boards, isLoading: boardsLoading } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);

  // Auto-select first board when boards load
  useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  if (boardsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Task Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">
            Organize and track your tasks across different boards
          </p>
        </div>
      </div>

      {/* Board Selector */}
      <BoardSelector
        selectedBoardId={selectedBoardId}
        onBoardSelect={setSelectedBoardId}
      />

      {/* Main Content */}
      {selectedBoardId && (
        <>
          {/* View Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Kanban</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={() => setIsCreateTaskDialogOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Task Views */}
          <div className="min-h-[600px]">
            {viewMode === "kanban" ? (
              <KanbanBoard boardId={selectedBoardId} />
            ) : (
              <TaskListView boardId={selectedBoardId} />
            )}
          </div>

          {/* Create Task Dialog */}
          <CreateTaskDialog
            boardId={selectedBoardId}
            open={isCreateTaskDialogOpen}
            onOpenChange={setIsCreateTaskDialogOpen}
          />
        </>
      )}

      {/* Empty State */}
      {!selectedBoardId && boards && boards.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No boards yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first board to start organizing tasks
          </p>
        </div>
      )}
    </div>
  );
}
