import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Search,
  Filter,
  RefreshCw,
  Star,
  IndianRupee,
  MapPin,
  Heart,
  Radio,
  Video,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile, RecommendationResponse, RecommendationItem, Studio } from '../types';
import { ScoreBreakdownCard } from '../components/ScoreBreakdownCard';
import { StudioModal } from '../components/StudioModal';

export const Recommendations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('U-001');
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Recommendations state
  const [recData, setRecData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<string>('');
  const [filterGenre, setFilterGenre] = useState<string>('');
  const [filterVideo, setFilterVideo] = useState<boolean>(false);
  const [filterAcoustics, setFilterAcoustics] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('score');

  // Breakdown visibility per studio
  const [expandedBreakdowns, setExpandedBreakdowns] = useState<Record<string, boolean>>({});

  // Studio inspection modal
  const [inspectedStudio, setInspectedStudio] = useState<Studio | null>(null);

  // 1. Load users once
  useEffect(() => {
    api.getUsers()
      .then((res) => {
        setUsers(res.items);
        const queryUid = searchParams.get('userId');
        if (queryUid && res.items.some((u) => u.user_id === queryUid)) {
          setSelectedUserId(queryUid);
        } else if (res.items.length > 0) {
          setSelectedUserId(res.items[0].user_id);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load user profiles from backend.');
      });
  }, [searchParams]);

  // Current selected user object
  const currentUser = useMemo(() => {
    return users.find((u) => u.user_id === selectedUserId) || null;
  }, [users, selectedUserId]);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: 5,
        sort_by: sortBy !== 'score' ? sortBy : undefined,
      };
      if (filterCity) params.city = filterCity;
      if (debouncedMaxPrice) params.max_price = parseFloat(debouncedMaxPrice);
      if (filterGenre) params.genre = filterGenre;
      if (filterVideo) params.video_recording = true;
      if (filterAcoustics) params.acoustic_treatment = true;

      const data = await api.getRecommendations(selectedUserId, params);
      setRecData(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 'Failed to generate recommendations for this user.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Debounce the free-text price field so typing doesn't spam the API.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedMaxPrice(filterMaxPrice), 400);
    return () => clearTimeout(handle);
  }, [filterMaxPrice]);

  // Auto-refetch whenever the selected user, sort, or any hard-constraint filter changes.
  useEffect(() => {
    if (selectedUserId) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, sortBy, filterCity, debouncedMaxPrice, filterGenre, filterVideo, filterAcoustics]);

  const toggleBreakdown = (studioId: string) => {
    setExpandedBreakdowns((prev) => ({
      ...prev,
      [studioId]: !prev[studioId],
    }));
  };

  const handleSelectUser = (uId: string) => {
    setSelectedUserId(uId);
    setSearchParams({ userId: uId });
    setIsDropdownOpen(false);
  };

  const filteredUsersForDropdown = useMemo(() => {
    if (!userSearchTerm.trim()) return users;
    const term = userSearchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.user_id.toLowerCase().includes(term) ||
        u.display_name.toLowerCase().includes(term) ||
        (u.last_active_city && u.last_active_city.toLowerCase().includes(term))
    );
  }, [users, userSearchTerm]);

  // Available cities for filter
  const cityOptions = [
    'Bengaluru', 'Mumbai', 'Pune', 'Delhi', 'Hyderabad',
    'Chennai', 'Kolkata', 'Jaipur', 'Noida', 'Indore', 'Ahmedabad', 'Kochi', 'Chandigarh'
  ];

  const genreOptions = [
    'interview', 'video', 'solo voiceover', 'music', 'storytelling', 'roundtable', 'regional-language'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Transparent AI Recommendation Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Personalized Studio Matchmaker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ranked active studios based on multi-factor proximity, genre frequency, saved wishlist, and verified acoustics.
          </p>
        </div>

        {/* Generate / Refresh button */}
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg glow-purple disabled:opacity-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Computing...' : 'Recalculate Matches'}</span>
        </button>
      </div>

      {/* Backdrop to dismiss dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* ================= USER SELECTOR & PROFILE SUMMARY ================= */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 relative ${isDropdownOpen ? 'z-40' : 'z-10'}`}>
        {/* User Search & Selector */}
        <div className={`glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between relative ${isDropdownOpen ? 'z-50' : 'z-10'}`}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Creator Profile (20 Benchmarks)
            </label>

            {/* Selector trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-left transition"
              >
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                      {currentUser.user_id.replace('U-', '')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">{currentUser.display_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {currentUser.user_id} · {currentUser.last_active_city || 'No city'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">Choose creator...</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown panel */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0b0f19] border border-slate-700/80 rounded-xl shadow-2xl p-2 max-h-72 overflow-y-auto"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(139, 92, 246, 0.2)' }}
                >
                  <div className="p-1 mb-2 sticky top-0 bg-[#0b0f19] z-10 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by ID or name..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {filteredUsersForDropdown.map((u) => (
                      <button
                        key={u.user_id}
                        type="button"
                        onClick={() => handleSelectUser(u.user_id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                          u.user_id === selectedUserId
                            ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {u.user_id}
                          </span>
                          <span>{u.display_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {u.is_cold_start ? (
                            <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400">
                              Cold-start
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              {u.booking_count} bookings
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Edge-cases supported:</span>
            <span className="text-purple-400 font-medium">U-003, U-016 (Cold), U-010 (Multi-City)</span>
          </div>
        </div>

        {/* User Profile Card */}
        {currentUser && (
          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {currentUser.user_id}
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading">{currentUser.display_name}</h3>
                </div>

                {currentUser.is_cold_start ? (
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> Cold-Start Profile
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Personalized Signals Active
                  </span>
                )}
              </div>

              {/* User details chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Recent Activity City</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {currentUser.last_active_city || 'Unspecified'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Past Bookings</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {currentUser.booking_count} recorded
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Saved Venues</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-1 mt-0.5">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    {currentUser.saved_count} wishlisted
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Profile Origin</span>
                  <span className="text-sm font-semibold text-white truncate block mt-0.5">
                    {currentUser.profile_city || 'Unspecified'}
                  </span>
                </div>
              </div>

              {/* Preferred genres */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium mr-1">Preferred Formats:</span>
                {currentUser.preferred_genres && currentUser.preferred_genres.length > 0 ? (
                  currentUser.preferred_genres.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                      {g}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">None specified</span>
                )}
              </div>
            </div>

            {/* Provenance note */}
            <p className="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-800/60">
              {currentUser.notes || 'Synthetic benchmark profile.'}
            </p>
          </div>
        )}
      </div>

      {/* ================= COLD-START OR CONTRADICTORY BANNER ================= */}
      {recData?.is_cold_start && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300 text-sm">
              Cold-Start Creator Profile: Not personalized — insufficient user history.
            </h4>
            <p className="leading-relaxed text-amber-200/90">
              This creator has 0 recorded bookings. The engine shifts weight to location proximity, community rating (out of 5.0), and established review volume to deliver reliable active suggestions without hallucinating historical affinities.
            </p>
          </div>
        </div>
      )}

      {/* ================= FILTER TOOLBAR ================= */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4 relative z-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Filter className="w-4 h-4 text-purple-400" />
            <span>Hard Constraint Filters</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs outline-none focus:border-purple-500"
            >
              <option value="score">Match Score (Recommended)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* City */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">City Constraint</label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500"
            >
              <option value="">All Cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Max Hourly Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500 placeholder:text-slate-600"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Recording Genre</label>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500"
            >
              <option value="">All Formats</option>
              {genreOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Video Toggle */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setFilterVideo(!filterVideo)}
              className={`w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border font-medium transition ${
                filterVideo
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Podcasting</span>
            </button>
          </div>

          {/* Acoustics Toggle */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setFilterAcoustics(!filterAcoustics)}
              className={`w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border font-medium transition ${
                filterAcoustics
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Acoustic Isolation</span>
            </button>
          </div>
        </div>

        {/* Clear filters button */}
        {(filterCity || filterMaxPrice || filterGenre || filterVideo || filterAcoustics) && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setFilterCity('');
                setFilterMaxPrice('');
                setFilterGenre('');
                setFilterVideo(false);
                setFilterAcoustics(false);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 transition"
            >
              Reset all constraints
            </button>
          </div>
        )}
      </div>

      {/* ================= RESULTS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-heading">
              Top Ranked Recommendations
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {recData?.recommendations.length ?? 0} matches of {recData?.total_candidates ?? 0} active studios
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Strict Inactive Exclusion Applied</span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">Computing multi-factor studio affinities...</p>
            <p className="text-xs text-slate-500">Evaluating proximity, genre vectors, wishlist boost, and acoustics</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && recData && recData.recommendations.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <Info className="w-8 h-8 text-purple-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Studios Match Your Current Constraints</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try loosening the city, budget, or equipment constraints to allow more active studio candidates into the scoring pipeline.
            </p>
          </div>
        )}

        {/* Studio Recommendation Cards */}
        {!loading && !error && recData && (
          <div className="space-y-4">
            {recData.recommendations.map((item: RecommendationItem) => {
              const { studio, score, score_breakdown, explanation, rank, is_saved, confidence } = item;
              const isExpanded = !!expandedBreakdowns[studio.studio_id];

              return (
                <div
                  key={studio.studio_id}
                  className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Rank & Studio Details */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Rank badge */}
                      <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center font-bold text-lg text-purple-300 font-heading flex-shrink-0">
                        #{rank}
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-white font-heading hover:text-purple-300 transition cursor-pointer"
                              onClick={() => setInspectedStudio(studio)}>
                            {studio.name}
                          </h3>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {studio.studio_id}
                          </span>
                          {is_saved && (
                            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                              <Heart className="w-3 h-3 fill-pink-400" /> Wishlist Saved
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        </div>

                        {/* Location, Pricing, Capacity, Ratings */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" />
                            {studio.city}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-emerald-400">
                            <IndianRupee className="w-3.5 h-3.5" />
                            ₹{studio.price_per_hour}/hr
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            {studio.capacity} guests
                          </span>
                          <span className="flex items-center gap-1 font-medium text-amber-300">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {studio.rating} ({studio.review_count} reviews)
                          </span>
                        </div>

                        {/* Badges for genre & equipment */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {studio.genre_fit.map((g) => (
                            <span key={g} className="px-2 py-0.5 rounded text-[11px] bg-purple-950/60 text-purple-300 border border-purple-800/50">
                              {g}
                            </span>
                          ))}
                          {studio.acoustic_treatment && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-indigo-950/50 text-indigo-300 border border-indigo-700/50">
                              <Radio className="w-3 h-3 text-indigo-400" /> Acoustic Isolation
                            </span>
                          )}
                          {studio.video_recording && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-cyan-950/50 text-cyan-300 border border-cyan-700/50">
                              <Video className="w-3 h-3 text-cyan-400" /> Video Recording
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Match Score Card & CTAs */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Match Score
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                              {score}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">/ 100</span>
                          </div>
                        </div>

                        <div className="p-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-semibold text-purple-300 px-2">
                          {confidence} Fit
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBreakdown(studio.studio_id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
                        >
                          <span>{isExpanded ? 'Hide Score Math' : 'Score Math'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => setInspectedStudio(studio)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Studio</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Grounded Explanation Box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-purple-300">Why recommended: </span>
                      {explanation}
                    </p>
                  </div>

                  {/* Expandable Score Breakdown Component */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 animate-in fade-in duration-200">
                      <ScoreBreakdownCard
                        breakdown={score_breakdown}
                        isColdStart={recData.is_cold_start}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Studio inspection modal */}
      <StudioModal
        studio={inspectedStudio}
        isOpen={!!inspectedStudio}
        onClose={() => setInspectedStudio(null)}
      />
    </div>
  );
};
