"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3
} from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Reminder, 
  getReminderStatusColor, 
  getReminderStatusDisplayName,
  isReminderOverdue,
  isReminderUpcoming,
  useCancelReminder
} from "@/hooks/use-reminders";
import { EditReminderDialog } from "./edit-reminder-dialog";

interface ReminderCardProps {
  reminder: Reminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const cancelReminder = useCancelReminder();

  const reminderDate = new Date(reminder.reminderDate);
  const isOverdue = isReminderOverdue(reminder);
  const isUpcoming = isReminderUpcoming(reminder, 1); // Next 24 hours

  function handleCancelReminder() {
    if (confirm("Are you sure you want to cancel this reminder? This action cannot be undone.")) {
      cancelReminder.mutate(reminder.id);
    }
  }

  function getDateDisplay() {
    if (isToday(reminderDate)) {
      return "Today";
    } else if (isTomorrow(reminderDate)) {
      return "Tomorrow";
    } else {
      return format(reminderDate, "MMM d, yyyy");
    }
  }

  function getTimeDisplay() {
    return format(reminderDate, "h:mm a");
  }

  function getStatusIcon() {
    switch (reminder.status) {
      case 'PENDING':
        return isOverdue ? (
          <AlertCircle className="w-4 h-4 text-red-500" />
        ) : (
          <Clock3 className="w-4 h-4 text-yellow-500" />
        );
      case 'SENT':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock3 className="w-4 h-4 text-gray-500" />;
    }
  }

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md",
        isOverdue && "border-l-4 border-l-red-500",
        isUpcoming && !isOverdue && "border-l-4 border-l-yellow-500",
        reminder.status === 'SENT' && "border-l-4 border-l-green-500"
      )}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon()}
                <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm sm:text-base">
                  {reminder.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{getDateDisplay()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeDisplay()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 sm:flex-shrink-0">
              <Badge 
                className={cn(getReminderStatusColor(reminder.status), "text-xs")} 
                variant="secondary"
              >
                {getReminderStatusDisplayName(reminder.status)}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Reminder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleCancelReminder}
                    className="text-red-600"
                    disabled={reminder.status !== 'PENDING'}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Reminder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {reminder.message && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {reminder.message}
            </p>
          )}

          {/* Contact Information */}
          {(reminder.contactName || reminder.contactEmail || reminder.contactPhone) && (
            <div className="space-y-1 mb-3">
              {reminder.contactName && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reminder.contactName}</span>
                </div>
              )}
              {reminder.contactEmail && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reminder.contactEmail}</span>
                </div>
              )}
              {reminder.contactPhone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reminder.contactPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {reminder.notes && (
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{reminder.notes}</span>
            </div>
          )}

          {/* Service Info */}
          {reminder.serviceType && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs text-gray-400">
                <span className="truncate">Delivery method: {reminder.serviceType.toUpperCase()}</span>
                {reminder.sentAt && (
                  <span className="truncate">Sent: {format(new Date(reminder.sentAt), "MMM d, h:mm a")}</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditReminderDialog
        reminder={reminder}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
