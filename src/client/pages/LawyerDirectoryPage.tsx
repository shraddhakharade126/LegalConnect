import React, { useState, useEffect } from 'react';
import { api } from '../api/index.ts';
import { Lawyer, LegalDomain } from '../types/index.ts';
import { LawyerCard } from '../components/LawyerCard.tsx';
import { BookingModal } from '../components/BookingModal.tsx';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  DollarSign,
} from 'lucide-react';

interface LawyerDirectoryPageProps {
  navigate: (path: string) => void;
  initialParams?: URLSearchParams;
}

export const LawyerDirectoryPage: React.FC<LawyerDirectoryPageProps> = ({
  navigate,
  initialParams,
}) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [categories, setCategories] = useState<LegalDomain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  // Filter states
  const [search, setSearch] = useState<string>(initialParams?.get('search') || '');
  const [domain, setDomain] = useState<string>(initialParams?.get('domain') || '');
  const [city, setCity] = useState<string>(initialParams?.get('city') || '');
  const [minExp, setMinExp] = useState<string>('');
  const [maxFee, setMaxFee] = useState<number>(300);
  const [minRating, setMinRating] = useState<string>('');
  const [sort, setSort] = useState<string>('rating');

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.domains || []));
  }, []);

  const loadLawyers = async () => {
    setLoading(true);
    try {
      const res = await api.getLawyers({
        search: search.trim() || undefined,
        domain: domain || undefined,
        city: city || undefined,
        minExp: minExp ? Number(minExp) : undefined,
        maxFee: maxFee ? Number(maxFee) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        sort,
      });
      setLawyers(res.lawyers || []);
    } catch (err) {
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLawyers();
  }, [domain, minExp, maxFee, minRating, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLawyers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setDomain('');
    setCity('');
    setMinExp('');
    setMaxFee(300);
    setMinRating('');
    setSort('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Verified Advocate Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified counsel across jurisdictions with transparent upfront consultation fees
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="md:hidden px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-medium p-2 border border-slate-300 rounded-xl bg-white text-slate-800 outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="fee_asc">Consultation Fee: Low to High</option>
              <option value="fee_desc">Consultation Fee: High to Low</option>
              <option value="exp_desc">Court Experience: Most Senior</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Header Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by lawyer name, law firm, practice area, court admission, or bar registration number..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                loadLawyers();
              }}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {/* Grid: Filters Sidebar + Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filters Sidebar */}
        <aside
          className={`md:block bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 ${
            filterDrawerOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-600" /> Filter Advocates
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Practice Area / Domain */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Practice Area
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 outline-none"
            >
              <option value="">All Practice Areas</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Jurisdiction / City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              City / State
            </label>
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={loadLawyers}
                placeholder="E.g., New York, CA, Chicago"
                className="w-full text-xs p-2.5 pl-8 border border-slate-300 rounded-xl outline-none"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Minimum Court Experience
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { label: 'Any experience', value: '' },
                { label: '5+ years experience', value: '5' },
                { label: '10+ years senior counsel', value: '10' },
                { label: '15+ years veteran advocate', value: '15' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="minExp"
                    checked={minExp === opt.value}
                    onChange={() => setMinExp(opt.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Consultation Fee */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <span>Max Fee</span>
              <span className="text-amber-700 font-bold">${maxFee} / session</span>
            </div>
            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$50</span>
              <span>$200</span>
              <span>$350+</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Client Rating
            </label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { label: 'All ratings', value: '' },
                { label: '4.5+ Stars', value: '4.5' },
                { label: '4.8+ Stars (Top Rated)', value: '4.8' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === opt.value}
                    onChange={() => setMinRating(opt.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Lawyer Cards Results */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{lawyers.length}</strong> verified
              practitioners
            </span>
            <span className="text-emerald-700 flex items-center gap-1 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> All Advocates Independently Audited
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
              <span className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>Filtering verified advocate registry...</span>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">No advocates matched your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try adjusting your maximum fee threshold, practice area, or location to see more
                  verified counsel.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-semibold rounded-xl hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {lawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer._id}
                  lawyer={lawyer}
                  onViewProfile={(id) => navigate(`/lawyer-profile/${id}`)}
                  onBook={(l) => {
                    setSelectedLawyer(l);
                    setIsBookingOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      <BookingModal
        lawyer={selectedLawyer}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={(aptId) => {
          setIsBookingOpen(false);
          navigate(`/consultations/${aptId}`);
        }}
      />
    </div>
  );
};
