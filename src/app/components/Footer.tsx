import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const siteLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/calendar', label: t('nav.calendar') },
  ];

  const facilitiesLinks = [
    { path: '/facilities/outdoor-stadium', label: t('facilities.outdoorStadium') },
    { path: '/facilities/swimming-pool', label: t('facilities.swimmingPool') },
    { path: '/facilities/indoor-stadium', label: t('facilities.indoorStadium') },
    { path: '/facilities/basketball-court', label: t('facilities.basketballCourt') }
  ];

  const legalLinks = [
    { path: '/privacy', label: t('footer.privacy') },
    { path: '/terms', label: t('footer.terms') },
    { path: '/licensing', label: t('footer.licensing') }
  ];

  return (
    <footer className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & Tagline */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Emblem_of_Sri_Lanka.svg/1200px-Emblem_of_Sri_Lanka.svg.png"
                  alt="Government Emblem"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] text-gray-600 font-medium">උතුරු පළාත් ක්‍රීඩා සංකීර්ණය</div>
                <div className="text-[11px] text-gray-600 font-medium">வடக்கு மாகாண விளையாட்டு வளாகம்</div>
                <div className="text-[13px] text-gray-900 font-bold tracking-tight">Provincial Sports Complex</div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">Northern Province</div>
              </div>
            </Link>

            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{t('footer.tagline')}</p>

            {/* social icons row */}
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Site Links */}
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">{t('footer.siteLinks')}</h3>
            <ul className="space-y-3">
              {siteLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-700 hover:text-black text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Facilities Links */}
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">{t('footer.facilitiesLinks')}</h3>
            <ul className="space-y-3">
              {facilitiesLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-700 hover:text-black text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">{t('footer.legalLinks')}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-700 hover:text-black text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="text-sm text-gray-600">
            {t('footer.copyright')}
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <button onClick={() => changeLanguage('si')} className={`px-3 py-2 rounded-md hover:bg-gray-50 ${i18n.language === 'si' ? 'font-bold text-black' : ''}`}>සිං</button>
              <button onClick={() => changeLanguage('ta')} className={`px-3 py-2 rounded-md hover:bg-gray-50 ${i18n.language === 'ta' ? 'font-bold text-black' : ''}`}>த</button>
              <button onClick={() => changeLanguage('en')} className={`px-3 py-2 rounded-md hover:bg-gray-50 ${i18n.language === 'en' ? 'font-bold text-black' : ''}`}>EN</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
