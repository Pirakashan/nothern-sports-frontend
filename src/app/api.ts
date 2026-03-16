/**
 * API Service Layer
 * Connects the React frontend to the Laravel backend API.
 * All API calls are proxied through Vite's dev server to avoid CORS issues.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('auth_token');

    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> ?? {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const err: any = new Error(errorBody.message || `API error ${res.status}`);
        err.status = res.status;
        err.errors = errorBody.errors;
        throw err;
    }

    return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface District {
    id: number;
    name: string;
    address?: string;
    contact?: string;
    working_hours?: string;
}

export interface Facility {
    id: number;
    district_id: number;
    name: string;
    slug: string;
    description: string;
    image?: string;
    district?: District;
    sports?: Sport[];
}

export interface Sport {
    id: number;
    district_id: number;
    facility_id: number;
    name: string;
    facility?: Facility;
    pricing_tables?: PricingTable[];
}

export interface PricingTable {
    id: number;
    district_id: number;
    sport_id: number;
    type: string;
    event_name?: string;
    sports_list?: string;
    billing_type: string;
    price_per_hour: string;
    price_per_day: string;
    price_gov_schools?: string;
    price_club_institute?: string;
    price_intl_schools?: string;
    price_intl?: string;
    // Legacy field - may still be present in older data
    price?: string;
}

export interface Booking {
    id: number;
    user_id?: number;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    district_id: number;
    facility_id: number;
    sport_id?: number;
    organization_type?: string;
    event_type?: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    price: string;
    status: string;
    user?: User;
    facility?: Facility;
    sport?: Sport;
    district?: District;
}

export interface Subscription {
    id: number;
    user_id: number;
    facility_id: number;
    start_date: string;
    end_date: string;
    status: string;
    frequency: string;
    price: string;
    facility?: Facility;
}

export interface Transaction {
    id: number;
    transaction_id: string;
    user_id: number;
    subscription_id: number | null;
    amount: string;
    payment_date: string;
    type: string;
    user_type: string;
    subscription?: Subscription;
}

export interface CalendarEntry {
    id: number;
    user_name: string;
    facility: string;
    facility_slug: string;
    sport: string;
    date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    district_id?: number;
    profile_photo?: string;
    district?: District;
    created_at?: string;
    updated_at?: string;
}

// ─── Auth APIs ────────────────────────────────────────────────────────────────

export const authApi = {
    register: (data: {
        name: string;
        email: string;
        phone?: string;
        password: string;
        password_confirmation: string;
    }) =>
        request<{ message: string; user: User; token: string }>('/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        request<{ message: string; user: User; token: string }>('/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: () =>
        request<{ message: string }>('/logout', { method: 'POST' }),

    profile: () => request<{ user: User }>('/my-profile'),

    updateProfile: (data: FormData) =>
        request<{ message: string; user: User; profile_photo_url?: string }>(
            '/my-profile',
            { method: 'POST', body: data }
        ),
};

// ─── District APIs ────────────────────────────────────────────────────────────

export const districtApi = {
    /** Get all districts */
    getAll: () =>
        request<{ districts: District[] }>('/districts'),

    /** Get single district */
    getById: (id: number) =>
        request<{ district: District }>(`/district/${id}`),

    /** Get facilities for a district (with sports & pricing) */
    getFacilities: (districtId: number) =>
        request<{ facilities: Facility[] }>(`/district/${districtId}/facilities`),

    /** Get sports for a district */
    getSports: (districtId: number) =>
        request<{ sports: Sport[] }>(`/district/${districtId}/sports`),
};

// ─── Facility APIs ────────────────────────────────────────────────────────────

export const facilityApi = {
    /** Get all facilities (unique by name, across districts) */
    getAll: () =>
        request<{ facilities: Facility[] }>('/facilities'),

    /** Get facility details by slug (with district, sports & pricing) */
    getBySlug: (slug: string) =>
        request<{ facility: Facility }>(`/facility/${slug}`),
};

