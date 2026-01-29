export const isDevelopment = process.env.NODE_ENV === 'development';
import { routeDataMap } from "@/app/api/route";

const mockdataMap: { [key: string]: any } = routeDataMap;
export const envFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // In production, short-circuit known API calls to local data
    if (!isDevelopment) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : '';
        const mockData = mockdataMap[url];
        if (mockData) {
            return new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // Default to the real fetch (development or other endpoints)
    return fetch(input as any, init as any);
};