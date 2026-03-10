// src/data/mockData.ts
import { DashboardData, Session, Attendance } from '../types';

export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Clase 15: Hooks Avanzados',
    subject: 'Desarrollo Frontend',
    instructor: 'Prof. Garcia',
    room: 'Lab A-301',
    scheduledStart: new Date(new Date().setHours(14, 0, 0)),
    scheduledEnd: new Date(new Date().setHours(16, 0, 0)),
    qrCode: 'token-inicial-xyz',
    qrCodeExpiry: new Date(new Date().getTime() + 15000),
    status: 'active',
    maxCapacity: 30,
    attendanceRequired: true
  },
  {
    id: '2',
    title: 'Introducción a Bases de Datos',
    subject: 'Backend I',
    instructor: 'Prof. Garcia',
    room: 'Aula B-102',
    scheduledStart: new Date(new Date().setHours(16, 30, 0)),
    scheduledEnd: new Date(new Date().setHours(18, 0, 0)),
    qrCode: '',
    qrCodeExpiry: new Date(),
    status: 'scheduled',
    maxCapacity: 45,
    attendanceRequired: true
  }
];

export const mockDashboardData: DashboardData = {
  todaySummary: {
    totalSessions: 4,
    activeSessions: 1,
    totalAttendances: 128,
    avgAttendanceRate: 85.5
  },
  recentAttendances: [
    { id: 'a1', sessionId: '1', studentId: '2024-001', markedAt: new Date(), method: 'qr', status: 'present', verified: true, studentName: 'Ana López' },
    { id: 'a2', sessionId: '1', studentId: '2024-005', markedAt: new Date(Date.now() - 60000), method: 'qr', status: 'present', verified: true, studentName: 'Carlos Ruiz' },
    { id: 'a3', sessionId: '1', studentId: '2024-012', markedAt: new Date(Date.now() - 120000), method: 'qr', status: 'late', lateMinutes: 5, verified: true, studentName: 'Maria González' },
  ],
  upcomingSessions: mockSessions,
  attendanceStats: [
    { sessionId: '1', totalEnrolled: 30, totalPresent: 25, totalLate: 2, totalAbsent: 3, attendanceRate: 90, avgArrivalTime: 4, onTimeRate: 88 }
  ],
  alerts: [
    { id: 'al1', type: 'low_attendance', message: 'Baja asistencia en "Matemáticas Discretas" ayer', severity: 'warning', timestamp: new Date() }
  ]
};