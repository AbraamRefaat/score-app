import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Heart,
  Bell,
  Languages,
  ChevronLeft,
  ShieldCheck,
  Headphones,
  Pencil,
  X,
  Check,
  User,
  Sparkles,
} from 'lucide-react';

interface UserProfile {
  name: string;
  title: string;
  avatar: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'أحمد علي',
  title: 'مشجع رياضي نشط',
  avatar: '/assets/user_avatar.png',
};

const AVATAR_PRESETS = [
  { id: '1', url: '/assets/user_avatar.png', label: 'أحمد علي (الافتراضي)' },
  { id: '2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'مشجع 2' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'مشجع 3' },
  { id: '4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'مشجع 4' },
];

const TITLE_SUGGESTIONS = [
  'مشجع رياضي نشط',
  'عاشق الساحرة المستديرة ⚽',
  'محلل تكتيكي معتمد 📋',
  'متابع أول بأول ⚡',
];

export const MoreTab: React.FC = () => {
  const {
    openModal,
    language,
    setLanguage,
  } = useApp();

  // Profile State persisted in localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('matchplus_user_profile');
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROFILE;
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editTitle, setEditTitle] = useState(profile.title);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const handleSaveProfile = () => {
    const updated: UserProfile = {
      name: editName.trim() || 'أحمد علي',
      title: editTitle.trim() || 'مشجع رياضي نشط',
      avatar: editAvatar,
    };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('matchplus_user_profile', JSON.stringify(updated));
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="pb-28 p-4 space-y-4 select-none">
      {/* 1. Sleek Sports Fan Profile Capsule (Inspired by user's reference) */}
      <div className="rounded-3xl bg-[#0c1220] border border-neutral-800/80 px-5 py-4 flex items-center justify-between shadow-xl relative overflow-hidden transition-all hover:border-neutral-700/80">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#7ec815]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Right side (RTL): Avatar + Name & Subtitle */}
        <div className="flex items-center gap-3.5 relative z-10">
          {/* Avatar with lime-green border matching reference */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#7ec815] shadow-[0_0_12px_rgba(126,200,21,0.3)] bg-[#151c2a]"
            />
          </div>

          {/* User Name & Bio */}
          <div className="text-right">
            <h2 className="text-lg font-black text-white tracking-wide leading-snug">
              {profile.name}
            </h2>
            <p className="text-xs font-semibold text-neutral-400 mt-0.5">
              {profile.title}
            </p>
          </div>
        </div>

        {/* Left side (RTL): Edit Pencil Button */}
        <button
          type="button"
          onClick={() => {
            setEditName(profile.name);
            setEditTitle(profile.title);
            setEditAvatar(profile.avatar);
            setIsEditModalOpen(true);
          }}
          className="w-10 h-10 rounded-full bg-[#151c2a] hover:bg-[#1f2b3e] active:scale-95 border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-white transition shadow cursor-pointer relative z-10"
          aria-label="تعديل الملف الشخصي"
          title="تعديل الملف الشخصي"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Main Hub Options */}
      <div className="bg-[#101420]/90 rounded-3xl border border-neutral-800/90 overflow-hidden divide-y divide-neutral-900 shadow-md">
        {/* My Favorites */}
        <button
          type="button"
          onClick={() => openModal({ type: 'favorites_page' })}
          className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 text-right transition group cursor-pointer"
          aria-label="فتح صفحة مفضلاتي"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition">
              <Heart className="w-5 h-5 fill-rose-500/30" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">مفضلاتي الرياضية</span>
              <span className="text-xs text-neutral-400">إدارة الأندية والبطولات وتخصيص نتائجك</span>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
        </button>

        {/* Notification Settings */}
        <button
          type="button"
          onClick={() => openModal({ type: 'notification_settings' })}
          className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 text-right transition group cursor-pointer"
          aria-label="فتح إعدادات الإشعارات"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">إعدادات الإشعارات والتنبيهات المباشرة</span>
              <span className="text-xs text-neutral-400">تنبيهات فورية للأهداف، صافرة البداية، والتشكيلات</span>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
        </button>

        {/* Language Selection */}
        <div className="flex items-center justify-between p-4 text-right">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">لغة التطبيق</span>
              <span className="text-xs text-neutral-400">العربية (الأساسية RTL) / English</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-neutral-200 border border-neutral-700 text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
          >
            {language === 'ar' ? 'العربية 🇸🇦' : 'English 🇬🇧'}
          </button>
        </div>
      </div>

      {/* 3. Utility & Support */}
      <div className="bg-[#101420]/90 rounded-3xl border border-neutral-800/90 overflow-hidden divide-y divide-neutral-900 shadow-md">
        <div className="flex items-center justify-between p-4 text-right">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-[#7ec815] border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">الخصوصية وحماية البيانات</span>
              <span className="text-xs text-neutral-400">تخزين آمن ومحلي لكافة اختياراتك وتفضيلاتك</span>
            </div>
          </div>
          <span className="text-[11px] text-[#7ec815] font-mono font-bold bg-[#7ec815]/10 px-2 py-0.5 rounded-full">
            آمن 100%
          </span>
        </div>

        <div className="p-4 text-right">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="p-2.5 rounded-2xl bg-neutral-800 text-neutral-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">الدعم والمساعدة</span>
              <span className="text-xs text-neutral-400">فريق الدعم الفني متواجد لمساعدتك</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 pr-12 leading-relaxed">
            لأي اقتراحات أو استفسارات حول تغطية البطولات والنتائج الحية، تواصل معنا عبر support@matchplus.app
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-neutral-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative space-y-5 text-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#7ec815]/10 flex items-center justify-center text-[#7ec815]">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-white">تعديل الملف الشخصي</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800/70 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 block">اختر الصورة الشخصية</label>
              <div className="flex items-center justify-center gap-3 py-1">
                {AVATAR_PRESETS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setEditAvatar(av.url)}
                    className={`relative rounded-full transition p-0.5 cursor-pointer ${
                      editAvatar === av.url
                        ? 'ring-2 ring-[#7ec815] scale-110 shadow-[0_0_12px_rgba(126,200,21,0.5)]'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-12 h-12 rounded-full object-cover bg-neutral-900"
                    />
                    {editAvatar === av.url && (
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#7ec815] text-black flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 block">اسم المشجع</label>
              <div className="relative">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="أدخل اسمك"
                  className="w-full bg-[#1e293b]/70 border border-neutral-700/70 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#7ec815] focus:ring-1 focus:ring-[#7ec815] transition"
                  dir="rtl"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Title / Status Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 block">الوصف أو اللقب الرياضي</label>
              <div className="relative">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="مثل: مشجع رياضي نشط"
                  className="w-full bg-[#1e293b]/70 border border-neutral-700/70 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#7ec815] focus:ring-1 focus:ring-[#7ec815] transition"
                  dir="rtl"
                />
                <Sparkles className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              </div>

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {TITLE_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setEditTitle(tag)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50 transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 bg-[#7ec815] hover:bg-[#6eb113] active:scale-98 text-black font-extrabold text-sm py-2.5 rounded-2xl transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>حفظ التعديلات</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-bold rounded-2xl transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
