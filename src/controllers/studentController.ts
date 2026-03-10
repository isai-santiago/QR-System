import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({ orderBy: { firstName: 'asc' } });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, firstName, lastName, email, program, semester } = req.body;
    const newStudent = await prisma.student.create({
      data: { studentId, firstName, lastName, email, program, semester: Number(semester) || 1, status: "active" }
    });
    res.json(newStudent);
  } catch (error) {
    res.status(400).json({ error: "El estudiante ya existe o faltan datos" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedStudent = await prisma.student.update({
      where: { studentId: id },
      data: { ...data, semester: Number(data.semester) || 1 }
    });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el estudiante" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { studentId: id } });
    res.json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar el estudiante" });
  }
};

// Nueva función para registrar la asistencia desde el móvil del alumno
export const scanAttendance = async (req: Request, res: Response) => {
  try {
    const { email, qrPayload } = req.body;
    const parsedPayload = JSON.parse(qrPayload);
    const { sessionId } = parsedPayload;

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return res.status(404).json({ error: "Estudiante no encontrado en la base de datos." });

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.status !== 'active') return res.status(404).json({ error: "Sesión inactiva o finalizada." });

    // --- NUEVA VALIDACIÓN DE HORARIO ---
    const now = new Date();
    // Extraemos la hora actual en formato "HH:MM" (ej. "14:30")
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    if (currentTime < session.startTime || currentTime > session.endTime) {
      return res.status(400).json({ 
        error: `Fuera de horario. El registro solo es válido de ${session.startTime} a ${session.endTime}.` 
      });
    }
    // -----------------------------------

    await prisma.attendance.create({
      data: { studentId: student.studentId, sessionId: session.id }
    });

    res.json({ message: "Asistencia registrada exitosamente", student: student.firstName, session: session.title });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: "Ya habías registrado tu asistencia en esta clase." });
    res.status(400).json({ error: "QR Inválido o expirado." });
  }
};