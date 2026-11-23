import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Shield, Sparkles, UserCheck, Bell, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenNotifications }) => {
  const { currentUser, switchUser, notifications, resetToDefault } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">Lab<span className="text-primary">Link</span></span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary-light border border-primary/30 font-mono font-medium">AI 2.0</span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Campus Laboratory Resource Platform</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-card px-2 py-1 rounded-full border border-surface-border text-sm">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'landing' ? 'bg-primary text-white font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('explore')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'explore' ? 'bg-primary text-white font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            Explore Labs
          </button>
          <button
            onClick={() => setCurrentView('ai-resolver')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
              currentView === 'ai-resolver' ? 'bg-violet text-white font-medium' : 'text-violet-light hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-light" />
            AI Conflict Resolver
          </button>
          <button
            onClick={() => setCurrentView('find-my-lab')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'find-my-lab' ? 'bg-primary text-white font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            Find My Lab AI
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              currentView === 'dashboard' ? 'bg-emerald text-white font-medium' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Right Demo Switcher & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="hidden lg:flex items-center gap-1 bg-surface p-1 rounded-lg border border-surface-border text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-primary" /> Role:
            </span>
            {(['student', 'faculty', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  switchUser(r);
                  setCurrentView('dashboard');
                }}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                  currentUser.role === r
                    ? r === 'student'
                      ? 'bg-primary text-white shadow-sm'
                      : r === 'faculty'
                      ? 'bg-violet text-white shadow-sm'
                      : 'bg-emerald text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-surface text-slate-300 hover:text-white hover:bg-surface-secondary border border-surface-border transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset demo data to default clean state?')) {
                resetToDefault();
              }
            }}
            className="p-2 rounded-lg bg-surface text-slate-400 hover:text-amber hover:bg-surface-secondary border border-surface-border transition-colors"
            title="Reset Seed Demo Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 pl-2 border-l border-surface-border cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-primary/40 object-cover"
            />
            <div className="hidden sm:block text-left text-xs">
              <div className="font-semibold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  currentUser.role === 'student' ? 'bg-primary' : currentUser.role === 'faculty' ? 'bg-violet' : 'bg-emerald'
                }`} />
                {currentUser.role}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

