import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Calendar,
  Search,
  Zap,
  BarChart3,
  Bot
} from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onViewResolver: () => void;
  onOpenAssistant: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore, onViewResolver, onOpenAssistant }) => {
  const { equipmentList, conflicts } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture'>('overview');

  return (
    <div className="min-h-screen text-slate-100 bg-[#0B1020] selection:bg-primary/30">
      
      {/* Ambient background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/15 via-violet/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[400px] bg-violet/10 blur-[130px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-secondary/80 border border-primary/30 text-xs font-medium text-slate-300 shadow-glass mb-8 animate-fadeDown">
          <span className="flex h-2 w-2 rounded-full bg-emerald animate-ping" />
          <span className="text-white font-semibold">Campus AI Infrastructure</span>
          <span className="text-slate-500">•</span>
          <span className="text-primary-light">Multi-Department Lab Sync</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Your Campus Labs. <br />
          <span className="gradient-text-primary">One Connected Platform.</span>
        </h1>

        {/* Tagline & Subtext */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          <strong className="text-white">One Campus. Infinite Possibilities. Shared Resources.</strong> <br />
          Discover cutting-edge H100 AI clusters, KUKA industrial arms, and 3D fabrication suites. 
          LabLink intelligently resolves equipment contention with deterministic deadline-aware AI allocation.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base shadow-glow-blue transition-all flex items-center gap-2 group"
          >
            Explore Resources
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onViewResolver}
            className="px-6 py-3.5 rounded-xl bg-surface-secondary hover:bg-surface-hover border border-surface-border text-slate-200 font-semibold text-base transition-all flex items-center gap-2 hover:border-violet/50"
          >
            <Sparkles className="w-4 h-4 text-violet-light" />
            See How AI Resolves Conflicts
          </button>

          <button
            onClick={onOpenAssistant}
            className="px-6 py-3.5 rounded-xl bg-violet/10 hover:bg-violet/20 border border-violet/30 text-violet-light font-semibold text-base transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            Ask "Find My Lab" AI
          </button>
        </div>

        {/* STATS COUNTER - Clearly marked as demo figures */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl glass-panel border border-surface-border text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">120+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Lab Resources</div>
            <div className="text-[10px] text-slate-500 mt-1">Institutional Demo Metric</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-surface-border text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">8</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Departments</div>
            <div className="text-[10px] text-slate-500 mt-1">Cross-Campus Network</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-surface-border text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-violet-light">95%</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Resource Visibility</div>
            <div className="text-[10px] text-slate-500 mt-1">Zero Idle Workstations</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-surface-border text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald">24/7</div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Booking Access</div>
            <div className="text-[10px] text-slate-500 mt-1">Digital QR Check-in</div>
          </div>
        </div>

        {/* Interactive Dashboard Sneak Peek */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-surface-border bg-surface-card p-3 shadow-2xl overflow-hidden group">
          <div className="flex items-center justify-between px-4 py-2 border-b border-surface-border bg-surface text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose/60 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber/60 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald/60 inline-block" />
              <span className="ml-2 font-mono text-slate-300">lablink.campus.internal/live-dashboard</span>
            </div>
            <span className="font-semibold text-emerald flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" /> Live Campus Dispatch Active
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left bg-surface/50">
            
            {/* Active Conflict Tile */}
            <div className="p-4 rounded-xl bg-surface-secondary/80 border border-violet/30 hover:border-violet/60 transition-all">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-violet/20 text-violet-light font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Conflict Engine
                </span>
                <span className="text-[10px] text-slate-400">2 Contenders</span>
              </div>
              <h4 className="font-semibold text-white text-sm">NVIDIA H100 GPU Contention</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Team Alpha (Deadline: Nov 25) vs Team Beta (Deadline: Nov 28). AI scored urgency at 92.4 vs 84.1.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-surface-border/50">
                <span className="text-emerald text-[11px] font-medium">Auto-Reassigned Beta to RTX 6000</span>
                <button onClick={onViewResolver} className="text-primary text-xs hover:underline flex items-center gap-1">
                  Inspect <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Live Utilization Tile */}
            <div className="p-4 rounded-xl bg-surface-secondary/80 border border-surface-border">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light font-medium flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Lab Occupancy
                </span>
                <span className="text-[10px] text-emerald font-mono">87% Active</span>
              </div>
              <h4 className="font-semibold text-white text-sm">Alan Turing AI Center</h4>
              <p className="text-xs text-slate-400 mt-1">
                4 nodes occupied. Next slot on Supernode H100 begins 1:30 PM.
              </p>
              <div className="mt-3 w-full bg-surface-card rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            {/* QR Check-in preview */}
            <div className="p-4 rounded-xl bg-surface-secondary/80 border border-surface-border">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald/20 text-emerald font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Instant Check-in
                </span>
                <span className="text-[10px] text-slate-400">Ready</span>
              </div>
              <h4 className="font-semibold text-white text-sm">KUKA KR6 Industrial Arm</h4>
              <p className="text-xs text-slate-400 mt-1">
                Reserved by Priya Venkatesh. Digital cryptographically signed pass generated.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-surface-border/50">
                <span className="text-slate-400 text-[11px]">Valid until 17:00</span>
                <span className="text-emerald font-mono text-[11px]">PASS #BK-103</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* CORE CAPABILITIES SECTION */}
      <section className="py-20 bg-surface/40 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Engineered for Modern University Ecosystems
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Eliminate siloed laboratory equipment, spreadsheet waitlists, and cross-department scheduling disputes with automated transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Universal Equipment Discovery</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Browse detailed technical specifications, current availability, lab locations, and booking requirements across 8 departments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-violet/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Conflict Arbitration</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Deterministic mathematical scoring factors in project evaluation deadlines, academic criticality, past hours, and alternative gear.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-emerald/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">"Find My Lab" Assistant</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Tell the AI your thesis or hackathon idea in plain English. It creates a personalized multi-lab equipment roadmap and slot schedule.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-amber/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Role-Based Governance</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Dedicated interfaces for Students, Faculty Supervisors, and Lab Admins with override power, maintenance tracking, and QR passes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-xs font-mono uppercase tracking-widest font-semibold">Workflow Blueprint</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            From Research Concept to Lab Access in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          <div className="relative p-6 rounded-2xl bg-surface border border-surface-border">
            <span className="text-4xl font-black text-slate-700/60 font-mono">01</span>
            <h4 className="text-base font-bold text-white mt-2">Discover or Describe</h4>
            <p className="text-xs text-slate-400 mt-1">
              Search the 16+ catalog items or type your project prompt in the AI Lab Assistant to discover compatible hardware.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-surface border border-surface-border">
            <span className="text-4xl font-black text-slate-700/60 font-mono">02</span>
            <h4 className="text-base font-bold text-white mt-2">Select Slot & Project</h4>
            <p className="text-xs text-slate-400 mt-1">
              Select your required time window and link your registered Capstone or research milestone.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-surface border border-surface-border">
            <span className="text-4xl font-black text-slate-700/60 font-mono">03</span>
            <h4 className="text-base font-bold text-white mt-2">AI Conflict Check</h4>
            <p className="text-xs text-slate-400 mt-1">
              If another team requests the same slot, the AI evaluates 7 fairness parameters and recommends the optimal distribution.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl bg-surface border border-surface-border">
            <span className="text-4xl font-black text-slate-700/60 font-mono">04</span>
            <h4 className="text-base font-bold text-white mt-2">QR Pass & Session</h4>
            <p className="text-xs text-slate-400 mt-1">
              Faculty signs off, your digital QR check-in pass generates, and you scan into the lab workstation seamlessly.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-surface-border bg-surface-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-base">LabLink</span>
              <span className="text-xs text-slate-400 ml-2">Intelligent University Lab Resource Platform</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button onClick={onExplore} className="hover:text-white transition-colors">Catalog</button>
            <button onClick={onViewResolver} className="hover:text-white transition-colors">AI Arbitration</button>
            <button onClick={onOpenAssistant} className="hover:text-white transition-colors">Find My Lab</button>
            <span>v2.0 Production Demo</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-surface-border/40 text-center text-xs text-slate-500">
          Built for academic laboratory cross-department sharing and conflict resolution.
        </div>
      </footer>

    </div>
  );
};

