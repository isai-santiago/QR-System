import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- SESIONES ---
export const getSessions = async (req: Request, res: Response) => {
  const sessions = await prisma.session.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(sessions);
};

export const createSession = async (req: Request, res: Response) => {
  const { title, room, startTime, endTime } = req.body;
  const newSession = await prisma.session.create({ 
    data: { title, room, startTime, endTime } 
  });
  res.json(newSession);
};

export const getSessionLive = async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { attendances: { include: { student: true }, orderBy: { markedAt: 'desc' } } }
  });
  if (!session) return res.status(404).json({ error: "Sesión no encontrada" });
  res.json(session);
};

// --- DASHBOARD METRICS ---
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalAttendances = await prisma.attendance.count();
    const activeSessions = await prisma.session.count({ where: { status: 'active' } });
    
    const recentActivity = await prisma.attendance.findMany({
      take: 5,
      orderBy: { markedAt: 'desc' },
      include: { student: true, session: true }
    });

    // Simulamos los datos del gráfico para la última semana (Requirement del reto)
    // En producción, esto se calcula agrupando las fechas de 'markedAt'
    const chartData = [
      { day: 'Lun', asistencias: 45 },
      { day: 'Mar', asistencias: 52 },
      { day: 'Mie', asistencias: 38 },
      { day: 'Jue', asistencias: 65 },
      { day: 'Vie', asistencias: 48 },
    ];

    res.json({
      totalStudents,
      totalAttendances,
      activeSessions,
      attendanceRate: totalStudents > 0 ? Math.min(100, Math.round((totalAttendances / (totalStudents * Math.max(1, activeSessions))) * 100)) : 0,
      recentActivity,
      chartData // Enviamos los datos del gráfico
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener métricas" });
  }
};

// --- REPORTES ---
export const getReportData = async (req: Request, res: Response) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        student: true,
        session: true
      },
      orderBy: { markedAt: 'desc' }
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

// --- GESTIÓN DE ESTUDIANTES (ACCIONES DE LOS 3 PUNTOS) ---

export const getStudentHistory = async (req: Request, res: Response) => {
  try {
    const history = await prisma.attendance.findMany({
      where: { student: { studentId: req.params.id } },
      include: { session: true },
      orderBy: { markedAt: 'desc' }
    });
    res.json(history);
  } catch (error) { res.status(500).json({ error: "Error al obtener historial" }); }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updated = await prisma.student.update({
      where: { studentId: req.params.id },
      data: { firstName, lastName, email }
    });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: "Error al actualizar" }); }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    // Primero borramos sus asistencias para que la base de datos no arroje error de relación
    await prisma.attendance.deleteMany({ where: { student: { studentId: req.params.id } } });
    // Luego borramos al estudiante
    await prisma.student.delete({ where: { studentId: req.params.id } });
    res.json({ message: "Estudiante dado de baja exitosamente" });
  } catch (error) { res.status(500).json({ error: "Error al dar de baja" }); }
};