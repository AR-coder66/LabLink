import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment, Booking } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface BookingModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, hasConflict?: boolean) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, projects, bookings, addBooking } = useApp();

  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState<string>('10:00');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || '');
  const [purpose, setPurpose] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !equipment) return null;

  // Calculate end time
  const getEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(':').map(Number);
    const endH = h + duration;
    return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const calculatedEndTime = getEndTime(startTime, durationHours);

  // Check live overlaps on the fly for UI feedback
  const existingEquipmentBookings = bookings.filter(
    b => b.equipmentId === equipment.id && b.date === date && b.status !== 'rejected' && b.status !== 'cancelled'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!purpose.trim()) {
      setErrorMsg('Please describe your academic purpose and workload requirements.');
      return;
    }

    const selectedProj = projects.find(p => p.id === projectId);

    const res = addBooking({
      equipmentId: equipment.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userDepartment: currentUser.department,
      projectId: selectedProj?.id,
      projectTitle: selectedProj ? selectedProj.title : 'Independent Lab Investigation',
      date,
      startTime,
      endTime: calculatedEndTime,
      durationHours,
      purpose,
    });

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      if (res.booking) {
        onSuccess(res.booking, res.hasConflict);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface-border bg-surface-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Reserve Equipment Slot
              </h3>
              <p className="text-xs text-slate-400">Intelligent conflict-checked booking request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Equipment Quick Summary */}
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-surface-border flex items-center gap-4">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-14 h-14 rounded-lg object-cover border border-surface-border"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-primary bg-primary/15 px-1.5 py-0.5 rounded border border-primary/25">
                  {equipment.resourceId}
                </span>
                <span className="text-[11px] text-slate-400">{equipment.location}</span>
              </div>
              <h4 className="text-sm font-semibold text-white truncate mt-0.5">{equipment.name}</h4>
              <p className="text-xs text-slate-400">Max slot duration: <span className="text-slate-200 font-medium">{equipment.maxBookingHours} hrs</span></p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose/10 border border-rose/30 text-rose-light text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Date & Start Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" /> Booking Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-card border border-surface-border text-white text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-card border border-surface-border text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM (High Demand)</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Slot Duration: <span className="text-primary font-bold">{durationHours} Hours</span>
              </label>
              <span className="text-xs text-slate-400">Time window: {startTime} – {calculatedEndTime}</span>
            </div>
            <input
              type="range"
              min={1}
              max={equipment.maxBookingHours}
              value={durationHours}
              onChange={(e) => setDurationHours(parseInt(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-secondary rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 hr</span>
              <span>Max allowed: {equipment.maxBookingHours} hrs</span>
            </div>
          </div>

          {/* Project Linkage */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald" /> Link to Registered Academic Project
              </span>
              <span className="text-[11px] text-emerald-light">Used for AI Priority Calculation</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-card border border-surface-border text-white text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title} (Deadline: {proj.deadline} | Priority: {proj.academicPriority})
                </option>
              ))}
            </select>
          </div>

          {/* Purpose & Workload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Academic Purpose & Technical Justification *
            </label>
            <textarea
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Need 80GB VRAM to run 4-bit quantized LLaMA-3 LoRA fine-tuning for thesis deadline on Nov 25..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-card border border-surface-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary transition-colors resize-none"
              required
            />
          </div>

          {/* Day's existing slots warning indicator */}
          {existingEquipmentBookings.length > 0 && (
            <div className="p-3 rounded-xl bg-violet/10 border border-violet/30 text-xs">
              <div className="flex items-center gap-2 text-violet-light font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Existing reservations on {date}:</span>
              </div>
              <div className="space-y-1 mt-1 text-slate-300">
                {existingEquipmentBookings.map((b) => (
                  <div key={b.id} className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-slate-200">{b.startTime} - {b.endTime}</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{b.userName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface text-[10px] uppercase text-amber font-mono">{b.status}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Note: If your time slot overlaps, the <strong>LabLink AI Conflict Resolver</strong> will score your deadline and academic need to determine priority.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-glow-blue transition-all flex items-center gap-2"
            >
              Confirm Reservation Request
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

