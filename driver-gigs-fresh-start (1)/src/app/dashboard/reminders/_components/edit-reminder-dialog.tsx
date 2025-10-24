"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Reminder, useUpdateReminder } from "@/hooks/use-reminders";

const editReminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  message: z.string().max(1000, "Message is too long").optional(),
  date: z.date(),
  time: z.string().min(1, "Time is required"),
  contactName: z.string().max(100, "Contact name is too long").optional(),
  contactPhone: z.string().max(20, "Phone number is too long").optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
});

type EditReminderFormData = z.infer<typeof editReminderSchema>;

interface EditReminderDialogProps {
  reminder: Reminder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditReminderDialog({ reminder, open, onOpenChange }: EditReminderDialogProps) {
  const updateReminder = useUpdateReminder();

  const form = useForm({
    resolver: zodResolver(editReminderSchema),
    defaultValues: {
      title: reminder.title,
      message: reminder.message || "",
      date: new Date(reminder.reminderDate),
      time: format(new Date(reminder.reminderDate), "HH:mm"),
      contactName: reminder.contactName || "",
      contactPhone: reminder.contactPhone || "",
      contactEmail: reminder.contactEmail || "",
      notes: reminder.notes || "",
    },
  });

  // Reset form when reminder changes
  useEffect(() => {
    const reminderDate = new Date(reminder.reminderDate);
    form.reset({
      title: reminder.title,
      message: reminder.message || "",
      date: reminderDate,
      time: format(reminderDate, "HH:mm"),
      contactName: reminder.contactName || "",
      contactPhone: reminder.contactPhone || "",
      contactEmail: reminder.contactEmail || "",
      notes: reminder.notes || "",
    });
  }, [reminder, form]);

  function onSubmit(data: any) {
    // Combine date and time into ISO string
    const [hours, minutes] = data.time.split(':').map(Number);
    const reminderDate = new Date(data.date);
    reminderDate.setHours(hours, minutes, 0, 0);

    const updateData = {
      title: data.title,
      message: data.message || undefined,
      reminderDate: reminderDate.toISOString(),
      contactName: data.contactName || undefined,
      contactPhone: data.contactPhone || undefined,
      contactEmail: data.contactEmail || undefined,
      notes: data.notes || undefined,
    };

    updateReminder.mutate({
      reminderId: reminder.id,
      data: updateData,
    }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  const canEdit = reminder.status === 'PENDING';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
          {!canEdit && (
            <p className="text-sm text-muted-foreground text-yellow-600">
              This reminder cannot be edited because it has already been {reminder.status.toLowerCase()}.
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What to remind you about *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter reminder title"
                      disabled={!canEdit}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={!canEdit}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>dd/mm/yyyy</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="time"
                          placeholder="--:-- --"
                          disabled={!canEdit}
                          {...field} 
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional message or details..."
                      rows={3}
                      disabled={!canEdit}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Contact Information (Optional)</h4>
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contact person name"
                        disabled={!canEdit}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Phone number"
                          type="tel"
                          disabled={!canEdit}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email address"
                          type="email"
                          disabled={!canEdit}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes..."
                      rows={2}
                      disabled={!canEdit}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateReminder.isPending}
              >
                {canEdit ? "Cancel" : "Close"}
              </Button>
              {canEdit && (
                <Button 
                  type="submit" 
                  disabled={updateReminder.isPending}
                >
                  {updateReminder.isPending ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
