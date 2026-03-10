import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Users, RefreshCw, ListChecks, UserPlus, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function LiveSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null); // Referencia para el botón "Ver lista"
  
  const [sessionData, setSessionData] = useState<any>(null);
  const [qrToken, setQrToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);

  // --- FUNCIÓN: GENERAR NUEVO CÓDIGO ---
  const generateNewToken = () => {
    setQrToken(JSON.stringify({ sessionId: id, timestamp: Date.now() }));
    setTimeLeft(15);
  };

  const fetchSession = async () => {
    try {
      const res = await axios.get(`/api/sessions/${id}/live`);
      setSessionData(res.data);
    } catch (error) { console.error(error); }
  };

  // Polling de asistencias
  useEffect(() => {
    fetchSession();
    const pollInterval = setInterval(fetchSession, 2500);
    return () => clearInterval(pollInterval);
  }, [id]);

  // Lógica del temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          generateNewToken(); // Auto-generar al llegar a cero
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [id]);

  // Generar token inicial
  useEffect(() => { generateNewToken(); }, [id]);

  // --- FUNCIÓN: DESPLAZAR A LISTA ---
  const scrollToView = () => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!sessionData) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      <header className="p-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <button onClick={() => navigate('/sessions')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} /> Salir del Proyector
        </button>
        <div className="text-right">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {sessionData.title}
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">{sessionData.room}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 gap-10">
        
        {/* PANEL DEL QR (A la izquierda) */}
        <div className="bg-white text-gray-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex flex-col items-center w-full max-w-[420px] animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight mb-1">Escanea para Asistir</h2>
            <p className="text-gray-400 text-sm font-medium">Usa la app de AttendSys en tu móvil</p>
          </div>
          
          <div className="p-4 bg-blue-50/50 rounded-3xl mb-8 relative group">
            <QRCodeSVG value={qrToken} size={280} level="H" includeMargin={true} className="rounded-xl transition-transform group-hover:scale-105 duration-300" />
            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${timeLeft < 5 ? 'bg-red-500 animate-pulse' : 'bg-blue-600'} text-white shadow-lg`}>
              Token Dinámico
            </div>
          </div>
          
          <div className="w-full flex justify-between items-center px-2 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Vence en</span>
              <span className={`font-mono text-2xl font-black ${timeLeft < 5 ? 'text-red-500' : 'text-gray-800'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Presentes</span>
              <span className="text-2xl font-black text-blue-600">
                {sessionData.attendances?.length || 0}
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <button 
              onClick={generateNewToken}
              className="flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              <RefreshCw size={18} className={timeLeft === 15 ? 'animate-spin' : ''} /> Nuevo código
            </button>
            <button 
              onClick={scrollToView}
              className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <ListChecks size={18} /> Ver lista
            </button>
          </div>
        </div>

        {/* LISTA DE ASISTENCIA (A la derecha) */}
        <div ref={listRef} className="w-full max-w-[480px] bg-gray-900/50 rounded-[2.5rem] p-8 border border-gray-800 flex flex-col h-[650px] shadow-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-blue-400" size={24}/> Alumnos en Clase
            </h3>
            <button className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-blue-400 transition-colors" title="Registro Manual">
              <UserPlus size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {(!sessionData.attendances || sessionData.attendances.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center">
                  <Users size={32} />
                </div>
                <p className="text-sm font-medium">Nadie ha escaneado el QR aún</p>
              </div>
            ) : (
             sessionData.attendances.map((att: any) => (
              <div key={att.id} className="bg-gray-800/40 p-4 rounded-2xl flex items-center justify-between border border-gray-700/50 group hover:border-blue-500/30 transition-all animate-[slideIn_0.3s_ease-out]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg shadow-inner">
                      {att.student.firstName[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-gray-900 w-4 h-4 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors">{att.student.firstName} {att.student.lastName}</p>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{att.student.studentId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle size={10} /> LISTO
                  </span>
                  <p className="text-[10px] text-gray-600 mt-1 font-mono">{new Date(att.markedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            )))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}