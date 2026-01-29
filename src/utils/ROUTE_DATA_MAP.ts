import { profileData, technologies } from '../data/prefillData';
const routeDataMap: Record<string, any> = {
    '/api/profile': profileData,
    '/api/tech-stack': technologies,
}
export default routeDataMap;