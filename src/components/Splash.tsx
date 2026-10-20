import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const Splash: React.FC = () => {
  const { setShowSplash } = useApp();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Splash duration: 2.7s animated display before transition
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 350);
    }, 2700);

    return () => clearTimeout(timer);
  }, [setShowSplash]);

  const handleTapToContinue = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 200);
  };

  return (
    <div
      onClick={handleTapToContinue}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#131826] text-white select-none overflow-hidden transition-opacity duration-300 ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="banner"
      aria-label="شاشة البداية ماتش+"
    >
      {/* Subtle ambient athletic glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[340px] h-[340px] rounded-full bg-[#7ec815]/15 blur-[90px] animate-pulse"></div>
        <div className="absolute top-1/4 w-72 h-72 rounded-full bg-[#3b82f6]/5 blur-[100px]"></div>
      </div>

      {/* Main Animated Center Content */}
      <div className="flex flex-col items-center text-center z-10 px-6">
        {/* Animated Rotated Squircle with Lightning Bolt */}
        <div className="relative mb-8 group">
          {/* Ambient drop glow behind squircle */}
          <div className="absolute -inset-2 bg-[#7ec815]/35 rounded-[36px] blur-xl -rotate-6 animate-pulse"></div>

          {/* Lime Green Squircle Tile */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-[#7ec815] flex items-center justify-center shadow-2xl -rotate-[7deg] transform transition-transform duration-700 hover:rotate-0 hover:scale-105 animate-[splash-pop_0.8s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            {/* Inner Bold Stylized Lightning Bolt */}
            <svg
              viewBox="0 0 64 74"
              className="w-14 h-16 fill-[#131826] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34 3 H17 L12 35 H26 L17 71 L52 29 H36 L42 3 Z"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name Typography with '+' on the left and 'ماتش' on the right matching reference */}
        <div dir="ltr" className="flex items-center justify-center gap-2.5 mb-2 animate-[splash-fade-up_0.8s_ease-out_0.25s_both]">
          {/* Green plus sign on the left */}
          <span className="text-4xl sm:text-5xl font-black text-[#7ec815] font-sans leading-none select-none">
            +
          </span>
          {/* White bold 'ماتش' on the right */}
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-normal font-sans leading-none select-none">
            ماتش
          </h1>
        </div>

        {/* Arabic Tagline */}
        <p className="text-[#8492a6] text-sm sm:text-base font-semibold tracking-wide animate-[splash-fade-up_0.8s_ease-out_0.4s_both]">
          رفيقك الرياضي الأول
        </p>

        {/* Subtle breathing live line */}
        <div className="mt-8 flex items-center gap-1.5 opacity-60 animate-[splash-fade-up_0.8s_ease-out_0.55s_both]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7ec815] animate-ping"></span>
          <span className="w-12 h-0.5 rounded-full bg-gradient-to-r from-[#7ec815]/80 to-transparent"></span>
        </div>
      </div>
    </div>
  );
};
