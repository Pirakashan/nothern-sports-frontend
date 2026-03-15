import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Globe, User, LogOut, LayoutDashboard, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { isAuthenticated, getStoredUser, clearAuth, getPhotoUrl } from '../api';

export function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const [user, setUser] = useState(getStoredUser());
  const isUserAuthenticated = isAuthenticated();

  // Listen for profile updates from UserDashboard
  useEffect(() => {
    const handleUpdate = () => setUser(getStoredUser());
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.reload();
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const facilities = [
    { slug: 'indoor-stadium', label: t('facilities.indoorStadium') },
    { slug: 'outdoor-stadium', label: t('facilities.outdoorStadium') },
    { slug: 'basketball-court', label: t('facilities.basketballCourt') },
    { slug: 'swimming-pool', label: t('facilities.swimmingPool') },
  ];

  const languages = [
    { code: 'en', label: 'English', shortLabel: 'EN' },
    { code: 'si', label: 'සිංහල', shortLabel: 'සිං' },
    { code: 'ta', label: 'தமிழ்', shortLabel: 'த' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[68px]">
          {/* ─── Logo Area ─── */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Emblem_of_Sri_Lanka.svg/1200px-Emblem_of_Sri_Lanka.svg.png"
                  alt="Government Emblem"
                  className="w-8 h-8 object-contain"
                />
              </div>
              {/* Text block with Sinhala / Tamil / English */}
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-[10px] text-gray-600 font-medium">උතුරු පළාත් ක්‍රීඩා සංකීර්ණය</span>
                <span className="text-[10px] text-gray-600 font-medium">வடக்கு மாகாண விளையாட்டு வளாகம்</span>
                <span className="text-[10px] text-gray-900 font-semibold tracking-wide">Provincial Sports Complex – Northern Province</span>
              </div>
            </div>
          </Link>

          {/* ═══════════ Desktop Navigation ═══════════ */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* 1 ─ Home */}
            <Link
              to="/"
              className={`px-4 py-2 text-[15px] font-medium transition-colors hover:text-[#d4af37] focus:outline-none ${location.pathname === '/'
                ? 'text-black font-semibold'
                : 'text-[#666666]'
                }`}
            >
              {t('nav.home')}
            </Link>

            {/* 2 ─ About Us */}
            <Link
              to="/about"
              className={`px-4 py-2 text-[15px] font-medium transition-colors hover:text-[#d4af37] focus:outline-none ${location.pathname === '/about'
                ? 'text-black font-semibold'
                : 'text-[#666666]'
                }`}
            >
              {t('nav.about')}
            </Link>

            {/* 3 ─ Our Facilities (dropdown) */}
            <DropdownMenu open={facilitiesOpen} onOpenChange={setFacilitiesOpen}>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors focus:outline-none hover:text-[#d4af37] ${location.pathname.startsWith('/facilities')
                  ? 'text-black font-semibold'
                  : 'text-[#666666]'
                  }`}
              >
                {t('nav.facilities')}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${facilitiesOpen ? 'rotate-180' : ''
                    }`}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                sideOffset={16}
                align="start"
                className="w-60 bg-white border border-gray-100 shadow-xl py-4 space-y-2 overflow-hidden"
              >
                {facilities.map((facility) => (
                  <DropdownMenuItem
                    key={facility.slug}
                    asChild
                    className="!px-0 !py-0 !rounded-none focus:bg-gray-50"
                  >
                    <Link
                      to={`/facilities/${facility.slug}`}
                      className="block w-full px-8 py-6 text-[15px] font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      {facility.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 5 ─ Calendar */}
            <Link
              to="/calendar"
              className={`px-4 py-2 text-[15px] font-medium transition-colors hover:text-[#d4af37] focus:outline-none ${location.pathname === '/calendar'
                ? 'text-black font-semibold'
                : 'text-[#666666]'
                }`}
            >
              {t('nav.calendar')}
            </Link>

            {/* ─── Language Dropdown ─── */}
            <div className="ml-4 border-l border-gray-200 pl-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-[14px] font-bold text-gray-700 hover:text-black transition-all rounded-lg hover:bg-gray-100 outline-none border border-transparent hover:border-gray-200 uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  {currentLang.shortLabel}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white shadow-2xl border border-gray-100 py-4 space-y-1 mt-2 overflow-hidden">
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} asChild>
                      <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-8 py-5 flex items-center justify-between transition-all ${i18n.language === lang.code
                          ? 'bg-gray-100 text-black font-bold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                          }`}
                      >
                        <span className="text-[14px]">{lang.label}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${i18n.language === lang.code ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {lang.shortLabel}
                        </span>
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ─── User Profile Icon / Auth Dropdown ─── */}
            {!isUserAuthenticated ? (
              <Link to="/login">
                <button className="ml-3 w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            ) : (
              <div className="ml-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 h-10 px-2 rounded-full hover:bg-gray-100 transition-colors outline-none border border-transparent">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {getPhotoUrl(user) ? (
                        <img src={getPhotoUrl(user)!} alt={user?.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        user?.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:inline text-sm font-semibold text-gray-700">
                      {user?.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white shadow-2xl border border-gray-100 py-2 mt-2">
                    <div className="px-4 py-3 mb-2 bg-gray-50/50 rounded-t-lg">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('auth.signedInAs')}</p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.role === 'system_admin' ? t('auth.systemAdmin') : user?.role === 'sub_admin' ? t('auth.subAdmin') : t('auth.user')}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link
                        to={user?.role === 'system_admin' || user?.role === 'sub_admin' ? "/admin/dashboard" : "/dashboard"}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t('auth.dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('auth.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* ─── Book Now ─── */}
            <Link to="/book" className="ml-2">
              <Button className="bg-[#d4af37] hover:bg-[#c79f2e] text-white px-6 py-2.5 rounded-xl text-[14px] font-bold shadow-sm transition-all border-none">
                {t('nav.bookNow')}
              </Button>
            </Link>
          </nav>

          {/* ═══════════ Mobile Menu ═══════════ */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1.5 text-[12px] font-medium text-gray-600 hover:text-black transition-colors rounded-md hover:bg-gray-100 outline-none border border-gray-200">
                <Globe className="w-3.5 h-3.5" />
                {currentLang.shortLabel}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white shadow-xl border border-gray-100 py-3 space-y-1">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} asChild>
                    <button
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left text-sm px-6 py-4 ${i18n.language === lang.code ? 'font-bold text-black bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        } transition-colors`}
                    >
                      {lang.label}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white text-black border-l border-gray-200">
                <nav className="flex flex-col gap-4 mt-8">
                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`text-lg hover:text-[#d4af37] transition-colors focus:outline-none ${location.pathname === '/' ? 'text-black font-semibold' : 'text-gray-600'
                      }`}
                  >
                    {t('nav.home')}
                  </Link>

                  {/* About Us */}
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className={`text-lg hover:text-[#d4af37] transition-colors focus:outline-none ${location.pathname === '/about' ? 'text-black font-semibold' : 'text-gray-600'
                      }`}
                  >
                    {t('nav.about')}
                  </Link>

                  {/* Our Facilities (expanded list) */}
                  <div className="border-t border-gray-200 pt-4 mt-1">
                    <div className="text-sm font-semibold text-black mb-2 uppercase tracking-wider">
                      {t('nav.facilities')}
                    </div>
                    {facilities.map((facility) => (
                      <Link
                        key={facility.slug}
                        to={`/facilities/${facility.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 pl-4 text-[15px] text-gray-600 hover:text-[#d4af37] hover:pl-5 transition-all duration-150 border-l-2 border-transparent hover:border-black focus:outline-none"
                      >
                        {facility.label}
                      </Link>
                    ))}
                  </div>

                  {/* Calendar */}
                  <Link
                    to="/calendar"
                    onClick={() => setIsOpen(false)}
                    className={`text-lg hover:text-[#d4af37] transition-colors focus:outline-none border-t border-gray-200 pt-4 ${location.pathname === '/calendar' ? 'text-black font-semibold' : 'text-gray-600'
                      }`}
                  >
                    {t('nav.calendar')}
                  </Link>

                  {/* Book Now */}
                  <Link to="/book" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-[#d4af37] hover:bg-[#c79f2e] text-white mt-4 rounded-md font-bold shadow-md border border-transparent">
                      {t('nav.bookNow')}
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
