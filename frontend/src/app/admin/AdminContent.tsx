"use client";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function AdminContent() {
  const { t } = useTranslation();
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  return (
    <main className="p-8">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold mb-4">{t('admin')}</h1>
      <p>{t('adminWelcome')}</p>
    </main>
  );
}