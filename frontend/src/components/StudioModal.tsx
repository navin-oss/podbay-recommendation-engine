import React, { useEffect } from 'react';
import { X, MapPin, Users, Star, IndianRupee, Radio, Video, CheckCircle, AlertTriangle, ShieldCheck, Headphones } from 'lucide-react';
import { Studio } from '../types';

interface StudioModalProps {
  studio: Studio | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({ studio, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = prevOverflow || '';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !studio) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glass-panel my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header background accent */}
        <div className="relative h-28 bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-slate-900 p-6 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {studio.studio_id}
              </span>
              {studio.active ? (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" /> Active Listing
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3" /> Inactive Studio
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white font-heading">{studio.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Location</span>
              </div>
              <p className="font-semibold text-white">{studio.city}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hourly Rate</span>
              </div>
              <p className="font-semibold text-white">₹{studio.price_per_hour}/hr</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Capacity</span>
              </div>
              <p className="font-semibold text-white">{studio.capacity} creators</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rating</span>
              </div>
              <p className="font-semibold text-white">{studio.rating} <span className="text-xs text-slate-400 font-normal">({studio.review_count} rev.)</span></p>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Supported Genres & Formats</h4>
            <div className="flex flex-wrap gap-2">
              {studio.genre_fit.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities: Acoustic & Video */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Studio Capabilities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${studio.acoustic_treatment ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300' : 'bg-slate-800/20 border-slate-800 text-slate-500'}`}>
                <Radio className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold">Acoustic Treatment</p>
                  <p className="text-xs text-slate-400">{studio.acoustic_treatment ? 'Sound-dampened isolated studio environment' : 'Basic non-treated room'}</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border ${studio.video_recording ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300' : 'bg-slate-800/20 border-slate-800 text-slate-500'}`}>
                <Video className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold">Video Podcasting Support</p>
                  <p className="text-xs text-slate-400">{studio.video_recording ? 'Camera angles and video lighting ready' : 'Audio-only recording setup'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Hardware & Equipment Inventory</h4>
            <div className="flex flex-wrap gap-2">
              {studio.equipment.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800/70 text-slate-300 border border-slate-700/60"
                >
                  <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Provenance note */}
          <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Synthetic Record Metadata</span>
            </div>
            <p>{studio.source_note || 'Fictional studio record generated for AI recommendation benchmarking.'}</p>
            {studio.availability_note && (
              <p className="text-slate-500">{studio.availability_note}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
