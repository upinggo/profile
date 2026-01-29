import { NextRequest, NextResponse } from 'next/server';
import routeDataMap from './ROUTE_DATA_MAP';

const getRequestPathData = (request: NextRequest) => {
    const path = request.nextUrl.pathname;
    return routeDataMap[path] || {};
}



// Sample data - in a real app this would come from a database

export async function GET(request: NextRequest) {
    try {
        const data = getRequestPathData(request);
        return NextResponse.json(data, { status: 200 });
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
        const data = getRequestPathData(request);

        // Update the profile data with provided fields
        Object.assign(data, updates);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile data' },
            { status: 500 }
        );
    }
}