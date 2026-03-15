import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
    Home,
    CreditCard,
    Calendar as CalendarIcon,
    User,
    LogOut,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    MapPin,
    Mail,
    Phone,
    FileText,
    Building2,
    Camera,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import {
    getStoredUser,
    clearAuth,
    bookingApi,
    subscriptionApi,
    transactionApi,
    authApi,
    saveAuth,
    getPhotoUrl,
    Booking,
    Subscription,
    Transaction,
} from '../api';

export function UserDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentUser, setCurrentUser] = useState(getStoredUser());
    const user = currentUser;
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [subscriptionStatus, setSubscriptionStatus] = useState('none');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Profile form state
    const [profileName, setProfileName] = useState(user?.name || '');
    const [profileEmail, setProfileEmail] = useState(user?.email || '');
    const [profilePhone, setProfilePhone] = useState(user?.phone || '');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(getPhotoUrl(user));
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');
    const [profileError, setProfileError] = useState('');
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subsRes, bookingsRes, txRes] = await Promise.all([
                subscriptionApi.mySubscriptions().catch(() => null),
                bookingApi.myBookings().catch(() => null),
                transactionApi.myTransactions().catch(() => null),
            ]);
            if (subsRes) {
                setSubscriptions(subsRes.subscriptions || []);
                setSubscriptionStatus(subsRes.subscription_status || 'none');
            }
            if (bookingsRes) {
                setBookings(bookingsRes.bookings || []);
            }
            if (txRes) {
                setTransactions(txRes.transactions || []);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async (id: number) => {
        if (!confirm('Cancel this subscription?')) return;
        try {
            await subscriptionApi.cancel(id);
            fetchData();
        } catch (err) {
            alert('Failed to cancel subscription');
        }
    };

    const handleProfileSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setProfileSaving(true);
        setProfileMsg('');
        setProfileError('');
        try {
            const formData = new FormData();
            formData.append('name', profileName);
            formData.append('email', profileEmail);
            formData.append('phone', profilePhone);
            if (profilePhoto) {
                formData.append('profile_photo', profilePhoto);
            }
            formData.append('_method', 'PUT');
            
            const res = await authApi.updateProfile(formData);
            if (res.user) {
                // Ensure the user object has the updated photo path or URL
                const updatedUser = { 
                    ...res.user, 
                    profile_photo: res.profile_photo_url || res.user.profile_photo 
                };
                
                const token = localStorage.getItem('auth_token');
                if (token) saveAuth(token, updatedUser);
                setCurrentUser(updatedUser);
                setProfileName(updatedUser.name);
                setProfileEmail(updatedUser.email);
                setProfilePhone(updatedUser.phone || '');
                
                // Construct the photo preview URL from either the response or the user model
                const previewUrl = getPhotoUrl(updatedUser);
                setPhotoPreview(previewUrl);
                setProfilePhoto(null);
                
                // Dispatch event so Header updates too
                window.dispatchEvent(new Event('user-updated'));
            }
            setProfileMsg('Profile updated successfully.');
        } catch (err: any) {
            setProfileError(err.message || 'Failed to update profile.');
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMsg('Passwords do not match.');
            return;
        }
        setPasswordSaving(true);
        setPasswordMsg('');
        try {
            const formData = new FormData();
            formData.append('current_password', currentPassword);
            formData.append('password', newPassword);
            formData.append('password_confirmation', confirmPassword);
            formData.append('_method', 'PUT');
            await authApi.updateProfile(formData);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordMsg('Password updated successfully.');
        } catch (err: any) {
            setPasswordMsg(err.message || 'Failed to update password.');
        } finally {
            setPasswordSaving(false);
        }
    };

    if (!user) return null;

    const NavItem = ({ icon, label, id }: { icon: React.ReactNode; label: string; id: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === id
                    ? 'bg-white text-blue-700 shadow-sm border border-gray-100 font-bold'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
            }`}
        >
            <div className={`${activeTab === id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                {icon}
            </div>
            <span className="text-sm font-semibold">{label}</span>
        </button>
    );

    const statusBadge = (status: string) => {
        if (status === 'active') return <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-xs px-3 py-1">Active</Badge>;
        if (status === 'expired') return <Badge className="bg-red-50 text-red-600 border-red-200 font-bold text-xs px-3 py-1">Expired</Badge>;
        if (status === 'cancelled') return <Badge className="bg-gray-100 text-gray-500 border-none font-bold text-xs px-3 py-1">Cancelled</Badge>;
        return <Badge variant="outline" className="font-bold text-xs px-3 py-1">{status}</Badge>;
    };

    // Shared subscription table component
    const SubscriptionTable = () => (
        <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-6 bg-white border-b border-gray-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">My Subscriptions</CardTitle>
                    <Button
                        onClick={() => navigate('/book')}
                        className="bg-black hover:bg-gray-800 text-white rounded-xl h-10 px-5 font-bold text-sm"
                    >
                        + New Subscription
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-gray-100">
                            <TableHead className="py-4 px-6 font-bold text-[11px] uppercase tracking-widest text-gray-400">Facility</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Active Range</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Status</TableHead>
                            <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-16 text-gray-400 font-medium">
                                    No subscriptions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscriptions.map((sub) => (
                                <TableRow key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <span className="font-bold text-gray-900 text-sm">{sub.facility?.name || 'Unknown'}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600 font-medium">
                                        {sub.start_date} → {sub.end_date}
                                    </TableCell>
                                    <TableCell>{statusBadge(sub.status)}</TableCell>
                                    <TableCell>
                                        {sub.status === 'active' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold"
                                                onClick={() => handleCancelSubscription(sub.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    // Right sidebar component
    const RightSidebar = () => (
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Reserve Facility Card */}
            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Reserve Facility for Your Organization</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">
                        Book a facility for your organization's events, meetings, or activities with ease. Secure your reservation in advance and ensure a seamless experience for your team.
                    </p>
                    <Button
                        onClick={() => navigate('/book')}
                        className="bg-black hover:bg-gray-800 text-white rounded-xl h-11 px-6 font-bold text-sm"
                    >
                        Start Booking
                    </Button>
                </CardContent>
            </Card>

            {/* User Info Card */}
            <Card className="border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[24px] overflow-hidden bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center text-[ Montserrat]">
                    <div className="w-24 h-24 rounded-full bg-amber-50 border-4 border-white shadow-lg flex items-center justify-center text-amber-600 font-bold text-3xl mb-4 overflow-hidden">
                        {getPhotoUrl(user) ? (
                            <img 
                                src={getPhotoUrl(user)!} 
                                alt={user.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">{user.name}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                        {user.email}
                    </p>
                    <div className="w-full flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                        {subscriptionStatus === 'active' && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px] px-3 py-1">Active Member</Badge>
                        )}
                        {subscriptionStatus === 'expired' && (
                            <Badge className="bg-red-50 text-red-600 border-none font-bold text-[10px] px-3 py-1">Expired</Badge>
                        )}
                        {subscriptionStatus === 'none' && (
                            <Badge className="bg-gray-50 text-gray-400 border-none font-bold text-[10px] px-3 py-1">Standard</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </aside>
    );

    return (
        <div className="min-h-screen pt-28 pb-12 bg-[#F5F6FA] font-['Montserrat']">
            <div className="container mx-auto px-4 max-w-[1400px]">

                {/* ─── Home Icon ─── */}
                <button
                    onClick={() => setActiveTab('home')}
                    className="mb-6 p-2 rounded-lg hover:bg-white/80 transition-colors group"
                    title="Home"
                >
                    <Home className={`w-7 h-7 ${activeTab === 'home' ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'} transition-colors`} />
                </button>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ─── Left Sidebar ─── */}
                    <aside className="w-full lg:w-60 shrink-0">
                        <nav className="bg-white/50 rounded-2xl p-3 space-y-1 sticky top-28 border border-gray-100">
                            <NavItem icon={<CreditCard className="w-5 h-5" />} label="My Subscription" id="subscriptions" />
                            <NavItem icon={<FileText className="w-5 h-5" />} label="My Bookings" id="bookings" />
                            <NavItem icon={<User className="w-5 h-5" />} label="Profile" id="profile" />
                        </nav>
                    </aside>

                    {/* ─── Main Content ─── */}
                    <main className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-32">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                {/* ─── HOME TAB ─── */}
                                {activeTab === 'home' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="flex-1 min-w-0">
                                                <SubscriptionTable />
                                            </div>
                                            <RightSidebar />
                                        </div>
                                    </div>
                                )}

                                {/* ─── SUBSCRIPTIONS TAB ─── */}
                                {activeTab === 'subscriptions' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="flex-1 min-w-0">
                                                <SubscriptionTable />
                                            </div>
                                            <RightSidebar />
                                        </div>

                                        {/* Past Transactions */}
                                        <div className="mt-8">
                                            <h2 className="text-xl font-bold text-blue-700 mb-1">Past Transactions</h2>
                                            <p className="text-gray-400 text-sm mb-4">,</p>
                                            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                                <CardContent className="p-0">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="border-b border-gray-100">
                                                                <TableHead className="py-4 px-6 font-bold text-[11px] uppercase tracking-widest text-gray-400">Transaction ID</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Payment Date</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Facility</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Frequency</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">User Type</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Price (LKR)</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Expiry Date</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Action</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {transactions.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={8} className="text-center py-6">
                                                                        <div className="bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium text-sm">
                                                                            No subscription transactions available.
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                transactions.map((tx) => (
                                                                    <TableRow key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                                        <TableCell className="py-4 px-6 font-medium text-gray-900 text-sm">{tx.transaction_id}</TableCell>
                                                                        <TableCell className="text-sm text-gray-600">{tx.payment_date}</TableCell>
                                                                        <TableCell className="text-sm text-gray-600">{tx.subscription?.facility?.name || '-'}</TableCell>
                                                                        <TableCell className="text-sm text-gray-600 capitalize">{tx.subscription?.frequency || '-'}</TableCell>
                                                                        <TableCell className="text-sm text-gray-600 capitalize">{tx.user_type}</TableCell>
                                                                        <TableCell className="text-sm font-medium text-gray-900">{Number(tx.amount || 0).toLocaleString()}</TableCell>
                                                                        <TableCell className="text-sm text-gray-600">{tx.subscription?.end_date || '-'}</TableCell>
                                                                        <TableCell>
                                                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold">
                                                                                View
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}

                                {/* ─── BOOKINGS TAB ─── */}
                                {activeTab === 'bookings' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-3">My Bookings</h1>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-4xl">
                                            Below is a detailed list of your bookings, including dates, facilities, and booking types.
                                            You can view your confirmed, pending, or completed bookings at a glance. Stay organized and track your
                                            reservations for training sessions, events, or facility usage conveniently. Need to manage or update a booking?
                                            Select the appropriate option to take action.
                                        </p>
                                        {bookings.length === 0 ? (
                                            <div className="bg-red-50 text-red-600 py-4 px-6 rounded-lg font-medium text-sm text-center">
                                                No bookings available.
                                            </div>
                                        ) : (
                                            <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                                <CardContent className="p-0">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="border-b border-gray-100">
                                                                <TableHead className="py-4 px-6 font-bold text-[11px] uppercase tracking-widest text-gray-400">Reference</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Facility</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Date & Time</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Status</TableHead>
                                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right pr-6">Amount</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {bookings.map((b) => (
                                                                <TableRow key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                                    <TableCell className="py-4 px-6 font-bold text-gray-900 text-sm">#BK-{b.id}</TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-bold text-gray-800 text-sm">{b.facility?.name || '-'}</span>
                                                                            <span className="text-xs text-blue-600 font-medium">{b.sport?.name || 'General'}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-medium text-gray-800">{b.booking_date}</span>
                                                                            <span className="text-xs text-gray-400">{b.start_time} - {b.end_time}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {b.status === 'confirmed' && <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-xs">Confirmed</Badge>}
                                                                        {b.status === 'pending' && <Badge className="bg-amber-50 text-amber-700 border-none font-bold text-xs">Pending</Badge>}
                                                                        {b.status === 'rejected' && <Badge className="bg-red-50 text-red-600 border-none font-bold text-xs">Rejected</Badge>}
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6">
                                                                        <span className="font-bold text-gray-900">Rs. {Number(b.price || 0).toLocaleString()}</span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                )}

                                {/* ─── PROFILE TAB ─── */}
                                {activeTab === 'profile' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-10">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            <div className="lg:w-80 shrink-0">
                                                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                                <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                                                    Update your account's profile information and email address. Keep your contact details up to date.
                                                </p>
                                            </div>
                                            <Card className="flex-1 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
                                                <CardContent className="p-8 space-y-8">
                                                    {/* Photo Upload Area */}
                                                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-50">
                                                        <div className="relative group">
                                                            <div className="w-24 h-24 rounded-full bg-amber-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                                                {photoPreview ? (
                                                                    <img 
                                                                        src={photoPreview} 
                                                                        alt="Profile" 
                                                                        className="w-full h-full object-cover" 
                                                                        onError={(e) => {
                                                                            // If the image fails to load, fallback to initials
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                            setPhotoPreview(null);
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span className="text-3xl font-bold text-amber-600">
                                                                        {profileName.charAt(0).toUpperCase()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button 
                                                                onClick={() => photoInputRef.current?.click()}
                                                                className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full shadow-xl hover:bg-amber-600 transition-colors"
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-col items-center sm:items-start gap-2">
                                                            <input
                                                                type="file"
                                                                ref={photoInputRef}
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0] || null;
                                                                    if (file) {
                                                                        setProfilePhoto(file);
                                                                        setPhotoPreview(URL.createObjectURL(file));
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="font-bold text-[11px] uppercase tracking-widest rounded-xl px-6 h-10 border-gray-200 hover:bg-gray-50 bg-white text-gray-900"
                                                                onClick={() => photoInputRef.current?.click()}
                                                            >
                                                                Select a New Photo
                                                            </Button>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                                JPG, PNG OR BITMAP. MAX SIZE 2MB.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Form Fields */}
                                                    <form onSubmit={handleProfileSave} className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
                                                                <Input
                                                                    value={profileName}
                                                                    onChange={(e) => setProfileName(e.target.value)}
                                                                    className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                                                                <Input
                                                                    value={profileEmail}
                                                                    onChange={(e) => setProfileEmail(e.target.value)}
                                                                    className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                                />
                                                            </div>
                                                            <div className="space-y-2 md:col-span-2">
                                                                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
                                                                <Input
                                                                    value={profilePhone}
                                                                    onChange={(e) => setProfilePhone(e.target.value)}
                                                                    className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                                    placeholder="+94 7X XXX XXXX"
                                                                />
                                                            </div>
                                                        </div>

                                                        {profileMsg && (
                                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                {profileMsg}
                                                            </div>
                                                        )}
                                                        {profileError && (
                                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm font-semibold">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {profileError}
                                                            </div>
                                                        )}

                                                        <div className="flex justify-end pt-4">
                                                            <Button
                                                                type="submit"
                                                                disabled={profileSaving}
                                                                className="bg-black hover:bg-amber-600 text-white rounded-xl h-12 px-10 font-bold text-sm shadow-lg shadow-black/5 transition-all"
                                                            >
                                                                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE'}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Horizontal Divider */}
                                        <hr className="border-gray-200" />

                                        {/* Update Password Section */}
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            <div className="lg:w-80 shrink-0">
                                                <h2 className="text-xl font-bold text-gray-900">Update Password</h2>
                                                <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
                                                    Ensure your account is using a long, random password to stay secure.
                                                </p>
                                            </div>
                                            <Card className="flex-1 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
                                                <CardContent className="p-8 space-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</Label>
                                                        <Input
                                                            type="password"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</Label>
                                                            <Input
                                                                type="password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</Label>
                                                            <Input
                                                                type="password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                            />
                                                        </div>
                                                    </div>
                                                    {passwordMsg && (
                                                        <div className={`p-3 rounded-lg text-sm font-semibold ${passwordMsg.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                            {passwordMsg}
                                                        </div>
                                                    )}
                                                    <div className="flex justify-end pt-4">
                                                        <Button
                                                            onClick={handlePasswordSave}
                                                            disabled={passwordSaving}
                                                            className="bg-gray-100 hover:bg-black hover:text-white text-black rounded-xl h-12 px-10 font-bold transition-all"
                                                        >
                                                            {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE'}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
