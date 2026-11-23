import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { EquipmentMarketplace } from './components/EquipmentMarketplace';
import { AIConflictResolver } from './components/AIConflictResolver';
import { FindMyLabAssistant } from './components/FindMyLabAssistant';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { NotificationPanel } from './components/NotificationPanel';
import { Equipment, Booking } from './types';
import confetti from 'canvas-confetti';

export function App() {
  const { currentUser, joinWaitlist } = useApp();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Success Banner State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleOpenBooking = (eq: Equipment) => {
    setSelectedEquipmentForBooking(eq);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (booking: Booking, hasConflict?: boolean) => {
    if (hasConflict) {
      triggerToast(
        `Slot requested! Concurrent demand detected. LabLink AI Conflict Resolver has scored the priority and forwarded to Faculty.`
      );
      // Take user to AI resolver to inspect
      setCurrentView('ai-resolver');
    } else {
      triggerToast(
        `Reservation submitted for ${booking.projectTitle}! Awaiting supervisor authorization.`
      );
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleJoinWaitlist = (eq: Equipment) => {
    joinWaitlist(eq.id, new Date().toISOString().split('T')[0], 3);
    triggerToast(`Added to the smart priority waitlist for ${eq.name}!`);
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-primary/30 selection:text-white">
      
      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Floating Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-surface-card border border-primary/50 text-white p-4 rounded-2xl shadow-glow-blue animate-bounce flex items-start gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <div className="text-xs leading-relaxed flex-1">{toastMessage}</div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onExplore={() => setCurrentView('explore')}
            onViewResolver={() => setCurrentView('ai-resolver')}
            onOpenAssistant={() => setCurrentView('find-my-lab')}
          />
        )}

        {currentView === 'explore' && (
          <EquipmentMarketplace
            onSelectBooking={handleOpenBooking}
            onJoinWaitlist={handleJoinWaitlist}
          />
        )}

        {currentView === 'ai-resolver' && (
          <AIConflictResolver />
        )}

        {currentView === 'find-my-lab' && (
          <FindMyLabAssistant
            onSelectBooking={handleOpenBooking}
          />
        )}

        {currentView === 'dashboard' && (
          <>
            {currentUser.role === 'student' && (
              <StudentDashboard
                onOpenBooking={handleOpenBooking}
                onExplore={() => setCurrentView('explore')}
                onOpenAssistant={() => setCurrentView('find-my-lab')}
              />
            )}

            {currentUser.role === 'faculty' && (
              <FacultyDashboard
                onGoToConflictResolver={() => setCurrentView('ai-resolver')}
              />
            )}

            {currentUser.role === 'admin' && (
              <AdminDashboard />
            )}
          </>
        )}
      </main>

      {/* Interactive Booking Modal */}
      <BookingModal
        equipment={selectedEquipmentForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />

      {/* Notification Drawer */}
      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToConflict={() => setCurrentView('ai-resolver')}
      />

    </div>
  );
}

export default App;

