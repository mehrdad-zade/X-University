import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../page';
import * as useAuthModule from '@/lib/useAuth';
import * as nextNavigation from 'next/navigation';
import { LOGIN_PATH } from '@/lib/useEndpoints';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
interface UserData {
  name: string;
  email: string;
  role: string;
  language: string;
  age_group: string;
  picture: string;
}

let swrData: UserData | null = null;
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

  it('redirects to login if not authenticated', async () => {
    jest.spyOn(useAuthModule, 'useAuth').mockImplementation(() => ({ isAuthenticated: false, isLoading: false, user: {}, error: null }));
    const push = jest.fn();
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => ({ ...mockRouter, push }));
    swrData = null; // Set to null so the component doesn't render the profile page
    render(
      <I18nextProvider i18n={i18n}>
        <ProfilePage />
      </I18nextProvider>
    );
    // Wait for the effect to run (flush microtasks)
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(LOGIN_PATH);
    }, { timeout: 500 });
    // Debug output if test fails
    if (!push.mock.calls.length) {
      screen.debug();
    }
    expect(push).toHaveBeenCalledWith(LOGIN_PATH);
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
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => mockRouter);
    swrData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      language: 'en',
      age_group: 'adult',
      picture: ''
    };
    render(
      <I18nextProvider i18n={i18n}>
        <ProfilePage />
      </I18nextProvider>
    );
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
    jest.spyOn(nextNavigation, 'useRouter').mockImplementation(() => mockRouter);
    swrData = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      language: 'en',
      age_group: 'adult',
      picture: ''
    };
    render(
      <I18nextProvider i18n={i18n}>
        <ProfilePage />
      </I18nextProvider>
    );
    fireEvent.click(screen.getByText(i18n.t('editProfile')));
    expect(screen.getByLabelText(i18n.t('displayName'))).toBeInTheDocument();
  });
});
