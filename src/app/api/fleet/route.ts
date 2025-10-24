import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/fleet - Get all vehicles for the user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

// POST /api/fleet - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      nickname,
      year,
      make,
      model,
      vehicleType,
      color,
      vin,
      licensePlate,
      state,
      mileage,
      fuelType,
      mpg,
      ownerNames,
      purchaseLocation,
      financialInfo,
      specifications,
      insuranceInfo,
      vehiclePhotos,
      insuranceDocs,
      registrationDocs,
      warrantyDocs,
      maintenanceDocs,
      otherDocs,
      notes
    } = body;

    // Validate required fields
    if (!nickname || !make || !model) {
      return NextResponse.json(
        { error: "Nickname, make, and model are required" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: session.user.id,
        nickname: nickname.trim(),
        year: year ? parseInt(year) : null,
        make: make.trim(),
        model: model.trim(),
        vehicleType: vehicleType?.trim() || null,
        color: color?.trim() || null,
        vin: vin?.trim() || null,
        licensePlate: licensePlate?.trim() || null,
        state: state?.trim() || null,
        mileage: mileage ? parseInt(mileage) : null,
        fuelType: fuelType?.trim() || null,
        mpg: mpg ? parseFloat(mpg) : null,
        ownerNames: ownerNames?.trim() || null,
        purchaseLocation: purchaseLocation?.trim() || null,
        financialInfo: financialInfo || null,
        specifications: specifications || null,
        insuranceInfo: insuranceInfo || null,
        vehiclePhotos: vehiclePhotos || undefined,
        insuranceDocs: insuranceDocs ? {
          insurancePolicy: insuranceDocs.insurancePolicy || [],
          insuranceCards: insuranceDocs.insuranceCards || []
        } : undefined,
        registrationDocs: registrationDocs ? {
          registration: registrationDocs.registration || [],
          title: registrationDocs.title || []
        } : undefined,
        warrantyDocs: warrantyDocs ? {
          vehicleWarranty: warrantyDocs.vehicleWarranty || [],
          tireWarranty: warrantyDocs.tireWarranty || [],
          partsWarranty: warrantyDocs.partsWarranty || []
        } : undefined,
        maintenanceDocs: maintenanceDocs || undefined,
        otherDocs: otherDocs || undefined,
        notes: notes?.trim() || null,
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
