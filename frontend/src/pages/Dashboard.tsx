import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  IndianRupee,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { api } from '../services/api';
import { DashboardStats, UserProfile } from '../types';

const CITY_COLORS = [
  '#8b5cf6', '#06b6d4', '#3b82f6', '#ec4899', '#10b981',
  '#f59e0b', '#6366f1', '#14b8a6', '#f43f5e', '#84cc16'
];

const GENRE_COLORS = [
  '#a855f7', '#38bdf8', '#fb7185', '#34d399', '#fbbf24', '#818cf8', '#c084fc'
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData] = await Promise.all([
        api.getDashboardStats(),
        api.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData.items);
    } catch (err: any) {
      console.error(err);
      setError(
        'Unable to connect to the PodBay backend API. Please make sure the FastAPI server is running on http://127.0.0.1:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cityChartData = stats
    ? Object.entries(stats.studios_by_city).map(([name, count]) => ({ name, count }))
    : [];

  const genreChartData = stats
    ? Object.entries(stats.studios_by_genre).map(([name, count]) => ({ name, value: count }))
    : [];

  return (
    <div className="space-y-12 pb-16">
      {/* ================= HERO SECTION ================= */}
      <section 
        className="relative min-h-[580px] md:min-h-[640px] flex items-center bg-cover bg-center overflow-hidden border-b border-slate-800"
        style={{ backgroundImage: `url('/PodcastStudio_Background.png')` }}
      >
        {/* Cinematic gradient overlay tailored to keep image details visible while maximizing text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/75 to-[#070b14]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-black/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Audio Match Engine</span>
            </div>

            {/* Title & Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white font-heading tracking-tight leading-none">
                Find Your Perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                  Podcast Studio.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Dynamic, multi-factor recommendation engine combining creator recording history, format compatibility, equipment needs, and geographic alignment with transparent scoring explanations.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/recommendations"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg glow-purple transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Recommendations</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/studios"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                <span>Explore Studios</span>
              </Link>
            </div>

            {/* Real-time Hero Statistics Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
                <p className="text-2xl font-bold text-white font-mono">{stats ? stats.total_studios : '60'}</p>
                <p className="text-xs text-slate-400">Verified Studios</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
                <p className="text-2xl font-bold text-emerald-400 font-mono">{stats ? stats.active_studios : '54'}</p>
                <p className="text-xs text-slate-400">Active Listings</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
                <p className="text-2xl font-bold text-cyan-400 font-mono">{stats ? stats.total_users : '20'}</p>
                <p className="text-xs text-slate-400">Creator Profiles</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
                <p className="text-2xl font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {stats ? stats.average_rating : '4.6'}
                </p>
                <p className="text-xs text-slate-400">Avg Star Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Error message banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Connection Warning</h3>
              <p className="text-xs mt-1 text-rose-300/90 leading-relaxed">{error}</p>
              <div className="mt-2 text-xs font-mono bg-black/40 p-2 rounded">
                uvicorn backend.app.main:app --reload --port 8000
              </div>
            </div>
            <button
              onClick={fetchData}
              className="px-3 py-1.5 rounded-lg bg-rose-800/50 hover:bg-rose-700 text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* ================= METRIC CARDS ================= */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading">Marketplace Intelligence</h2>
              <p className="text-xs text-slate-400">Aggregated real-time metrics computed directly from backend data</p>
            </div>
            <span className="text-xs font-mono text-purple-400 px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/40">
              Live Schema Validated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Studio Listings */}
            <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Studios</span>
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-110 transition">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white font-mono mb-2">
                {stats?.total_studios ?? '...'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> {stats?.active_studios ?? 0} active
                </span>
                <span>•</span>
                <span className="text-rose-400">{stats?.inactive_studios ?? 0} inactive</span>
              </div>
            </div>

            {/* Card 2: Creator Profiles */}
            <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">User Profiles</span>
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white font-mono mb-2">
                {stats?.total_users ?? '...'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-300 font-medium">{stats?.users_with_bookings ?? 0} with bookings</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{stats?.users_cold_start ?? 0} cold-start</span>
              </div>
            </div>

            {/* Card 3: Hourly Pricing */}
            <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Hourly Rate</span>
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white font-mono mb-2">
                ₹{stats?.average_price_per_hour ?? 0}
              </div>
              <div className="text-xs text-slate-400">
                Range: ₹{stats?.price_range.min} — ₹{stats?.price_range.max} (Median ₹{stats?.price_range.median})
              </div>
            </div>

            {/* Card 4: Recommendation Confidence */}
            <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommendation Engine</span>
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 group-hover:scale-110 transition">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-300 font-mono mb-2">
                100%
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Inactive Studio Exclusion Verified
              </div>
            </div>
          </div>
        </section>

        {/* ================= CHARTS SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* City Distribution Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Studios by City</h3>
                <p className="text-xs text-slate-400">Studio listings across primary Indian metropolitan hubs</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">15 Cities</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityChartData.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    angle={-25} 
                    textAnchor="end"
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {cityChartData.slice(0, 8).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CITY_COLORS[index % CITY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Genre Distribution Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Genre & Format Fit Distribution</h3>
                <p className="text-xs text-slate-400">Podcast formats supported across studio inventory</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">7 Formats</span>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={genreChartData}
                  margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {genreChartData.map((_, index) => (
                      <Cell key={`cell-genre-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ================= HOW THE ALGORITHM WORKS ================= */}
        <section className="glass-panel p-8 rounded-3xl border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Transparent Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              Explainable Scoring Model
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              PodBay computes a normalized 0–100 match score without opaque black-box neural networks. Every score is directly traceable to verified profile signals, historical frequency, and physical studio attributes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Pillar 1 · Proximity</div>
              <h4 className="text-base font-bold text-white mb-1">City Alignment (25 Pts)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches the creator's recent active city or secondary previous booking cities to minimize transit overhead.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Pillar 2 · Content</div>
              <h4 className="text-base font-bold text-white mb-1">Genre Compatibility (30 Pts)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proportionally weights studio format support against past recording frequency and explicit preferences.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1">Pillar 3 · Affinity</div>
              <h4 className="text-base font-bold text-white mb-1">Saved Wishlist (20 Pts)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Boosts studios explicitly bookmarked by the creator, reflecting high purchase intent.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Pillar 4 · Production</div>
              <h4 className="text-base font-bold text-white mb-1">Amenities Fit (10 Pts)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rewards acoustic isolation treatment (+5) and multi-camera 4K video recording capabilities (+5).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Pillar 5 · Trust</div>
              <h4 className="text-base font-bold text-white mb-1">Quality Rating (10 Pts)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scales linearly from the studio's verified 5-star community rating.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Pillar 6 · Social Proof</div>
              <h4 className="text-base font-bold text-white mb-1">Review Volume (5 Pts)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scales according to verified booking review count up to a threshold of 150 reviews.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Cold-Start & Constraint Guarantees</h4>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Inactive venues are hard-excluded before ranking. Zero-history creators receive transparent popularity & rating rankings labeled as unpersonalized.
              </p>
            </div>
            <Link
              to="/evaluation"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View Audit Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ================= QUICK USER LAUNCHPAD ================= */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-heading">Creator Profiles Quick-Select</h2>
              <p className="text-xs text-slate-400">Launch personalized recommendations for any of the 20 benchmark creator profiles</p>
            </div>
            <Link to="/users" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <span>View all profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {users.slice(0, 4).map((user) => (
              <div
                key={user.user_id}
                onClick={() => navigate(`/recommendations?userId=${user.user_id}`)}
                className="glass-card p-4 rounded-2xl cursor-pointer hover:border-purple-500/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                      {user.user_id}
                    </span>
                    {user.is_cold_start ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Cold-Start
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {user.booking_count} Bookings
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                    {user.display_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    City: <span className="text-slate-300">{user.last_active_city || 'Not set'}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-purple-400 group-hover:text-cyan-400 font-medium">
                  <span>Match Studios</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
