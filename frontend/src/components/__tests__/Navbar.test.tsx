import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAuth } from '@/lib/useAuth';

jest.mock('@/lib/useAuth');
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: () => ({
    user: null,
    error: null,
    isLoading: false,
  }),
}));

describe('Navbar', () => {
  it('shows login when not authenticated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null, error: null } as ReturnType<typeof useAuth>);
    render(<Navbar />);
    expect(screen.getByText(/Login/i)).not.toBeNull();
  });
  it('shows logout and role when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      user: {
        sub: '12345',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        language: 'en',
        age_group: 'adult',
        picture: ''
      }
    } as ReturnType<typeof useAuth>);
    render(<Navbar />);
    expect(screen.getByText(/Logout/i)).not.toBeNull();
    // Check both the admin link and the badge
    const adminElements = screen.getAllByText(/admin/i);
    expect(adminElements.length).toBeGreaterThan(1);
  });
});
