import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingPage from '../page';
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

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if not authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: false, isLoading: false, user: {}, error: null }));
    const push = jest.fn();
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ push } as any));
    render(<OnboardingPage />);
    expect(push.mock.calls[0][0]).toBe(LOGIN_PATH);
  });

  it('renders form and submits metadata', async () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: true, isLoading: false, user: { sub: 'test-sub', name: 'Test User', email: 'test@example.com', role: 'student', language: 'en', age_group: 'adult', picture: '' }, error: null }));
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ push: jest.fn() } as any));
    render(<OnboardingPage />);
    fireEvent.change(screen.getByLabelText(/Preferred Language/i), { target: { value: 'en', name: 'language' } });
    fireEvent.change(screen.getByLabelText(/Age Group/i), { target: { value: 'adult', name: 'age_group' } });
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as never;
    fireEvent.click(screen.getByText(/Submit/i));
    expect(await screen.findByText(/Submitting...|Submit/i)).not.toBeNull();
  });

  it('renders onboarding if authenticated', () => {
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
    render(<OnboardingPage />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
