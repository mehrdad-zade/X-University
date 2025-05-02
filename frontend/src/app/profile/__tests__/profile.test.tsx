import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../page';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/useAuth');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: () => ({
    user: null,
    error: null,
    isLoading: false,
  }),
}));
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

type User = {
  sub: string;
  name: string;
  email: string;
  role: string;
  language: string;
  age_group: string;
  picture: string;
};

describe('ProfilePage', () => {
  it('redirects to login if not authenticated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null, error: null } as { isAuthenticated: boolean; isLoading: boolean; user: null; error: null });
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    render(<ProfilePage />);
    expect(push.mock.calls[0][0]).toBe('/auth/login');
  });

  it('renders user info and allows editing', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { sub: 'test-sub', name: 'Test User', email: 'test@example.com', role: 'student', language: 'en', age_group: 'adult', picture: '' } as User,
      error: null
    });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    render(<ProfilePage />);
    expect(screen.queryByText(/Test User/)).not.toBeNull();
    fireEvent.click(screen.getByText(/Edit Profile/i));
    expect(screen.getByLabelText(/Display Name/i)).not.toBeNull();
  });
});
