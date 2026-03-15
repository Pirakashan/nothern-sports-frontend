import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTranslation } from 'react-i18next';

export function Terms() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-[#1a5632] mb-8">{t('terms.title')}</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.acceptance')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('terms.acceptanceText')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.bookingTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-3">
            <p className="text-gray-700">
              <strong>{t('terms.booking1')}</strong> {t('terms.booking1Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.booking2')}</strong> {t('terms.booking2Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.booking3')}</strong> {t('terms.booking3Text')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.paymentTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-3">
            <p className="text-gray-700">
              <strong>{t('terms.payment1')}</strong> {t('terms.payment1Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.payment2')}</strong> {t('terms.payment2Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.payment3')}</strong> {t('terms.payment3Text')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.cancellationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-3">
            <p className="text-gray-700">
              <strong>{t('terms.cancel1')}</strong> {t('terms.cancel1Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.cancel2')}</strong> {t('terms.cancel2Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.cancel3')}</strong> {t('terms.cancel3Text')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.facilityRulesTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>{t('terms.rule1')}</li>
              <li>{t('terms.rule2')}</li>
              <li>{t('terms.rule3')}</li>
              <li>{t('terms.rule4')}</li>
              <li>{t('terms.rule5')}</li>
              <li>{t('terms.rule6')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.liabilityTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-3">
            <p className="text-gray-700">
              <strong>{t('terms.liability1')}</strong> {t('terms.liability1Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.liability2')}</strong> {t('terms.liability2Text')}
            </p>
            <p className="text-gray-700">
              <strong>{t('terms.liability3')}</strong> {t('terms.liability3Text')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.conductTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 mb-3">{t('terms.conductIntro')}</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('terms.conduct1')}</li>
              <li>{t('terms.conduct2')}</li>
              <li>{t('terms.conduct3')}</li>
              <li>{t('terms.conduct4')}</li>
              <li>{t('terms.conduct5')}</li>
            </ul>
            <p className="text-gray-700 mt-3">
              {t('terms.conductWarning')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('terms.contactTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('terms.contactText')}
            </p>
            <p className="text-gray-700">
              Central Province Sports Complex – Digana<br />
              Digana, Rajawella, Kandy, Sri Lanka<br />
              Phone: +081 2 052 550<br />
              Email: info@sportsdigana.lk
            </p>
            <p className="text-gray-700 mt-4 text-sm">
              {t('terms.lastUpdated')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
