import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment, EquipmentCategory } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowUpDown,
  BookOpen,
  CalendarPlus,
  HelpCircle
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

const CATEGORIES: EquipmentCategory[] = [
  'Electronics & Embedded Systems',
  'Robotics',
  'AI & Machine Learning',
  'Computing & GPU Workstations',
  'Mechanical Equipment',
  '3D Printing',
  'Networking & IoT'
];

interface EquipmentMarketplaceProps {
  onSelectBooking: (equipment: Equipment) => void;
  onJoinWaitlist: (equipment: Equipment) => void;
}

export const EquipmentMarketplace: React.FC<EquipmentMarketplaceProps> = ({
  onSelectBooking,
  onJoinWaitlist
}) => {
  const { equipmentList } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'duration'>('popularity');
  const [selectedEquipmentForDetails, setSelectedEquipmentForDetails] = useState<Equipment | null>(null);

  // Filtered & Sorted equipment list
  const filteredEquipment = useMemo(() => {
    return equipmentList
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          Object.values(item.specs).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesDepartment = selectedDepartment === 'all' || item.department === selectedDepartment;
        const matchesAvailability = selectedAvailability === 'all' || item.status === selectedAvailability;

        return matchesSearch && matchesCategory && matchesDepartment && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') {
          return b.totalBookings - a.totalBookings;
        } else if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'duration') {
          return b.maxBookingHours - a.maxBookingHours;
        }
        return 0;
      });
  }, [equipmentList, searchQuery, selectedCategory, selectedDepartment, selectedAvailability, sortBy]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Cpu className="w-4 h-4" /> Campus Inventory ({equipmentList.length} Units)
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Laboratory Equipment Marketplace</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore and reserve verified university machinery, AI clusters, cleanroom instrumentation, and testing rigs across all research centers.
          </p>
        </div>

        {/* Quick count chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-slate-300">
            Showing <strong className="text-white">{filteredEquipment.length}</strong> instruments
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by instrument name, specs (e.g. H100, 6061 aluminum, 26.5 GHz), ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Department Filter */}
          <div className="min-w-[200px]">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Departments (8)</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="busy">In Use / Busy</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[170px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors"
            >
              <option value="popularity">Most Booked (Popular)</option>
              <option value="name">Equipment Name (A-Z)</option>
              <option value="duration">Max Booking Duration</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white font-medium'
                : 'bg-surface-secondary text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white font-medium'
                  : 'bg-surface-secondary text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-surface border border-surface-border p-8">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No laboratory equipment matched your criteria</h3>
          <p className="text-sm text-slate-400 mt-1">Try resetting filters or adjusting your keywords.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDepartment('all');
              setSelectedAvailability('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-surface-secondary text-xs text-primary-light hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((eq) => {
            const isAvailable = eq.status === 'available';
            const isMaintenance = eq.status === 'maintenance';
            const isBusy = eq.status === 'busy';

            return (
              <div
                key={eq.id}
                className="group rounded-2xl bg-surface border border-surface-border hover:border-primary/40 transition-all flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image Header with status badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />
                  
                  {/* Status Tag */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-1.5 shadow-sm ${
                        isAvailable
                          ? 'bg-emerald/20 text-emerald-light border-emerald/40'
                          : isMaintenance
                          ? 'bg-rose/20 text-rose-light border-rose/40'
                          : 'bg-amber/20 text-amber-light border-amber/40'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAvailable ? 'bg-emerald animate-pulse' : isMaintenance ? 'bg-rose' : 'bg-amber'
                        }`}
                      />
                      {isAvailable ? 'Available' : isMaintenance ? 'Under Repair' : 'In Use'}
                    </span>
                  </div>

                  {/* Resource ID Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[11px] border border-white/10">
                      {eq.resourceId}
                    </span>
                  </div>

                  {/* Category Pill on image */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-md bg-surface/90 text-slate-300 text-[11px] border border-surface-border">
                      {eq.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-primary-light transition-colors line-clamp-1">
                      {eq.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{eq.location}</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {eq.description}
                    </p>

                    {/* Key Technical Specifications Pill grid */}
                    <div className="mt-4 pt-3 border-t border-surface-border grid grid-cols-2 gap-2 text-[11px]">
                      {Object.entries(eq.specs).slice(0, 2).map(([key, val]) => (
                        <div key={key} className="bg-surface-secondary/70 p-2 rounded-lg border border-surface-border/60">
                          <span className="text-slate-400 block truncate">{key}</span>
                          <span className="text-white font-medium block truncate mt-0.5">{val}</span>
                        </div>
                      ))}
                    </div>

                    {isMaintenance && eq.maintenanceNote && (
                      <div className="mt-3 p-2 rounded-lg bg-rose/10 border border-rose/30 text-rose-light text-[11px] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{eq.maintenanceNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta & Booking Trigger */}
                  <div className="mt-5 pt-3 border-t border-surface-border flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Max: <strong className="text-slate-200">{eq.maxBookingHours}h</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAvailable ? (
                        <button
                          onClick={() => onSelectBooking(eq)}
                          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-glow-blue transition-all flex items-center gap-1.5"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          Book Slot
                        </button>
                      ) : isBusy ? (
                        <button
                          onClick={() => onJoinWaitlist(eq)}
                          className="px-3.5 py-2 rounded-xl bg-amber/15 hover:bg-amber/25 text-amber-light border border-amber/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          Join Waitlist
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-2 rounded-xl bg-surface-secondary text-slate-500 text-xs font-semibold cursor-not-allowed"
                        >
                          Offline
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

