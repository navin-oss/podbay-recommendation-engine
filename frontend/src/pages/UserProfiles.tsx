import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Sparkles,
  MapPin,
  Calendar,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X,
  Building2,
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile, UserHistoryResponse, Studio } from '../types';
import { StudioModal } from '../components/StudioModal';

export const UserProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterColdStart, setFilterColdStart] = useState<boolean>(false);

  // Selected User for full drawer/modal details
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userHistory, setUserHistory] = useState<UserHistoryResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  // Inspect studio from saved list
  const [inspectedStudio, setInspectedStudio] = useState<Studio | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers({
        cold_start_only: filterColdStart ? true : undefined,
      });
      setUsers(data.items);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch user profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterColdStart]);

  // When a user is selected, fetch their enriched history
  useEffect(() => {
    if (selectedUser) {
      setHistoryLoading(true);
      api.getUserHistory(selectedUser.user_id)
        .then((hist) => setUserHistory(hist))
        .catch((err) => console.error(err))
        .finally(() => setHistoryLoading(false));

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedUser(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = prevOverflow || '';
      };
    } else {
      setUserHistory(null);
    }
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.user_id.toLowerCase().includes(q) ||
        u.display_name.toLowerCase().includes(q) ||
        (u.last_active_city && u.last_active_city.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Creator Benchmark Directory
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            User Profiles & Booking Records
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore the 20 benchmark creator profiles, historical recording logs, and saved venue wishlists.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-800/40">
          <span>Total Profiles: 20</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-purple-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setFilterColdStart(!filterColdStart)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
              filterColdStart
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Cold-Start Only</span>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-panel p-16 rounded-2xl border border-slate-800 text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-300">Loading creator profiles...</p>
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="glass-card rounded-2xl p-5 border border-slate-800/90 flex flex-col justify-between hover:border-purple-500/50 transition cursor-pointer group"
              onClick={() => setSelectedUser(user)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
                    {user.user_id}
                  </span>
                  {user.is_cold_start ? (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <AlertTriangle className="w-3 h-3" /> Cold-Start
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> {user.booking_count} Bookings
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                  {user.display_name}
                </h3>

                <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>City: <strong className="text-slate-200">{user.last_active_city || 'None'}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    <span>Saved Studios: <strong className="text-slate-200">{user.saved_count}</strong></span>
                  </p>
                </div>

                {/* Formats */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.preferred_genres.map((g) => (
                    <span key={g} className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/40">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium group-hover:text-purple-300 transition">
                  Inspect History
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recommendations?userId=${user.user_id}`);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600 text-purple-200 transition"
                  title="Generate Recommendations for this User"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= USER DETAIL MODAL / DRAWER ================= */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[85vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {selectedUser.user_id}
                  </span>
                  {selectedUser.is_cold_start ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Cold-Start Profile
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Established History
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white font-heading">{selectedUser.display_name}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active City: {selectedUser.last_active_city || 'Unspecified'} · Profile City: {selectedUser.profile_city || 'Unspecified'}
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Top Action */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <div>
                  <h4 className="text-sm font-bold text-white">Generate Studio Matches</h4>
                  <p className="text-xs text-purple-200/80">
                    Run the explainable recommendation algorithm for {selectedUser.display_name}.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/recommendations?userId=${selectedUser.user_id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Recommendations</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Past Bookings Table */}
              <div>
                <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Historical Recording Sessions ({selectedUser.past_bookings.length})</span>
                </h3>

                {selectedUser.past_bookings.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-400">
                    No past bookings on record. This is a cold-start user.
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Studio</th>
                          <th className="py-2.5 px-3">City</th>
                          <th className="py-2.5 px-3">Format</th>
                          <th className="py-2.5 px-3 text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-300">
                        {selectedUser.past_bookings.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/20">
                            <td className="py-2.5 px-3 font-mono text-slate-400">{b.date}</td>
                            <td className="py-2.5 px-3 font-semibold text-white">
                              {b.studio_name || b.studio_id}
                            </td>
                            <td className="py-2.5 px-3">{b.studio_city || '—'}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 text-[10px] border border-purple-800/40">
                                {b.genre}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-400">
                              {b.studio_price ? `₹${b.studio_price}/hr` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Saved Studios */}
              <div>
                <h3 className="text-sm font-bold text-white font-heading mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400/20" />
                  <span>Wishlist & Saved Studios ({selectedUser.saved_studios.length})</span>
                </h3>

                {historyLoading ? (
                  <p className="text-xs text-slate-400">Loading saved studio metadata...</p>
                ) : userHistory && userHistory.saved_studios.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userHistory.saved_studios.map((st) => (
                      <div
                        key={st.studio_id}
                        onClick={() => setInspectedStudio(st)}
                        className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-mono text-[10px] text-purple-400">{st.studio_id}</span>
                            <span className="text-xs font-bold text-white">{st.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {st.city} · ₹{st.price_per_hour}/hr · ⭐ {st.rating}
                          </p>
                        </div>
                        <button className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs text-white">
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No studios currently saved.</p>
                )}
              </div>

              {/* Provenance note */}
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Synthetic profile provenance: </strong>
                  {selectedUser.notes || 'Synthetic user persona for engine benchmarking. Not an actual creator.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Studio Modal */}
      <StudioModal
        studio={inspectedStudio}
        isOpen={!!inspectedStudio}
        onClose={() => setInspectedStudio(null)}
      />
    </div>
  );
};
