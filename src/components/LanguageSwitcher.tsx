import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1 font-medium"
    >
      <span className={i18n.language === 'en' ? 'text-foreground' : 'text-muted-foreground'}>
        EN
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={i18n.language === 'de' ? 'text-foreground' : 'text-muted-foreground'}>
        DE
      </span>
    </Button>
  );
}
