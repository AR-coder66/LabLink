import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment, EquipmentCategory } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Wrench, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers,
  MapPin,
  Clock,
  Scale
} from 'lucide-react';
import { DEPARTMENTS, LAB_LOCATIONS } from '../data/mockData';

const COLORS = ['#527BFF', '#9875FF', '#10B981', '#F59E0B', '#F43F5E', '#38BDF8', '#A855F7', '#EC4899'];

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    equipmentList, 
    bookings, 
    maintenanceReports, 
    updateEquipmentStatus, 
    addEquipment, 
    deleteEquipment,
    addMaintenanceReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'maintenance' | 'fairness'>('analytics');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);

  // New Equipment Form State
  const [newName, setNewName] = useState('');
  const [newResId, setNewResId] = useState('');
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]);
  const [newLoc, setNewLoc] = useState(LAB_LOCATIONS[0]);
  const [newCat, setNewCat] = useState<EquipmentCategory>('AI & Machine Learning');
  const [newMaxHours, setNewMaxHours] = useState(4);
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80');

  // New Maintenance Report State
  const [selectedEqForMaint, setSelectedEqForMaint] = useState(equipmentList[0]?.id || '');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintSeverity, setMaintSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  // Chart 1: Equipment utilization by bookings count
  const mostUsedEquipmentData = equipmentList.slice(0, 7).map(e => ({
    name: e.name.split(' ').slice(0, 3).join(' '),
    bookings: e.totalBookings,
  }));

  // Chart 2: Department-wise distribution
  const departmentStats = DEPARTMENTS.map(dept => {
    const count = equipmentList.filter(e => e.department === dept).length;
    return { name: dept.split(' ')[0], value: count || 1 };
  });

  // Chart 3: Weekly Booking Trends
  const bookingTrendsData = [
    { day: 'Mon', bookings: 24, hours: 82 },
    { day: 'Tue', bookings: 38, hours: 140 },
    { day: 'Wed', bookings: 45, hours: 165 },
    { day: 'Thu', bookings: 41, hours: 152 },
    { day: 'Fri', bookings: 52, hours: 190 },
    { day: 'Sat', bookings: 29, hours: 95 },
    { day: 'Sun', bookings: 14, hours: 48 },
  ];

  // Chart 4: Resource Fairness Index across departments
  const departmentFairnessData = [
    { department: 'CS & AI', requestedHours: 140, allocatedHours: 125, fairnessRatio: 89 },
    { department: 'Robotics', requestedHours: 110, allocatedHours: 102, fairnessRatio: 92 },
    { department: 'Mechanical', requestedHours: 85, allocatedHours: 80, fairnessRatio: 94 },
    { department: 'Electronics', requestedHours: 70, allocatedHours: 68, fairnessRatio: 97 },
    { department: 'Aerospace', requestedHours: 65, allocatedHours: 58, fairnessRatio: 89 },
    { department: 'Networks', requestedHours: 40, allocatedHours: 39, fairnessRatio: 98 },
  ];

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newResId.trim()) return;

    addEquipment({
      name: newName,
      resourceId: newResId,
      department: newDept,
      location: newLoc,
      category: newCat,
      status: 'available',
      maxBookingHours: newMaxHours,
      description: newDesc,
      image: newImg,
      supervisor: currentUser.name,
      specs: {
        'Controller': 'Campus Central Lab Node',
        'Standard': 'Industrial Grade v2.4'
      }
    });

    setAddModalOpen(false);
    setNewName('');
    setNewResId('');
    setNewDesc('');
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipmentList.find(e => e.id === selectedEqForMaint);
    if (!eq || !maintDesc.trim()) return;

    addMaintenanceReport({
      equipmentId: eq.id,
      equipmentName: eq.name,
      reportedBy: currentUser.name,
      reporterRole: currentUser.role,
      issueDescription: maintDesc,
      severity: maintSeverity
    });

    setMaintenanceModalOpen(false);
    setMaintDesc('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald font-semibold uppercase tracking-wider">
            <span>Central Lab Operations</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Campus Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Laboratory Administrator Control Center
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time analytics, equipment commissioning, preventative maintenance pipelines, and multi-department fairness governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setMaintenanceModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-hover border border-surface-border text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Wrench className="w-4 h-4 text-amber" />
            Log Maintenance
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Equipment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-emerald text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Utilization Analytics
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'inventory'
              ? 'bg-emerald text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Equipment ({equipmentList.length})
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'maintenance'
              ? 'bg-emerald text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Maintenance Pipeline ({maintenanceReports.length})
        </button>
        <button
          onClick={() => setActiveTab('fairness')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'fairness'
              ? 'bg-emerald text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Fairness Meter
        </button>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Most Used Equipment */}
            <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> Most Utilized Campus Instruments
                </h3>
                <p className="text-xs text-slate-400">Cumulative total reservations booked</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostUsedEquipmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2B48" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#131B2E', borderColor: '#1F2B48', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="bookings" fill="#527BFF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Weekly Booking Trends */}
            <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald" /> Weekly Lab Occupancy Trends
                </h3>
                <p className="text-xs text-slate-400">Total lab hours logged per day</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2B48" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#131B2E', borderColor: '#1F2B48', borderRadius: 8, fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Department Breakdown Pie & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet" /> Department Inventory Spread
              </h3>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#131B2E', borderColor: '#1F2B48', borderRadius: 8, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 rounded-3xl bg-surface border border-surface-border flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Institutional Efficiency Metrics</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time statistics across all eight university faculties.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Total Equipment</span>
                    <div className="text-2xl font-bold text-white mt-1">{equipmentList.length} Units</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Active Reservations</span>
                    <div className="text-2xl font-bold text-emerald mt-1">{bookings.length} Booked</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Maintenance Rate</span>
                    <div className="text-2xl font-bold text-amber-light mt-1">
                      {((equipmentList.filter(e => e.status === 'maintenance').length / equipmentList.length) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-surface-border mt-4 text-xs text-slate-300">
                💡 <strong>Admin Tip:</strong> Peak laboratory hours campus-wide occur on Thursday & Friday afternoons (1:00 PM – 5:00 PM). Schedule preventative calibration during Monday mornings for zero disruption.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Full Laboratory Equipment Registry</h2>
              <p className="text-xs text-slate-400 mt-0.5">Change availability status, inspect serial tags, or decommission instruments.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-surface-card text-[11px] uppercase tracking-wider text-slate-400 font-mono border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4">Resource ID & Name</th>
                  <th className="px-6 py-4">Department & Lab</th>
                  <th className="px-6 py-4">Status Toggle</th>
                  <th className="px-6 py-4">Max Slot</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {equipmentList.map((eq) => (
                  <tr key={eq.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-primary text-[11px] font-bold">{eq.resourceId}</div>
                      <div className="font-semibold text-white mt-0.5">{eq.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-200">{eq.department}</div>
                      <div className="text-[11px] text-slate-400">{eq.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={eq.status}
                        onChange={(e) => updateEquipmentStatus(eq.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none border ${
                          eq.status === 'available'
                            ? 'bg-emerald/15 text-emerald border-emerald/30'
                            : eq.status === 'maintenance'
                            ? 'bg-rose/15 text-rose border-rose/30'
                            : 'bg-amber/15 text-amber border-amber/30'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="busy">In Use (Busy)</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {eq.maxBookingHours} hrs
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${eq.name} from catalog?`)) {
                            deleteEquipment(eq.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose hover:bg-rose/10 transition-colors"
                        title="Delete Equipment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE PIPELINE */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Reported Hardware Faults & Maintenance Log</h2>
              <p className="text-xs text-slate-400">Reports filed by students and technicians.</p>
            </div>
            <button
              onClick={() => setMaintenanceModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber hover:bg-amber-dark text-slate-950 font-bold text-xs"
            >
              + File Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maintenanceReports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-surface border border-surface-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rep.equipmentName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    rep.severity === 'critical' ? 'bg-rose/20 text-rose' : 'bg-amber/20 text-amber'
                  }`}>
                    {rep.severity} Severity
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rep.issueDescription}
                </p>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reported by: {rep.reportedBy} ({rep.reporterRole})</span>
                  <span className="font-mono text-emerald font-semibold uppercase">{rep.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE FAIRNESS METER */}
      {activeTab === 'fairness' && (
        <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/20 text-violet-light text-xs font-mono font-bold mb-2">
              <Scale className="w-3.5 h-3.5" /> Campus Equity Algorithm v2.1
            </div>
            <h2 className="text-lg font-bold text-white">Cross-Department Resource Fairness Index</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Monitors Gini coefficient and distribution ratio to ensure no single engineering department monopolizes campus high-performance compute or rapid fabrication tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentFairnessData.map((d) => (
              <div key={d.department} className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{d.department}</h4>
                  <span className="text-xs font-mono font-bold text-emerald">
                    {d.fairnessRatio}% Ratio
                  </span>
                </div>

                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald rounded-full"
                    style={{ width: `${d.fairnessRatio}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Req: {d.requestedHours}h</span>
                  <span>Allocated: <strong className="text-white">{d.allocatedHours}h</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Commission New Equipment</h3>
            <p className="text-xs text-slate-400 mb-4">Add a new physical lab instrument to the student discovery directory.</p>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Instrument Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Oxford Cryostat 4K Superconducting Probe"
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Resource ID *</label>
                  <input
                    type="text"
                    value={newResId}
                    onChange={(e) => setNewResId(e.target.value)}
                    placeholder="CRYO-OXF-01"
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Slot Hours</label>
                  <input
                    type="number"
                    value={newMaxHours}
                    min={1}
                    max={12}
                    onChange={(e) => setNewMaxHours(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Robotics">Robotics</option>
                    <option value="3D Printing">3D Printing</option>
                    <option value="Mechanical Equipment">Mechanical Equipment</option>
                    <option value="Electronics & Embedded Systems">Electronics & Embedded Systems</option>
                    <option value="Networking & IoT">Networking & IoT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Laboratory Location</label>
                <select
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                >
                  {LAB_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald hover:bg-emerald-dark text-slate-950 font-bold rounded-xl"
                >
                  Commission Instrument
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Maintenance Modal */}
      {maintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Log Maintenance & Repair Order</h3>
            <p className="text-xs text-slate-400 mb-4">Flags equipment status and prevents student bookings.</p>

            <form onSubmit={handleCreateMaintenance} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Equipment</label>
                <select
                  value={selectedEqForMaint}
                  onChange={(e) => setSelectedEqForMaint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                >
                  {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.resourceId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
                <select
                  value={maintSeverity}
                  onChange={(e) => setMaintSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs"
                >
                  <option value="low">Low (Cosmetic / Calibration check)</option>
                  <option value="medium">Medium (Component replacement)</option>
                  <option value="high">High (Auto-offline)</option>
                  <option value="critical">Critical (Immediate shutdown)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issue Description *</label>
                <textarea
                  rows={3}
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  placeholder="e.g. Laser alignment error on SLA optics. Technician called..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-card border border-surface-border text-white text-xs resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setMaintenanceModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber hover:bg-amber-dark text-slate-950 font-bold rounded-xl"
                >
                  Log & Update Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

