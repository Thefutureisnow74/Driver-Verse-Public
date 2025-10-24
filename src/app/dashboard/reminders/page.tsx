"use client";

import { useState } from "react";
import { useReminders, useUpcomingReminders, ReminderStatus } from "@/hooks/use-reminders";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Search, Bell, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { CreateReminderDialog } from "./_components/create-reminder-dialog";
import { ReminderCard } from "./_components/reminder-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type ViewMode = "all" | "upcoming" | "status";
type StatusFilter = ReminderStatus | "all";

export default function RemindersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("upcoming");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data based on view mode
  const { data: allReminders, isLoading: allLoading } = useReminders(
    statusFilter !== "all" ? statusFilter : undefined
  );
  const { data: upcomingReminders, isLoading: upcomingLoading } = useUpcomingReminders();

  const isLoading = viewMode === "upcoming" ? upcomingLoading : allLoading;
  const reminders = viewMode === "upcoming" ? upcomingReminders : allReminders;

  // Filter reminders based on search term
  const filteredReminders = reminders?.filter((reminder) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      reminder.title.toLowerCase().includes(searchLower) ||
      reminder.message?.toLowerCase().includes(searchLower) ||
      reminder.contactName?.toLowerCase().includes(searchLower) ||
      reminder.notes?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Get stats for badges
  const upcomingCount = upcomingReminders?.length || 0;
  const pendingCount = allReminders?.filter(r => r.status === ReminderStatus.PENDING).length || 0;
  const sentCount = allReminders?.filter(r => r.status === ReminderStatus.SENT).length || 0;
  const failedCount = allReminders?.filter(r => r.status === ReminderStatus.FAILED).length || 0;

  if (isLoading) {
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
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your personal reminders and stay organized
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Reminder
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Upcoming</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0 ml-2" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0 ml-2" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Sent</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{sentCount}</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0 ml-2" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Failed</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{failedCount}</p>
            </div>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* View Tabs and Filters */}
      <div className="bg-white rounded-lg border p-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <div className="flex flex-col gap-4 mb-4">
            {/* Tabs Row */}
            <div className="flex items-center justify-between">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="upcoming" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Upcoming</span>
                  <span className="sm:hidden">Up</span>
                  {upcomingCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {upcomingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">All Reminders</span>
                  <span className="sm:hidden">All</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {viewMode === "all" && (
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={ReminderStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ReminderStatus.SENT}>Sent</SelectItem>
                    <SelectItem value={ReminderStatus.FAILED}>Failed</SelectItem>
                    <SelectItem value={ReminderStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="relative flex-1 sm:max-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reminders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            <div className="space-y-4">
              {filteredReminders.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No upcoming reminders
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any reminders scheduled for the near future.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Reminder
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredReminders.map((reminder) => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {filteredReminders.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? "No reminders found" : "No reminders yet"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? "Try adjusting your search terms or filters."
                      : "Create your first reminder to get started."
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Reminder
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 mb-4">
                    {filteredReminders.length} reminder{filteredReminders.length !== 1 ? 's' : ''} found
                  </div>
                  <div className="grid gap-4">
                    {filteredReminders.map((reminder) => (
                      <ReminderCard key={reminder.id} reminder={reminder} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Reminder Dialog */}
      <CreateReminderDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
