import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTranslation } from 'react-i18next';

export function Licensing() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-[#1a5632] mb-8">{t('licensing.title')}</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.facilityLicensing')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('licensing.facilityLicensingText')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.safetyCerts')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-3">
            <p className="text-gray-700">
              {t('licensing.safetyCertsText')}
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('licensing.safety1')}</li>
              <li>{t('licensing.safety2')}</li>
              <li>{t('licensing.safety3')}</li>
              <li>{t('licensing.safety4')}</li>
              <li>{t('licensing.safety5')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.insurance')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('licensing.insuranceText')}
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('licensing.insurance1')}</li>
              <li>{t('licensing.insurance2')}</li>
              <li>{t('licensing.insurance3')}</li>
              <li>{t('licensing.insurance4')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.affiliations')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 mb-3">
              {t('licensing.affiliationsText')}
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('licensing.affiliation1')}</li>
              <li>{t('licensing.affiliation2')}</li>
              <li>{t('licensing.affiliation3')}</li>
              <li>{t('licensing.affiliation4')}</li>
              <li>{t('licensing.affiliation5')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.environmental')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('licensing.environmentalText')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.staffQuals')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 mb-3">
              {t('licensing.staffQualsText')}
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('licensing.staff1')}</li>
              <li>{t('licensing.staff2')}</li>
              <li>{t('licensing.staff3')}</li>
              <li>{t('licensing.staff4')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('licensing.verification')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('licensing.verificationText')}
            </p>
            <p className="text-gray-700">
              Central Province Sports Complex – Digana<br />
              Phone: +081 2 052 550<br />
              Email: info@sportsdigana.lk<br />
              Address: Digana, Rajawella, Kandy, Sri Lanka
            </p>
            <p className="text-gray-700 mt-4 text-sm">
              {t('licensing.lastUpdated')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
