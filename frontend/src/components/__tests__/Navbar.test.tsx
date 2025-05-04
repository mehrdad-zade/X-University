import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import * as useAuthModule from '@/lib/useAuth';

jest.mock('@/lib/useAuth');

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login button if not authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: false, isLoading: false, user: {}, error: null }));
    render(<Navbar />);
    // The button text is 'Login with Keycloak'
    expect(screen.getByText(/Login with Keycloak/i)).toBeInTheDocument();
  });

  it('renders user info if authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
      },
      error: null
    }));
    render(<Navbar />);
    // Check for the user's role, which is rendered in the Navbar
    expect(screen.getByText(/student/i)).toBeInTheDocument();
  });
});
