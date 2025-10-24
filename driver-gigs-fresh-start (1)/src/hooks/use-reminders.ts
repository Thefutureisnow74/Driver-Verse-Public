import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ReminderStatus as ReminderStatusType } from "@/generated/prisma";
// Re-export enum from Prisma for convenience
export { ReminderStatus  } from "@/generated/prisma";
export type { ReminderStatus as ReminderStatusType } from "@/generated/prisma";

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  message?: string;
  reminderDate: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  status: ReminderStatusType;
  isActive: boolean;
  externalId?: string;
  serviceType?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface CreateReminderData {
  title: string;
  message?: string;
  reminderDate: string; // ISO string
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

export interface UpdateReminderData {
  title?: string;
  message?: string;
  reminderDate?: string; // ISO string
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  status?: ReminderStatusType;
}

// Hook to fetch all reminders
export function useReminders(status?: string, upcoming?: boolean) {
  return useQuery({
    queryKey: ["reminders", { status, upcoming }],
    queryFn: async (): Promise<Reminder[]> => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (upcoming) params.append('upcoming', 'true');
      
      const response = await axios.get(`/api/reminders?${params.toString()}`);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch upcoming reminders (next 7 days)
export function useUpcomingReminders() {
  return useReminders(undefined, true);
}

// Hook to fetch reminders by status
export function useRemindersByStatus(status: ReminderStatusType) {
  return useReminders(status);
}

// Hook to fetch a specific reminder
export function useReminder(reminderId: string) {
  return useQuery({
    queryKey: ["reminders", reminderId],
    queryFn: async (): Promise<Reminder> => {
      const response = await axios.get(`/api/reminders/${reminderId}`);
      return response.data;
    },
    enabled: !!reminderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to create a reminder
export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReminderData): Promise<Reminder> => {
      const response = await axios.post("/api/reminders", data);
      return response.data;
    },
    onSuccess: (newReminder) => {
      // Update all reminders queries
      queryClient.setQueryData(["reminders"], (old: Reminder[] | undefined) => {
        if (!old) return [newReminder];
        return [newReminder, ...old];
      });
      
      // Update upcoming reminders if applicable
      const reminderDate = new Date(newReminder.reminderDate);
      const now = new Date();
      if (reminderDate > now) {
        queryClient.setQueryData(
          ["reminders", { upcoming: true }], 
          (old: Reminder[] | undefined) => {
            if (!old) return [newReminder];
            return [newReminder, ...old].sort((a, b) => 
              new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
            );
          }
        );
      }
      
      // Update status-based queries
      queryClient.setQueryData(
        ["reminders", { status: newReminder.status }], 
        (old: Reminder[] | undefined) => {
          if (!old) return [newReminder];
          return [newReminder, ...old];
        }
      );
      
      // Add the new reminder to cache
      queryClient.setQueryData(["reminders", newReminder.id], newReminder);
      
      toast.success("Reminder created successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to create reminder";
      toast.error(message);
    },
  });
}

// Hook to update a reminder
export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      reminderId, 
      data 
    }: { 
      reminderId: string; 
      data: UpdateReminderData;
    }): Promise<Reminder> => {
      const response = await axios.put(`/api/reminders/${reminderId}`, data);
      return response.data;
    },
    onSuccess: (updatedReminder) => {
      // Update all reminders queries
      queryClient.setQueryData(["reminders"], (old: Reminder[] | undefined) => {
        if (!old) return [updatedReminder];
        return old.map(reminder => 
          reminder.id === updatedReminder.id ? updatedReminder : reminder
        );
      });
      
      // Update upcoming reminders
      queryClient.setQueryData(
        ["reminders", { upcoming: true }], 
        (old: Reminder[] | undefined) => {
          if (!old) return old;
          const reminderDate = new Date(updatedReminder.reminderDate);
          const now = new Date();
          
          if (reminderDate > now && updatedReminder.status === 'PENDING') {
            // Add or update in upcoming
            const filtered = old.filter(r => r.id !== updatedReminder.id);
            return [...filtered, updatedReminder].sort((a, b) => 
              new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
            );
          } else {
            // Remove from upcoming
            return old.filter(r => r.id !== updatedReminder.id);
          }
        }
      );
      
      // Update status-based queries
      Object.values(['PENDING', 'SENT', 'FAILED', 'CANCELLED']).forEach(status => {
        queryClient.setQueryData(
          ["reminders", { status }], 
          (old: Reminder[] | undefined) => {
            if (!old) return old;
            
            if (updatedReminder.status === status) {
              // Add or update in this status
              const filtered = old.filter(r => r.id !== updatedReminder.id);
              return [...filtered, updatedReminder];
            } else {
              // Remove from this status
              return old.filter(r => r.id !== updatedReminder.id);
            }
          }
        );
      });
      
      // Update individual reminder cache
      queryClient.setQueryData(["reminders", updatedReminder.id], updatedReminder);
      
      toast.success("Reminder updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to update reminder";
      toast.error(message);
    },
  });
}

// Hook to cancel/delete a reminder
export function useCancelReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminderId: string): Promise<void> => {
      await axios.delete(`/api/reminders/${reminderId}`);
    },
    onSuccess: (_, reminderId) => {
      // Remove from all queries
      queryClient.setQueryData(["reminders"], (old: Reminder[] | undefined) => {
        if (!old) return [];
        return old.filter(reminder => reminder.id !== reminderId);
      });
      
      queryClient.setQueryData(
        ["reminders", { upcoming: true }], 
        (old: Reminder[] | undefined) => {
          if (!old) return [];
          return old.filter(reminder => reminder.id !== reminderId);
        }
      );
      
      // Remove from status-based queries
      Object.values(['PENDING', 'SENT', 'FAILED', 'CANCELLED']).forEach(status => {
        queryClient.setQueryData(
          ["reminders", { status }], 
          (old: Reminder[] | undefined) => {
            if (!old) return [];
            return old.filter(reminder => reminder.id !== reminderId);
          }
        );
      });
      
      // Remove from individual cache
      queryClient.removeQueries({ queryKey: ["reminders", reminderId] });
      
      toast.success("Reminder cancelled successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to cancel reminder";
      toast.error(message);
    },
  });
}

// Helper functions
export function isReminderOverdue(reminder: Reminder): boolean {
  return new Date(reminder.reminderDate) < new Date() && reminder.status === 'PENDING';
}

export function isReminderUpcoming(reminder: Reminder, days: number = 7): boolean {
  const reminderDate = new Date(reminder.reminderDate);
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return reminderDate > now && reminderDate <= futureDate && reminder.status === 'PENDING';
}

export function formatReminderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getReminderStatusColor(status: ReminderStatusType): string {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SENT: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };
  
  return colors[status as keyof typeof colors];
}

export function getReminderStatusDisplayName(status: ReminderStatusType): string {
  const names = {
    PENDING: "Pending",
    SENT: "Sent",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
  };
  
  return names[status as keyof typeof names];
}
