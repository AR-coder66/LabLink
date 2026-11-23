import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment, Booking, Project } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  FolderPlus, 
  QrCode, 
  Cpu, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Flame,
  FileText
} from 'lucide-react';
import QRCode from 'qrcode';

interface StudentDashboardProps {
  onOpenBooking: (equipment: Equipment) => void;
  onExplore: () => void;
  onOpenAssistant: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenBooking,
  onExplore,
  onOpenAssistant
}) => {
  const { currentUser, bookings, projects, equipmentList, addProject, checkInWithQr } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'projects'>('overview');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // New Project Form State
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjDept, setNewProjDept] = useState(currentUser.department);
  const [newProjDeadline, setNewProjDeadline] = useState('2026-12-10');
  const [newProjPriority, setNewProjPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [newProjPurpose, setNewProjPurpose] = useState<'Capstone Final Year' | 'Faculty Research' | 'Course Assignment' | 'Hackathon & Innovation'>('Capstone Final Year');
  const [newProjMembers, setNewProjMembers] = useState(currentUser.name);

  // Student's specific data
  const myBookings = bookings.filter(b => b.userId === currentUser.id);
  const activeReservations = myBookings.filter(b => b.status === 'approved');
  const pendingReservations = myBookings.filter(b => b.status === 'pending');
  const myProjects = projects.filter(p => p.leadStudentId === currentUser.id || p.teamMembers.includes(currentUser.name));

  const handleOpenQrPass = async (b: Booking) => {
    setQrModalBooking(b);
    try {
      const url = await QRCode.toDataURL(`LABLINK-VERIFIED-PASS:${b.id}:${b.equipmentId}:${b.date}`, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0B1020',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;

    addProject({
      title: newProjTitle,
      description: newProjDesc,
      department: newProjDept,
      leadStudentId: currentUser.id,
      leadStudentName: currentUser.name,
      teamMembers: newProjMembers.split(',').map(s => s.trim()),
      deadline: newProjDeadline,
      academicPriority: newProjPriority,
      academicPurpose: newProjPurpose,
      requiredEquipmentIds: ['eq-1'],
      facultySupervisor: 'Dr. Evelyn Reed',
    });

    setProjectModalOpen(false);
    setNewProjTitle('');
    setNewProjDesc('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-surface-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            <span>Student Portal</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{currentUser.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            You have <strong className="text-emerald">{activeReservations.length} active approved reservations</strong> and {pendingReservations.length} pending conflict checks across campus research laboratories.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setProjectModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-hover border border-surface-border text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 text-primary" />
            Register Project
          </button>

          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-blue transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Book New Equipment
          </button>
        </div>

        {/* Ambient background ornament */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-primary/10 via-violet/5 to-transparent pointer-events-none" />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Approved Slots</span>
            <span className="p-2 rounded-xl bg-emerald/10 text-emerald">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{activeReservations.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">QR check-in passes ready</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Under AI Review</span>
            <span className="p-2 rounded-xl bg-amber/10 text-amber">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-light mt-2">{pendingReservations.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Priority scoring active</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Linked Projects</span>
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{myProjects.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Capstone & Innovation</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Fair Share Index</span>
            <span className="p-2 rounded-xl bg-violet/10 text-violet">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-violet-light mt-2">92.4</div>
          <p className="text-[11px] text-slate-500 mt-1">High priority status</p>
        </div>

      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview & Recent Equipment
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Reservations ({myBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'projects'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Academic Projects ({myProjects.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Active Bookings with Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Active & Upcoming Reservations
              </h2>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface border border-surface-border text-center">
                <p className="text-sm text-slate-400">You don't have any bookings yet.</p>
                <button
                  onClick={onExplore}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-white"
                >
                  Explore Laboratory Equipment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((bk) => {
                  const eq = equipmentList.find(e => e.id === bk.equipmentId);
                  const isApproved = bk.status === 'approved';
                  const isPending = bk.status === 'pending';

                  return (
                    <div
                      key={bk.id}
                      className="p-5 rounded-2xl bg-surface border border-surface-border hover:border-surface-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={eq?.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704'}
                          alt={eq?.name}
                          className="w-14 h-14 rounded-xl object-cover border border-surface-border shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-primary font-bold">
                              {eq?.resourceId || 'EQUIP-01'}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                                isApproved
                                  ? 'bg-emerald/20 text-emerald-light border border-emerald/30'
                                  : isPending
                                  ? 'bg-amber/20 text-amber-light border border-amber/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {bk.status}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1">
                            {eq?.name || 'Scientific Instrument'}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {bk.date}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5" /> {bk.startTime} - {bk.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-surface-border">
                        {isApproved && (
                          <button
                            onClick={() => handleOpenQrPass(bk)}
                            className="px-3.5 py-2 rounded-xl bg-emerald/15 hover:bg-emerald/25 text-emerald-light border border-emerald/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <QrCode className="w-4 h-4" />
                            Digital Pass
                          </button>
                        )}
                        {isPending && (
                          <span className="text-[11px] text-amber-light px-2.5 py-1 rounded bg-amber/10 border border-amber/20">
                            Awaiting Faculty Sign-off
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: AI Project Helper & Quick Equipment Suggestions */}
          <div className="space-y-6">
            
            {/* Quick AI Project Assist Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-violet/20 via-surface to-surface border border-violet/30 space-y-3">
              <div className="flex items-center gap-2 text-violet-light text-xs font-semibold">
                <Sparkles className="w-4 h-4" /> Need Advice on Available Lab Gear?
              </div>
              <h3 className="text-base font-bold text-white">Ask "Find My Lab" AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Describe your research goal in natural language. Our AI maps your requirements against active lab capacity and suggests conflict-free schedules.
              </p>
              <button
                onClick={onOpenAssistant}
                className="w-full mt-2 py-2.5 rounded-xl bg-violet hover:bg-violet-hover text-white text-xs font-bold transition-all shadow-glow-violet flex items-center justify-center gap-2"
              >
                Launch AI Assistant <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recently Added Campus Instruments */}
            <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> Popular Campus Resources
              </h3>
              <div className="space-y-3">
                {equipmentList.slice(0, 3).map((eq) => (
                  <div
                    key={eq.id}
                    onClick={() => onOpenBooking(eq)}
                    className="p-3 rounded-xl bg-surface-secondary/70 hover:bg-surface-hover border border-surface-border cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-semibold text-white truncate">{eq.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{eq.department}</div>
                    </div>
                    <span className="text-[10px] text-primary font-semibold shrink-0">Book &rarr;</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: MY BOOKINGS TABLE */}
      {activeTab === 'bookings' && (
        <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden">
          <div className="p-6 border-b border-surface-border">
            <h2 className="text-lg font-bold text-white">Full Booking Archive & Pass Verification</h2>
            <p className="text-xs text-slate-400 mt-1">Review your past lab sessions, approved QR codes, and faculty notes.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface-card text-[11px] uppercase tracking-wider text-slate-400 font-mono border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Project Purpose</th>
                  <th className="px-6 py-4">Priority Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {myBookings.map((b) => {
                  const eq = equipmentList.find(e => e.id === b.equipmentId);
                  return (
                    <tr key={b.id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{eq?.name}</div>
                        <div className="text-[11px] text-slate-400">{eq?.location}</div>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <div>{b.date}</div>
                        <div className="text-slate-400">{b.startTime} - {b.endTime}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {b.purpose}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-primary-light">
                        {b.priorityScore || '88.5'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'approved' ? 'bg-emerald/20 text-emerald-light' : 'bg-amber/20 text-amber-light'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status === 'approved' ? (
                          <button
                            onClick={() => handleOpenQrPass(b)}
                            className="px-3 py-1.5 rounded-lg bg-emerald/20 text-emerald-light hover:bg-emerald/30 font-semibold"
                          >
                            View QR Pass
                          </button>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MY PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Academic Project Portfolios</h2>
              <p className="text-xs text-slate-400">All equipment reservations must be tethered to an approved project for AI priority calculation.</p>
            </div>
            <button
              onClick={() => setProjectModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light font-mono font-semibold">
                      {p.academicPurpose}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose/20 text-rose-light font-bold">
                      {p.academicPriority} Urgency
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3 line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Deadline:</span>
                    <span className="font-mono text-white font-semibold">{p.deadline}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Supervisor:</span>
                    <span className="text-slate-200">{p.facultySupervisor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Pass Modal */}
      {qrModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-surface border border-surface-border rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border text-xs text-slate-400">
              <span className="font-mono uppercase font-bold text-emerald">Verified Lab Access Pass</span>
              <button
                onClick={() => setQrModalBooking(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Digital Physical Handover Pass</h3>
              <p className="text-xs text-slate-400 mt-1">
                Scan at the laboratory supervisor terminal or door scanner to unlock workstation.
              </p>
            </div>

            {/* The QR Image */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Access Pass" className="w-48 h-48 mx-auto" />}
            </div>

            <div className="text-xs font-mono text-slate-300 bg-surface-card p-2.5 rounded-xl border border-surface-border">
              PASS TOKEN: {qrModalBooking.qrCode || `LL-PASS-${qrModalBooking.id}`}
            </div>

            {/* Simulate scan check-in */}
            <button
              onClick={() => {
                const res = checkInWithQr(qrModalBooking.id);
                alert(res.message);
                setQrModalBooking(null);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simulate Terminal Scan & Check-in
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-primary" /> Register Academic Project
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Real-Time Autonomous Drone Obstacle Avoidance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Explain your methodology and why specialized equipment is required..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-white text-xs resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Academic Purpose</label>
                  <select
                    value={newProjPurpose}
                    onChange={(e) => setNewProjPurpose(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  >
                    <option value="Capstone Final Year">Capstone Final Year</option>
                    <option value="Faculty Research">Faculty Research</option>
                    <option value="Course Assignment">Course Assignment</option>
                    <option value="Hackathon & Innovation">Hackathon & Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Academic Priority</label>
                  <select
                    value={newProjPriority}
                    onChange={(e) => setNewProjPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  >
                    <option value="Critical">Critical (Thesis Due Soon)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Final Deadline</label>
                  <input
                    type="date"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Team Members (comma sep)</label>
                  <input
                    type="text"
                    value={newProjMembers}
                    onChange={(e) => setNewProjMembers(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

