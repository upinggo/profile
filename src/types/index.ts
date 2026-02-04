// Profile Types
export interface ProfileData {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  aiProfiles: AiProfile[];
}

export interface AiProfile {
  id: string;
  name: string;
  description: string;
  capabilities?: string[];
}

// Technology Stack Types
export interface TechnologyCategory {
  id: string;
  name: string;
  description: string;
  children: TechnologyItem[];
}

export interface TechnologyItem {
  id: string;
  name: string;
  description: string;
  children?: TechnologyItem[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
}

// Navigation Types
export interface NavigationProps {
  children: React.ReactNode;
  path: string;
  className?: string;
  [key: string]: any;
}

// Error Boundary Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Component Props Types
export interface ProfileContainerProps {
  initialData?: ProfileData;
}

export interface TechnologyStackProps {
  initialData?: TechnologyCategory[];
}