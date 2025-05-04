'use client';

import { SessionProvider } from 'next-auth/react';
import React from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SessionProvider>{children}</SessionProvider>
    </I18nextProvider>
  );
}
