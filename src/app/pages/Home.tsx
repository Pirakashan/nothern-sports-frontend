import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Youtube, MousePointer2, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { facilities, type Facility } from '../data';

// Default images for known facility slugs
const FACILITY_IMAGE_MAP: Record<string, string> = {
  'outdoor-stadium': '/images/unnamed 8.jpg',
  'swimming-pool': '/images/unnamed 6.jpg',
  'indoor-stadium': '/images/unnamed 3.jpg',
  'basketball-court': '/images/unnamed 4.jpg',
  'dormitory': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1080',
  'conference-hall': 'https://images.unsplash.com/photo-1764471444363-e6dc0f9773bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'vehicle-parking': 'https://images.unsplash.com/photo-1703743618612-a104e48ce0d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  'fitness-center': 'https://images.unsplash.com/photo-1771586791190-97ed536c54af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
};

const DEFAULT_FACILITY_IMAGE = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';

export function getFacilityImage(facility: Facility): string {
  return FACILITY_IMAGE_MAP[facility.slug] || DEFAULT_FACILITY_IMAGE;
}

export function Home() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      src: '/images/Gemini_Generated_Image_yusmqpyusmqpyusm.png',
      alt: 'Sports Complex Aerial View',
      facilityLink: '/about',
      buttonText: t('hero.aboutUs')
    },
    {
      src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yIHNwb3J0cyBmaWVsZHxlbnwxfHx8fDE3NzIxNDkzMzN8MA&ixlib=rb-4.1.0&q=80&w=2000',
      alt: 'Outdoor Sports Field',
      facilityLink: '/book',
      buttonText: t('nav.bookNow')
    },
    {
      src: 'https://images.unsplash.com/photo-1695326288959-89be49070059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2wlMjBvbHltcGljfGVufDF8fHx8MTc3MjEwMDQ2OXww&ixlib=rb-4.1.0&q=80&w=2000',
      alt: 'Swimming Pool',
      facilityLink: '/about',
      buttonText: t('hero.aboutUs')
    },
    {
      src: '/images/unnamed.jpg',
      alt: 'Indoor Stadium',
      facilityLink: '/book',
      buttonText: t('nav.bookNow')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const previousSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const featuredFacilities = facilities.filter(f => 
    ['outdoor-stadium', 'swimming-pool', 'indoor-stadium', 'basketball-court'].includes(f.id)
  );

  return (
    <div className="min-h-screen font-['Montserrat']">
      {/* Hero Section */}
      <section className="relative px-4 py-4 md:px-8 md:py-6 bg-white overflow-hidden">
        {/* Main Hero Container with Rounded Corners */}
        <div className="relative h-[70vh] min-h-[550px] rounded-[48px] overflow-hidden shadow-2xl">
          {/* Slides Container */}
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4 max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-[1.2] tracking-tight uppercase drop-shadow-xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm md:text-base lg:text-lg mb-10 text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to={heroImages[currentSlide].facilityLink}>
                <Button className="bg-[#d4af37] hover:bg-[#c79f2e] text-white text-base font-bold px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-none">
                  {heroImages[currentSlide].buttonText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Slide Controls (Inside rounded container) */}
          <button onClick={previousSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/30">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/30">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 items-center">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${index === currentSlide ? 'bg-white w-8 h-1.5' : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/60'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>



      {/* Empowering Athletes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-black/5 text-black text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                {t('about.badge')}
              </div>
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
                  src="/images/Gemini_Generated_Image_yusmqpyusmqpyusm.png"
                  alt="Athletes training at the sports complex"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
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

      {/* Featured Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">{t('nav.facilities')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('facilities.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFacilities.map((facility) => {
              const facilityName = facility.name;

              return (
                <Link key={facility.id} to={`/facilities/${facility.slug}`}>
                  <div className="relative h-64 overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <ImageWithFallback
                      src={getFacilityImage(facility)}
                      alt={facilityName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                      <div className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <p className="text-lg font-bold">{facilityName}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/about">
              <Button className="inline-block bg-black hover:bg-gray-800 text-white text-base px-4 py-2">
                {t('facilities.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
