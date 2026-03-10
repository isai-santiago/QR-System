// src/types.ts

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  program: string;
  semester: number;
  status: "active" | "inactive" | "suspended";
  enrollmentDate: Date;
  lastActive?: Date;
}

export interface Session {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  room: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  qrCode: string;
  qrCodeExpiry: Date;
  status: "scheduled" | "active" | "completed" | "cancelled";
  maxCapacity: number;
  attendanceRequired: boolean;
  description?: string;
  materials?: string[];
}

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  markedAt: Date;
  method: "qr" | "manual";
  status: "present" | "late" | "absent";
  lateMinutes?: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  notes?: string;
  verified: boolean;
  // Propiedad extendida para UI (opcional si haces join en backend)
  studentName?: string; 
}

export interface AttendanceStats {
  sessionId: string;
  totalEnrolled: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  attendanceRate: number;
  avgArrivalTime: number;
  onTimeRate: number;
}

export interface DashboardData {
  todaySummary: {
    totalSessions: number;
    activeSessions: number;
    totalAttendances: number;
    avgAttendanceRate: number;
  };
  recentAttendances: Attendance[];
  upcomingSessions: Session[];
  attendanceStats: AttendanceStats[];
  alerts: {
    id: string;
    type: "low_attendance" | "session_ending" | "qr_expired" | "system";
    message: string;
    severity: "info" | "warning" | "error";
    sessionId?: string;
    timestamp: Date;
  }[];
}