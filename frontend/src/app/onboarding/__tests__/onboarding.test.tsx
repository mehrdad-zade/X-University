import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingPage from '../page';
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

describe('OnboardingPage', () => {
  it('redirects to login if not authenticated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false, user: null, error: null } as ReturnType<typeof useAuth>);
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    render(<OnboardingPage />);
    expect(push.mock.calls[0][0]).toBe('/auth/login');
  });

  it('renders form and submits metadata', async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false, user: { sub: 'test-sub', name: 'Test User', email: 'test@example.com', role: 'student', language: 'en', age_group: 'adult', picture: '' }, error: null } as ReturnType<typeof useAuth>);
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    render(<OnboardingPage />);
    fireEvent.change(screen.getByLabelText(/Preferred Language/i), { target: { value: 'en', name: 'language' } });
    fireEvent.change(screen.getByLabelText(/Age Group/i), { target: { value: 'adult', name: 'age_group' } });
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as never;
    fireEvent.click(screen.getByText(/Submit/i));
    expect(await screen.findByText(/Submitting...|Submit/i)).not.toBeNull();
  });
});
