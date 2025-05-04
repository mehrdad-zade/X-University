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
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  it('renders user info if authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: 'test-sub',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        language: 'en',
        age_group: 'adult',
        picture: ''
      },
      error: null
    }));
    render(<Navbar />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
