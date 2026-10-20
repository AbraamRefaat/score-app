import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorView: React.FC = () => {
  const { setUiState } = useApp();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-extrabold text-white mb-2">تعذر تحديث النتائج المباشرة</h3>
      <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
        حدث انقطاع مؤقت في الاتصال بسيرفر النتائج. يتم حفظ بياناتك محلياً بشكل آمن.
      </p>
      <button
        type="button"
        onClick={() => setUiState('ready')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition active:scale-95 shadow-lg shadow-emerald-500/20"
      >
        <RefreshCw className="w-4 h-4" />
        <span>إعادة المحاولة الآن</span>
      </button>
    </div>
  );
};
