import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get session for user context
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Search and filters
    const search = searchParams.get("search") || "";
    const vehicleType = searchParams.get("vehicleType");
    const contractType = searchParams.get("contractType");
    const serviceVertical = searchParams.get("serviceVertical");
    const areaServed = searchParams.get("areaServed");
    const state = searchParams.get("state");
    const isActive = searchParams.get("isActive");
    const userStatus = searchParams.get("userStatus"); // Filter by user's status with companies
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const where: any = {};

    // Search in name and description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by vehicle type - handle mapping from UI labels to database values
    if (vehicleType) {
      // Map UI vehicle type to database search
      const vehicleTypeMapping: Record<string, string[]> = {
        "Car": ["Car", "Sedan", "Prius", "EV", "Hybrid"],
        "SUV": ["SUV", "Luxury SUV"],
        "Van": ["Van", "Cargo Van", "Minivan", "Sprinter Van", "Shuttle"],
        "Truck": ["Truck", "Pickup Truck", "Box Truck", "Tractor-Trailer"],
        "Bike": ["Bike", "Bicycle", "Scooter"],
        "Other": [] // Will be handled separately
      };

      if (vehicleType === "Other") {
        // For "Other", exclude all the mapped types
        const allMappedTypes = Object.values(vehicleTypeMapping).flat();
        where.vehicleTypes = {
          hasSome: where.vehicleTypes?.hasSome || [],
          NOT: { hasSome: allMappedTypes }
        };
      } else if (vehicleTypeMapping[vehicleType]) {
        where.vehicleTypes = { hasSome: vehicleTypeMapping[vehicleType] };
      } else {
        // Fallback to exact match
        where.vehicleTypes = { has: vehicleType };
      }
    }

    // Filter by contract type - handle employment type mapping
    if (contractType) {
      const contractTypeMapping: Record<string, string[]> = {
        "Independent Contractor": ["Independent Contractor", "1099"],
        "Employee": ["Employee", "W-2", "Employee (W-2)"],
        "Both": ["Independent Contractor", "Employee", "1099", "W-2", "Both"],
        "Dedicated Routes": ["Dedicated Routes"],
        "Contract Routes": ["Contract Routes"],
        "Scheduled Routes": ["Scheduled Routes"]
      };

      if (contractTypeMapping[contractType]) {
        where.contractType = { in: contractTypeMapping[contractType] };
      } else {
        // Fallback to exact match
        where.contractType = contractType;
      }
    }

    // Filter by service vertical - handle mapping from UI labels to database values
    if (serviceVertical) {
      const serviceVerticalMapping: Record<string, string[]> = {
        "Food": ["Food", "Food Delivery", "Restaurant Delivery"],
        "Package Delivery": ["Package Delivery", "Package", "Delivery", "Parcel Delivery"],
        "Document Delivery": ["Document Delivery", "Document", "Legal Delivery"],
        "Rideshare": ["Rideshare", "Taxi", "Taxi/Rideshare", "Ride Share", "Uber", "Lyft"],
        "Freight": ["Freight", "Trucking", "Logistics", "Cargo"],
        "Medical": ["Medical", "Medical Delivery", "Healthcare", "Pharmaceutical"],
        "Cannabis Delivery": ["Cannabis Delivery", "Cannabis", "Marijuana Delivery"],
        "Pet Transport": ["Pet Transport", "Pet", "Animal Transport"],
        "Child Transport": ["Child Transport", "School Transport", "Student Transport"],
        "Senior Services": ["Senior Services", "Elderly Transport", "Senior Transport"],
        "Air Transport": ["Air Transport", "Airport", "Aviation"],
        "Vehicle Transport": ["Vehicle Transport", "Auto Transport", "Car Transport"],
        "Luggage Delivery": ["Luggage Delivery", "Baggage", "Luggage"],
        "Other": [] // Will be handled separately
      };

      if (serviceVertical === "Other") {
        // For "Other", exclude all the mapped types
        const allMappedTypes = Object.values(serviceVerticalMapping).flat();
        where.serviceVertical = {
          hasSome: where.serviceVertical?.hasSome || [],
          NOT: { hasSome: allMappedTypes }
        };
      } else if (serviceVerticalMapping[serviceVertical]) {
        where.serviceVertical = { hasSome: serviceVerticalMapping[serviceVertical] };
      } else {
        // Fallback to exact match
        where.serviceVertical = { has: serviceVertical };
      }
    }

    // Filter by area served - handle mapping from UI labels to database values
    if (areaServed) {
      const areaServedMapping: Record<string, string[]> = {
        "United States": ["United States", "US", "USA", "Nationwide", "National"],
        "California": ["California", "CA", "Regional CA", "San Francisco CA", "Los Angeles", "LA", "San Gabriel Valley"],
        "Texas": ["Texas", "TX", "Dallas", "Houston", "Austin", "San Antonio"],
        "Florida": ["Florida", "FL", "Miami", "Orlando", "Tampa", "Jacksonville"],
        "New York": ["New York", "NY", "NYC", "New York City", "Manhattan", "Brooklyn"],
        "Illinois": ["Illinois", "IL", "Chicago", "Chicagoland"],
        "Virginia": ["Virginia", "VA", "Richmond VA"],
        "Select Cities": ["Select cities", "US (select cities)", "Select U.S. cities", "US (select metro)", "US (urban cities)"],
        "Regional": ["Regional", "Regional US", "Multiple states", "Metro networks"],
        "Global": ["Global", "International", "Global - 45+ countries"],
        "Canada": ["Canada", "Canadian cities"],
        "Australia": ["Australia", "Australian cities"],
        "Medical Networks": ["Medical networks", "Healthcare systems", "Healthcare zones", "Hospital systems", "Medical delivery networks", "Pharmaceutical zones"],
        "Senior Services": ["Senior communities", "Senior centers", "Senior transport", "NEMT services"],
        "Other": [] // Will be handled separately
      };

      if (areaServed === "Other") {
        // For "Other", exclude all the mapped types
        const allMappedTypes = Object.values(areaServedMapping).flat();
        where.areasServed = {
          hasSome: where.areasServed?.hasSome || [],
          NOT: { hasSome: allMappedTypes }
        };
      } else if (areaServedMapping[areaServed]) {
        where.areasServed = { hasSome: areaServedMapping[areaServed] };
      } else {
        // Fallback to exact match
        where.areasServed = { has: areaServed };
      }
    }

    // Filter by state - handle mapping from state values to database search
    if (state) {
      const stateMapping: Record<string, string[]> = {
        "alabama": ["Alabama", "AL"],
        "alaska": ["Alaska", "AK"],
        "arizona": ["Arizona", "AZ"],
        "arkansas": ["Arkansas", "AR"],
        "california": ["California", "CA", "Regional CA", "San Francisco CA", "Los Angeles", "LA", "San Gabriel Valley"],
        "colorado": ["Colorado", "CO"],
        "connecticut": ["Connecticut", "CT"],
        "delaware": ["Delaware", "DE"],
        "florida": ["Florida", "FL", "Miami", "Orlando", "Tampa", "Jacksonville"],
        "georgia": ["Georgia", "GA"],
        "hawaii": ["Hawaii", "HI"],
        "idaho": ["Idaho", "ID"],
        "illinois": ["Illinois", "IL", "Chicago", "Chicagoland"],
        "indiana": ["Indiana", "IN"],
        "iowa": ["Iowa", "IA"],
        "kansas": ["Kansas", "KS"],
        "kentucky": ["Kentucky", "KY"],
        "louisiana": ["Louisiana", "LA"],
        "maine": ["Maine", "ME"],
        "maryland": ["Maryland", "MD"],
        "massachusetts": ["Massachusetts", "MA"],
        "michigan": ["Michigan", "MI"],
        "minnesota": ["Minnesota", "MN"],
        "mississippi": ["Mississippi", "MS"],
        "missouri": ["Missouri", "MO"],
        "montana": ["Montana", "MT"],
        "nebraska": ["Nebraska", "NE"],
        "nevada": ["Nevada", "NV"],
        "new-hampshire": ["New Hampshire", "NH"],
        "new-jersey": ["New Jersey", "NJ"],
        "new-mexico": ["New Mexico", "NM"],
        "new-york": ["New York", "NY", "NYC", "New York City", "Manhattan", "Brooklyn"],
        "north-carolina": ["North Carolina", "NC"],
        "north-dakota": ["North Dakota", "ND"],
        "ohio": ["Ohio", "OH"],
        "oklahoma": ["Oklahoma", "OK"],
        "oregon": ["Oregon", "OR"],
        "pennsylvania": ["Pennsylvania", "PA"],
        "rhode-island": ["Rhode Island", "RI"],
        "south-carolina": ["South Carolina", "SC"],
        "south-dakota": ["South Dakota", "SD"],
        "tennessee": ["Tennessee", "TN"],
        "texas": ["Texas", "TX", "Dallas", "Houston", "Austin", "San Antonio"],
        "utah": ["Utah", "UT"],
        "vermont": ["Vermont", "VT"],
        "virginia": ["Virginia", "VA", "Richmond VA"],
        "washington": ["Washington", "WA"],
        "west-virginia": ["West Virginia", "WV"],
        "wisconsin": ["Wisconsin", "WI"],
        "wyoming": ["Wyoming", "WY"],
        "district-of-columbia": ["District of Columbia", "DC", "Washington DC"]
      };

      if (stateMapping[state]) {
        where.areasServed = { hasSome: stateMapping[state] };
      } else {
        // Fallback to exact match
        where.areasServed = { has: state };
      }
    }

    // Filter by active status
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Filter by user status (if user is logged in)
    if (userStatus && session?.user?.id) {
      where.userStatuses = {
        some: {
          userId: session.user.id,
          status: userStatus,
        },
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === "averagePay") {
      orderBy.averagePay = sortOrder;
    }

    // Get companies with pagination
    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          userStatuses: session?.user?.id ? {
            where: { userId: session.user.id },
            select: { status: true, notes: true, updatedAt: true },
          } : false,
        },
      }),
      prisma.company.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin privileges
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const {
      name,
      vehicleTypes,
      serviceVertical,
      contractType,
      areasServed,
      averagePay,
      insuranceRequirements,
      licenseRequirements,
      certificationsRequired,
      website,
      contactEmail,
      contactPhone,
      description,
      logoUrl,
      workflowStatus,
      yearEstablished,
      companySize,
      headquarters,
      businessModel,
      companyMission,
      targetCustomers,
      companyCulture,
      videoUrl,
    } = body;

    if (!name || !serviceVertical || !contractType) {
      return NextResponse.json(
        { error: "Missing required fields: name, serviceVertical, contractType" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        vehicleTypes: vehicleTypes || [],
        serviceVertical,
        contractType,
        areasServed: areasServed || [],
        averagePay,
        insuranceRequirements,
        licenseRequirements,
        certificationsRequired: certificationsRequired || [],
        website,
        contactEmail,
        contactPhone,
        description,
        logoUrl,
        workflowStatus,
        yearEstablished,
        companySize,
        headquarters,
        businessModel,
        companyMission,
        targetCustomers,
        companyCulture,
        videoUrl,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
