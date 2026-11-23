export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar: string;
  rollNumberOrStaffId: string;
  joinedDate: string;
}

export type EquipmentCategory =
  | 'Electronics & Embedded Systems'
  | 'Robotics'
  | 'AI & Machine Learning'
  | 'Computing & GPU Workstations'
  | 'Mechanical Equipment'
  | '3D Printing'
  | 'Networking & IoT';

export type AvailabilityStatus = 'available' | 'busy' | 'maintenance' | 'reserved';

export interface Equipment {
  id: string;
  resourceId: string;
  name: string;
  category: EquipmentCategory;
  department: string;
  location: string;
  status: AvailabilityStatus;
  maxBookingHours: number;
  specs: Record<string, string>;
  image: string;
  description: string;
  hourlyRate?: number;
  totalBookings: number;
  maintenanceNote?: string;
  supervisor: string;
  qrToken: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  userRole: Role;
  userDepartment: string;
  projectId?: string;
  projectTitle: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g., "10:00"
  endTime: string; // e.g., "13:00"
  durationHours: number;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
  facultyRemarks?: string;
  priorityScore?: number;
  checkedIn?: boolean;
  qrVerifiedAt?: string;
  qrCode?: string;
  qrToken?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  department: string;
  leadStudentId: string;
  leadStudentName: string;
  teamMembers: string[];
  deadline: string; // YYYY-MM-DD
  academicPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  academicPurpose: 'Capstone Final Year' | 'Faculty Research' | 'Course Assignment' | 'Hackathon & Innovation';
  requiredEquipmentIds: string[];
  status: 'planning' | 'approved' | 'active' | 'completed';
  facultySupervisor: string;
  facultyComments?: string;
  createdAt: string;
}

export interface ConflictScenario {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  timeSlot: string;
  contenders: {
    bookingId: string;
    teamName: string;
    studentName: string;
    studentId: string;
    projectTitle: string;
    projectDeadline: string;
    academicImportance: 'Critical' | 'High' | 'Medium' | 'Low';
    requestedSlot: string;
    durationHours: number;
    previousUsageHours: number;
    priorityScore: number;
    scoreBreakdown: {
      deadlineScore: number;
      importanceScore: number;
      fairnessScore: number;
      academicNeedScore: number;
    };
  }[];
  recommendedWinnerId: string;
  aiExplanation: string;
  suggestedAlternative: {
    bookingId: string;
    alternativeSlot: string;
    alternativeEquipmentId?: string;
    alternativeEquipmentName?: string;
  };
  facultyDecision?: {
    approvedBookingId: string;
    overridden: boolean;
    reason: string;
    decidedAt: string;
    facultyName: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface MaintenanceReport {
  id: string;
  equipmentId: string;
  equipmentName: string;
  reportedBy: string;
  reporterRole: Role;
  issueDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'in-review' | 'repaired';
  createdAt: string;
  resolutionNote?: string;
}

export interface WaitlistEntry {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  preferredDate: string;
  preferredDuration: number;
  requestedAt: string;
  status: 'waiting' | 'notified' | 'expired';
}

