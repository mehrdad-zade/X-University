import { render, screen, fireEvent } from '@testing-library/react';
import UnauthHome from './UnauthHome';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

describe('UnauthHome', () => {
  function renderWithI18n() {
    return render(
      <I18nextProvider i18n={i18n}>
        <UnauthHome />
      </I18nextProvider>
    );
  }

  it('renders welcome and login text in English by default', () => {
    renderWithI18n();
    expect(screen.getByText('Welcome to X‑University')).toBeInTheDocument();
    expect(screen.getByText('Login to Get Started')).toBeInTheDocument();
  });

  it('switches to Spanish when Español button is clicked', () => {
    renderWithI18n();
    fireEvent.click(screen.getByText('Español'));
    expect(screen.getByText('Bienvenido a X‑University')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión para comenzar')).toBeInTheDocument();
  });

  it('switches to French when Français button is clicked', () => {
    renderWithI18n();
    fireEvent.click(screen.getByText('Français'));
    expect(screen.getByText('Bienvenue à X‑University')).toBeInTheDocument();
    expect(screen.getByText('Connectez-vous pour commencer')).toBeInTheDocument();
  });

  it('switches to Mandarin when 中文 button is clicked', () => {
    renderWithI18n();
    fireEvent.click(screen.getByText('中文'));
    expect(screen.getByText('欢迎来到 X‑University')).toBeInTheDocument();
    expect(screen.getByText('登录以开始')).toBeInTheDocument();
  });

  it('switches to Arabic when العربية button is clicked', () => {
    renderWithI18n();
    fireEvent.click(screen.getByText('العربية'));
    expect(screen.getByText('مرحبًا بك في X‑University')).toBeInTheDocument();
    expect(screen.getByText('سجّل الدخول للبدء')).toBeInTheDocument();
  });
});
