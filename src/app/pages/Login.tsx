import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authApi, saveAuth } from '../api';

export function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await authApi.login({ email, password });
            saveAuth(res.token, res.user);

            // Redirect based on role
            if (res.user.role === 'system_admin' || res.user.role === 'sub_admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
            // Force a reload or state update to refresh header
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#F9FAFB] flex items-center justify-center font-['Montserrat']">
            <div className="container mx-auto px-4 flex justify-center">
                <div className="w-full max-w-[450px]">
                    {/* Logo / Title Area */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white mb-6 shadow-lg">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{t('login.welcome')}</h1>
                        <p className="text-gray-500 font-medium">{t('login.subtitle')}</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                    {t('login.emailLabel')}
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all text-gray-900 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                    {t('login.passwordLabel')}
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all text-gray-900 font-medium"
                                    />
                                </div>
                                <div className="flex justify-end pr-1">
                                    <Link to="#" className="text-[11px] font-bold text-black hover:underline uppercase tracking-widest">
                                        {t('login.forgotPassword')}
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#d4af37] hover:bg-[#b8962d] text-black rounded-xl font-bold text-base shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {t('login.signIn')}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                            <p className="text-gray-500 text-sm font-medium">
                                {t('login.noAccount')}{' '}
                                <Link to="/register" className="text-black font-bold hover:underline">
                                    {t('login.createAccount')}
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Social Proof / Trust */}
                    <div className="mt-12 text-center opacity-40 grayscale flex items-center justify-center gap-8">
                        <span className="text-xs font-bold uppercase tracking-widest">{t('login.secure')}</span>
                        <span className="text-xs font-bold uppercase tracking-widest">{t('login.encrypted')}</span>
                        <span className="text-xs font-bold uppercase tracking-widest">{t('login.official')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
