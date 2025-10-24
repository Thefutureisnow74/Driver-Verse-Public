import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { reminderService, determineReminderType } from "@/lib/reminder-service";
import { ReminderStatus } from "@/generated/prisma";

const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  message: z.string().max(1000, "Message is too long").optional(),
  reminderDate: z.string().datetime("Invalid date format"),
  contactName: z.string().max(100, "Contact name is too long").optional(),
  contactPhone: z.string().max(20, "Phone number is too long").optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
});

// GET /api/reminders - Get all reminders for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    let whereClause: any = {
      userId: session.user.id,
      isActive: true,
    };

    if (status && Object.values(ReminderStatus).includes(status as ReminderStatus)) {
      whereClause.status = status;
    }

    if (upcoming) {
      whereClause.reminderDate = {
        gte: new Date(),
      };
      whereClause.status = ReminderStatus.PENDING;
    }

    const reminders = await prisma.reminder.findMany({
      where: whereClause,
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reminders - Create a new reminder
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createReminderSchema.parse(body);

    const reminderDate = new Date(validatedData.reminderDate);
    
    // Check if reminder date is in the future
    if (reminderDate <= new Date()) {
      return NextResponse.json(
        { error: "Reminder date must be in the future" },
        { status: 400 }
      );
    }

    // Create reminder in database
    const reminder = await prisma.reminder.create({
      data: {
        ...validatedData,
        reminderDate,
        userId: session.user.id,
      },
    });

    // Schedule reminder with external service
    try {
      const reminderType = determineReminderType(
        validatedData.contactEmail,
        validatedData.contactPhone
      );

      const serviceRequest = {
        id: reminder.id,
        type: reminderType,
        recipient: {
          email: validatedData.contactEmail || session.user.email,
          phone: validatedData.contactPhone,
          name: validatedData.contactName || session.user.name,
        },
        content: {
          subject: `Reminder: ${validatedData.title}`,
          message: validatedData.message || validatedData.title,
          scheduledFor: reminderDate,
        },
        metadata: {
          userId: session.user.id,
          reminderId: reminder.id,
        },
      };

      const serviceResponse = reminderType === 'email' 
        ? await reminderService.scheduleEmailReminder(serviceRequest)
        : await reminderService.scheduleSMSReminder(serviceRequest);

      // Update reminder with external service information
      if (serviceResponse.success && serviceResponse.externalId) {
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            externalId: serviceResponse.externalId,
            serviceType: reminderType,
          },
        });
      }
    } catch (serviceError) {
      console.error("Failed to schedule reminder with external service:", serviceError);
      // Continue - reminder is still created in database
    }

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
