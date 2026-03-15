import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTranslation } from 'react-i18next';

export function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-[#1a5632] mb-8">{t('privacy.title')}</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.introduction')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('privacy.introText')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.infoCollect')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <div>
              <h3 className="font-bold text-[#1a5632]">{t('privacy.personalInfo')}</h3>
              <p className="text-gray-700">
                {t('privacy.personalInfoText')}
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>{t('privacy.personalItem1')}</li>
                <li>{t('privacy.personalItem2')}</li>
                <li>{t('privacy.personalItem3')}</li>
                <li>{t('privacy.personalItem4')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#1a5632]">{t('privacy.usageInfo')}</h3>
              <p className="text-gray-700">
                {t('privacy.usageInfoText')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.howWeUse')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 mb-3">{t('privacy.howWeUseText')}</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('privacy.useItem1')}</li>
              <li>{t('privacy.useItem2')}</li>
              <li>{t('privacy.useItem3')}</li>
              <li>{t('privacy.useItem4')}</li>
              <li>{t('privacy.useItem5')}</li>
              <li>{t('privacy.useItem6')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.infoSharing')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('privacy.infoSharingText')}
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('privacy.shareItem1')}</li>
              <li>{t('privacy.shareItem2')}</li>
              <li>{t('privacy.shareItem3')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.dataSecurity')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('privacy.dataSecurityText')}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.yourRights')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 mb-3">{t('privacy.yourRightsText')}</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>{t('privacy.rightItem1')}</li>
              <li>{t('privacy.rightItem2')}</li>
              <li>{t('privacy.rightItem3')}</li>
              <li>{t('privacy.rightItem4')}</li>
              <li>{t('privacy.rightItem5')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1a5632]">{t('privacy.contactUs')}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700">
              {t('privacy.contactUsText')}
            </p>
            <p className="text-gray-700">
              Email: info@sportsdigana.lk<br />
              Phone: +081 2 052 550<br />
              Address: Digana, Rajawella, Kandy, Sri Lanka
            </p>
            <p className="text-gray-700 mt-4 text-sm">
              {t('privacy.lastUpdated')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
