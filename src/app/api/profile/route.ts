import { NextRequest, NextResponse } from 'next/server';
import { profileData } from '../../lib/profileData';

// Sample data - in a real app this would come from a database
// `profileData` is shared from app/lib, not exported here to comply with Next.js route types.

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();

    // Update the profile data with provided fields
    Object.assign(profileData, updates);

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile data' },
      { status: 500 }
    );
  }
}