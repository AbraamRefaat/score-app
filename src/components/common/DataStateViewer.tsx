import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { RefreshCw, WifiOff, AlertTriangle, Layers, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

export const DataStateViewer: React.FC = () => {
  const {
    uiState,
    setUiState,
    isLiveSimulationActive,
    setIsLiveSimulationActive,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-16 left-4 z-40 select-none">
      {isOpen ? (
        <div className="bg-neutral-900/95 backdrop-blur border border-neutral-700/80 rounded-2xl p-3 shadow-2xl text-xs space-y-2.5 w-60 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
            <span className="font-extrabold text-neutral-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>معاينة حالات البيانات</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setUiState('ready')}
              className={`p-1.5 rounded-lg font-bold text-center transition ${
                uiState === 'ready'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              طبيعي (Ready)
            </button>

            <button
              type="button"
              onClick={() => setUiState('loading')}
              className={`p-1.5 rounded-lg font-bold text-center transition ${
                uiState === 'loading'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              تحميل (Skeleton)
            </button>

            <button
              type="button"
              onClick={() => setUiState('error')}
              className={`p-1.5 rounded-lg font-bold text-center transition ${
                uiState === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              خطأ اتصال (Error)
            </button>

            <button
              type="button"
              onClick={() => setUiState('empty')}
              className={`p-1.5 rounded-lg font-bold text-center transition ${
                uiState === 'empty'
                  ? 'bg-amber-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              حالة فارغة (Empty)
            </button>
          </div>

          <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">محاكاة الدقائق الحية:</span>
            <button
              type="button"
              onClick={() => setIsLiveSimulationActive(!isLiveSimulationActive)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold ${
                isLiveSimulationActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {isLiveSimulationActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isLiveSimulationActive ? 'جارية' : 'متوقفة'}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-700 shadow-xl text-[11px] font-bold backdrop-blur transition"
          aria-label="خيارات حالات الواجهة"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>حالات البيانات</span>
          <ChevronUp className="w-3 h-3 text-neutral-400" />
        </button>
      )}
    </div>
  );
};
