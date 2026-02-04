import { NextRequest, NextResponse } from 'next/server';
import { profileData } from '@/data/prefillData';
import { ProfileData, ApiResponse } from '@/types';

// Validation function
function isValidProfileUpdate(data: any): data is Partial<ProfileData> {
  if (typeof data !== 'object' || data === null) return false;
  
  const allowedKeys = ['name', 'role', 'bio', 'avatar', 'aiProfiles'];
  return Object.keys(data).every(key => allowedKeys.includes(key));
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching profile data for request:', request.url);
    
    // Simulate some processing delay in development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const response: ApiResponse<ProfileData> = {
      data: profileData,
      status: 200,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    const errorResponse: ApiResponse<null> = {
      data: null,
      status: 500,
      message: 'Failed to fetch profile data',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Updating profile data for request:', request.url);
    
    const updates = await request.json();
    
    if (!isValidProfileUpdate(updates)) {
      return NextResponse.json(
        { 
          error: 'Invalid profile update data',
          status: 400,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // In a real application, this would update a database
    // For now, we'll just simulate the update
    const updatedProfile = {
      ...profileData,
      ...updates
    };

    const response: ApiResponse<ProfileData> = {
      data: updatedProfile,
      status: 200,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    const errorResponse: ApiResponse<null> = {
      data: null,
      status: 500,
      message: 'Failed to update profile data',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}