import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/fleet/[id] - Get a specific vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: id,
        userId: session.user.id // Ensure user can only access their own vehicles
      }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

// PUT /api/fleet/[id] - Update a vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if the vehicle exists and belongs to the user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
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

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

// DELETE /api/fleet/[id] - Delete a vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if the vehicle exists and belongs to the user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    await prisma.vehicle.delete({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
