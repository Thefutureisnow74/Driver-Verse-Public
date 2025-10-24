import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get session for user context
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Define standardized filter options
    const serviceVerticals = [
      "Food",
      "Package Delivery", 
      "Document Delivery",
      "Rideshare",
      "Freight",
      "Medical",
      "Cannabis Delivery",
      "Pet Transport",
      "Child Transport",
      "Senior Services",
      "Air Transport",
      "Vehicle Transport",
      "Luggage Delivery",
      "Other"
    ];

    const vehicleTypes = [
      { value: "Car", label: "Car (includes Car, Sedan, Prius, EV, Hybrid)" },
      { value: "SUV", label: "SUV (includes SUV, Luxury SUV)" },
      { value: "Van", label: "Van (includes Van, Cargo Van, Minivan, Sprinter Van, Shuttle)" },
      { value: "Truck", label: "Truck (includes Truck, Pickup Truck, Box Truck, Tractor-Trailer)" },
      { value: "Bike", label: "Bike (includes Bike, Bicycle, Scooter)" },
      { value: "Other", label: "Other (includes everything else)" }
    ];

    const contractTypes = [
      { value: "Independent Contractor", label: "Independent Contractor (1099)" },
      { value: "Employee", label: "Employee (W-2)" },
      { value: "Both", label: "Both" },
      { value: "Dedicated Routes", label: "Dedicated Routes" },
      { value: "Contract Routes", label: "Contract Routes" },
      { value: "Scheduled Routes", label: "Scheduled Routes" }
    ];

    // Define standardized area served options
    const areasServed = [
      "United States",
      "California", 
      "Texas",
      "Florida",
      "New York",
      "Illinois",
      "Virginia",
      "Select Cities",
      "Regional",
      "Global",
      "Canada",
      "Australia",
      "Medical Networks",
      "Senior Services",
      "Other"
    ];

    // Get dynamic data from database
    const [
      certificationsRequired,
      companySizes,
      businessModels,
    ] = await Promise.all([
      
      // Get unique certifications required
      prisma.company.findMany({
        select: { certificationsRequired: true },
        where: { isActive: true },
      }).then(companies => 
        Array.from(new Set(companies.flatMap(c => c.certificationsRequired))).sort()
      ),
      
      // Get unique company sizes
      prisma.company.findMany({
        select: { companySize: true },
        where: { 
          isActive: true,
          companySize: { not: null },
        },
        distinct: ['companySize'],
      }).then(companies => companies.map(c => c.companySize).filter(Boolean).sort()),
      
      // Get unique business models
      prisma.company.findMany({
        select: { businessModel: true },
        where: { 
          isActive: true,
          businessModel: { not: null },
        },
        distinct: ['businessModel'],
      }).then(companies => companies.map(c => c.businessModel).filter(Boolean).sort()),
    ]);

    // Get user status options
    const userStatusOptions = ["Researching", "Applied", "Wait List", "Active", "Other"];

    // Get user's company status counts if logged in
    let userStatusCounts = {};
    if (session?.user?.id) {
      const statusCounts = await prisma.userCompanyStatus.groupBy({
        by: ['status'],
        where: { userId: session.user.id },
        _count: { status: true },
      });
      
      userStatusCounts = statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>);
    }

    // Get total company count
    const totalCompanies = await prisma.company.count({
      where: { isActive: true },
    });

    return NextResponse.json({
      filters: {
        vehicleTypes,
        contractTypes,
        serviceVerticals,
        areasServed,
        certificationsRequired,
        companySizes,
        businessModels,
        userStatusOptions,
      },
      userStatusCounts,
      totalCompanies,
    });
  } catch (error) {
    console.error("Error fetching company filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch company filters" },
      { status: 500 }
    );
  }
}
