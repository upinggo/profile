import routeDataMap from "./ROUTE_DATA_MAP";

export const isDevelopment = process.env.NODE_ENV === 'development';
export const envFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // In production, short-circuit known API calls to local data
    if (!isDevelopment && process.env.isSPA === 'false') {
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
                const assetPath = `${githubPagesAssetURL}${url}`.replace('//', '/');
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
export const githubPagesAssetURL = (() => {
    if (isDevelopment) {
        return '';
    } else {
        // In production, adjust for GitHub Pages subdirectory deployment
        // Construct path relative to the current location
        // This handles cases where the site is deployed to a subdirectory
        const pathParts = window.location.pathname.split('/');
        pathParts.pop();
        return pathParts.join('/') || '';
    }
})();
