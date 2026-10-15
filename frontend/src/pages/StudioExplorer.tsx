import React, { useEffect, useState } from 'react';
import {
  SlidersHorizontal,
  Search,
  LayoutGrid,
  List,
  MapPin,
  IndianRupee,
  Users,
  Star,
  CheckCircle,
  AlertTriangle,
  Radio,
  Video,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { Studio, StudioListResponse } from '../types';
import { StudioModal } from '../components/StudioModal';

export const StudioExplorer: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [responseMeta, setResponseMeta] = useState<StudioListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [videoOnly, setVideoOnly] = useState<boolean>(false);
  const [acousticOnly, setAcousticOnly] = useState<boolean>(false);
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [page, setPage] = useState<number>(1);

  // Modal
  const [inspectedStudio, setInspectedStudio] = useState<Studio | null>(null);

  const fetchStudios = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        page_size: 12,
        sort_by: sortBy,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCity) params.city = selectedCity;
      if (selectedGenre) params.genre = selectedGenre;
      if (maxPrice) params.max_price = parseFloat(maxPrice);
      if (minCapacity) params.capacity = parseInt(minCapacity, 10);
      if (videoOnly) params.video_recording = true;
      if (acousticOnly) params.acoustic_treatment = true;
      if (activeOnly) params.active_only = true;

      const data = await api.getStudios(params);
      setStudios(data.items);
      setResponseMeta(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch studio listings from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, [page, sortBy, selectedCity, selectedGenre, videoOnly, acousticOnly, activeOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudios();
  };

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
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Complete Venue Directory
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Studio Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and filter through all 60 synthetic demonstration studios with full equipment and capacity metadata.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by studio name, city, hardware, or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-purple-500 placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          {/* City */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">City</label>
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500"
            >
              <option value="">All Cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Genre Format</label>
            <select
              value={selectedGenre}
              onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500"
            >
              <option value="">All Formats</option>
              {genreOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Max Rate (₹/hr)</label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500 placeholder:text-slate-600"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-purple-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="capacity">Largest Capacity</option>
            </select>
          </div>

          {/* Video Checkbox */}
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="video-check"
              checked={videoOnly}
              onChange={(e) => { setVideoOnly(e.target.checked); setPage(1); }}
              className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="video-check" className="text-slate-300 cursor-pointer flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-cyan-400" /> Video Ready
            </label>
          </div>

          {/* Active Only Checkbox */}
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="active-check"
              checked={activeOnly}
              onChange={(e) => { setActiveOnly(e.target.checked); setPage(1); }}
              className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="active-check" className="text-slate-300 cursor-pointer flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Active Only
            </label>
          </div>
        </div>
      </div>

      {/* Meta statistics bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="text-white font-medium">{studios.length}</span> of{' '}
          <span className="text-white font-medium">{responseMeta?.total ?? 0}</span> studios
          {responseMeta && (
            <span className="ml-2 text-slate-500">
              ({responseMeta.active_count} active, {responseMeta.inactive_count} inactive in dataset)
            </span>
          )}
        </div>

        <div className="font-mono">
          Page {page} of {responseMeta?.total_pages ?? 1}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-panel p-16 rounded-2xl border border-slate-800 text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-300">Filtering studio database...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* ================= GRID VIEW ================= */}
      {!loading && !error && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {studios.map((studio) => (
            <div
              key={studio.studio_id}
              className="glass-card rounded-2xl p-5 border border-slate-800/90 flex flex-col justify-between hover:border-purple-500/40 transition group cursor-pointer"
              onClick={() => setInspectedStudio(studio)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {studio.studio_id}
                  </span>
                  {studio.active ? (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertTriangle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                  {studio.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {studio.city}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    Cap. {studio.capacity}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {studio.rating}
                  </span>
                </div>

                {/* Genre chips */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {studio.genre_fit.slice(0, 3).map((g) => (
                    <span key={g} className="text-[10px] px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40">
                      {g}
                    </span>
                  ))}
                  {studio.genre_fit.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      +{studio.genre_fit.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Hourly Rate</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">₹{studio.price_per_hour}/hr</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setInspectedStudio(studio); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TABLE VIEW ================= */}
      {!loading && !error && viewMode === 'table' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Studio Name</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Rate (₹/hr)</th>
                  <th className="py-3 px-4">Cap.</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Features</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {studios.map((studio) => (
                  <tr
                    key={studio.studio_id}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setInspectedStudio(studio)}
                  >
                    <td className="py-3 px-4 font-mono text-purple-400">{studio.studio_id}</td>
                    <td className="py-3 px-4 font-bold text-white">{studio.name}</td>
                    <td className="py-3 px-4">{studio.city}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">₹{studio.price_per_hour}</td>
                    <td className="py-3 px-4">{studio.capacity}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-400" /> {studio.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {studio.acoustic_treatment && (
                          <span title="Acoustic Treatment"><Radio className="w-3.5 h-3.5 text-indigo-400" /></span>
                        )}
                        {studio.video_recording && (
                          <span title="Video Recording"><Video className="w-3.5 h-3.5 text-cyan-400" /></span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {studio.active ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setInspectedStudio(studio); }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {responseMeta && responseMeta.total_pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1 text-xs">
            {Array.from({ length: responseMeta.total_pages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`w-8 h-8 rounded-lg font-mono text-xs transition ${
                  pNum === page
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {pNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(responseMeta.total_pages, p + 1))}
            disabled={page === responseMeta.total_pages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      <StudioModal
        studio={inspectedStudio}
        isOpen={!!inspectedStudio}
        onClose={() => setInspectedStudio(null)}
      />
    </div>
  );
};
