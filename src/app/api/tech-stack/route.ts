import { NextResponse } from 'next/server';
import { technologies } from '@/data/prefillData';
import { ApiResponse } from '@/types';

export async function GET() {
    const response: ApiResponse<typeof technologies> = {
        data: technologies,
        status: 200,
        timestamp: new Date().toISOString()
    };
    return NextResponse.json(response, {
        status: 200,
        headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
        }
    });
}