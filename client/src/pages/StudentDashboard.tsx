import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { LogOut, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const userEmail = localStorage.getItem('user_email') || '';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const onScan = async (result: string) => {
    if (status !== 'idle') return; // Evita escaneos múltiples accidentales
    
    try {
        const response = await axios.post('/api/attendance/scan', {
        email: userEmail,
        qrPayload: result
      });
      setStatus('success');
      setMessage(`¡Hola ${response.data.student}! ${response.data.message}`);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || "Error al procesar el código QR.");
      setTimeout(() => setStatus('idle'), 4000); // Reiniciar el escáner tras 4 segundos
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col transition-colors duration-300">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2 font-bold text-xl">
          <QrCode className="text-blue-500"/> AttendSys Estudiante
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 font-medium bg-red-400/10 px-4 py-2 rounded-xl transition-colors hover:bg-red-400/20">
          <LogOut size={18}/> Salir
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Registrar Asistencia</h1>
          <p className="text-gray-400">Apunta la cámara al código proyectado por el profesor.</p>
        </div>

        {status === 'idle' && (
          <div className="w-full aspect-square bg-gray-800 rounded-3xl overflow-hidden border-4 border-gray-700 shadow-2xl relative">
            <Scanner onScan={(result) => onScan(result[0].rawValue)} />
          </div>
        )}

        {status === 'success' && (
          <div className="w-full bg-green-500/10 border border-green-500/30 p-8 rounded-3xl flex flex-col items-center text-center animate-[popUp_0.3s_ease-out]">
            <CheckCircle2 size={64} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">Asistencia Confirmada</h2>
            <p className="text-gray-300">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full bg-red-500/10 border border-red-500/30 p-8 rounded-3xl flex flex-col items-center text-center animate-[popUp_0.3s_ease-out]">
            <AlertCircle size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Acceso Denegado</h2>
            <p className="text-gray-300">{message}</p>
          </div>
        )}
      </main>
      <style>{`
        @keyframes popUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export { StudentDashboard };