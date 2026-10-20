import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Clock, Share2, Tag, Play } from 'lucide-react';

interface NewsDetailModalProps {
  newsId: string;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ newsId }) => {
  const { news, teams, tournaments, closeModal, openModal } = useApp();

  const article = news.find(n => n.id === newsId) || news[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-950 rounded-t-3xl sm:rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        role="dialog"
        aria-label={article.titleAr}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900 bg-neutral-950/95 sticky top-0 z-20">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 transition"
            aria-label="إغلاق المقال"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-neutral-400">{article.categoryAr}</span>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-right">
          <h1 className="text-lg font-black text-white leading-relaxed">{article.titleAr}</h1>

          <div className="flex items-center justify-between text-xs text-neutral-500 pb-3 border-b border-neutral-900">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.publishedAtAr}</span>
            </span>
            <span>{article.readTimeAr}</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-neutral-800">
            <img src={article.image} alt={article.titleAr} className="w-full h-52 object-cover" />
            {article.videoUrl && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            )}
          </div>

          <p className="text-sm font-bold text-neutral-200 leading-relaxed bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
            {article.summaryAr}
          </p>

          <div className="text-sm text-neutral-300 leading-relaxed space-y-3 pt-2">
            <p>{article.contentAr}</p>
            <p>
              وذكرت المصادر المقربة أن الجهاز الفني وضع خطة بديلة للتعامل مع ضغط المباريات في الفترة المقبلة لضمان استمرار الأداء التنافسي على أعلى مستوى.
            </p>
          </div>

          {/* Related Tags */}
          <div className="pt-4 border-t border-neutral-900">
            <h4 className="text-xs font-bold text-neutral-400 mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>الفرق والبطولات المرتبطة</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {article.teamIds.map(tId => {
                const team = teams.find(t => t.id === tId);
                if (!team) return null;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      closeModal();
                      openModal({ type: 'team_profile', teamId: team.id });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-200 border border-neutral-800"
                  >
                    <span>{team.logo}</span>
                    <span>{team.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
