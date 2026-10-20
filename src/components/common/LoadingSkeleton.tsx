import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Date strip skeleton */}
      <div className="flex gap-2 pb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 w-16 bg-neutral-900 rounded-xl"></div>
        ))}
      </div>

      {/* Live matches skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-neutral-900 rounded"></div>
        <div className="h-24 bg-neutral-900/80 rounded-2xl border border-neutral-850"></div>
      </div>

      {/* Tournament group skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-4 w-40 bg-neutral-900 rounded"></div>
        <div className="h-36 bg-neutral-900/80 rounded-2xl border border-neutral-850"></div>
        <div className="h-28 bg-neutral-900/80 rounded-2xl border border-neutral-850"></div>
      </div>
    </div>
  );
};
