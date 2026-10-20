import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { NewsItem } from '../../types/index.ts';
import { Play, Flame, Sparkles, Filter, Clock, Tag } from 'lucide-react';

export const NewsTab: React.FC = () => {
  const { news, preferences, openModal } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'transfers' | 'teams' | 'tournaments'>('all');

  // Filter and prioritize news:
  // Items matching followed teams or tournaments get priority
  const filteredNews = news
    .filter(item => {
      if (activeCategory === 'all') return true;
      return item.category === activeCategory;
    })
    .sort((a, b) => {
      const aIsFav =
        a.teamIds.some(t => preferences.selectedTeams.includes(t)) ||
        (a.tournamentId && preferences.selectedTournaments.includes(a.tournamentId));
      const bIsFav =
        b.teamIds.some(t => preferences.selectedTeams.includes(t)) ||
        (b.tournamentId && preferences.selectedTournaments.includes(b.tournamentId));
      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      return 0;
    });

  const buzzItems = news.filter(n => n.isBuzz);

  return (
    <div className="pb-24 select-none">
      {/* Category Filter Chips */}
      <div className="py-2.5 px-4 bg-neutral-950/80 border-b border-neutral-900/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'all', label: 'كافة الأخبار' },
            { id: 'transfers', label: 'سوق الانتقالات' },
            { id: 'teams', label: 'أخبار الفرق' },
            { id: 'tournaments', label: 'البطولات العالمية' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
                activeCategory === cat.id
                  ? 'bg-neutral-100 text-neutral-950 border-white shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* BUZZ & Highlights Section */}
        {buzzItems.length > 0 && activeCategory === 'all' && (
          <section aria-labelledby="buzz-heading">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <Flame className="w-4 h-4" />
                </span>
                <h2 id="buzz-heading" className="text-sm font-black text-white">
                  ملخصات وBUZZ رياضي
                </h2>
              </div>
              <span className="text-[10px] text-neutral-400">فيديوهات ولقطات سريعة</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {buzzItems.map(item => (
                <div
                  key={`buzz-${item.id}`}
                  onClick={() => openModal({ type: 'news_detail', newsId: item.id })}
                  className="w-56 shrink-0 bg-neutral-900/60 hover:bg-neutral-850 rounded-2xl border border-neutral-800 overflow-hidden cursor-pointer group transition active:scale-[0.98]"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-4 h-4 fill-current mr-0.5" />
                      </div>
                    </div>
                    {item.duration && (
                      <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        {item.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-3 text-right">
                    <h3 className="text-xs font-bold text-neutral-100 line-clamp-2 leading-snug group-hover:text-emerald-400">
                      {item.titleAr}
                    </h3>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      {item.publishedAtAr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Feed */}
        <section aria-labelledby="latest-news-heading" className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 id="latest-news-heading" className="text-sm font-black text-white">
              أحدث التغطيات الرياضية
            </h2>
          </div>

          <div className="space-y-3">
            {filteredNews.map(item => {
              const isPrioritized =
                item.teamIds.some(t => preferences.selectedTeams.includes(t)) ||
                (item.tournamentId && preferences.selectedTournaments.includes(item.tournamentId));

              return (
                <article
                  key={item.id}
                  onClick={() => openModal({ type: 'news_detail', newsId: item.id })}
                  className="bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-800/80 rounded-2xl p-3.5 flex gap-3.5 cursor-pointer transition active:scale-[0.99] group"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-neutral-800 bg-neutral-900">
                    <img
                      src={item.image}
                      alt={item.titleAr}
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {item.duration && (
                      <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded font-mono">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-right">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md">
                          {item.categoryAr}
                        </span>
                        {isPrioritized && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>موصى به لك</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-black text-neutral-100 group-hover:text-emerald-400 line-clamp-2 leading-relaxed">
                        {item.titleAr}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2">
                      <span>{item.publishedAtAr}</span>
                      <span>{item.readTimeAr}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
