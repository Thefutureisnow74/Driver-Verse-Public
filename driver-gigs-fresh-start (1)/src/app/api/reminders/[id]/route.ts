import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { reminderService, determineReminderType, SendReminderRequest } from "@/lib/reminder-service";
import { ReminderStatus } from "@/generated/prisma";

const updateReminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").optional(),
  message: z.string().max(1000, "Message is too long").optional(),
  reminderDate: z.string().datetime("Invalid date format").optional(),
  contactName: z.string().max(100, "Contact name is too long").optional(),
  contactPhone: z.string().max(20, "Phone number is too long").optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
  status: z.nativeEnum(ReminderStatus).optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/reminders/[id] - Get a specific reminder
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!reminder) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json(reminder);
  } catch (error) {
    console.error("Error fetching reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/reminders/[id] - Update a reminder
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify reminder ownership
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingReminder) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateReminderSchema.parse(body);

    let updateData: any = { ...validatedData };

    // Handle date updates
    if (validatedData.reminderDate) {
      const reminderDate = new Date(validatedData.reminderDate);
      
      // Check if reminder date is in the future (only for pending reminders)
      if (existingReminder.status === ReminderStatus.PENDING && reminderDate <= new Date()) {
        return NextResponse.json(
          { error: "Reminder date must be in the future" },
          { status: 400 }
        );
      }

      updateData.reminderDate = reminderDate;

      // If date is changing for a pending reminder, reschedule with external service
      if (existingReminder.status === ReminderStatus.PENDING && 
          existingReminder.externalId && 
          reminderDate.getTime() !== existingReminder.reminderDate.getTime()) {
        
        try {
          // Cancel old reminder
          await reminderService.cancelReminder(
            existingReminder.externalId,
            existingReminder.serviceType as 'email' | 'sms'
          );

          // Schedule new reminder
          const reminderType = determineReminderType(
            validatedData.contactEmail || existingReminder.contactEmail || undefined,
            validatedData.contactPhone || existingReminder.contactPhone || undefined
          );

          const serviceRequest = {
            id: existingReminder.id,
            type: reminderType,
            recipient: {
              email: validatedData.contactEmail || existingReminder.contactEmail || session.user.email,
              phone: validatedData.contactPhone || existingReminder.contactPhone,
              name: validatedData.contactName || existingReminder.contactName || session.user.name,
            },
            content: {
              subject: `Reminder: ${validatedData.title || existingReminder.title}`,
              message: validatedData.message || existingReminder.message || validatedData.title || existingReminder.title,
              scheduledFor: reminderDate,
            },
            metadata: {
              userId: session.user.id,
              reminderId: existingReminder.id,
            },
          };

          const serviceResponse = reminderType === 'email' 
            ? await reminderService.scheduleEmailReminder(serviceRequest as SendReminderRequest)
            : await reminderService.scheduleSMSReminder(serviceRequest as SendReminderRequest);

          if (serviceResponse.success && serviceResponse.externalId) {
            updateData.externalId = serviceResponse.externalId;
            updateData.serviceType = reminderType;
          }
        } catch (serviceError) {
          console.error("Failed to reschedule reminder:", serviceError);
        }
      }
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedReminder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders/[id] - Cancel/delete a reminder
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify reminder ownership
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingReminder) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    // Cancel with external service if it's pending
    if (existingReminder.status === ReminderStatus.PENDING && existingReminder.externalId) {
      try {
        await reminderService.cancelReminder(
          existingReminder.externalId,
          existingReminder.serviceType as 'email' | 'sms'
        );
      } catch (serviceError) {
        console.error("Failed to cancel reminder with external service:", serviceError);
      }
    }

    // Soft delete by marking as cancelled and inactive
    await prisma.reminder.update({
      where: { id },
      data: { 
        status: ReminderStatus.CANCELLED,
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Reminder cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
