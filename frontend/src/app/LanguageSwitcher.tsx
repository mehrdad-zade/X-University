import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lng);
    }
  };
  return (
    <div className="mb-4 flex gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-2 py-1 rounded ${i18n.language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Español
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 rounded ${i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Français
      </button>
      <button
        onClick={() => changeLanguage('zh')}
        className={`px-2 py-1 rounded ${i18n.language === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        中文
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        العربية
      </button>
    </div>
  );
}