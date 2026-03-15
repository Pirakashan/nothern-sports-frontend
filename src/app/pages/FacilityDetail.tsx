import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock, ArrowRight, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { facilities, facilityLocations } from '../data';
import { getFacilityImage } from './Home';
import { SportsIcon } from '../components/SportsIcon';
import { facilityApi, type Facility as ApiFacility, type Sport as ApiSport, type PricingTable as ApiPricingTable } from '../api';

// Shape for grouped API pricing rows displayed in tables
interface ApiPricingRow {
  no: number;
  event: string;
  sportsList: string;
  type: string;
  pricePerHour: number;
  govSchools: number;
  club: number;
  intlSchools: number;
  international: number;
}

export function FacilityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const facility = facilities.find(f => f.slug === slug);

  // Find all districts for this facility
  const facilityDistricts = facilityLocations.filter(loc => loc.facilityId === facility?.id).map(loc => loc.district);
  // District dropdown state
  const [selectedDistrict, setSelectedDistrict] = useState(facilityDistricts[0] || 'vavuniya');
  // Find location info for selected district
  const locationInfo = facilityLocations.find(loc => loc.facilityId === facility?.id && loc.district === selectedDistrict);

  // API-based pricing state
  const [apiPricing, setApiPricing] = useState<{
    competition: ApiPricingRow[];
    practice: ApiPricingRow[];
    refundable_deposit: ApiPricingRow[];
  } | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setPricingLoading(true);
    facilityApi.getBySlug(slug)
      .then((res) => {
        const apiFacility = res.facility;
        if (apiFacility?.sports && apiFacility.sports.length > 0) {
          const competitionRows: ApiPricingRow[] = [];
          const practiceRows: ApiPricingRow[] = [];
          const refundableDepositRows: ApiPricingRow[] = [];

          const seenCompetitionEvents = new Set<string>();
          const seenPracticeEvents = new Set<string>();

          apiFacility.sports.forEach((sport: ApiSport) => {
            if (sport.pricing_tables) {
              sport.pricing_tables.forEach((pt: ApiPricingTable) => {
                const eventName = pt.event_name || sport.name;
                const sportsList = pt.sports_list || sport.name;

                const row: ApiPricingRow = {
                  no: 0,
                  event: eventName,
                  sportsList: sportsList,
                  type: pt.type,
                  pricePerHour: Number(pt.price_per_hour || pt.price || 0),
                  govSchools: Number(pt.price_gov_schools || 0),
                  club: Number(pt.price_club_institute || 0),
                  intlSchools: Number(pt.price_intl_schools || 0),
                  international: Number(pt.price_intl || 0),
                };

                if (pt.type === 'competition') {
                  if (!seenCompetitionEvents.has(eventName)) {
                    competitionRows.push(row);
                    seenCompetitionEvents.add(eventName);
                  }
                } else if (pt.type === 'practice') {
                  if (!seenPracticeEvents.has(eventName)) {
                    practiceRows.push(row);
                    seenPracticeEvents.add(eventName);
                  }
                } else if (pt.type === 'refundable_deposit') {
                  // Refundable deposits are usually shown per customer type in the image,
                  // but stored as columns in our DB. We'll handle this specially in the table.
                  if (refundableDepositRows.length === 0) {
                    refundableDepositRows.push(row);
                  }
                }
              });
            }
          });

          // Assign row numbers
          competitionRows.forEach((r, i) => r.no = i + 1);
          practiceRows.forEach((r, i) => r.no = i + 1);

          setApiPricing({
            competition: competitionRows,
            practice: practiceRows,
            refundable_deposit: refundableDepositRows
          });
        }
      })
      .catch(() => {
        // API unavailable - will fall back to static data
      })
      .finally(() => setPricingLoading(false));
  }, [slug]);

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1a5632] mb-4">{t('facility.notFound')}</h1>
          <Link to="/">
            <Button className="bg-[#1a5632] hover:bg-[#2a7048] text-white">
              {t('facility.returnHome')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const facilityName = currentLang === 'si' ? facility.nameSi : currentLang === 'ta' ? facility.nameTa : facility.name;
  const facilityDesc = currentLang === 'si' ? facility.descriptionSi : currentLang === 'ta' ? facility.descriptionTa : facility.description;

  const heroImage = getFacilityImage(facility);

  const useDarkOverlay = facility.slug === 'indoor-stadium' || facility.slug === 'basketball-court';
  const isOutdoor = !useDarkOverlay;

  const displayedSports = facility.sports;

  // Contact info
  const contactAddress = locationInfo?.address || 'N/A';
  const contactPhone = locationInfo?.phone || 'N/A';
  const contactEmail = locationInfo?.email || 'N/A';
  const contactHours = locationInfo?.hours || 'N/A';

  // Determine if we use API pricing or static pricing
  const hasApiPricing = apiPricing && (apiPricing.competition.length > 0 || apiPricing.practice.length > 0 || apiPricing.refundable_deposit.length > 0);
  const useStaticPricing = !hasApiPricing && !pricingLoading;

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-end overflow-hidden">
        <div className={`absolute inset-0 ${useDarkOverlay ? 'bg-black/40' : 'bg-white/20'} z-10`} />
        <ImageWithFallback
          src={heroImage}
          alt={facilityName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`relative z-20 px-4 pb-12 container mx-auto ${useDarkOverlay ? 'text-white' : 'text-black'}`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{facilityName}</h1>
          <p className={`text-lg max-w-3xl ${useDarkOverlay ? 'text-gray-200' : 'text-gray-800'}`}>{facilityDesc}</p>
        </div>
      </section>

      {/* District Selection Chips */}
      <section className="py-6 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <span className="font-bold text-gray-900 tracking-tight">{t('booking.selectDistrict') || 'Select District'}:</span>
            <div className="flex flex-wrap gap-3">
              {facilityDistricts.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                    selectedDistrict === d
                      ? 'bg-[#1a5632] text-white shadow-md scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a5632] hover:text-[#1a5632]'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">
              {/* Sports & Activities - Icon Grid */}
              {locationInfo?.sports && locationInfo.sports.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('booking.sports')}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {locationInfo.sports.map((sport) => (
                      <div key={sport} className="flex flex-col items-center justify-center text-center bg-gray-50 rounded-[16px] aspect-square p-4 shadow-sm hover:shadow-md transition-shadow">
                        <SportsIcon sport={sport} className="w-20 h-20 text-gray-700 mb-3" />
                        <span className="text-sm font-semibold text-gray-700">{sport}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <Card className={isOutdoor ? 'bg-white text-black' : ''}>
                <CardHeader>
                  <CardTitle className={isOutdoor ? 'text-black' : 'text-[#1a5632]'}>{t('facility.features')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 ${isOutdoor ? 'text-gray-800' : 'text-gray-700'}`}>
                    <li className="flex items-start gap-2">
                      <span className={`${isOutdoor ? 'text-black' : 'text-[#d4af37]'} mt-1`}>✓</span>
                      <span>{t('facility.feature1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${isOutdoor ? 'text-black' : 'text-[#d4af37]'} mt-1`}>✓</span>
                      <span>{t('facility.feature2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${isOutdoor ? 'text-black' : 'text-[#d4af37]'} mt-1`}>✓</span>
                      <span>{t('facility.feature3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${isOutdoor ? 'text-black' : 'text-[#d4af37]'} mt-1`}>✓</span>
                      <span>{t('facility.feature4')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${isOutdoor ? 'text-black' : 'text-[#d4af37]'} mt-1`}>✓</span>
                      <span>{t('facility.feature5')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking CTA */}
              <Card className="bg-white text-black">
                <CardHeader>
                  <CardTitle>{t('booking.bookFacility')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-800">
                    {t('booking.reserveSlot')}
                  </p>
                  <Link to="/book">
                    <Button className="w-full bg-[#d4af37] hover:bg-[#c79f2e] text-white">
                      {t('nav.bookNow')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className={isOutdoor ? 'bg-white text-black' : ''}>
                <CardHeader>
                  <CardTitle className={isOutdoor ? 'text-black' : 'text-[#1a5632]'}>{t('facility.contactInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="font-bold text-black">{t('facility.address')}</div>
                    <div className="text-gray-600">{contactAddress}</div>
                  </div>
                  <div>
                    <div className="font-bold text-black">{t('facility.phone')}</div>
                    <div className="text-gray-600">{contactPhone}</div>
                  </div>
                  <div>
                    <div className="font-bold text-black">{t('facility.email')}</div>
                    <div className="text-gray-600">{contactEmail}</div>
                  </div>
                  <div>
                    <div className="font-bold text-black">{t('facility.hours')}</div>
                    <div className="text-gray-600">{contactHours}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Animated Runner GIF Placeholder */}
              <Card className="overflow-hidden bg-white">
                <div className="h-48 flex items-center justify-center">
                  <div className="text-black text-center">
                    <Activity className="w-16 h-16 mx-auto mb-2 animate-bounce text-black" />
                    <p className="text-sm">{t('facility.sportsExcellence')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tables - Full Width Centered Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('booking.pricingTable') || 'Pricing Table'}</h2>

        {/* District Pricing Table 
          {locationInfo?.pricing && locationInfo.pricing.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">District Pricing</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                        <th className="px-3 py-3 text-left font-semibold">Category</th>
                        <th className="px-3 py-3 text-right font-semibold">Govt Schools (Rs.)</th>
                        <th className="px-3 py-3 text-right font-semibold">Club (Rs.)</th>
                        <th className="px-3 py-3 text-right font-semibold">Intl Schools (Rs.)</th>
                        <th className="px-3 py-3 text-right font-semibold">International (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {locationInfo.pricing.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-medium text-gray-900">{row.category}</td>
                          <td className="px-3 py-3 text-right text-gray-700">{row.govtSchools.toLocaleString('en-US')}</td>
                          <td className="px-3 py-3 text-right text-gray-700">{row.club.toLocaleString('en-US')}</td>
                          <td className="px-3 py-3 text-right text-gray-700">{row.intlSchools.toLocaleString('en-US')}</td>
                          <td className="px-3 py-3 text-right text-gray-700">{row.international.toLocaleString('en-US')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )} */}

          {/* District Deposit Table 
          {locationInfo?.deposit && locationInfo.deposit.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">District Deposits</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                        <th className="px-3 py-3 text-left font-semibold">Customer Type</th>
                        <th className="px-3 py-3 text-right font-semibold">Deposit (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {locationInfo.deposit.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-medium text-gray-900">{row.customerType}</td>
                          <td className="px-3 py-3 text-right text-gray-700">{row.amount.toLocaleString('en-US')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )} */}
          {/* API-based Pricing (from Backend) */}
          {hasApiPricing && (
            <div className="space-y-12">
              {/* Competition / Meet / Tournament Table (API) */}
              {apiPricing.competition.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Competition / Meet / Tournament</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <th className="px-3 py-3 text-left font-semibold w-12">No</th>
                            <th className="px-3 py-3 text-left font-semibold">Events</th>
                            <th className="px-3 py-3 text-left font-semibold">Sports</th>
                            <th className="px-3 py-3 text-left font-semibold">Duration</th>
                            <th className="px-3 py-3 text-right font-semibold">Government Schools (Rs.)</th>
                            <th className="px-3 py-3 text-right font-semibold">Club/Institute (Rs.)</th>
                            <th className="px-3 py-3 text-right font-semibold">International Schools (Rs.)</th>
                            <th className="px-3 py-3 text-right font-semibold">International (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {apiPricing.competition.map((row) => (
                            <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-3 text-gray-700">{row.no}</td>
                              <td className="px-3 py-3 font-medium text-gray-900">{row.event}</td>
                              <td className="px-3 py-3 text-gray-700 text-sm">{row.sportsList}</td>
                              <td className="px-3 py-3 text-gray-700">Per hour</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.govSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.club.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.intlSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.international.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Practices Table (API) */}
              {apiPricing.practice.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Practices</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <th className="px-3 py-3 text-left font-semibold w-12">No</th>
                            <th className="px-3 py-3 text-left font-semibold">Events</th>
                            <th className="px-3 py-3 text-left font-semibold">Sports</th>
                            <th className="px-3 py-3 text-left font-semibold">Duration</th>
                            <th className="px-3 py-3 text-right font-semibold">Government Schools (Rs.)</th>
                            <th className="px-3 py-3 text-right font-semibold">Club/Institute (Rs.)</th>
                            <th className="px-3 py-3 text-right font-semibold">International Schools (Rs.)</th>
                            <th className="px-3 py-3 text-right font-semibold">International (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {apiPricing.practice.map((row) => (
                            <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-3 text-gray-700">{row.no}</td>
                              <td className="px-3 py-3 font-medium text-gray-900">{row.event}</td>
                              <td className="px-3 py-3 text-gray-700 text-sm">{row.sportsList}</td>
                              <td className="px-3 py-3 text-gray-700">Per hour</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.govSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.club.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.intlSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-3 py-3 text-right text-gray-700">{row.international.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Refundable Deposits Table (API) */}
              {apiPricing.refundable_deposit.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('facility.refundableDeposits') || 'Refundable Deposits'}</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <th className="px-3 py-3 text-left font-semibold w-12">No</th>
                            <th className="px-3 py-3 text-left font-semibold">Customer Type</th>
                            <th className="px-3 py-3 text-left font-semibold">Duration</th>
                            <th className="px-3 py-3 text-right font-semibold">Deposit (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-gray-700">1</td>
                            <td className="px-3 py-3 font-medium text-gray-900">Government Schools</td>
                            <td className="px-3 py-3 text-gray-700">Per hour</td>
                            <td className="px-3 py-3 text-right text-gray-700">{apiPricing.refundable_deposit[0].govSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-gray-700">2</td>
                            <td className="px-3 py-3 font-medium text-gray-900">Club/Institute</td>
                            <td className="px-3 py-3 text-gray-700">Per hour</td>
                            <td className="px-3 py-3 text-right text-gray-700">{apiPricing.refundable_deposit[0].club.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-gray-700">3</td>
                            <td className="px-3 py-3 font-medium text-gray-900">International Schools</td>
                            <td className="px-3 py-3 text-gray-700">Per hour</td>
                            <td className="px-3 py-3 text-right text-gray-700">{apiPricing.refundable_deposit[0].intlSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-gray-700">4</td>
                            <td className="px-3 py-3 font-medium text-gray-900">International</td>
                            <td className="px-3 py-3 text-gray-700">Per hour</td>
                            <td className="px-3 py-3 text-right text-gray-700">{apiPricing.refundable_deposit[0].international.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Static Fallback Pricing (from data.ts when API is unavailable) ─── */}
          {useStaticPricing && (facility.pricingData.competition.length > 0 || facility.pricingData.practices.length > 0 || facility.pricingData.refundableDeposits.length > 0) && (
            <section>
              {/* Competition / Meet / Tournament Table */}
              {facility.pricingData.competition.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Competition / Meet / Tournament</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <th className="px-3 py-3 text-left font-semibold w-12">No</th>
                            <th className="px-3 py-3 text-left font-semibold">Events</th>
                            <th className="px-3 py-3 text-left font-semibold">Sports</th>
                            <th className="px-3 py-3 text-left font-semibold">Duration</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.govtSchoolsRs') || 'Government Schools (Rs.)'}</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.clubRs') || 'Club/Institute (Rs.)'}</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.intlSchoolsRs') || 'International Schools (Rs.)'}</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.internationalRs') || 'International (Rs.)'}</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {facility.pricingData.competition.map((row) => {
                            const event = currentLang === 'si' ? row.eventSi : currentLang === 'ta' ? row.eventTa : row.event;
                            const sports = currentLang === 'si' ? row.sportsSi : currentLang === 'ta' ? row.sportsTa : row.sports;
                            return (
                              <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-3 text-gray-700">{row.no}</td>
                                <td className="px-3 py-3 font-medium text-gray-900">{event}</td>
                                <td className="px-3 py-3 text-gray-700 text-sm">{sports}</td>
                                <td className="px-3 py-3 text-gray-700">{row.duration}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.govtSchools.toFixed(2)}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.club.toFixed(2)}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.intlSchools.toFixed(2)}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.international.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Practices Table */}
              {facility.pricingData.practices.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Practices</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <th className="px-3 py-3 text-left font-semibold w-12">No</th>
                            <th className="px-3 py-3 text-left font-semibold">Events</th>
                            <th className="px-3 py-3 text-left font-semibold">Sports</th>
                            <th className="px-3 py-3 text-left font-semibold">Duration</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.govtSchoolsRs') || 'Government Schools (Rs.)'}</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.clubRs') || 'Club/Institute (Rs.)'}</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.intlSchoolsRs') || 'International Schools (Rs.)'}</th>
                            <th className="px-3 py-3 text-right font-semibold">{t('facility.internationalRs') || 'International (Rs.)'}</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {facility.pricingData.practices.map((row) => {
                            const event = currentLang === 'si' ? row.eventSi : currentLang === 'ta' ? row.eventTa : row.event;
                            const sports = currentLang === 'si' ? row.sportsSi : currentLang === 'ta' ? row.sportsTa : row.sports;
                            return (
                              <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-3 text-gray-700">{row.no}</td>
                                <td className="px-3 py-3 font-medium text-gray-900">{event}</td>
                                <td className="px-3 py-3 text-gray-700 text-sm">{sports}</td>
                                <td className="px-3 py-3 text-gray-700">{row.duration}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.govtSchools.toFixed(2)}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.club.toFixed(2)}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.intlSchools.toFixed(2)}</td>
                                <td className="px-3 py-3 text-right text-gray-700">{row.international.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Refundable Deposits Table */}
              {facility.pricingData.refundableDeposits.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('facility.refundableDeposits') || 'Refundable Deposits'}</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-900 text-white text-xs uppercase tracking-wider">
                            <th className="px-3 py-3 text-left font-semibold w-12">No</th>
                            <th className="px-3 py-3 text-left font-semibold">Customer Type</th>
                            <th className="px-3 py-3 text-left font-semibold">Duration</th>
                            <th className="px-3 py-3 text-left font-semibold">Deposit (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {facility.pricingData.refundableDeposits.map((row) => {
                            const customer = currentLang === 'si' ? row.customerTypeSi : currentLang === 'ta' ? row.customerTypeTa : row.customerType;
                            return (
                              <tr key={row.no} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-3 text-gray-700">{row.no}</td>
                                <td className="px-3 py-3 font-medium text-gray-900">{customer}</td>
                                <td className="px-3 py-3 text-gray-700">{row.duration}</td>
                                <td className="px-3 py-3 text-gray-700">{row.deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

