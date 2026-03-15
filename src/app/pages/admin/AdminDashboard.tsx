import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    Activity,
    Bell,
    Calendar,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    Download,
    Eye,
    Filter,
    LayoutDashboard,
    LogOut,
    Menu,
    MoreVertical,
    Plus,
    RotateCcw,
    Search,
    Settings,
    Trash2,
    TrendingUp,
    UserPlus,
    Users,
    X,
    Building2,
    Activity as SportIcon,
    LucideIcon,
    ChevronRight,
    Search as SearchIcon,
    Activity as ActivityIcon,
    MapPin,
    Phone,
    Mail,
    Image as ImageIcon,
    Pencil,
    Tags,
    Loader2,
    XCircle,
    Clock,
    FileText,
    PlusCircle,
    UserCog
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Textarea } from "../../components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import {
    getStoredUser,
    isAuthenticated,
    clearAuth,
    systemAdminApi,
    subAdminApi,
    districtApi,
    User,
    Booking,
    District,
    Facility
} from '../../api';
import jsPDF from 'jspdf';

export function AdminDashboard() {
    const navigate = useNavigate();
    const user = getStoredUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Data State
    const [stats, setStats] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [subAdmins, setSubAdmins] = useState<User[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [confirmedReports, setConfirmedReports] = useState<Booking[]>([]);
    const [rejectedReports, setRejectedReports] = useState<Booking[]>([]);
    const [reportSubTab, setReportSubTab] = useState<'all' | 'confirmed' | 'rejected'>('all');
    const [reportMonth, setReportMonth] = useState<number>(new Date().getMonth() + 1);
    const [reportYear, setReportYear] = useState<number>(new Date().getFullYear());

    // Filtered reports by selected month/year
    const filterByDate = (list: Booking[]) => list.filter(b => {
        if (!b.booking_date) return false;
        const d = new Date(b.booking_date);
        return d.getMonth() + 1 === reportMonth && d.getFullYear() === reportYear;
    });
    const filteredConfirmed = filterByDate(confirmedReports);
    const filteredRejected = filterByDate(rejectedReports);

    // Form State for new Facility
    const [newFacility, setNewFacility] = useState({
        name: '',
        description: '',
        district_id: '',
        file: null as File | null,
        sports: [{
            name: '', pricing: [
                { type: 'practice', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                { type: 'competition', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                { type: 'refundable_deposit', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' }
            ]
        }]
    });

    // Form State for new Sub Admin
    const [newSubAdmin, setNewSubAdmin] = useState({
        name: '',
        email: '',
        password: '',
        district_id: ''
    });

    // Edit Facility State
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [editFacilityForm, setEditFacilityForm] = useState({
        name: '',
        description: '',
        file: null as File | null,
    });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addSportName, setAddSportName] = useState('');
    const [addSportPricing, setAddSportPricing] = useState([
        { type: 'practice', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
        { type: 'competition', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
        { type: 'refundable_deposit', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' }
    ]);
    const [addFacilityDialogOpen, setAddFacilityDialogOpen] = useState(false);
    const [facilityDistrictFilter, setFacilityDistrictFilter] = useState<string>('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [bookingSearchQuery, setBookingSearchQuery] = useState('');
    const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);
    const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
    const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editUserForm, setEditUserForm] = useState({
        name: '',
        email: '',
        phone: '',
        district_id: ''
    });

    // Filtered Users
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearchQuery))
    );

    // Filtered Bookings for the bookings tab
    const filteredBookings = bookings.filter(b => {
        const query = bookingSearchQuery.toLowerCase();
        return (
            (b.guest_name || b.user?.name || '').toLowerCase().includes(query) ||
            b.facility?.name?.toLowerCase().includes(query) ||
            b.booking_date?.includes(query)
        );
    });

    useEffect(() => {
        if (!isAuthenticated() || (user?.role !== 'system_admin' && user?.role !== 'sub_admin')) {
            navigate('/login');
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (background = false) => {
        if (!background) setLoading(true);
        try {
            const isAdmin = user?.role === 'system_admin';

            // Fetch core data - catch individually so one failure doesn't block all
            const [statsRes, districtsRes, facilitiesRes] = await Promise.all([
                (isAdmin ? systemAdminApi.getDashboard() : subAdminApi.getDashboard()).catch(() => null),
                districtApi.getAll().catch(() => null),
                subAdminApi.getFacilities().catch(() => null)
            ]);

            if (statsRes) setStats(statsRes);
            setDistricts(districtsRes?.districts || []);
            setFacilities(facilitiesRes?.facilities || []);

            if (isAdmin) {
                const [bookingsRes, usersRes, subAdminsRes] = await Promise.all([
                    systemAdminApi.getAllBookings().catch(() => null),
                    systemAdminApi.getUsers().catch(() => null),
                    systemAdminApi.getSubAdmins().catch(() => null)
                ]);
                setBookings(bookingsRes?.data || []);
                setUsers(usersRes?.users || []);
                setSubAdmins(subAdminsRes?.sub_admins || []);
            } else {
                const [bookingsRes, usersRes] = await Promise.all([
                    subAdminApi.getBookings().catch(() => null),
                    subAdminApi.getUsers().catch(() => null)
                ]);
                setBookings(bookingsRes?.bookings || []);
                setUsers(usersRes?.users || []);
            }

            // Both Roles: Fetch Reports
            try {
                const reportsRes = await subAdminApi.getReports();
                setConfirmedReports(reportsRes?.confirmed || []);
                setRejectedReports(reportsRes?.rejected || []);
            } catch (err) {
                console.warn("Failed to fetch reports:", err);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            if (!background) setLoading(false);
        }
    };

    /** Handler for tab changes that triggers a background refresh */
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        fetchDashboardData(true);
    };

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const handleConfirmBooking = async (id: number) => {
        try {
            await subAdminApi.confirmBooking(id);
            fetchDashboardData();
        } catch (err: any) {
            alert(err.message || "Failed to confirm booking");
        }
    };

    const handleRejectBooking = async (id: number) => {
        try {
            await subAdminApi.rejectBooking(id);
            fetchDashboardData();
        } catch (err: any) {
            alert(err.message || "Failed to reject booking");
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Delete this user account?")) return;
        try {
            await systemAdminApi.deleteUser(id);
            fetchDashboardData();
        } catch (err) { alert("Failed to delete user"); }
    };

    const openEditUser = (u: User) => {
        setEditingUser(u);
        setEditUserForm({
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            district_id: u.district_id ? String(u.district_id) : ''
        });
        setEditUserDialogOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            await systemAdminApi.updateUser(editingUser.id, editUserForm);
            alert("User updated successfully");
            setEditUserDialogOpen(false);
            fetchDashboardData(true);
        } catch (err: any) {
            alert(err.message || "Failed to update user");
        }
    };

    const handleDeleteSubAdmin = async (id: number) => {
        if (!confirm("Remove this sub administrator?")) return;
        try {
            await systemAdminApi.deleteSubAdmin(id);
            fetchDashboardData();
        } catch (err) { alert("Failed to delete sub admin"); }
    };

    const handleDeleteFacility = async (id: number) => {
        if (!confirm("Delete this facility and all related data?")) return;
        try {
            await subAdminApi.deleteFacility(id);
            fetchDashboardData();
        } catch (err) { alert("Delete failed"); }
    };

    const openEditFacility = (facility: Facility) => {
        setEditingFacility(facility);
        setEditFacilityForm({
            name: facility.name,
            description: facility.description || '',
            file: null,
        });
        setAddSportName('');
        setAddSportPricing([
            { type: 'practice', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
            { type: 'competition', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
            { type: 'refundable_deposit', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' }
        ]);
        setEditDialogOpen(true);
    };
    // Placeholder for Manage Pricing handler
    const openManagePricing = (facility: Facility) => {
        alert(`Manage pricing for facility: ${facility.name}`);
    };

    const handleUpdateFacility = async () => {
        if (!editingFacility) return;
        try {
            const formData = new FormData();
            formData.append('name', editFacilityForm.name);
            formData.append('description', editFacilityForm.description);
            if (editFacilityForm.file) formData.append('image', editFacilityForm.file);

            await subAdminApi.updateFacility(editingFacility.id, formData);
            alert("Facility updated successfully!");
            setEditDialogOpen(false);
            fetchDashboardData();
        } catch (err: any) {
            alert("Error: " + (err.message || "Failed to update facility"));
        }
    };

    const handleAddSportToFacility = async () => {
        if (!editingFacility || !addSportName.trim()) return;
        try {
            await subAdminApi.addSport({
                facility_id: editingFacility.id,
                name: addSportName.trim(),
                pricing: addSportPricing.filter(p => p.price_per_hour > 0 || p.price_per_day > 0),
            });
            setAddSportName('');
            setAddSportPricing([
                { type: 'practice', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                { type: 'competition', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                { type: 'refundable_deposit', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' }
            ]);
            // Refresh data and update editing facility
            const res = await subAdminApi.getFacilities();
            const updatedFacilities = res?.facilities || [];
            setFacilities(updatedFacilities);
            const updated = updatedFacilities.find((f: Facility) => f.id === editingFacility.id);
            if (updated) setEditingFacility(updated);
        } catch (err: any) {
            alert("Error: " + (err.message || "Failed to add sport"));
        }
    };

    const handleDeleteSport = async (sportId: number) => {
        if (!confirm("Delete this sport and all its pricing data?")) return;
        try {
            await subAdminApi.deleteSport(sportId);
            // Refresh
            const res = await subAdminApi.getFacilities();
            const updatedFacilities = res?.facilities || [];
            setFacilities(updatedFacilities);
            if (editingFacility) {
                const updated = updatedFacilities.find((f: Facility) => f.id === editingFacility.id);
                if (updated) setEditingFacility(updated);
            }
        } catch (err: any) {
            alert("Error: " + (err.message || "Failed to delete sport"));
        }
    };

    const handleUpdateSportPricing = async (sportId: number, type: string, updates: any) => {
        try {
            await subAdminApi.addPricing({ sport_id: sportId, type, ...updates });
            // Silently refresh
            const res = await subAdminApi.getFacilities();
            const updatedFacilities = res?.facilities || [];
            setFacilities(updatedFacilities);
            if (editingFacility) {
                const updated = updatedFacilities.find((f: Facility) => f.id === editingFacility.id);
                if (updated) setEditingFacility(updated);
            }
        } catch (err: any) {
            alert("Failed to update pricing");
        }
    };

    const handleAddSportRow = () => {
        setNewFacility({
            ...newFacility,
            sports: [...newFacility.sports, {
                name: '', pricing: [
                    { type: 'practice', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                    { type: 'competition', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                    { type: 'refundable_deposit', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' }
                ]
            }]
        });
    };

    const handleRemoveSportRow = (index: number) => {
        const updated = [...newFacility.sports];
        updated.splice(index, 1);
        setNewFacility({ ...newFacility, sports: updated });
    };

    const handleUpdateSport = (sIdx: number, field: string, value: any) => {
        const updated = [...newFacility.sports];
        (updated[sIdx] as any)[field] = value;
        setNewFacility({ ...newFacility, sports: updated });
    };

    const handleUpdatePricing = (sIdx: number, pIdx: number, field: string, value: any) => {
        const updated = [...newFacility.sports];
        const pricingEntry = updated[sIdx].pricing[pIdx] as any;
        pricingEntry[field] = field === 'billing_type' ? value : Number(value);
        setNewFacility({ ...newFacility, sports: updated });
    };

    const handleCreateFacility = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newFacility.name);
            formData.append('description', newFacility.description);
            formData.append('district_id', newFacility.district_id);
            if (newFacility.file) formData.append('image', newFacility.file);
            formData.append('sports', JSON.stringify(newFacility.sports));

            await subAdminApi.addFacility(formData);
            alert("Facility created successfully!");
            setAddFacilityDialogOpen(false);
            setNewFacility({
                name: '',
                description: '',
                district_id: '',
                file: null,
                sports: [{
                    name: '', pricing: [
                        { type: 'practice', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                        { type: 'competition', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' },
                        { type: 'refundable_deposit', price_per_hour: 0, price_per_day: 0, billing_type: 'hourly' }
                    ]
                }]
            });
            fetchDashboardData();
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const handleCreateSubAdmin = async () => {
        try {
            await systemAdminApi.createSubAdmin(newSubAdmin);
            alert("Sub Admin account created!");
            fetchDashboardData();
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const handleDownloadPDF = (mode?: 'all' | 'confirmed' | 'rejected') => {
        const downloadMode = mode || reportSubTab;
        const monthNames = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
        const periodLabel = `${monthNames[reportMonth]} ${reportYear}`;
        const title = downloadMode === 'all' ? `Booking Operations Report – ${periodLabel}` :
            downloadMode === 'confirmed' ? `Approved Bookings Report – ${periodLabel}` : `Rejected Requests Report – ${periodLabel}`;

        let data: Booking[] = [];
        if (downloadMode === 'all') {
            data = [...filteredConfirmed, ...filteredRejected].sort((a, b) => b.id - a.id);
        } else if (downloadMode === 'confirmed') {
            data = filteredConfirmed;
        } else {
            data = filteredRejected;
        }

        const districtName = user?.district?.name || 'Northern Province';
        const showRevenue = downloadMode === 'confirmed' || downloadMode === 'all';

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pw = doc.internal.pageSize.getWidth();
        const ph = doc.internal.pageSize.getHeight();
        const m = 14;
        let y = m;

        // ── Header ──
        doc.setFillColor(26, 26, 26);
        doc.rect(0, 0, pw, 28, 'F');
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, pw / 2, 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setTextColor(200, 200, 200);
        doc.text(`District: ${districtName}  |  Generated: ${new Date().toLocaleDateString()}  |  Total Records: ${data.length}`, pw / 2, 20, { align: 'center' });
        y = 36;

        // ── Column setup ──
        const headers = showRevenue
            ? ['Ref', 'Date', 'Venue', 'Customer', 'Timing', 'Status', 'Revenue']
            : ['Ref', 'Date', 'Venue', 'Customer', 'Timing', 'Status'];
        const colW = showRevenue
            ? [25, 30, 58, 52, 38, 28, 30]
            : [28, 34, 68, 62, 44, 32];

        // ── Table header row ──
        const drawTableHeader = () => {
            doc.setFillColor(245, 245, 240);
            doc.rect(m, y - 5, pw - m * 2, 9, 'F');
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 100, 100);
            let x = m + 2;
            headers.forEach((h, i) => {
                doc.text(h.toUpperCase(), x, y);
                x += colW[i];
            });
            y += 7;
            doc.setDrawColor(200);
            doc.line(m, y - 2, pw - m, y - 2);
        };

        drawTableHeader();

        // ── Data rows ──
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        data.forEach((b, idx) => {
            if (y > ph - 20) {
                doc.addPage();
                y = m + 4;
                drawTableHeader();
            }

            // Alternating row bg
            if (idx % 2 === 0) {
                doc.setFillColor(252, 252, 252);
                doc.rect(m, y - 4, pw - m * 2, 8, 'F');
            }

            let x = m + 2;
            const status = b.status === 'confirmed' ? 'Approved' : b.status === 'rejected' ? 'Rejected' : (b.status || '-');

            const cells = showRevenue
                ? [`#BK-${b.id}`, b.booking_date || '-', b.facility?.name || '-', b.guest_name || b.user?.name || 'Guest', `${b.start_time} - ${b.end_time}`, status, `Rs. ${Number(b.price || 0).toLocaleString()}`]
                : [`#BK-${b.id}`, b.booking_date || '-', b.facility?.name || '-', b.guest_name || b.user?.name || 'Guest', `${b.start_time} - ${b.end_time}`, status];

            cells.forEach((cell, i) => {
                // Color status and revenue
                if (headers[i] === 'Status') {
                    doc.setTextColor(b.status === 'confirmed' ? 22 : 220, b.status === 'confirmed' ? 163 : 38, b.status === 'confirmed' ? 74 : 38);
                    doc.setFont('helvetica', 'bold');
                } else if (headers[i] === 'Revenue') {
                    doc.setTextColor(184, 150, 45);
                    doc.setFont('helvetica', 'bold');
                } else {
                    doc.setTextColor(50, 50, 50);
                    doc.setFont('helvetica', 'normal');
                }
                const maxLen = Math.floor(colW[i] / 1.8);
                const truncated = String(cell).length > maxLen ? String(cell).substring(0, maxLen) + '..' : String(cell);
                doc.text(truncated, x, y);
                x += colW[i];
            });

            y += 8;
            doc.setDrawColor(235, 235, 235);
            doc.line(m, y - 3, pw - m, y - 3);
        });

        // ── Summary ──
        if (showRevenue) {
            y += 4;
            const total = data.reduce((sum, b) => sum + Number(b.price || 0), 0);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            doc.text('Total Revenue:', m + 2, y);
            doc.setTextColor(184, 150, 45);
            doc.text(`Rs. ${total.toLocaleString()}`, m + 40, y);
        }

        // ── Footer ──
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.setFont('helvetica', 'normal');
        doc.text('Provincial Sports Complex \u2013 Northern Province, Sri Lanka', pw - m, ph - 8, { align: 'right' });

        // Direct download
        const fileName = `${downloadMode}_report_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(fileName);
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-['Montserrat']">
            {/* ─── Sidebar Simulation (Desktop) ─── */}
            <div className="flex">
                <div className="hidden lg:flex flex-col w-72 h-screen bg-black text-white sticky top-0 p-6">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-[#d4af37]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-tight leading-none">Admin Console</h2>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">{user?.role?.replace('_', ' ') || 'Admin'}</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <NavItem
                            icon={<LayoutDashboard className="w-5 h-5" />}
                            label="Overview"
                            active={activeTab === 'overview'}
                            onClick={() => handleTabChange('overview')}
                        />
                        <NavItem
                            icon={<Calendar className="w-5 h-5" />}
                            label="Manage Bookings"
                            active={activeTab === 'bookings'}
                            onClick={() => handleTabChange('bookings')}
                        />
                        <NavItem
                            icon={<Building2 className="w-5 h-5" />}
                            label="Facilities"
                            active={activeTab === 'facilities'}
                            onClick={() => handleTabChange('facilities')}
                        />
                        {user?.role === 'system_admin' && (
                            <NavItem
                                icon={<UserCog className="w-5 h-5" />}
                                label="Sub Admins"
                                active={activeTab === 'subadmins'}
                                onClick={() => handleTabChange('subadmins')}
                            />
                        )}
                        <NavItem
                            icon={<Users className="w-5 h-5" />}
                            label="Registered Users"
                            active={activeTab === 'users'}
                            onClick={() => handleTabChange('users')}
                        />
                        <NavItem
                            icon={<FileText className="w-5 h-5" />}
                            label="Reports"
                            active={activeTab === 'reports'}
                            onClick={() => handleTabChange('reports')}
                        />
                    </nav>

                    <div className="pt-6 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold text-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* ─── Main Content Area ─── */}
                <div className="flex-1 p-4 md:p-8 lg:p-10">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {activeTab === 'overview' && 'Welcome back, ' + (user?.name?.split(' ')[0] || 'User')}
                                {activeTab === 'bookings' && 'Booking Management'}
                                {activeTab === 'facilities' && 'Facility & Sports'}
                                {activeTab === 'subadmins' && 'Admin Accounts'}
                                {activeTab === 'users' && 'Community Directory'}
                                {activeTab === 'reports' && 'Operations Reports'}
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">
                                {activeTab === 'overview' && 'Here is what is happening across your district today.'}
                                {activeTab === 'bookings' && 'Review and approve facility usage requests.'}
                                {activeTab === 'facilities' && 'Manage stadiums, courts, and pricing models.'}
                                {activeTab === 'subadmins' && 'Assign and manage district-level administrators.'}
                                {activeTab === 'users' && 'View all registered community members.'}
                                {activeTab === 'reports' && 'Deep dive into confirmation and rejection analytics.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end px-4 border-r border-gray-200">
                                <span className="text-sm font-bold text-gray-900">{user?.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{user?.district?.name || 'Global Access'}</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold shadow-xl shadow-black/10">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </header>

                    <main>
                        {/* ─── TAB: OVERVIEW ─── */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        title="Total Bookings"
                                        value={stats?.total_bookings || stats?.pending_bookings + stats?.active_facilities * 2} // Fallback
                                        icon={<Calendar className="w-6 h-6 text-blue-600" />}
                                        trend="+12% from last week"
                                    />
                                    <StatCard
                                        title="Pending Auth"
                                        value={stats?.pending_bookings || 0}
                                        icon={<Clock className="w-6 h-6 text-amber-600" />}
                                        trend="Needs attention"
                                        alert={stats?.pending_bookings > 0}
                                    />
                                    <StatCard
                                        title="Total Revenue"
                                        value={'Rs. ' + (stats?.monthly_revenue || 0).toLocaleString()}
                                        icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                                        trend="+5.4% monthly"
                                    />
                                    <StatCard
                                        title="Community"
                                        value={stats?.total_users || 0}
                                        icon={<Users className="w-6 h-6 text-purple-600" />}
                                        trend="Active users"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div>
                                                <CardTitle className="text-xl font-bold">Recent Booking Requests</CardTitle>
                                                <CardDescription>Latest 5 sessions submitted recently</CardDescription>
                                            </div>
                                            <Button variant="outline" className="rounded-xl font-bold text-xs" onClick={() => setActiveTab('bookings')}>View All</Button>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {bookings.slice(0, 5).map(booking => (
                                                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                                booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                {(booking.guest_name || booking.user?.name || 'G')?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-gray-900">{booking.guest_name || booking.user?.name || 'Guest'}</p>
                                                                <p className="text-xs font-medium text-gray-500">{booking.facility?.name} • {booking.booking_date}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className={`rounded-lg py-1 px-3 font-bold text-[10px] uppercase tracking-wider ${booking.status === 'confirmed' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                                                            booking.status === 'pending' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                                                                'border-red-200 text-red-600 bg-red-50'
                                                            }`}>
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
                                        <CardHeader>
                                            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <QuickActionBtn
                                                icon={<PlusCircle className="text-blue-600" />}
                                                label="New Facility"
                                                onClick={() => setActiveTab('facilities')}
                                            />
                                            <QuickActionBtn
                                                icon={<Users className="text-purple-600" />}
                                                label="Manage Users"
                                                onClick={() => setActiveTab('users')}
                                            />
                                            <QuickActionBtn
                                                icon={<FileText className="text-emerald-600" />}
                                                label="Generate Report"
                                                onClick={() => setActiveTab('reports')}
                                            />
                                            <QuickActionBtn
                                                icon={<Settings className="text-gray-600" />}
                                                label="District Config"
                                                onClick={() => { }}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* ─── TAB: BOOKINGS ─── */}
                        {activeTab === 'bookings' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2">
                                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="Search by name, facility or date..."
                                                className="pl-10 h-11 border-gray-100 rounded-xl bg-gray-50/50"
                                                value={bookingSearchQuery}
                                                onChange={e => setBookingSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                className="rounded-xl h-11 px-4 font-bold flex gap-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                                                onClick={() => fetchDashboardData(true)}
                                            >
                                                <RotateCcw className="w-4 h-4" /> Refresh List
                                            </Button>
                                            <Button variant="outline" className="rounded-xl h-11 px-4 font-bold flex gap-2">
                                                <Filter className="w-4 h-4" /> Filter
                                            </Button>
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 py-6">Customer</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Facility / Sport</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Schedule</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Price</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Status</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredBookings.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} className="text-center py-20 text-gray-400 font-medium italic">No booking records found.</TableCell></TableRow>
                                            ) : filteredBookings.map((booking) => (
                                                <TableRow key={booking.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <TableCell className="py-6">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900">{booking.guest_name || booking.user?.name || 'Guest'}</span>
                                                            <span className="text-xs text-gray-500 mt-0.5">{booking.guest_email || booking.user?.email || 'N/A'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-800">{booking.facility?.name}</span>
                                                            <Badge variant="secondary" className="w-fit mt-1 text-[10px] font-bold py-0.5 rounded-md bg-gray-100 text-gray-600 border-none shadow-none">
                                                                {booking.sport?.name || 'N/A'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                                {booking.booking_date}
                                                            </span>
                                                            <span className="text-xs font-semibold text-gray-500 mt-1 pl-5">
                                                                {booking.start_time} - {booking.end_time}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-gray-900">Rs. {Number(booking.price).toLocaleString()}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`rounded-lg py-1 px-3 font-bold text-[10px] uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-red-50 text-red-600 border-red-100'
                                                            }`}>
                                                            {booking.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {booking.status === 'pending' ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-9 rounded-lg" onClick={() => handleConfirmBooking(booking.id)}>
                                                                    Approve
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 h-9 rounded-lg" onClick={() => handleRejectBooking(booking.id)}>
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                        )}

                        {/* ─── TAB: FACILITIES ─── */}
                        {activeTab === 'facilities' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xl font-bold text-gray-900">Active Infrastructure</h3>
                                        {/* Only system admin sees the district filter */}
                                        {user?.role === 'system_admin' && (
                                            <select
                                                className="h-10 rounded-xl border border-gray-200 bg-white px-4 pr-8 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent cursor-pointer"
                                                value={facilityDistrictFilter}
                                                onChange={e => setFacilityDistrictFilter(e.target.value)}
                                            >
                                                <option value="">All Districts</option>
                                                {districts.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                                            </select>
                                        )}
                                    </div>
                                    {/* Only system admin can add new facilities */}
                                    {user?.role === 'system_admin' && (
                                        <Dialog open={addFacilityDialogOpen} onOpenChange={setAddFacilityDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="bg-[#d4af37] hover:bg-[#b8962d] text-black rounded-xl px-6 h-12 font-bold shadow-lg shadow-amber-500/10 flex gap-2">
                                                    <Plus className="w-5 h-5" /> Add New Facility
                                                </Button>
                                            </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] p-8 border-none shadow-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black">Register New Facility</DialogTitle>
                                                <DialogDescription className="font-medium">Define a new sports venue, its disciplines, and local pricing models.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-6 mt-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Venue Name</Label>
                                                        <Input placeholder="e.g. Durayappa Stadium" className="h-12 rounded-xl" value={newFacility.name} onChange={e => setNewFacility({ ...newFacility, name: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Assigned District</Label>
                                                        <select className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={newFacility.district_id} onChange={e => setNewFacility({ ...newFacility, district_id: e.target.value })}>
                                                            <option value="">Select District</option>
                                                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Venue Photo</Label>
                                                    <Input type="file" className="h-12 rounded-xl py-2 cursor-pointer" onChange={e => setNewFacility({ ...newFacility, file: e.target.files?.[0] || null })} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Detailed Description</Label>
                                                    <Textarea placeholder="Describe the facility architecture, seating capacity, and history..." className="rounded-xl min-h-[100px]" value={newFacility.description} onChange={e => setNewFacility({ ...newFacility, description: e.target.value })} />
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-bold text-sm text-gray-900">Sports & Pricing Models</Label>
                                                        <Button variant="outline" size="sm" className="rounded-lg h-9 font-bold text-xs flex gap-1.5" onClick={handleAddSportRow}>
                                                            <Plus className="w-3.5 h-3.5" /> Add Sport
                                                        </Button>
                                                    </div>

                                                    {newFacility.sports.map((sport, sIdx) => (
                                                        <div key={sIdx} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-4 relative group">
                                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-400" onClick={() => handleRemoveSportRow(sIdx)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                <div className="lg:col-span-1">
                                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase">Sport Name</Label>
                                                                    <Input placeholder="Cricket" className="h-10 text-xs rounded-lg mt-1" value={sport.name} onChange={e => handleUpdateSport(sIdx, 'name', e.target.value)} />
                                                                </div>
                                                                {sport.pricing.map((p, pIdx) => (
                                                                    <div key={pIdx} className="lg:col-span-1 space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <Label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{p.type.replace('_', ' ')}</Label>
                                                                            <select className="text-[9px] font-black bg-transparent border-none focus:ring-0 cursor-pointer text-blue-600 uppercase" value={p.billing_type} onChange={e => handleUpdatePricing(sIdx, pIdx, 'billing_type', e.target.value)}>
                                                                                <option value="hourly">HOURLY</option>
                                                                                <option value="daily">DAILY</option>
                                                                            </select>
                                                                        </div>
                                                                        <Input type="number" placeholder={p.billing_type === 'hourly' ? "1hr cost" : "1day cost"} className="h-9 text-xs rounded-lg" value={p.billing_type === 'hourly' ? p.price_per_hour : p.price_per_day} onChange={e => handleUpdatePricing(sIdx, pIdx, p.billing_type === 'hourly' ? 'price_per_hour' : 'price_per_day', e.target.value)} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <Button className="w-full h-14 rounded-2xl bg-black font-black text-lg shadow-xl shadow-black/10 mt-6" onClick={handleCreateFacility}>
                                                    Save Venue Infrastructure
                                                </Button>
                                            </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                                {/* Facility Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {facilities
                                        .filter(f => !facilityDistrictFilter || String(f.district_id || f.district?.id) === facilityDistrictFilter)
                                        .map(facility => {
                                        // Fallback image map based on facility name
                                        const facilityImageMap: Record<string, string> = {
                                            'outdoor stadium': '/images/unnamed 8.jpg',
                                            'swimming pool': '/images/unnamed 6.jpg',
                                            'indoor stadium': '/images/unnamed 3.jpg',
                                            'basketball court': '/images/unnamed 4.jpg',
                                            'dormitory': '/images/unnamed 5.jpg',
                                            'fitness center': '/images/unnamed 2.jpg',
                                            'conference hall': '/images/unnamed (1).jpg',
                                            'vehicle parking': '/images/unnamed.jpg',
                                        };
                                        const fallbackImage = facilityImageMap[facility.name.toLowerCase()] || '';
                                        const displayImage = facility.image || fallbackImage;

                                        return (
                                        <Card key={facility.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden group">
                                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                                {displayImage ? (
                                                    <img src={displayImage} alt={facility.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { if (fallbackImage && e.currentTarget.src !== fallbackImage) { e.currentTarget.src = fallbackImage; } }} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                        <Building2 className="w-12 h-12" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-black/60 backdrop-blur-md border-none text-white font-bold text-[10px] uppercase px-3 py-1">
                                                        {facility.district?.name || 'Vavuniya'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-lg text-gray-900">{facility.name}</h4>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-full -mt-2 -mr-2">
                                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-xl p-1">
                                                            <DropdownMenuItem onClick={() => openEditFacility(facility)} className="rounded-lg py-2.5 font-bold text-sm cursor-pointer flex gap-2">
                                                                <Eye className="w-4 h-4" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openManagePricing(facility)} className="rounded-lg py-2.5 font-bold text-sm cursor-pointer flex gap-2">
                                                                <Tags className="w-4 h-4" /> Manage Pricing
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteFacility(facility.id)} className="rounded-lg py-2.5 font-bold text-sm cursor-pointer flex gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                                                                <Trash2 className="w-4 h-4" /> Delete Facility
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 font-medium mb-5">{facility.description || 'Modern sports facility designed for multi-purpose athletic training and regional competitions.'}</p>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Available Sports</span>
                                                        <span className="text-[11px] font-bold text-gray-900">{facility.sports?.length || 0} Listed</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {facility.sports?.map(s => (
                                                            <Badge key={s.id} variant="secondary" className="rounded-lg bg-gray-50 text-gray-700 border-gray-100 font-bold text-[10px] px-2.5 py-1">
                                                                {s.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                                                    <Button variant="outline" className="flex-1 rounded-xl font-bold text-sm h-11" onClick={() => openEditFacility(facility)}>
                                                        Edit Details
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="rounded-xl h-11 w-11 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteFacility(facility.id)}>
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* ─── Edit Facility Dialog ─── */}
                            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Edit Facility</DialogTitle>
                                        <DialogDescription className="font-medium">Update venue details, manage sports, and adjust pricing models.</DialogDescription>
                                    </DialogHeader>

                                    {editingFacility && (
                                        <div className="space-y-6 mt-6">
                                                {/* Facility Details */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#d4af37] pl-3">Venue Information</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Venue Name</Label>
                                                            <Input className="h-12 rounded-xl" value={editFacilityForm.name} onChange={e => setEditFacilityForm({ ...editFacilityForm, name: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Update Photo</Label>
                                                            <Input type="file" className="h-12 rounded-xl py-2 cursor-pointer" onChange={e => setEditFacilityForm({ ...editFacilityForm, file: e.target.files?.[0] || null })} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Description</Label>
                                                        <Textarea className="rounded-xl min-h-[80px]" value={editFacilityForm.description} onChange={e => setEditFacilityForm({ ...editFacilityForm, description: e.target.value })} />
                                                    </div>
                                                    <Button className="rounded-xl h-11 bg-black font-bold px-8" onClick={handleUpdateFacility}>
                                                        Save Changes
                                                    </Button>
                                                </div>

                                                {/* Existing Sports & Pricing */}
                                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">
                                                        Current Sports ({editingFacility.sports?.length || 0})
                                                    </h4>
                                                    {editingFacility.sports && editingFacility.sports.length > 0 ? (
                                                        editingFacility.sports.map(sport => (
                                                            <div key={sport.id} className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-4 relative group">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                                            <Activity className="w-4 h-4 text-emerald-600" />
                                                                        </div>
                                                                        <span className="font-bold text-gray-900">{sport.name}</span>
                                                                    </div>
                                                                    <Button variant="ghost" size="sm" className="rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-xs" onClick={() => handleDeleteSport(sport.id)}>
                                                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                                                    </Button>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                    {['practice', 'competition', 'refundable_deposit'].map(type => {
                                                                        const p = sport.pricing_tables?.find(pt => pt.type === type);
                                                                        const billingType = p?.billing_type || 'hourly';
                                                                        return (
                                                                        <div key={type} className="space-y-2 bg-white/50 p-3 rounded-xl border border-gray-100">
                                                                            <div className="flex items-center justify-between">
                                                                                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{type.replace('_', ' ')}</Label>
                                                                                <select 
                                                                                    className="text-[9px] font-black bg-transparent border-none focus:ring-0 cursor-pointer text-blue-600 uppercase" 
                                                                                    value={billingType} 
                                                                                    onChange={(e) => handleUpdateSportPricing(sport.id, type, { billing_type: e.target.value })}
                                                                                >
                                                                                    <option value="hourly">HOURLY</option>
                                                                                    <option value="daily">DAILY</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    type="number"
                                                                                    className="h-9 rounded-lg text-sm font-bold"
                                                                                    placeholder={billingType === 'hourly' ? "0.00 / hr" : "0.00 / day"}
                                                                                    defaultValue={billingType === 'hourly' ? (p?.price_per_hour || 0) : (p?.price_per_day || 0)}
                                                                                    onBlur={(e) => {
                                                                                        const val = Number(e.target.value);
                                                                                        if (billingType === 'hourly') {
                                                                                            handleUpdateSportPricing(sport.id, type, { price_per_hour: val });
                                                                                        } else {
                                                                                            handleUpdateSportPricing(sport.id, type, { price_per_day: val });
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                                            <p className="text-gray-400 font-bold text-sm italic">No sports added yet</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Add New Sport */}
                                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-blue-500 pl-3">Add New Sport</h4>
                                                    <div className="p-6 rounded-2xl bg-blue-50/30 border border-blue-100 space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            <div className="lg:col-span-1">
                                                                <Label className="text-[10px] font-bold text-gray-400 uppercase">Sport Name</Label>
                                                                <Input
                                                                    placeholder="e.g. Badminton"
                                                                    className="h-10 text-sm rounded-lg mt-1"
                                                                    value={addSportName}
                                                                    onChange={e => setAddSportName(e.target.value)}
                                                                />
                                                            </div>
                                                            {addSportPricing.map((p, pIdx) => (
                                                                <div key={pIdx} className="space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <Label className="text-[10px] font-bold text-gray-400 uppercase">{p.type.replace('_', ' ')}</Label>
                                                                        <select 
                                                                            className="text-[10px] font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-blue-600 uppercase p-0 h-auto" 
                                                                            value={p.billing_type} 
                                                                            onChange={e => {
                                                                                const updated = [...addSportPricing];
                                                                                updated[pIdx].billing_type = e.target.value;
                                                                                setAddSportPricing(updated);
                                                                            }}
                                                                        >
                                                                            <option value="hourly">HOUR</option>
                                                                            <option value="daily">DAY</option>
                                                                        </select>
                                                                    </div>
                                                                    <Input
                                                                        type="number"
                                                                        className="h-10 text-sm rounded-lg mt-1"
                                                                        placeholder={p.billing_type === 'hourly' ? "0.00 / hr" : "0.00 / day"}
                                                                        value={p.billing_type === 'hourly' ? p.price_per_hour : p.price_per_day}
                                                                        onChange={e => {
                                                                            const updated = [...addSportPricing];
                                                                            if (p.billing_type === 'hourly') {
                                                                                updated[pIdx].price_per_hour = Number(e.target.value);
                                                                            } else {
                                                                                updated[pIdx].price_per_day = Number(e.target.value);
                                                                            }
                                                                            setAddSportPricing(updated);
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <Button className="rounded-xl h-10 bg-blue-600 hover:bg-blue-700 font-bold text-sm px-6 flex gap-2" onClick={handleAddSportToFacility}>
                                                            <Plus className="w-4 h-4" /> Add Sport to Facility
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}

                        {/* ─── TAB: USERS ─── */}
                        {activeTab === 'users' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2">
                                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="relative max-w-md">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="Filter by user name, email or phone..."
                                                className="pl-10 h-11 border-gray-100 rounded-xl bg-gray-50/50"
                                                value={userSearchQuery}
                                                onChange={e => setUserSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="border-none">
                                                <TableHead className="py-6 font-bold text-[11px] uppercase tracking-widest text-gray-400">User Identification</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Contact Details</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">District Access</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Member Since</TableHead>
                                                <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest text-gray-400 px-8">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length === 0 ? (
                                                <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 font-medium italic">No registered community members found.</TableCell></TableRow>
                                            ) : filteredUsers.map((u) => (
                                                <TableRow key={u.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <TableCell className="py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-900">{u.name}</span>
                                                                <Badge variant="secondary" className="w-fit mt-1 text-[9px] font-bold py-0 rounded bg-black text-white px-2">Member</Badge>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                                <Mail className="w-3.5 h-3.5 text-gray-400" /> {u.email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                                <Phone className="w-3.5 h-3.5 text-gray-400" /> {u.phone || 'Not provided'}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-bold text-gray-600 text-sm">{u.district?.name || 'General Access'}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm font-medium text-gray-500">
                                                            {u.created_at ? new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right px-8">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="rounded-xl h-10 w-10 text-gray-400 hover:text-black"
                                                                onClick={() => {
                                                                    setSelectedUserForView(u);
                                                                    setUserDetailDialogOpen(true);
                                                                }}
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </Button>
                                                            {user?.role === 'system_admin' && (
                                                                <>
                                                                    <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 text-gray-400 hover:text-black" onClick={() => openEditUser(u)}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 text-red-500 hover:bg-red-50" onClick={() => handleDeleteUser(u.id)}>
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>

                                {/* User Detail / Profile Dialog */}
                                <Dialog open={userDetailDialogOpen} onOpenChange={setUserDetailDialogOpen}>
                                    <DialogContent className="rounded-[32px] p-8 border-none shadow-2xl max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black">Community Member Profile</DialogTitle>
                                            <DialogDescription className="font-medium text-gray-500">Overview of registered user identification and activities.</DialogDescription>
                                        </DialogHeader>
                                        
                                        {selectedUserForView && (
                                            <div className="mt-8 space-y-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-400 border-2 border-dashed border-gray-200">
                                                        {selectedUserForView.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-gray-900 leading-tight">{selectedUserForView.name}</h3>
                                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 mt-1 font-black text-[10px] uppercase tracking-widest">Active Member</Badge>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Primary Email</Label>
                                                        <p className="font-bold text-gray-700">{selectedUserForView.email}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Contact Number</Label>
                                                        <p className="font-bold text-gray-700">{selectedUserForView.phone || 'No phone number linked'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Resident District</Label>
                                                        <p className="font-bold text-gray-700">{selectedUserForView.district?.name || 'Not assigned / Global'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Authentication Role</Label>
                                                        <p className="font-bold text-gray-700 capitalize">{selectedUserForView.role.replace('_', ' ')}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Registration Date</Label>
                                                        <p className="font-bold text-gray-700">
                                                            {selectedUserForView.created_at ? new Date(selectedUserForView.created_at).toLocaleString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-gray-100 flex gap-3">
                                                    <Button className="flex-1 rounded-2xl bg-black font-black h-14 shadow-xl shadow-black/10" onClick={() => setUserDetailDialogOpen(false)}>
                                                        Done
                                                    </Button>
                                                    {user?.role === 'system_admin' && (
                                                        <>
                                                            <Button variant="outline" className="rounded-2xl border-gray-100 text-gray-600 hover:bg-gray-50 font-black h-14 px-6" onClick={() => {
                                                                openEditUser(selectedUserForView);
                                                                setUserDetailDialogOpen(false);
                                                            }}>
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="outline" className="rounded-2xl border-red-100 text-red-600 hover:bg-red-50 font-black h-14 px-6" onClick={() => {
                                                                handleDeleteUser(selectedUserForView.id);
                                                                setUserDetailDialogOpen(false);
                                                            }}>
                                                                <Trash2 className="w-5 h-5" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                {/* Edit User Dialog */}
                                <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
                                    <DialogContent className="rounded-[32px] p-8 border-none shadow-2xl max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black">Edit User Profile</DialogTitle>
                                            <DialogDescription className="font-medium text-gray-500">Update account information and district access.</DialogDescription>
                                        </DialogHeader>
                                        
                                        <div className="mt-6 space-y-6">
                                            <div className="space-y-2">
                                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400">Full Name</Label>
                                                <Input className="h-12 rounded-xl" value={editUserForm.name} onChange={e => setEditUserForm({ ...editUserForm, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400">Email Address</Label>
                                                <Input className="h-12 rounded-xl" value={editUserForm.email} onChange={e => setEditUserForm({ ...editUserForm, email: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400">Phone Number</Label>
                                                <Input className="h-12 rounded-xl" value={editUserForm.phone} onChange={e => setEditUserForm({ ...editUserForm, phone: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-black text-xs uppercase tracking-widest text-gray-400">District Access</Label>
                                                <select className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={editUserForm.district_id} onChange={e => setEditUserForm({ ...editUserForm, district_id: e.target.value })}>
                                                    <option value="">General Access</option>
                                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </div>

                                            <div className="pt-4 flex gap-3">
                                                <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black" onClick={() => setEditUserDialogOpen(false)}>Cancel</Button>
                                                <Button className="flex-1 h-14 rounded-2xl bg-black font-black shadow-xl shadow-black/10" onClick={handleUpdateUser}>Save Changes</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}

                        {/* ─── TAB: SUBADMINS ─── */}
                        {activeTab === 'subadmins' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">District Administrators</h3>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[#d4af37] hover:bg-[#b8962d] text-black rounded-xl px-6 h-12 font-bold shadow-lg shadow-amber-500/10 flex gap-2">
                                                <PlusCircle className="w-5 h-5" /> Create Sub Admin
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-[32px] p-8 border-none shadow-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black">New Admin Account</DialogTitle>
                                                <DialogDescription className="font-medium">Delegate district control to a trusted government official.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 mt-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Official Name</Label>
                                                    <Input placeholder="e.g. Priyantha Kumara" className="h-12 rounded-xl" value={newSubAdmin.name} onChange={e => setNewSubAdmin({ ...newSubAdmin, name: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Gov Email</Label>
                                                    <Input type="email" placeholder="admin@province.lk" className="h-12 rounded-xl" value={newSubAdmin.email} onChange={e => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Temporary Password</Label>
                                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" value={newSubAdmin.password} onChange={e => setNewSubAdmin({ ...newSubAdmin, password: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-xs uppercase tracking-widest text-gray-400">Responsible District</Label>
                                                    <select className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={newSubAdmin.district_id} onChange={e => setNewSubAdmin({ ...newSubAdmin, district_id: e.target.value })}>
                                                        <option value="">Select District</option>
                                                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                    </select>
                                                </div>
                                                <Button className="w-full h-14 rounded-2xl bg-[#d4af37] text-black font-black text-lg shadow-xl shadow-amber-500/10 mt-6" onClick={handleCreateSubAdmin}>
                                                    Assign Administrator
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow className="border-none">
                                                <TableHead className="py-6 font-bold text-[11px] uppercase tracking-widest text-gray-400">Administrator</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Assigned District</TableHead>
                                                <TableHead className="font-bold text-[11px] uppercase tracking-widest text-gray-400">Auth Email</TableHead>
                                                <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest text-gray-400 px-8">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subAdmins.map((adm) => (
                                                <TableRow key={adm.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <TableCell className="py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-[#d4af37] flex items-center justify-center text-white font-bold">
                                                                {adm.name.charAt(0)}
                                                            </div>
                                                            <span className="font-bold text-gray-900">{adm.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className="rounded-lg bg-emerald-50 text-emerald-700 border-none font-bold text-xs px-3">
                                                            {adm.district?.name || 'Unassigned'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-600">{adm.email}</TableCell>
                                                    <TableCell className="text-right px-8">
                                                        <Button variant="ghost" size="icon" className="rounded-xl text-red-500 hover:bg-red-50" onClick={() => handleDeleteSubAdmin(adm.id)}>
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                        )}

                        {/* ─── TAB: REPORTS ─── */}
                        {activeTab === 'reports' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 pb-20">
                                {/* Month / Year Filters */}
                                <div className="flex items-center gap-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <select
                                            value={reportMonth}
                                            onChange={e => setReportMonth(Number(e.target.value))}
                                            className="h-11 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 cursor-pointer"
                                        >
                                            {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                                                <option key={i} value={i + 1}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <select
                                        value={reportYear}
                                        onChange={e => setReportYear(Number(e.target.value))}
                                        className="h-11 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 cursor-pointer"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(yr => (
                                            <option key={yr} value={yr}>{yr}</option>
                                        ))}
                                    </select>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">
                                        Showing: {['','January','February','March','April','May','June','July','August','September','October','November','December'][reportMonth]} {reportYear}
                                    </span>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ReportCard
                                        title="Approved Bookings"
                                        count={filteredConfirmed.length}
                                        color="emerald"
                                        description="Successfully validated sessions that are visible on the calendar."
                                        active={reportSubTab === 'confirmed'}
                                        onClick={() => setReportSubTab(reportSubTab === 'confirmed' ? 'all' : 'confirmed')}
                                    />
                                    <ReportCard
                                        title="Rejected Requests"
                                        count={filteredRejected.length}
                                        color="red"
                                        description="Requests that were rejected due to conflicts or policy violations."
                                        active={reportSubTab === 'rejected'}
                                        onClick={() => setReportSubTab(reportSubTab === 'rejected' ? 'all' : 'rejected')}
                                    />
                                </div>

                                {/* Report Content Section */}
                                <div className="space-y-12">
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-2xl font-black text-gray-900 border-l-4 border-[#d4af37] pl-4">
                                            {reportSubTab === 'all' && 'Consolidated Booking Logs'}
                                            {reportSubTab === 'confirmed' && 'Approved Records'}
                                            {reportSubTab === 'rejected' && 'Rejected Logs'}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleDownloadPDF('all')}
                                                className="bg-[#d4af37] hover:bg-[#b8962d] text-black rounded-2xl h-12 px-5 font-bold shadow-xl shadow-amber-500/10 flex gap-2"
                                            >
                                                <FileText className="w-4 h-4" /> Export All
                                            </Button>
                                            <Button
                                                onClick={() => handleDownloadPDF('confirmed')}
                                                variant="outline"
                                                className="rounded-2xl h-12 px-5 font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> Approved
                                            </Button>
                                            <Button
                                                onClick={() => handleDownloadPDF('rejected')}
                                                variant="outline"
                                                className="rounded-2xl h-12 px-5 font-bold border-red-200 text-red-600 hover:bg-red-50 flex gap-2"
                                            >
                                                <XCircle className="w-4 h-4" /> Rejected
                                            </Button>
                                        </div>
                                    </div>

                                    {(reportSubTab === 'all' || reportSubTab === 'confirmed') && (
                                        <div className="space-y-4">
                                            {reportSubTab === 'all' && <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest ml-4">Approved Sessions</h4>}
                                            <Card className="border-none shadow-[0_8px_40px_rgb(0,0,0,0.03)] rounded-[32px] overflow-hidden">
                                                <Table>
                                                    <TableHeader className="bg-emerald-50/20">
                                                        <TableRow className="border-none">
                                                            <TableHead className="py-5 font-bold text-[10px] uppercase tracking-widest text-emerald-800">Reference / Date</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-emerald-800">Facility Details</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-emerald-800">User / Guest Info</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-emerald-800">Timing</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-emerald-800 text-right pr-8">Revenue</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredConfirmed.length === 0 ? (
                                                            <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 font-medium italic">No approved bookings found for this period.</TableCell></TableRow>
                                                        ) : filteredConfirmed.map((b) => (
                                                            <TableRow key={b.id} className="border-gray-50 hover:bg-emerald-50/10 transition-colors group">
                                                                <TableCell className="py-6 font-bold">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-900 font-black">#BK-{b.id}</span>
                                                                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1">{b.booking_date}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-gray-800">{b.facility?.name}</span>
                                                                        <span className="text-xs text-blue-600 font-semibold">{b.sport?.name || 'General Access'}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-gray-900">{b.guest_name || b.user?.name || 'Guest'}</span>
                                                                        <span className="text-xs text-gray-500">{b.guest_email || b.user?.email || 'N/A'}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="rounded-lg py-1 px-3 font-bold text-[10px] border-gray-100 text-gray-600 bg-white shadow-sm flex items-center w-fit gap-1.5">
                                                                        <Clock className="w-3 h-3" /> {b.start_time} - {b.end_time}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right pr-8">
                                                                    <span className="font-black text-emerald-600">Rs. {Number(b.price).toLocaleString()}</span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Card>
                                        </div>
                                    )}

                                    {(reportSubTab === 'all' || reportSubTab === 'rejected') && (
                                        <div className="space-y-4">
                                            {reportSubTab === 'all' && <h4 className="text-sm font-bold text-red-600 uppercase tracking-widest ml-4">Rejected Records</h4>}
                                            <Card className="border-none shadow-[0_8px_40px_rgb(0,0,0,0.03)] rounded-[32px] overflow-hidden">
                                                <Table>
                                                    <TableHeader className="bg-red-50/20">
                                                        <TableRow className="border-none">
                                                            <TableHead className="py-5 font-bold text-[10px] uppercase tracking-widest text-red-800">Reference / Date</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-red-800">Venue</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-red-800">Applicant</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-red-800">Timing</TableHead>
                                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest text-red-800 text-right pr-8">Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredRejected.length === 0 ? (
                                                            <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 font-medium italic">No rejected requests found for this period.</TableCell></TableRow>
                                                        ) : filteredRejected.map((b) => (
                                                            <TableRow key={b.id} className="border-gray-50 hover:bg-red-50/10 transition-colors group">
                                                                <TableCell className="py-6 font-bold">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-900 font-black">#BK-{b.id}</span>
                                                                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1">{b.booking_date}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-gray-800">{b.facility?.name}</span>
                                                                        <span className="text-xs text-gray-500">{b.sport?.name || 'General Access'}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-gray-900">{b.guest_name || b.user?.name || 'Guest'}</span>
                                                                        <span className="text-xs text-gray-500">{b.guest_email || b.user?.email || 'N/A'}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="rounded-lg py-1 px-3 font-bold text-[10px] border-red-50 text-red-500 bg-white">
                                                                        {b.start_time} - {b.end_time}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right pr-8">
                                                                    <Badge className="bg-red-50 text-red-600 border-none rounded-md px-2 py-0.5 font-extrabold text-[10px] uppercase tracking-widest italic">Rejected</Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// ─── Shared Local Components ──────────────────────────────────────────────────

function NavItem({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-200 group ${active
                ? 'bg-white text-black font-bold shadow-lg shadow-black/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                }`}
        >
            <span className={`${active ? 'text-black' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>{icon}</span>
            <span className="text-sm tracking-tight">{label}</span>
        </button>
    );
}

function StatCard({ title, value, icon, trend, alert }: any) {
    return (
        <Card className={`border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[24px] overflow-hidden ${alert ? 'ring-2 ring-amber-400' : ''}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase">
                        {trend}
                    </Badge>
                </div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</h3>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
            </CardContent>
        </Card>
    );
}

function QuickActionBtn({ icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 w-full p-4 rounded-2xl bg-[#F8F9FC] hover:bg-[#F1F3F9] border border-transparent hover:border-gray-100 transition-all group group"
        >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="font-bold text-sm text-gray-800 tracking-tight">{label}</span>
            <Plus className="w-4 h-4 ml-auto text-gray-300 group-hover:text-black transition-colors" />
        </button>
    );
}

function ReportCard({ title, count, color, description, active, onClick }: any) {
    const isEmerald = color === 'emerald';
    return (
        <button
            onClick={onClick}
            className={`p-8 rounded-[32px] border transition-all duration-300 text-left cursor-pointer group hover:scale-[1.02] ${active
                ? (isEmerald ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-red-50 border-red-300 ring-2 ring-red-500/20')
                : (isEmerald ? 'bg-white border-emerald-100 opacity-60 hover:opacity-100' : 'bg-white border-red-100 opacity-60 hover:opacity-100')
                }`}
        >
            <div className="flex items-center justify-between mb-6">
                <h4 className={`font-black text-3xl ${isEmerald ? 'text-emerald-900' : 'text-red-900'}`}>{count}</h4>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${isEmerald ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {isEmerald ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
            </div>
            <h5 className="font-black text-lg text-gray-900 mb-2 truncate">{title}</h5>
            <p className="text-xs font-bold text-gray-500 leading-relaxed line-clamp-2">{description}</p>
        </button>
    );
}
