import { NextRequest, NextResponse } from 'next/server';

// Sample data - in a real app this would come from a database
export const profileData = {
  id: '1',
  name: 'Neil Shen',
  role: 'AI Developer',
  bio: 'Passionate about creating innovative AI solutions',
  avatar: 'https://avatars.githubusercontent.com/u/25785956?v=4',
  aiProfiles: [
    {
      id: '1',
      name: 'Creative Assistant',
      description: 'Helpful for brainstorming and creative tasks',
      capabilities: ['brainstorming', 'creative writing', 'idea generation']
    },
    {
      id: '2',
      name: 'Tech Expert',
      description: 'Knowledgeable in programming and tech solutions',
      capabilities: ['programming', 'debugging', 'architecture']
    },
    {
      id: '3',
      name: 'Writing Coach',
      description: 'Assists with writing and editing tasks',
      capabilities: ['editing', 'proofreading', 'style improvement']
    }
  ]
};

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