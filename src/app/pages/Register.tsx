import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Phone, Loader2, AlertCircle, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authApi, saveAuth } from '../api';

export function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const res = await authApi.register(formData);
            saveAuth(res.token, res.user);

            // Redirect to home or profile
            navigate('/');
            window.location.reload(); // Force header update
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#F9FAFB] flex items-center justify-center font-['Montserrat']">
            <div className="container mx-auto px-4 flex justify-center">
                <div className="w-full max-w-[500px]">
                    {/* Logo / Title Area */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white mb-6 shadow-lg">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{t('register.title')}</h1>
                        <p className="text-gray-500 font-medium tracking-tight">{t('register.subtitle')}</p>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="space-y-1.5 px-0.5">
                                <Label htmlFor="name" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    {t('register.fullName')}
                                </Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors w-5 h-5" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-black transition-all text-gray-900 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 px-0.5">
                                    <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {t('register.email')}
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors w-5 h-5" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@mail.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-black transition-all text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 px-0.5">
                                    <Label htmlFor="phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {t('register.phone')}
                                    </Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors w-5 h-5" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+94 7X XXX XXXX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-black transition-all text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 px-0.5">
                                    <Label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {t('register.password')}
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors w-5 h-5" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-black transition-all text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 px-0.5">
                                    <Label htmlFor="password_confirmation" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {t('register.confirm')}
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors w-5 h-5" />
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:ring-black transition-all text-gray-900 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-xl font-bold text-base shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {t('register.registerNow')}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                            <p className="text-gray-500 text-sm font-medium">
                                {t('register.hasAccount')}{' '}
                                <Link to="/login" className="text-black font-bold hover:underline">
                                    {t('register.signIn')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Separate component for icon to avoid confusion
function UserPlus(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="16" x2="22" y1="11" y2="11" />
        </svg>
    );
}