// ─── Sport APIs ───────────────────────────────────────────────────────────────

export const sportApi = {
    /** Get pricing for a sport */
    getPricing: (sportId: number) =>
        request<{ sport: Pick<Sport, 'id' | 'name'>; facility: Facility; district: District; pricing: PricingTable[] }>(
            `/sport/${sportId}/pricing`
        ),
};

// ─── Booking APIs ─────────────────────────────────────────────────────────────

export const bookingApi = {
    /** Check availability for a time slot */
    checkAvailability: (data: {
        district_id: number;
        facility_id: number;
        sport_id?: number;
        booking_date: string;
        start_time: string;
        end_time: string;
        booking_mode?: string;
        slots?: number[];
        total_slots?: number;
    }) =>
        request<{ available: boolean; message: string; booked_slots: number[] }>('/check-availability', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /** Create a new booking request */
    create: (data: {
        district_id: number;
        facility_id: number;
        sport_id?: number;
        organization_type?: string;
        event_type?: string;
        booking_mode?: string;
        slots?: number[];
        booking_date: string;
        booking_end_date?: string;
        start_time: string;
        end_time: string;
        price?: number;
        guest_name?: string;
        guest_email?: string;
        guest_phone: string;
    }) =>
        request<{ message: string; booking: Booking }>('/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /** Get current user's bookings (requires auth) */
    myBookings: () =>
        request<{ bookings: Booking[] }>('/my-bookings'),
};

// ─── Subscription APIs ────────────────────────────────────────────────────────

export const subscriptionApi = {
    mySubscriptions: () =>
        request<{ subscriptions: Subscription[]; subscription_status: string }>('/my-subscriptions'),

    create: (data: {
        facility_id: number;
        start_date: string;
        end_date: string;
        frequency: string;
        price: number;
    }) =>
        request<{ message: string; subscription: Subscription }>('/subscriptions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    cancel: (id: number) =>
        request<{ message: string }>(`/subscriptions/${id}/cancel`, { method: 'PUT' }),
};

// ─── Transaction APIs ─────────────────────────────────────────────────────────

export const transactionApi = {
    myTransactions: () =>
        request<{ transactions: Transaction[] }>('/my-transactions'),
};

// ─── Calendar APIs ────────────────────────────────────────────────────────────

export const calendarApi = {
    /** Get confirmed bookings for calendar display */
    getEvents: (districtId: number) =>
        request<{ calendar: CalendarEntry[] }>(`/calendar?district_id=${districtId}`),
};

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export function saveAuth(token: string, user: User) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
}

export function getStoredUser(): User | null {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
}

export function getPhotoUrl(user: User | null): string | null {
    if (!user) return null;
    
    // Some APIs might return a profile_photo_url field directly
    const photo = user.profile_photo;
    if (!photo) return null;

    // Handle full URLs (convert to relative for proxy if it's our own domain)
    if (photo.startsWith('http')) {
        const storageIdx = photo.indexOf('/storage/');
        if (storageIdx !== -1) {
            return photo.substring(storageIdx);
        }
        return photo; // External URL
    }

    // Already a absolute-looking relative path
    if (photo.startsWith('/storage/')) return photo;
    
    // Relative path (stripping leading slash if any)
    const cleanPhoto = photo.startsWith('/') ? photo.substring(1) : photo;
    
    // If it already has storage/ at the start (but no leading slash)
    if (cleanPhoto.startsWith('storage/')) return `/${cleanPhoto}`;
    
    return `/storage/${cleanPhoto}`;
}

// ─── Sub Admin APIs (District Restricted) ───────────────────────────────────

export const subAdminApi = {
    /** Add a facility with sports and pricing */
    addFacility: (formData: FormData) =>
        request<{ message: string; facility: Facility }>('/subadmin/facilities', {
            method: 'POST',
            body: formData,
        }),

    /** Update an existing facility */
    updateFacility: (id: number, formData: FormData) => {
        formData.append('_method', 'PUT');
        return request<{ message: string; facility: Facility }>(`/subadmin/facilities/${id}`, {
            method: 'POST',
            body: formData,
        });
    },

    /** Delete a facility */
    deleteFacility: (id: number) =>
        request<{ message: string }>(`/subadmin/facilities/${id}`, {
            method: 'DELETE',
        }),

    /** Add a single sport to a facility */
    addSport: (data: { facility_id: number; name: string; pricing?: { type: string; price_per_hour: number; price_per_day: number; billing_type: string }[] }) =>
        request<{ message: string; sport: Sport }>('/subadmin/sports', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /** Delete a sport */
    deleteSport: (id: number) =>
        request<{ message: string }>(`/subadmin/sports/${id}`, {
            method: 'DELETE',
        }),

    /** Add or update pricing for a sport */
    addPricing: (data: { sport_id: number; type: string; price_per_hour?: number; price_per_day?: number; billing_type?: string }) =>
        request<{ message: string; pricing: PricingTable }>('/subadmin/pricing', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /** Get all facilities for the sub-admin's district */
    getFacilities: () =>
        request<{ facilities: Facility[] }>('/subadmin/facilities'),

    /** Get all sports for the sub-admin's district */
    getSports: () =>
        request<{ sports: Sport[] }>('/subadmin/sports'),

    /** Get all bookings for the sub-admin's district */
    getBookings: () =>
        request<{ bookings: Booking[] }>('/subadmin/bookings'),

    /** Confirm a booking request */
    confirmBooking: (id: number) =>
        request<{ message: string; booking: Booking }>(`/subadmin/bookings/${id}/confirm`, {
            method: 'PUT',
        }),

    /** Reject a booking request */
    rejectBooking: (id: number) =>
        request<{ message: string; booking: Booking }>(`/subadmin/bookings/${id}/reject`, {
            method: 'PUT',
        }),

    /** Get dashboard statistics */
    getDashboard: () =>
        request<{
            pending_bookings: number;
            total_users: number;
            monthly_revenue: number;
            active_facilities: number;
            recent_bookings: Booking[];
        }>('/subadmin/dashboard'),

    /** Get report data */
    getReports: () =>
        request<{ confirmed: Booking[]; rejected: Booking[] }>('/subadmin/reports'),

    /** Get registered users for the district */
    getUsers: () =>
        request<{ users: User[] }>('/subadmin/users'),
};

// ─── System Admin APIs (Global) ──────────────────────────────────────────────

export const systemAdminApi = {
    /** Create a new Sub Admin account */
    createSubAdmin: (data: any) =>
        request<{ message: string; sub_admin: User }>('/systemadmin/create-subadmin', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /** Get all sub admins */
    getSubAdmins: () =>
        request<{ sub_admins: User[] }>('/systemadmin/sub-admins'),

    /** Delete a sub admin */
    deleteSubAdmin: (id: number) =>
        request<{ message: string }>(`/systemadmin/sub-admin/${id}`, {
            method: 'DELETE',
        }),

    /** Get all registered users (role: user) */
    getUsers: () =>
        request<{ users: User[] }>('/systemadmin/users'),

    /** Delete a user account */
    deleteUser: (id: number) =>
        request<{ message: string }>(`/systemadmin/user/${id}`, {
            method: 'DELETE',
        }),

    /** Update a user account */
    updateUser: (id: number, data: any) =>
        request<{ message: string; user: User }>(`/systemadmin/user-profile/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    /** Get all bookings across all districts */
    getAllBookings: (params?: { district_id?: number; status?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return request<any>(`/systemadmin/all-bookings${query ? `?${query}` : ''}`);
    },

    /** Get system-wide dashboard stats */
    getDashboard: () =>
        request<{
            total_districts: number;
            total_users: number;
            total_sub_admins: number;
            total_bookings: number;
            pending_bookings: number;
            confirmed_bookings: number;
            rejected_bookings: number;
        }>('/systemadmin/dashboard'),
};
