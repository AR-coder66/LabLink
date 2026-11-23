import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  Layers, 
  Check, 
  Info, 
  Calendar,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIConflictResolver: React.FC = () => {
  const { conflicts, resolveConflict, currentUser } = useApp();
  const [selectedConflictId, setSelectedConflictId] = useState<string>(conflicts[0]?.id || '');
  const [overrideModalOpen, setOverrideModalOpen] = useState<boolean>(false);
  const [overrideTargetWinner, setOverrideTargetWinner] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');

  const activeConflict = conflicts.find(c => c.id === selectedConflictId) || conflicts[0];

  const handleApplyAIRecommendation = () => {
    if (!activeConflict) return;
    resolveConflict(
      activeConflict.id,
      activeConflict.recommendedWinnerId,
      false,
      'Approved as recommended by LabLink Deterministic Multi-Parameter AI Scoring Engine.'
    );
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      // ignore
    }
  };

  const handleFacultyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConflict || !overrideTargetWinner || !overrideReason.trim()) return;

    resolveConflict(
      activeConflict.id,
      overrideTargetWinner,
      true,
      overrideReason
    );
    setOverrideModalOpen(false);
    setOverrideReason('');
  };

  if (!activeConflict) {
    return (
      <div className="py-16 px-4 max-w-4xl mx-auto text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">All Resource Scheduling Clear!</h2>
        <p className="text-slate-400 mt-2 text-sm">
          No concurrent equipment contentions or booking overlaps in the queue right now.
        </p>
      </div>
    );
  }

  const winnerContender = activeConflict.contenders.find(
    c => c.bookingId === activeConflict.recommendedWinnerId
  );
  const secondaryContender = activeConflict.contenders.find(
    c => c.bookingId !== activeConflict.recommendedWinnerId
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet/20 via-surface to-primary/10 border border-violet/30 shadow-glass">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/30 text-xs font-semibold text-violet-light mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Signature AI Arbitration Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            LabLink AI Conflict Resolver
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Deterministic multi-variable prioritization model with natural language arbitration. Evaluates submission deadlines, academic urgency, equipment substitution, and fair usage history.
          </p>
        </div>

        {/* Conflict selector dropdown if multiple */}
        {conflicts.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Dispute:</span>
            <select
              value={selectedConflictId}
              onChange={(e) => setSelectedConflictId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-secondary border border-surface-border text-xs text-white focus:outline-none"
            >
              {conflicts.map((c, idx) => (
                <option key={c.id} value={c.id}>
                  Dispute #{idx + 1}: {c.equipmentName.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Decision Status Banner if already settled */}
      {activeConflict.facultyDecision && (
        <div className="p-4 rounded-2xl bg-emerald/10 border border-emerald/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">
                Dispute Settled by {activeConflict.facultyDecision.facultyName} (
                {activeConflict.facultyDecision.overridden ? 'Faculty Manual Override' : 'AI Recommendation Enforced'}
                )
              </div>
              <p className="text-xs text-emerald-light/90 mt-0.5">
                Note: {activeConflict.facultyDecision.reason}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 shrink-0 font-mono">
            {new Date(activeConflict.facultyDecision.decidedAt).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Main Conflict Detail Card */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-2xl">
        
        {/* Header summary of contested resource */}
        <div className="p-6 bg-surface-card border-b border-surface-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-primary" /> {activeConflict.date}
              <span className="text-slate-600">•</span>
              <Clock className="w-3.5 h-3.5 text-primary" /> {activeConflict.timeSlot}
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Contested Resource: {activeConflict.equipmentName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-rose/20 text-rose-light border border-rose/30 text-xs font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> 2 Overlapping Requests
            </span>
          </div>
        </div>

        {/* 2-Column Contenders Comparison */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface/50">
          {activeConflict.contenders.map((contender) => {
            const isWinner = contender.bookingId === activeConflict.recommendedWinnerId;

            return (
              <div
                key={contender.bookingId}
                className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isWinner
                    ? 'bg-primary/10 border-primary/50 shadow-glow-blue'
                    : 'bg-surface-secondary/70 border-surface-border'
                }`}
              >
                {/* AI Recommendation Stamp */}
                {isWinner && (
                  <div className="absolute -top-3 right-6">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Recommended Priority Winner
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                        Applicant Team
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{contender.teamName}</h3>
                      <p className="text-xs text-slate-400">Student ID: {contender.studentId}</p>
                    </div>

                    {/* Overall Score Circle */}
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-primary-light">
                        {contender.priorityScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block -mt-1">/ 100 PTS</span>
                    </div>
                  </div>

                  {/* Project details */}
                  <div className="mt-4 p-3.5 rounded-xl bg-surface/80 border border-surface-border text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Registered Project</span>
                      <span className="text-white font-medium">{contender.projectTitle}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-border/50">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Project Deadline</span>
                        <span className={`font-semibold ${isWinner ? 'text-rose-light' : 'text-slate-200'}`}>
                          {contender.projectDeadline}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Academic Importance</span>
                        <span className="font-semibold text-emerald-light">{contender.academicImportance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scoring breakdown bars */}
                  <div className="mt-4 space-y-2 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                      Deterministic Score Vector Breakdown
                    </span>
                    
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>Deadline Urgency Weight</span>
                        <span className="font-mono text-white">{contender.scoreBreakdown.deadlineScore} / 40</span>
                      </div>
                      <div className="h-1.5 bg-surface-card rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(contender.scoreBreakdown.deadlineScore / 40) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>Academic Milestone Urgency</span>
                        <span className="font-mono text-white">{contender.scoreBreakdown.importanceScore} / 25</span>
                      </div>
                      <div className="h-1.5 bg-surface-card rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet rounded-full"
                          style={{ width: `${(contender.scoreBreakdown.importanceScore / 25) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                        <span>Fair Campus Share (Fewer Past Hours)</span>
                        <span className="font-mono text-white">{contender.scoreBreakdown.fairnessScore} / 20</span>
                      </div>
                      <div className="h-1.5 bg-surface-card rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald rounded-full"
                          style={{ width: `${(contender.scoreBreakdown.fairnessScore / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-surface-border text-xs text-slate-400 flex items-center justify-between">
                  <span>Usage this month: <strong className="text-white">{contender.previousUsageHours} hrs</strong></span>
                  <span className="font-mono text-[11px]">Requested: {contender.durationHours} hrs</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* AI Synthesis & Solution Timeline */}
        <div className="p-6 bg-surface-secondary/40 border-t border-surface-border space-y-4">
          
          <div className="p-4 rounded-2xl bg-surface border border-violet/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-violet/10 text-violet shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                LabLink AI Natural Language Arbitration
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {activeConflict.aiExplanation}
              </p>
            </div>
          </div>

          {/* Alternative Slot Proposal Card */}
          <div className="p-4 rounded-2xl bg-surface-card border border-emerald/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-light font-bold">
                  Zero-Waste Alternative Slot Found
                </span>
                <div className="text-xs sm:text-sm font-medium text-white">
                  For {secondaryContender?.teamName}:
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {activeConflict.suggestedAlternative.alternativeSlot}
                </div>
              </div>
            </div>

            <div className="text-right sm:shrink-0">
              <span className="text-[11px] px-2.5 py-1 rounded bg-emerald/10 text-emerald-light border border-emerald/20 font-medium">
                Compatible Match: RTX 6000 Ada (96GB VRAM)
              </span>
            </div>
          </div>

          {/* Action buttons (Only enabled if pending decision) */}
          {!activeConflict.facultyDecision ? (
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setOverrideTargetWinner(secondaryContender?.bookingId || '');
                  setOverrideModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-secondary border border-surface-border text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber" />
                Faculty Manual Override...
              </button>

              <button
                onClick={handleApplyAIRecommendation}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-blue transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Approve & Execute AI Allocation
              </button>
            </div>
          ) : (
            <div className="pt-2 text-right">
              <span className="text-xs text-slate-400">
                This dispute has been resolved and bookings have been automatically synced.
              </span>
            </div>
          )}

        </div>

      </div>

      {/* Manual Override Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Faculty Override Authority</h3>
            </div>
            <p className="text-xs text-slate-400">
              Overriding an AI recommendation logs your university faculty ID and reason for audit compliance.
            </p>

            <form onSubmit={handleFacultyOverride} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Prioritized Winner
                </label>
                <select
                  value={overrideTargetWinner}
                  onChange={(e) => setOverrideTargetWinner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-xs text-white"
                  required
                >
                  {activeConflict.contenders.map(c => (
                    <option key={c.bookingId} value={c.bookingId}>
                      {c.teamName} ({c.projectTitle.slice(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Academic Justification / Recorded Reason *
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Approved Team Beta due to urgent physical robot hardware flight-test scheduled for tomorrow morning..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber hover:bg-amber-dark text-slate-950 font-bold text-xs"
                >
                  Confirm Override Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

