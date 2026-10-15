import React from 'react';
import { Mic, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#050811] text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-heading">
                Pod<span className="text-purple-400">Bay</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              AI-driven, explainable podcast recording studio recommendation engine built with FastAPI, React, and modular multi-factor content-based ranking.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Stack AI/ML Technical Assessment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">System Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition">Dashboard & Live Statistics</Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-purple-400 transition">Personalized Recommendation Engine</Link>
              </li>
              <li>
                <Link to="/studios" className="hover:text-purple-400 transition">Studio Catalog & Search</Link>
              </li>
              <li>
                <Link to="/users" className="hover:text-purple-400 transition">Creator Profiles & History</Link>
              </li>
              <li>
                <Link to="/evaluation" className="hover:text-purple-400 transition">Engine Evaluation & Benchmarks</Link>
              </li>
            </ul>
          </div>

          {/* Provenance and notice */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-medium mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Synthetic Data Notice</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              All 60 studio records and 20 user profiles are synthetic demo data created for system evaluation. Venues, pricing in INR, availability flags, and creator booking histories are fictional and not verified commercial entities.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PodBay Recommendation Engine. Built for Pair Programming Assessment.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono">FastAPI + React 19 + Vite + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
