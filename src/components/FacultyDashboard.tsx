import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Calendar, 
  User, 
  ShieldCheck, 
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FacultyDashboardProps {
  onGoToConflictResolver: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onGoToConflictResolver }) => {
  const { currentUser, bookings, projects, conflicts, updateBookingStatus } = useApp();

  const [filterDept, setFilterDept] = useState<string>('all');
  const [remarkModalBooking, setRemarkModalBooking] = useState<Booking | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');

  const handleOpenRemarkModal = (b: Booking, type: 'approved' | 'rejected') => {
    setRemarkModalBooking(b);
    setActionType(type);
    setRemarkText(type === 'approved' ? 'Approved for research milestone testing.' : 'Slot overlap or prerequisites incomplete.');
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkModalBooking) return;
    updateBookingStatus(remarkModalBooking.id, actionType, remarkText);
    setRemarkModalBooking(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet font-semibold uppercase tracking-wider">
            <span>Faculty Supervisor Interface</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Faculty Laboratory Review Portal
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Evaluate student project access requests, review deterministic AI schedule recommendations, and sign off on equipment usage.
          </p>
        </div>

        {conflicts.length > 0 && (
          <button
            onClick={onGoToConflictResolver}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet to-primary hover:opacity-95 text-white text-xs font-bold shadow-glow-violet transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Resolve Pending Conflicts ({conflicts.length})
          </button>
        )}
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Pending Review</span>
            <span className="p-2 rounded-xl bg-amber/10 text-amber">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-light mt-2">{pendingBookings.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting approval or changes</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Conflicts</span>
            <span className="p-2 rounded-xl bg-rose/10 text-rose">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-rose-light mt-2">{conflicts.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requires arbitration sign-off</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Supervised Projects</span>
            <span className="p-2 rounded-xl bg-violet/10 text-violet">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{projects.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active Capstone cohorts</p>
        </div>
      </div>

      {/* Main Review Section: Pending Requests */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-xl">
        <div className="p-6 bg-surface-card border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-violet" />
              Incoming Student Access & Booking Requests
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review project relevance, requested duration, and AI priority score before authorization.
            </p>
          </div>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No pending reservation requests right now.
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {pendingBookings.map((b) => {
              const proj = projects.find(p => p.id === b.projectId);

              return (
                <div key={b.id} className="p-6 hover:bg-surface-secondary/30 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{b.userName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({b.userDepartment})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet/20 text-violet-light font-mono font-bold">
                        AI Score: {b.priorityScore || '88.0'}
                      </span>
                      {proj && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-slate-300">
                          Due: {proj.deadline}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-semibold text-primary-light">
                      Project: {b.projectTitle}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      <strong>Purpose:</strong> {b.purpose}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {b.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {b.startTime} - {b.endTime} ({b.durationHours} hrs)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleOpenRemarkModal(b, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-surface-secondary hover:bg-rose/20 text-slate-300 hover:text-rose-light border border-surface-border text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject / Modify
                    </button>
                    <button
                      onClick={() => handleOpenRemarkModal(b, 'approved')}
                      className="px-5 py-2 rounded-xl bg-emerald hover:bg-emerald-dark text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Slot
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Remark Modal */}
      {remarkModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              {actionType === 'approved' ? 'Confirm Approval & Note' : 'Decline Request & Provide Feedback'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter comments or safety instructions for {remarkModalBooking.userName}.
            </p>

            <form onSubmit={handleConfirmDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Supervisor Remarks</label>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-xs text-white resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRemarkModalBooking(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl font-bold text-xs ${
                    actionType === 'approved'
                      ? 'bg-emerald text-slate-950'
                      : 'bg-rose text-white'
                  }`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

