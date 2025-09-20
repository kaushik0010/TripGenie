'use client';

import { I18nextProvider } from 'react-i18next';
import { ReactNode } from 'react';
import i18n from '@/i18n-client';

export default function TranslationProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}