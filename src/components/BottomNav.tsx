import React from 'react';
import { useApp, type ActiveTab } from '../context/AppContext.tsx';
import { Star, Globe, Newspaper, MoreHorizontal } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; labelAr: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'my_scores', labelAr: 'نتائجي', icon: Star },
    { id: 'all_scores', labelAr: 'جميع النتائج', icon: Globe },
    { id: 'news', labelAr: 'أخبار', icon: Newspaper },
    { id: 'more', labelAr: 'المزيد', icon: MoreHorizontal },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c101a]/95 backdrop-blur-lg border-t border-neutral-900/90 max-w-lg mx-auto"
      role="navigation"
      aria-label="شريط التنقل السفلي"
    >
      <div className="flex items-center justify-around px-2 py-1.5 safe-bottom">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 min-h-[48px] cursor-pointer ${
                isActive
                  ? 'text-[#7ec815] font-black'
                  : 'text-neutral-400 hover:text-neutral-200 font-medium'
              }`}
              aria-label={item.labelAr}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4] fill-[#7ec815]/20' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7ec815]"></span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight select-none">{item.labelAr}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
