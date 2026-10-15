import React from 'react';
import { ScoreBreakdown } from '../types';

interface ScoreBreakdownCardProps {
  breakdown: ScoreBreakdown;
  isColdStart?: boolean;
}

export const ScoreBreakdownCard: React.FC<ScoreBreakdownCardProps> = ({ breakdown, isColdStart }) => {
  const factors = [
    { label: 'City Proximity', score: breakdown.city_match, max: isColdStart ? 35 : 25, color: 'bg-emerald-500' },
    { label: 'Genre Alignment', score: breakdown.genre_match, max: isColdStart ? 25 : 30, color: 'bg-purple-500' },
    { label: 'Saved Wishlist Intent', score: breakdown.saved_studio, max: isColdStart ? 0 : 20, color: 'bg-pink-500' },
    { label: 'Acoustics & Video Gear', score: breakdown.amenities, max: isColdStart ? 0 : 10, color: 'bg-cyan-500' },
    { label: 'Community Rating', score: breakdown.quality_rating, max: isColdStart ? 25 : 10, color: 'bg-amber-500' },
    { label: 'Review Social Proof', score: breakdown.popularity_reviews, max: isColdStart ? 15 : 5, color: 'bg-blue-500' },
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-semibold text-slate-300">Multi-Signal Score Breakdown</span>
        <span className="font-mono font-bold text-purple-400">{breakdown.total} / 100</span>
      </div>

      <div className="space-y-2">
        {factors.map(({ label, score, max, color }) => {
          if (max === 0 && score === 0) return null;
          const pct = Math.min(100, Math.round((score / max) * 100));
          return (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>{label}</span>
                <span className="font-mono text-slate-200">
                  {score.toFixed(1)} <span className="text-slate-500">/ {max}</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {isColdStart && (
        <div className="text-[11px] text-amber-300/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
          Cold-start weights re-allocated to city proximity & verified ratings.
        </div>
      )}
    </div>
  );
};
