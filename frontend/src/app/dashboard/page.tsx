"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { LOGIN_PATH } from "@/lib/useEndpoints";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function DashboardPage() {
  const { user: sessionUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (!hasMounted) return;
    if (!isLoading && !isAuthenticated) {
      router.push(LOGIN_PATH);
    }
  }, [hasMounted, isLoading, isAuthenticated, router]);

  if (!hasMounted) return null;

  if (isLoading) return <p>{t('loading')}</p>;

  return (
    <div className="p-8">
      <LanguageSwitcher />
      <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      <p className="mt-4">{t('dashboardWelcome', { name: sessionUser?.name, email: sessionUser?.email })}</p>
      <p className="mt-2">{t('roleLabel')}: {sessionUser?.role || t('unknown')}</p>
    </div>
  );
}