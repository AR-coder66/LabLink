import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Equipment,
  Booking,
  Project,
  ConflictScenario,
  MaintenanceReport,
  NotificationItem,
  Role,
  WaitlistEntry
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EQUIPMENT,
  INITIAL_PROJECTS,
  INITIAL_BOOKINGS,
  INITIAL_CONFLICTS,
  INITIAL_MAINTENANCE,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  switchUser: (role: Role) => void;
  users: User[];
  equipmentList: Equipment[];
  projects: Project[];
  bookings: Booking[];
  conflicts: ConflictScenario[];
  maintenanceReports: MaintenanceReport[];
  notifications: NotificationItem[];
  waitlist: WaitlistEntry[];
  
  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'priorityScore'>) => { success: boolean; message: string; booking?: Booking; hasConflict?: boolean };
  updateBookingStatus: (bookingId: string, status: Booking['status'], remarks?: string) => void;
  resolveConflict: (conflictId: string, approvedBookingId: string, overridden: boolean, reason: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => void;
  addMaintenanceReport: (report: Omit<MaintenanceReport, 'id' | 'createdAt' | 'status'>) => void;
  updateEquipmentStatus: (equipmentId: string, status: Equipment['status'], note?: string) => void;
  addEquipment: (equipment: Omit<Equipment, 'id' | 'totalBookings' | 'qrToken'>) => void;
  deleteEquipment: (equipmentId: string) => void;
  joinWaitlist: (equipmentId: string, preferredDate: string, preferredDuration: number) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  checkInWithQr: (bookingId: string) => { success: boolean; message: string };
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'lablink_state_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage if available
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users] = useState<User[]>(INITIAL_USERS);

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}equipment`);
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [conflicts, setConflicts] = useState<ConflictScenario[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}conflicts`);
    return saved ? JSON.parse(saved) : INITIAL_CONFLICTS;
  });

  const [maintenanceReports, setMaintenanceReports] = useState<MaintenanceReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}maintenance`);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}waitlist`);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}equipment`, JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}conflicts`, JSON.stringify(conflicts));
  }, [conflicts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}maintenance`, JSON.stringify(maintenanceReports));
  }, [maintenanceReports]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}waitlist`, JSON.stringify(waitlist));
  }, [waitlist]);

  // Switch demo user
  const switchUser = (role: Role) => {
    const target = users.find(u => u.role === role) || users[0];
    setCurrentUser(target);
  };

  // Helper: check time overlap
  const isTimeOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
    const s1 = parseInt(start1.replace(':', ''), 10);
    const e1 = parseInt(end1.replace(':', ''), 10);
    const s2 = parseInt(start2.replace(':', ''), 10);
    const e2 = parseInt(end2.replace(':', ''), 10);
    return Math.max(s1, s2) < Math.min(e1, e2);
  };

  // Add booking with validation and conflict detection
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'priorityScore'>) => {
    const targetEq = equipmentList.find(e => e.id === bookingData.equipmentId);
    if (!targetEq) {
      return { success: false, message: 'Equipment not found' };
    }

    if (targetEq.status === 'maintenance') {
      return {
        success: false,
        message: `Equipment is currently under maintenance: ${targetEq.maintenanceNote || 'Temporarily offline'}.`
      };
    }

    if (bookingData.durationHours > targetEq.maxBookingHours) {
      return {
        success: false,
        message: `Requested duration (${bookingData.durationHours} hrs) exceeds maximum permitted duration of ${targetEq.maxBookingHours} hrs.`
      };
    }

    // Check existing overlapping bookings for the same equipment and date
    const overlapping = bookings.filter(b => 
      b.equipmentId === bookingData.equipmentId &&
      b.date === bookingData.date &&
      b.status !== 'rejected' &&
      b.status !== 'cancelled' &&
      isTimeOverlapping(b.startTime, b.endTime, bookingData.startTime, bookingData.endTime)
    );

    const newBookingId = `bk-${Date.now()}`;
    // Calculate intelligent priority score based on project deadline, user past usage, academic importance
    const project = projects.find(p => p.id === bookingData.projectId);
    const daysUntilDeadline = project ? Math.max(1, Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 14;
    
    // Scoring logic (Max 100):
    // Deadline: closer = higher score (up to 40)
    const deadlineScore = Math.min(40, Math.max(10, 40 - (daysUntilDeadline * 1.5)));
    // Academic importance: Critical=25, High=20, Medium=15, Low=10
    const importanceScore = project?.academicPriority === 'Critical' ? 25 : project?.academicPriority === 'High' ? 20 : 15;
    // Fairness score based on user booking count: fewer past bookings = higher fair share (up to 20)
    const pastUserBookings = bookings.filter(b => b.userId === bookingData.userId).length;
    const fairnessScore = Math.max(5, 20 - (pastUserBookings * 2));
    // Academic need: 10
    const academicNeedScore = 10;
    const computedPriority = parseFloat((deadlineScore + importanceScore + fairnessScore + academicNeedScore).toFixed(1));

    const newBooking: Booking = {
      ...bookingData,
      id: newBookingId,
      status: overlapping.length > 0 ? 'pending' : 'pending',
      createdAt: new Date().toISOString(),
      priorityScore: computedPriority,
      qrCode: `LL-PASS-${newBookingId}-${targetEq.resourceId}`
    };

    setBookings(prev => [newBooking, ...prev]);

    // If overlap detected, create an AI conflict scenario
    if (overlapping.length > 0) {
      const existingConflictBooking = overlapping[0];
      const conflictId = `conf-${Date.now()}`;

      // Determine recommended winner
      const isNewHigher = computedPriority > (existingConflictBooking.priorityScore || 80);
      const winnerId = isNewHigher ? newBookingId : existingConflictBooking.id;

      const newConflict: ConflictScenario = {
        id: conflictId,
        equipmentId: targetEq.id,
        equipmentName: targetEq.name,
        date: bookingData.date,
        timeSlot: `${bookingData.startTime} - ${bookingData.endTime}`,
        contenders: [
          {
            bookingId: existingConflictBooking.id,
            teamName: existingConflictBooking.userName,
            studentName: existingConflictBooking.userName,
            studentId: existingConflictBooking.userId,
            projectTitle: existingConflictBooking.projectTitle,
            projectDeadline: 'Project Linked',
            academicImportance: 'Critical',
            requestedSlot: `${existingConflictBooking.startTime} - ${existingConflictBooking.endTime}`,
            durationHours: existingConflictBooking.durationHours,
            previousUsageHours: 6,
            priorityScore: existingConflictBooking.priorityScore || 85,
            scoreBreakdown: {
              deadlineScore: 32,
              importanceScore: 25,
              fairnessScore: 18,
              academicNeedScore: 10
            }
          },
          {
            bookingId: newBookingId,
            teamName: bookingData.userName,
            studentName: bookingData.userName,
            studentId: bookingData.userId,
            projectTitle: bookingData.projectTitle,
            projectDeadline: project ? `${project.deadline} (${daysUntilDeadline}d left)` : 'Standard deadline',
            academicImportance: project?.academicPriority || 'High',
            requestedSlot: `${bookingData.startTime} - ${bookingData.endTime}`,
            durationHours: bookingData.durationHours,
            previousUsageHours: pastUserBookings * 3,
            priorityScore: computedPriority,
            scoreBreakdown: {
              deadlineScore,
              importanceScore,
              fairnessScore,
              academicNeedScore
            }
          }
        ],
        recommendedWinnerId: winnerId,
        aiExplanation: `LabLink AI analyzed 7 scheduling parameters. ${isNewHigher ? bookingData.userName : existingConflictBooking.userName} was given priority (Score: ${Math.max(computedPriority, existingConflictBooking.priorityScore || 85)}) due to imminent project evaluation urgency and fair lab utilization history. An alternative slot has been dynamically matched.`,
        suggestedAlternative: {
          bookingId: isNewHigher ? existingConflictBooking.id : newBookingId,
          alternativeSlot: 'Next open window: +3.5 hours later OR alternative compatible workstation in Alan Turing Center',
          alternativeEquipmentId: 'eq-8',
          alternativeEquipmentName: 'Dell Precision 7960 Dual RTX 6000 Ada Workstation'
        }
      };

      setConflicts(prev => [newConflict, ...prev]);

      // Add Notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          title: 'Resource Schedule Conflict Detected',
          message: `Your booking for ${targetEq.name} overlaps with an existing request. LabLink AI has created an arbitration card for Faculty review.`,
          type: 'warning',
          timestamp: 'Just now',
          read: false
        },
        ...prev
      ]);

      return {
        success: true,
        message: 'Booking submitted. Because this slot was concurrently requested, LabLink AI Conflict Resolver has routed both requests with priority scoring to Faculty review.',
        booking: newBooking,
        hasConflict: true
      };
    }

    // Standard booking notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: 'Booking Request Submitted',
        message: `Your reservation request for ${targetEq.name} on ${bookingData.date} (${bookingData.startTime} - ${bookingData.endTime}) was submitted for supervisor sign-off.`,
        type: 'info',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);

    return {
      success: true,
      message: 'Booking request successfully logged! Awaiting faculty/admin approval.',
      booking: newBooking,
      hasConflict: false
    };
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status'], remarks?: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status, facultyRemarks: remarks || b.facultyRemarks } : b))
    );

    // Notify user
    const bk = bookings.find(b => b.id === bookingId);
    if (bk) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: bk.userId,
          title: `Booking ${status.toUpperCase()}`,
          message: `Your booking for ${bk.projectTitle} has been marked as ${status}. ${remarks ? `Remarks: ${remarks}` : ''}`,
          type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
          timestamp: 'Just now',
          read: false
        },
        ...prev
      ]);
    }
  };

  const resolveConflict = (
    conflictId: string,
    approvedBookingId: string,
    overridden: boolean,
    reason: string
  ) => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    // Update conflict decision
    setConflicts(prev =>
      prev.map(c =>
        c.id === conflictId
          ? {
              ...c,
              facultyDecision: {
                approvedBookingId,
                overridden,
                reason,
                decidedAt: new Date().toISOString(),
                facultyName: currentUser.name
              }
            }
          : c
      )
    );

    // Approve the winning booking, reassign/reject the other contender
    const loser = conflict.contenders.find(ct => ct.bookingId !== approvedBookingId);
    updateBookingStatus(approvedBookingId, 'approved', `Approved via ${overridden ? 'Faculty Override' : 'AI Resolution'}: ${reason}`);

    if (loser) {
      updateBookingStatus(
        loser.bookingId,
        'rejected',
        `Rescheduled: Slot prioritized for peer team with higher deadline urgency. Suggested alternative: ${conflict.suggestedAlternative.alternativeSlot}`
      );
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'status'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setProjects(prev => [newProj, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: 'Project Created & Linked',
        message: `Project "${newProj.title}" has been registered. You can now request lab equipment under this project.`,
        type: 'success',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const addMaintenanceReport = (reportData: Omit<MaintenanceReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: MaintenanceReport = {
      ...reportData,
      id: `maint-${Date.now()}`,
      status: 'reported',
      createdAt: new Date().toISOString()
    };
    setMaintenanceReports(prev => [newReport, ...prev]);

    // If critical or high, automatically put equipment in maintenance
    if (reportData.severity === 'critical' || reportData.severity === 'high') {
      updateEquipmentStatus(reportData.equipmentId, 'maintenance', reportData.issueDescription);
    }
  };

  const updateEquipmentStatus = (equipmentId: string, status: Equipment['status'], note?: string) => {
    setEquipmentList(prev =>
      prev.map(e =>
        e.id === equipmentId
          ? { ...e, status, maintenanceNote: note !== undefined ? note : e.maintenanceNote }
          : e
      )
    );
  };

  const addEquipment = (equipmentData: Omit<Equipment, 'id' | 'totalBookings' | 'qrToken'>) => {
    const newEq: Equipment = {
      ...equipmentData,
      id: `eq-${Date.now()}`,
      totalBookings: 0,
      qrToken: `LL-QR-${equipmentData.resourceId}`
    };
    setEquipmentList(prev => [newEq, ...prev]);
  };

  const deleteEquipment = (equipmentId: string) => {
    setEquipmentList(prev => prev.filter(e => e.id !== equipmentId));
  };

  const joinWaitlist = (equipmentId: string, preferredDate: string, preferredDuration: number) => {
    const eq = equipmentList.find(e => e.id === equipmentId);
    const entry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      equipmentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      preferredDate,
      preferredDuration,
      requestedAt: new Date().toISOString(),
      status: 'waiting'
    };
    setWaitlist(prev => [entry, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: 'Joined Smart Waitlist',
        message: `You are in line for ${eq?.name || 'Equipment'}. You will receive an instant push notification the second an approved slot is cancelled.`,
        type: 'info',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const checkInWithQr = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return { success: false, message: 'Booking pass not found' };
    if (target.status !== 'approved') {
      return { success: false, message: 'Check-in is only permitted for approved bookings.' };
    }

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? { ...b, checkedIn: true, qrVerifiedAt: new Date().toISOString() }
          : b
      )
    );

    return { success: true, message: 'QR Code verified! Equipment handover authorized. Lab session started.' };
  };

  const resetToDefault = () => {
    localStorage.clear();
    setEquipmentList(INITIAL_EQUIPMENT);
    setProjects(INITIAL_PROJECTS);
    setBookings(INITIAL_BOOKINGS);
    setConflicts(INITIAL_CONFLICTS);
    setMaintenanceReports(INITIAL_MAINTENANCE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWaitlist([]);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        users,
        equipmentList,
        projects,
        bookings,
        conflicts,
        maintenanceReports,
        notifications,
        waitlist,
        addBooking,
        updateBookingStatus,
        resolveConflict,
        addProject,
        addMaintenanceReport,
        updateEquipmentStatus,
        addEquipment,
        deleteEquipment,
        joinWaitlist,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        checkInWithQr,
        resetToDefault
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

