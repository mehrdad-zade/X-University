import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../page';
import * as useAuthModule from '@/lib/useAuth';
import * as nextNavigation from 'next/navigation';
import { LOGIN_PATH } from '@/lib/useEndpoints';

jest.mock('@/lib/useAuth');
jest.mock('next/navigation');
jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: () => ({
    user: null,
    error: null,
    isLoading: false,
  }),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if not authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: false, isLoading: false, user: {}, error: null }));
    const push = jest.fn();
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ push } as any));
    render(<ProfilePage />);
    expect(push.mock.calls[0][0]).toBe(LOGIN_PATH);
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
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ push: jest.fn() } as any));
    render(<ProfilePage />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('allows editing of user info', () => {
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
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ push: jest.fn() } as any));
    render(<ProfilePage />);
    fireEvent.click(screen.getByText(/Edit Profile/i));
    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
  });
});
