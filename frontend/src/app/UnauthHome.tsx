"use client";
import LoginButton from "../components/LoginButton";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function UnauthHome() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <LanguageSwitcher />
      <h1 suppressHydrationWarning className="text-3xl font-bold mb-4">{t('welcome')}</h1>
      <p suppressHydrationWarning className="mb-6">{t('login')}</p>
      <LoginButton />
    </div>
  );
}