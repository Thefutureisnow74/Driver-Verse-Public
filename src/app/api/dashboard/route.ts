import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export interface DashboardData {
  overview: {
    updatedAt: string;
    activeCompanies: {
      count: number;
      change: string;
    };
    newOpportunities: {
      count: number;
      change: string;
    };
    researching: {
      count: number;
      status: string;
    };
    applied: {
      count: number;
      status: string;
    };
    waitList: {
      count: number;
      status: string;
    };
    other: {
      count: number;
      status: string;
    };
    vehicleAlerts: {
      count: number;
      status: string;
    };
  };
}

/**
 * GET /api/dashboard - Get dashboard statistics for the authenticated user
 * Returns real-time data about user's company statuses and vehicle information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get company status counts
    const [
      activeCompaniesCount,
      researchingCount,
      appliedCount,
      waitListCount,
      otherCount,
      totalCompaniesCount,
      vehicleCount,
      // Get counts from last week for comparison
      lastWeekActiveCount,
      lastWeekTotalCount
    ] = await Promise.all([
      // Current counts
      prisma.userCompanyStatus.count({
        where: { userId, status: "Active" }
      }),
      prisma.userCompanyStatus.count({
        where: { userId, status: "Researching" }
      }),
      prisma.userCompanyStatus.count({
        where: { userId, status: "Applied" }
      }),
      prisma.userCompanyStatus.count({
        where: { userId, status: "Wait List" }
      }),
      prisma.userCompanyStatus.count({
        where: { userId, status: "Other" }
      }),
      prisma.userCompanyStatus.count({
        where: { userId }
      }),
      prisma.vehicle.count({
        where: { userId }
      }),
      // Last week counts for comparison
      prisma.userCompanyStatus.count({
        where: { 
          userId, 
          status: "Active",
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.userCompanyStatus.count({
        where: { 
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate new opportunities (companies added in last 7 days)
    const newOpportunitiesCount = await prisma.userCompanyStatus.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Calculate vehicle alerts (vehicles without required documents or expiring insurance)
    const vehicles = await prisma.vehicle.findMany({
      where: { userId },
      select: {
        id: true,
        insuranceDocs: true,
        registrationDocs: true,
        insuranceInfo: true
      }
    });

    let vehicleAlertsCount = 0;
    vehicles.forEach(vehicle => {
      // Check for missing insurance documents
      const insuranceDocs = vehicle.insuranceDocs as any;
      if (!insuranceDocs?.insuranceCards?.length && !insuranceDocs?.insurancePolicy?.length) {
        vehicleAlertsCount++;
      }
      
      // Check for missing registration documents
      const registrationDocs = vehicle.registrationDocs as any;
      if (!registrationDocs?.registration?.length && !registrationDocs?.title?.length) {
        vehicleAlertsCount++;
      }
    });

    // Calculate changes
    const activeChange = activeCompaniesCount - lastWeekActiveCount;
    const newOpportunitiesChange = lastWeekTotalCount;

    const data: DashboardData = {
      overview: {
        updatedAt: new Date().toISOString(),
        activeCompanies: {
          count: activeCompaniesCount,
          change: activeChange > 0 ? `+${activeChange} this week` : activeChange < 0 ? `${activeChange} this week` : "No change"
        },
        newOpportunities: {
          count: newOpportunitiesCount,
          change: newOpportunitiesChange > 0 ? `+${newOpportunitiesChange} this week` : "No new opportunities"
        },
        researching: {
          count: researchingCount,
          status: researchingCount > 0 ? "In progress" : "None active"
        },
        applied: {
          count: appliedCount,
          status: appliedCount > 0 ? "Pending review" : "No applications"
        },
        waitList: {
          count: waitListCount,
          status: waitListCount > 0 ? "Waiting for response" : "None pending"
        },
        other: {
          count: otherCount,
          status: otherCount > 0 ? "Various statuses" : "None"
        },
        vehicleAlerts: {
          count: vehicleAlertsCount,
          status: vehicleAlertsCount > 0 ? "Action required" : "All up to date"
        }
      }
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
