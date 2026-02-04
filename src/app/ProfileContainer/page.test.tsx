import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileContainer from './page';

// Mock the useApi hook
jest.mock('@/hooks/useApi', () => ({
  useApi: jest.fn()
}));

// Mock the components
jest.mock('@/components/AiProfileCard', () => {
  return function MockAiProfileCard({ name, description }: { name: string; description: string }) {
    return (
      <div data-testid="ai-profile-card">
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
    );
  };
});

jest.mock('@/components/common/Navigation', () => {
  return function MockNavigation({ children, path }: { children: React.ReactNode; path: string }) {
    return <a href={path}>{children}</a>;
  };
});

describe('ProfileContainer', () => {
  const mockUseApi = require('@/hooks/useApi').useApi;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockUseApi.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    render(<ProfileContainer />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders profile data when loaded', async () => {
    const mockProfileData = {
      id: '1',
      name: 'Neil Shen',
      role: 'Senior Developer',
      bio: 'Passionate developer',
      avatar: 'https://example.com/avatar.jpg',
      aiProfiles: [
        {
          id: '1',
          name: 'Creative Assistant',
          description: 'Helpful for creative tasks',
          capabilities: ['brainstorming', 'writing']
        }
      ]
    };

    mockUseApi.mockReturnValue({
      data: mockProfileData,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    render(<ProfileContainer />);

    await waitFor(() => {
      expect(screen.getByText('Neil Shen')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Passionate developer')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    mockUseApi.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to load'),
      refetch: jest.fn()
    });

    render(<ProfileContainer />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Profile')).toBeInTheDocument();
    });
  });

  it('calls refetch when retry button is clicked', async () => {
    const mockRefetch = jest.fn();
    
    mockUseApi.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to load'),
      refetch: mockRefetch
    });

    render(<ProfileContainer />);

    await waitFor(() => {
      const retryButton = screen.getByText('Retry');
      userEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});