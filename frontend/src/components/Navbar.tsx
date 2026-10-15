import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mic, Sparkles, SlidersHorizontal, Users, ShieldCheck, Activity, Database, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then(() => {
        if (isMounted) setBackendOk(true);
      })
      .catch(() => {
        if (isMounted) setBackendOk(false);
      });
    return () => { isMounted = false; };
  }, []);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Activity },
    { to: '/recommendations', label: 'Recommendations', icon: Sparkles },
    { to: '/studios', label: 'Studios', icon: SlidersHorizontal },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/evaluation', label: 'Evaluation', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] glow-purple transition group-hover:scale-105">
              <div className="w-full h-full bg-[#090e1a] rounded-[11px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  Pod<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Bay</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  AI Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Podcast Studio Matching</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* System Indicators */}
          <div className="flex items-center gap-3">
            {/* Synthetic Data badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/60 text-slate-400 border border-slate-700/50" title="All listings and profiles are synthetic test records">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Synthetic Data</span>
            </div>

            {/* Health pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700/60">
              {backendOk === true && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-mono">Backend API Live</span>
                </>
              )}
              {backendOk === false && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-300 font-mono">Backend Offline</span>
                </>
              )}
              {backendOk === null && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-slate-400 font-mono">Connecting...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 bg-slate-950/90 text-xs">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-2 rounded font-medium ${
                isActive ? 'text-purple-400' : 'text-slate-400'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </header>
  );
};
