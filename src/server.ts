import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './services/socketService';

// Controladores modernos
import { getSessions, createSession, getSessionLive, getDashboardStats, getReportData, getStudentHistory, updateStudent, deleteStudent } from './controllers/systemController';
import { getStudents, createStudent, scanAttendance } from './controllers/studentController';
import { login, register, updateProfile } from './controllers/authController';


const app = express();
const httpServer = createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar Socket.io (Mantenemos tu código en vivo)
initSocket(httpServer);

// --- RUTAS API ---


// Rutas de Autenticación
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.put('/api/auth/profile', updateProfile);

// Estudiantes y Escáner QR
app.get('/api/students', getStudents);
app.post('/api/students', createStudent);
app.put('/api/students/:id', updateStudent);
app.delete('/api/students/:id', deleteStudent);
app.post('/api/attendance/scan', scanAttendance);

// Sesiones y Dashboard
app.get('/api/sessions', getSessions);
app.post('/api/sessions', createSession);
app.get('/api/sessions/:id/live', getSessionLive);
app.get('/api/dashboard/stats', getDashboardStats);
app.get('/api/reports', getReportData);
app.get('/api/students/:id/history', getStudentHistory);
app.put('/api/students/:id', updateStudent);
app.delete('/api/students/:id', deleteStudent);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});