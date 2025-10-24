import { TaskPriority, TaskStatus } from "@/generated/prisma";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";


export interface Board {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  color?: string;
  isArchived: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  _count: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

// Re-export enums from Prisma for convenience
export { TaskStatus, TaskPriority } from "@/generated/prisma";

export interface CreateBoardData {
  name: string;
  description?: string;
  tags: string[];
  color?: string;
}

export interface UpdateBoardData {
  name?: string;
  description?: string;
  tags?: string[];
  color?: string;
  isArchived?: boolean;
}

// Hook to fetch all boards
export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async (): Promise<Board[]> => {
      const response = await axios.get("/api/boards");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch a specific board
export function useBoard(boardId: string) {
  return useQuery({
    queryKey: ["boards", boardId],
    queryFn: async (): Promise<Board> => {
      const response = await axios.get(`/api/boards/${boardId}`);
      return response.data;
    },
    enabled: !!boardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a board
export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBoardData): Promise<Board> => {
      const response = await axios.post("/api/boards", data);
      return response.data;
    },
    onSuccess: (newBoard) => {
      // Update the boards list
      queryClient.setQueryData(["boards"], (old: Board[] | undefined) => {
        if (!old) return [newBoard];
        return [newBoard, ...old];
      });
      
      // Add the new board to cache
      queryClient.setQueryData(["boards", newBoard.id], newBoard);
      
      toast.success("Board created successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to create board";
      toast.error(message);
    },
  });
}

// Hook to update a board
export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      boardId, 
      data 
    }: { 
      boardId: string; 
      data: UpdateBoardData;
    }): Promise<Board> => {
      const response = await axios.put(`/api/boards/${boardId}`, data);
      return response.data;
    },
    onSuccess: (updatedBoard) => {
      // Update the boards list
      queryClient.setQueryData(["boards"], (old: Board[] | undefined) => {
        if (!old) return [updatedBoard];
        return old.map(board => 
          board.id === updatedBoard.id ? updatedBoard : board
        );
      });
      
      // Update the specific board cache
      queryClient.setQueryData(["boards", updatedBoard.id], updatedBoard);
      
      toast.success("Board updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to update board";
      toast.error(message);
    },
  });
}

// Hook to archive a board
export function useArchiveBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId: string): Promise<void> => {
      await axios.delete(`/api/boards/${boardId}`);
    },
    onSuccess: (_, boardId) => {
      // Remove from boards list
      queryClient.setQueryData(["boards"], (old: Board[] | undefined) => {
        if (!old) return [];
        return old.filter(board => board.id !== boardId);
      });
      
      // Remove from individual board cache
      queryClient.removeQueries({ queryKey: ["boards", boardId] });
      
      toast.success("Board archived successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to archive board";
      toast.error(message);
    },
  });
}
