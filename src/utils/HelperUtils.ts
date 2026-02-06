import routeDataMap from "./ROUTE_DATA_MAP";

export const isDevelopment = process.env.NODE_ENV === 'development';
export const envFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // In production (static export), short-circuit known API calls to local data
    if (!isDevelopment) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : '';
        const mockData = routeDataMap[url]; // Replace with your actual data
        if (mockData) {
            return new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // Handle static assets for GitHub Pages deployment
        // If the request is for a static asset, return the direct fetch
        // The adjustment for subdirectory deployments should be handled in the calling components
        if (url.startsWith('/') && (url.endsWith('.md') || url.endsWith('.json') || url.endsWith('.txt'))) {
            try {
                // Build the correct path to the asset
                const assetPath = `${getGHPagesAssetURL()}${url}`.replace('//', '/');
                const response = await fetch(assetPath);
                // If successful, return the response
                if (response.ok) {
                    return response;
                }
            } catch (e) {
                console.warn(`Failed to fetch static asset: ${url}`, e);
            }
        }
    }

    // Default to the real fetch (development or other endpoints)
    return fetch(input as any, init as any);
};

// this function is used for GitHub Pages deployment only to fetch the static assets correctly
export const getGHPagesAssetURL = (): string => {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        console.log('Using NEXT_PUBLIC_SITE_URL for asset paths. Ensure this is set correctly for GitHub Pages deployment.');
        // Using configured site URL for assets
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    // Guard for SSR/build getGHPagesAssetURL where window is undefined
    if (isDevelopment || typeof window === 'undefined') {
        return '';
    }
    // In production, adjust for GitHub Pages subdirectory deployment
    // Construct path relative to the current location
    // This handles cases where the site is deployed to a subdirectory
    const staticOriginURL = window.location.origin;
    const repoName = window.location.pathname.split('/')[1] || "profile"; // Assumes repo name is the first segment
    const assetURL = `${staticOriginURL}/${repoName}`;
    console.log('Constructed asset path for GitHub Pages deployment:', assetURL);
    return assetURL;
};
