"use client";

import { useState } from "react";
import { useBoards, useUpdateBoard, useArchiveBoard, Board } from "@/hooks/use-boards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit2, Archive, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateBoardDialog } from "./create-board-dialog";
import { EditBoardDialog } from "./edit-board-dialog";

interface BoardSelectorProps {
  selectedBoardId?: string;
  onBoardSelect: (boardId: string) => void;
}

export function BoardSelector({ selectedBoardId, onBoardSelect }: BoardSelectorProps) {
  const { data: boards, isLoading } = useBoards();
  const updateBoard = useUpdateBoard();
  const archiveBoard = useArchiveBoard();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  const selectedBoard = boards?.find(board => board.id === selectedBoardId);

  function handleArchiveBoard(boardId: string) {
    if (confirm("Are you sure you want to archive this board? This will hide it from your active boards.")) {
      archiveBoard.mutate(boardId);
      
      // If the archived board was selected, select another board or none
      if (selectedBoardId === boardId && boards && boards.length > 1) {
        const otherBoard = boards.find(b => b.id !== boardId);
        if (otherBoard) {
          onBoardSelect(otherBoard.id);
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-48 h-10 bg-gray-100 rounded-md animate-pulse" />
        <div className="w-10 h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-gray-500">No boards yet</div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create Board
        </Button>
        <CreateBoardDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={selectedBoardId} onValueChange={onBoardSelect}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a board">
              {selectedBoard && (
                <div className="flex items-center gap-2">
                  {selectedBoard.color && (
                    <div className={cn("w-3 h-3 rounded-full", selectedBoard.color)} />
                  )}
                  <span>{selectedBoard.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {selectedBoard._count.tasks}
                  </Badge>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {boards.map((board) => (
              <SelectItem key={board.id} value={board.id}>
                <div className="flex items-center gap-2 w-full">
                  {board.color && (
                    <div className={cn("w-3 h-3 rounded-full", board.color)} />
                  )}
                  <span className="flex-1">{board.name}</span>
                  <Badge variant="secondary">
                    {board._count.tasks}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedBoard && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingBoard(selectedBoard)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Board
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleArchiveBoard(selectedBoard.id)}
                className="text-red-600"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          New Board
        </Button>
      </div>

      {/* Selected Board Info */}
      {selectedBoard && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedBoard.name}</h3>
              {selectedBoard.description && (
                <p className="text-sm text-gray-600 mt-1">{selectedBoard.description}</p>
              )}
              {selectedBoard.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedBoard.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{selectedBoard._count.tasks} tasks</div>
              <div>Updated {new Date(selectedBoard.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editingBoard && (
        <EditBoardDialog
          board={editingBoard}
          open={!!editingBoard}
          onOpenChange={(open) => !open && setEditingBoard(null)}
        />
      )}
    </>
  );
}
