import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Award, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { facilities } from '../data';
import { getFacilityImage } from './Home';

export function About() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const displayFacilities = facilities.filter(f => 
    ['outdoor-stadium', 'swimming-pool', 'indoor-stadium', 'basketball-court'].includes(f.id)
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <ImageWithFallback
          src="/images/unnamed 2.jpg"
          alt="About Sports Complex"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">{t('nav.about')}</h1>
          {/* tagline removed */}
        </div>
      </section>

      {/* Empowering Athletes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* label removed per request */}
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                {t('about.heading')}
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('about.description2')}
              </p>
            </div>
            {/* Right Photo */}
            <div className="relative">
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="/images/unnamed 2.jpg"
                  alt="Athletes training at the sports complex"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Highlight stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-black">500+</h3>
              <p className="text-gray-600">{t('about.statsAthletes')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-black">55+</h3>
              <p className="text-gray-600">{t('about.statsSports')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-3xl font-bold text-black">4+</h3>
              <p className="text-gray-600">{t('about.statsFacilities')}</p>
            </div>
          </div>
        </div>
      </section>

      
      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-black/5 text-black text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              {t('about.whatDrivesUs')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black">{t('about.ourPurpose')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-black to-gray-600" />
              <div className="p-8 pt-10">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{t('about.mission')}</h3>
                <p className="text-gray-600 text-[16px] leading-relaxed">
                  {t('about.missionText')}
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-600 to-black" />
              <div className="p-8 pt-10">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{t('about.vision')}</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {t('about.visionText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Facilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-black text-center mb-8">{t('about.ourFacilities')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayFacilities.map((facility) => {
              const name = currentLang === 'si' ? facility.nameSi : currentLang === 'ta' ? facility.nameTa : facility.name;
              const description = currentLang === 'si' ? facility.descriptionSi : currentLang === 'ta' ? facility.descriptionTa : facility.description;

              return (
                <Link key={facility.id} to={`/facilities/${facility.slug}`}>
                  <div className="overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className="w-full h-44">
                      <ImageWithFallback
                        src={getFacilityImage(facility)}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-lg font-bold text-black">{name}</p>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-3">{description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      
    </div>
  );
}
