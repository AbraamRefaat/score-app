import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Bell,
  Volume2,
  Goal,
  AlertOctagon,
  Clock,
  Users,
  CheckCircle,
  Shield,
  Smartphone,
} from 'lucide-react';

interface NotificationSettingsModalProps {
  targetMatchId?: string;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  targetMatchId,
}) => {
  const {
    teams,
    matches,
    notificationSettings,
    updateNotificationSettings,
    toggleTeamNotification,
    toggleMatchNotification,
    closeModal,
  } = useApp();

  const followedTeams = teams.filter(t => notificationSettings.teamSpecific[t.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-950 rounded-t-3xl sm:rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        role="dialog"
        aria-label="إعدادات الإشعارات والتنبيهات"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-900 bg-neutral-950/95 sticky top-0 z-20">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 transition"
            aria-label="إغلاق إعدادات الإشعارات"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-black text-white">إعدادات الإشعارات والتنبيهات</h2>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-right">
          {/* Sound switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">صوت التنبيهات ونغمة الأهداف</span>
                <span className="text-[10px] text-neutral-400">إطلاق صوت صفارة أو هتاف عند تسجيل هدف</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateNotificationSettings({ soundEnabled: !notificationSettings.soundEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationSettings.soundEnabled ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationSettings.soundEnabled ? 'left-1' : 'right-1'
                }`}
              ></span>
            </button>
          </div>

          {/* Core Events Group */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-neutral-300">أحداث المباريات المراد التنبيه بها</h3>

            {/* 1. Goals */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚽</span>
                <div>
                  <span className="text-xs font-bold text-white block">الأهداف (فورية بلحظتها)</span>
                  <span className="text-[10px] text-neutral-400">
                    إشعار فوري عند تسجيل أي هدف مع اسم المسجل والصانع
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({ goals: !notificationSettings.goals })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notificationSettings.goals ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.goals ? 'left-1' : 'right-1'
                  }`}
                ></span>
              </button>
            </div>

            {/* 2. Red cards & VAR */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="p-1 rounded bg-rose-600 text-[10px] font-bold text-white">VAR</span>
                <div>
                  <span className="text-xs font-bold text-white block">
                    البطاقات الحمراء ومراجعات VAR
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    حالات الطرد وإلغاء أو احتساب ركلات الجزاء والأهداف
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({ redCardsVar: !notificationSettings.redCardsVar })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notificationSettings.redCardsVar ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.redCardsVar ? 'left-1' : 'right-1'
                  }`}
                ></span>
              </button>
            </div>

            {/* 3. Pre-match reminder */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-white block">تذكير قبل انطلاق المباراة</span>
                  <span className="text-[10px] text-neutral-400">تنبيه قبل 15 دقيقة من بداية صافرة الحكم</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    preMatchReminder: !notificationSettings.preMatchReminder,
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notificationSettings.preMatchReminder ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.preMatchReminder ? 'left-1' : 'right-1'
                  }`}
                ></span>
              </button>
            </div>

            {/* 4. Official lineups announced */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="text-xs font-bold text-white block">إعلان التشكيلات الرسمية</span>
                  <span className="text-[10px] text-neutral-400">
                    فور الكشف عن قائمة الـ 11 لاعباً الأساسيين (قبل ساعة)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    lineupsAnnounced: !notificationSettings.lineupsAnnounced,
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notificationSettings.lineupsAnnounced ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.lineupsAnnounced ? 'left-1' : 'right-1'
                  }`}
                ></span>
              </button>
            </div>

            {/* 5. Final Result */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">صافرة النهاية والنتيجة النهائية</span>
                  <span className="text-[10px] text-neutral-400">ملخص النتيجة مع انتهاء وقت المباراة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    finalResult: !notificationSettings.finalResult,
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notificationSettings.finalResult ? 'bg-emerald-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.finalResult ? 'left-1' : 'right-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Per-team toggles */}
          <div className="space-y-2 pt-2 border-t border-neutral-900">
            <h3 className="text-xs font-black text-neutral-300">إشعارات مخصصة لكل فريق</h3>
            <div className="space-y-2">
              {followedTeams.map(t => {
                const isEnabled = !!notificationSettings.teamSpecific[t.id];
                return (
                  <div
                    key={`team-notif-${t.id}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{t.logo}</span>
                      <span className="text-xs font-bold text-white">{t.nameAr}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleTeamNotification(t.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        isEnabled
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isEnabled ? 'مُفعّل' : 'معطّل'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
