import React, { useState, useEffect } from "react";
import { authApi, saveAuth, getPhotoUrl, User } from "../api";
import { Camera, Mail, User as UserIcon, Loader2, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [statusError, setStatusError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await authApi.profile();
            setUser(res.user);
            setName(res.user.name);
            setEmail(res.user.email);
            setPhone(res.user.phone || "");
            if (res.user.profile_photo) {
                setPhotoPreview(getPhotoUrl(res.user));
            }
        } catch (err: any) {
            setStatusError("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoPreview(URL.createObjectURL(file));
            setPhotoFile(file);
        }
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg("");
        setStatusError("");

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            if (photoFile) {
                formData.append("profile_photo", photoFile);
            }
            formData.append("_method", "PUT");

            const res = await authApi.updateProfile(formData);
            
            // Sync user state with backend response
            const updatedUser = {
                ...res.user,
                profile_photo: res.profile_photo_url || res.user.profile_photo
            };
            
            setUser(updatedUser);
            setName(updatedUser.name);
            setEmail(updatedUser.email);
            setPhone(updatedUser.phone || "");
            saveAuth(localStorage.getItem('auth_token') || "", updatedUser);
            
            // Update preview to the new URL from server
            const previewUrl = getPhotoUrl(updatedUser);
            setPhotoPreview(previewUrl);
            setPhotoFile(null);
            
            setStatusMsg("Profile updated successfully.");
            
            // Notify other components (Header, Dashboard)
            window.dispatchEvent(new Event('user-updated'));
        } catch (err: any) {
            setStatusError(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatusError("New passwords do not match.");
            return;
        }

        setSaving(true);
        setStatusMsg("");
        setStatusError("");

        try {
            const formData = new FormData();
            formData.append("current_password", currentPassword);
            formData.append("password", newPassword);
            formData.append("password_confirmation", confirmPassword);
            formData.append("_method", "PUT");

            await authApi.updateProfile(formData);
            setStatusMsg("Password updated successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setStatusError(err.message || "Failed to update password.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 font-['Montserrat']">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                        <p className="text-gray-500 font-medium">Manage your personal information and security.</p>
                    </div>

                    {/* Global Feedback */}
                    {statusMsg && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm animate-in fade-in slide-in-from-top-1">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="font-semibold">{statusMsg}</span>
                        </div>
                    )}
                    {statusError && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="font-semibold">{statusError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar/Profile Card */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex flex-col items-center">
                                <div className="relative group mb-6">
                                    <div className="w-32 h-32 rounded-full bg-amber-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                        {photoPreview ? (
                                            <img 
                                                src={photoPreview} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    setPhotoPreview(null);
                                                }}
                                            />
                                        ) : (
                                            <span className="text-4xl font-bold text-amber-600">
                                                {name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer shadow-lg hover:bg-amber-600 transition-colors">
                                        <Camera className="w-5 h-5" />
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                    </label>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center">{name}</h3>
                                <p className="text-gray-500 font-medium text-sm text-center mb-6">{email}</p>
                                
                                <div className="w-full pt-6 border-t border-gray-50 flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {email}
                                    </div>
                                    {phone && (
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            {phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Forms */}
                        <div className="md:col-span-2 flex flex-col gap-8">
                            {/* Personal Info */}
                            <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-amber-600" />
                                    Profile Information
                                </h2>
                                <form onSubmit={handleProfileSave} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
                                            <Input 
                                                value={name} 
                                                onChange={e => setName(e.target.value)} 
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                                            <Input 
                                                type="email" 
                                                value={email} 
                                                onChange={e => setEmail(e.target.value)} 
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
                                            <Input 
                                                value={phone} 
                                                onChange={e => setPhone(e.target.value)} 
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium"
                                                placeholder="+94 7X XXX XXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            type="submit" 
                                            disabled={saving}
                                            className="px-8 h-12 bg-black hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-black/5"
                                        >
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </section>

                            {/* Security / Password */}
                            <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-amber-600" />
                                    Security
                                </h2>
                                <form onSubmit={handlePasswordSave} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</Label>
                                        <Input 
                                            type="password" 
                                            value={currentPassword} 
                                            onChange={e => setCurrentPassword(e.target.value)} 
                                            className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</Label>
                                            <Input 
                                                type="password" 
                                                value={newPassword} 
                                                onChange={e => setNewPassword(e.target.value)} 
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</Label>
                                            <Input 
                                                type="password" 
                                                value={confirmPassword} 
                                                onChange={e => setConfirmPassword(e.target.value)} 
                                                className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:bg-white transition-all font-medium" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            type="submit" 
                                            disabled={saving}
                                            className="px-8 h-12 bg-gray-100 hover:bg-black hover:text-white text-black rounded-xl font-bold transition-all"
                                        >
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                                        </Button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

// Note: Replace "/api/profile/update" with your actual backend endpoint.
