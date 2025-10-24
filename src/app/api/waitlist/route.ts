import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

/**
 * Schema for waitlist signup validation
 */
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  interests: z.array(z.string()).optional(),
  source: z.enum(['HOMEPAGE', 'LANDING_PAGE', 'BLOG', 'SOCIAL_MEDIA', 'REFERRAL', 'ADVERTISEMENT', 'OTHER']).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

/**
 * POST /api/waitlist
 * Add email to waitlist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validatedData = waitlistSchema.parse(body);
    
    // Get additional tracking data from headers
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : 
                     request.headers.get('x-real-ip') || 
                     undefined;

    // Check if email already exists
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email: validatedData.email }
    });

    if (existingEntry) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email already registered for waitlist" 
        },
        { status: 409 }
      );
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        company: validatedData.company,
        phone: validatedData.phone,
        message: validatedData.message,
        interests: validatedData.interests || [],
        source: validatedData.source || 'HOMEPAGE',
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        referrer,
        ipAddress,
        userAgent,
      }
    });

    // TODO: Send confirmation email
    // TODO: Add to email marketing list
    // TODO: Trigger analytics event

    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist",
      id: waitlistEntry.id
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid data provided",
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist
 * Get waitlist statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    
    const [
      totalCount,
      pendingCount,
      notifiedCount,
      recentSignups
    ] = await Promise.all([
      prisma.waitlist.count(),
      prisma.waitlist.count({ where: { status: 'PENDING' } }),
      prisma.waitlist.count({ where: { notified: true } }),
      prisma.waitlist.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ]);

    // Get source breakdown
    const sourceBreakdown = await prisma.waitlist.groupBy({
      by: ['source'],
      _count: {
        source: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        total: totalCount,
        pending: pendingCount,
        notified: notifiedCount,
        recentSignups,
        sourceBreakdown: sourceBreakdown.reduce((acc, item) => {
          acc[item.source] = item._count.source;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Waitlist stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
