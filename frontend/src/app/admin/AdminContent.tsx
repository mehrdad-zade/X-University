"use client";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function AdminContent() {
  const { t } = useTranslation();
  return (
    <main className="p-8">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold mb-4">{t('admin')}</h1>
      <p>{t('adminWelcome')}</p>
    </main>
  );
}