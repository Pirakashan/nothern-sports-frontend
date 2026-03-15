import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="text-9xl font-bold text-[#1a5632] mb-4">{t('notFound.title')}</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('notFound.heading')}</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          {t('notFound.description')}
        </p>
        <Link to="/">
          <Button className="bg-[#1a5632] hover:bg-[#2a7048] text-white">
            <Home className="w-4 h-4 mr-2" />
            {t('notFound.returnHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
