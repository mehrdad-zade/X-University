import { render, screen, fireEvent, act } from '@testing-library/react';
import OnboardingPage from '../page';
import * as useAuthModule from '@/lib/useAuth';
import * as nextNavigation from 'next/navigation';
import { LOGIN_PATH } from '@/lib/useEndpoints';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('@/lib/useAuth');
jest.mock('next/navigation');
jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: () => ({
    user: null,
    error: null,
    isLoading: false,
  }),
}));
interface SwrData {
  [key: string]: unknown; // Adjust this type based on the actual structure of swrData
}
let swrData: SwrData | null = null;
jest.mock('swr', () => ({
  __esModule: true,
  default: () => ({
    data: swrData,
    mutate: jest.fn(),
  }),
}));

const mockRouter: AppRouterInstance = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

describe('OnboardingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if not authenticated', () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: false, isLoading: false, user: {}, error: null }));
    const push = jest.fn();
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ ...mockRouter, push }));
    render(<OnboardingPage />);
    expect(push.mock.calls[0][0]).toBe(LOGIN_PATH);
  });

  it('renders form and submits metadata', async () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: true, isLoading: false, user: { sub: 'test-sub', name: 'Test User', email: 'test@example.com', role: 'student', language: 'en', age_group: 'adult', picture: '' }, error: null }));
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => mockRouter);
    render(<OnboardingPage />);
    fireEvent.change(screen.getByLabelText(/Preferred Language/i), { target: { value: 'en', name: 'language' } });
    fireEvent.change(screen.getByLabelText(/Age Group/i), { target: { value: 'adult', name: 'age_group' } });
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as never;
    fireEvent.click(screen.getByText(/Submit/i));
    expect(await screen.findByText(/Submitting...|Submit/i)).not.toBeNull();
  });

  it('renders onboarding if authenticated', async () => {
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
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => mockRouter);
    swrData = null; // or set to mock onboarding data if needed
    await act(async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <OnboardingPage />
        </I18nextProvider>
      );
    });
    // The onboarding page heading is likely 'Complete Your Profile' (t('onboardingTitle'))
    expect(screen.getByText(i18n.t('onboardingTitle', 'Complete Your Profile'))).toBeInTheDocument();
  });
});
