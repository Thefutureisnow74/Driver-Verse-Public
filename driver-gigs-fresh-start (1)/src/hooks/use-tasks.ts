import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Task, TaskStatus, TaskPriority, Board } from "./use-boards";
// Re-export types and enums for convenience
export type { Task, Board } from "./use-boards";
export { TaskStatus, TaskPriority } from "@/generated/prisma";

export interface CreateTaskData {
  boardId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  tags?: string[];
  assignedTo?: string;
  position?: number;
}

export interface MoveTaskData {
  taskId: string;
  newStatus: TaskStatus;
  newPosition: number;
}

// Hook to fetch tasks for a specific board
export function useTasks(boardId: string) {
  return useQuery({
    queryKey: ["tasks", boardId],
    queryFn: async (): Promise<Task[]> => {
      const response = await axios.get(`/api/tasks?boardId=${boardId}`);
      return response.data;
    },
    enabled: !!boardId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch a specific task
export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["tasks", "single", taskId],
    queryFn: async (): Promise<Task & { board: Board }> => {
      const response = await axios.get(`/api/tasks/${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to create a task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskData): Promise<Task> => {
      const response = await axios.post("/api/tasks", data);
      return response.data;
    },
    onSuccess: (newTask) => {
      // Update the tasks list for this board
      queryClient.setQueryData(["tasks", newTask.boardId], (old: Task[] | undefined) => {
        if (!old) return [newTask];
        return [...old, newTask];
      });
      
      // Update the board's task count
      queryClient.setQueryData(["boards", newTask.boardId], (old: Board | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: [...old.tasks, newTask],
          _count: {
            ...old._count,
            tasks: old._count.tasks + 1,
          },
        };
      });
      
      // Update boards list
      queryClient.setQueryData(["boards"], (old: Board[] | undefined) => {
        if (!old) return old;
        return old.map(board => 
          board.id === newTask.boardId 
            ? {
                ...board,
                tasks: [...board.tasks, newTask],
                _count: {
                  ...board._count,
                  tasks: board._count.tasks + 1,
                },
              }
            : board
        );
      });
      
      toast.success("Task created successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to create task";
      toast.error(message);
    },
  });
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      data 
    }: { 
      taskId: string; 
      data: UpdateTaskData;
    }): Promise<Task> => {
      const response = await axios.put(`/api/tasks/${taskId}`, data);
      return response.data;
    },
    onSuccess: (updatedTask) => {
      // Update the tasks list
      queryClient.setQueryData(["tasks", updatedTask.boardId], (old: Task[] | undefined) => {
        if (!old) return [updatedTask];
        return old.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      
      // Update individual task cache
      queryClient.setQueryData(["tasks", "single", updatedTask.id], updatedTask);
      
      // Update board cache
      queryClient.setQueryData(["boards", updatedTask.boardId], (old: Board | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          ),
        };
      });
      
      // Update boards list
      queryClient.setQueryData(["boards"], (old: Board[] | undefined) => {
        if (!old) return old;
        return old.map(board => 
          board.id === updatedTask.boardId 
            ? {
                ...board,
                tasks: board.tasks.map(task => 
                  task.id === updatedTask.id ? updatedTask : task
                ),
              }
            : board
        );
      });
      
      toast.success("Task updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to update task";
      toast.error(message);
    },
  });
}

// Hook to move a task (drag and drop)
export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MoveTaskData): Promise<Task> => {
      const response = await axios.post("/api/tasks/move", data);
      return response.data;
    },
    onMutate: async (data: MoveTaskData) => {
      // Optimistic update - cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      
      // Get the current task to know which board it belongs to
      const currentTask = queryClient.getQueryData<Task[]>(["tasks"])?.find(
        task => task.id === data.taskId
      );
      
      if (!currentTask) return;
      
      // Optimistically update the tasks list
      queryClient.setQueryData(["tasks", currentTask.boardId], (old: Task[] | undefined) => {
        if (!old) return old;
        
        // Create a copy of the tasks
        const tasks = [...old];
        const taskIndex = tasks.findIndex(task => task.id === data.taskId);
        
        if (taskIndex === -1) return old;
        
        const task = { ...tasks[taskIndex] };
        task.status = data.newStatus;
        task.position = data.newPosition;
        
        tasks[taskIndex] = task;
        
        // Sort by status and position
        return tasks.sort((a, b) => {
          if (a.status !== b.status) {
            const statusOrder = [
              TaskStatus.TODO,
              TaskStatus.IN_PROGRESS,
              TaskStatus.PENDING,
              TaskStatus.DONE,
              TaskStatus.DROPPED,
            ];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          }
          return a.position - b.position;
        });
      });
      
      return { currentTask };
    },
    onError: (error: any, data, context) => {
      // Revert optimistic update on error
      if (context?.currentTask) {
        queryClient.setQueryData(["tasks", context.currentTask.boardId], (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map(task => 
            task.id === data.taskId ? context.currentTask : task
          );
        });
      }
      
      const message = error.response?.data?.error || "Failed to move task";
      toast.error(message);
    },
    onSuccess: (updatedTask) => {
      // Update with the server response
      queryClient.setQueryData(["tasks", updatedTask.boardId], (old: Task[] | undefined) => {
        if (!old) return [updatedTask];
        return old.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
    },
  });
}

// Helper function to group tasks by status
export function groupTasksByStatus(tasks: Task[]) {
  return {
    [TaskStatus.TODO]: tasks.filter(task => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.PENDING]: tasks.filter(task => task.status === TaskStatus.PENDING),
    [TaskStatus.DONE]: tasks.filter(task => task.status === TaskStatus.DONE),
    [TaskStatus.DROPPED]: tasks.filter(task => task.status === TaskStatus.DROPPED),
  };
}

// Helper function to get task status display name
export function getTaskStatusDisplayName(status: TaskStatus): string {
  const statusNames = {
    [TaskStatus.TODO]: "To Do",
    [TaskStatus.IN_PROGRESS]: "In Progress",
    [TaskStatus.PENDING]: "Pending",
    [TaskStatus.DONE]: "Done",
    [TaskStatus.DROPPED]: "Dropped",
  };
  
  return statusNames[status];
}

// Helper function to get task priority color
export function getTaskPriorityColor(priority?: TaskPriority): string {
  if (!priority) return "bg-gray-100 text-gray-800";
  
  const priorityColors = {
    [TaskPriority.LOW]: "bg-green-100 text-green-800",
    [TaskPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [TaskPriority.HIGH]: "bg-orange-100 text-orange-800",
    [TaskPriority.URGENT]: "bg-red-100 text-red-800",
  };
  
  return priorityColors[priority];
}
