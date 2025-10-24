

// For real implementation with Better-Auth:

import { User } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        totalEarnings: true,
        completedGigs: true,
        rating: true,
        // Contact Information
        phoneNumber: true,
        streetAddress: true,
        city: true,
        state: true,
        zipCode: true,
        jobPreferences: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log(user);
    const userProfile: Partial<User> & { jobPreferences?: any } = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalEarnings: user.totalEarnings,
      completedGigs: user.completedGigs,
      rating: user.rating,
      // Contact Information
      phoneNumber: user.phoneNumber,
      streetAddress: user.streetAddress,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      jobPreferences: user.jobPreferences,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

