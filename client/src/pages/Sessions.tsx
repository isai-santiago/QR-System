import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, QrCode, MapPin, X, Clock } from 'lucide-react';

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Añadimos startTime y endTime al estado inicial
  const [formData, setFormData] = useState({ title: '', room: '', startTime: '', endTime: '' });

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/sessions'); // Usando el proxy
      setSessions(res.data);
    } catch (error) {
      console.error("Error al obtener sesiones", error);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/sessions', formData);
      setIsModalOpen(false);
      setFormData({ title: '', room: '', startTime: '', endTime: '' }); // Limpiar formulario
      navigate(`/session/${res.data.id}/live`);
    } catch (error) {
      alert("Error al crear la sesión");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Sesiones</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md hover:bg-blue-700 transition-colors">
          <Plus size={20} /> Nueva Sesión
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session: any) => {
          const now = new Date();
          const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          // Lógica de tres estados
          const isUpcoming = currentTime < session.startTime;
          const isActive = currentTime >= session.startTime && currentTime <= session.endTime;
          const isFinished = currentTime > session.endTime;

          return (
            <div key={session.id} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border transition-all ${
              isActive ? 'border-green-500/30' : 'border-gray-100 dark:border-gray-700'
            } ${isFinished ? 'opacity-60' : 'opacity-100'}`}>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isUpcoming && (
                      <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        En Espera
                      </span>
                    )}
                    {isActive && (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                        ● Activa Ahora
                      </span>
                    )}
                    {isFinished && (
                      <span className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Finalizada
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${isFinished ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {session.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={16}/> {session.room}</span>
                    <span className="flex items-center gap-1"><Clock size={16}/> {session.startTime} - {session.endTime}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => navigate(`/session/${session.id}/live`)} 
                    disabled={!isActive}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <QrCode size={18} />
                    {isUpcoming ? 'Esperando hora...' : isFinished ? 'Expirada' : 'Proyectar QR'}
                  </button>
                  
                  {isUpcoming && (
                    <p className="text-[10px] text-amber-600 font-medium">Inicia pronto</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-[popUp_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Crear Clase / Sesión</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la clase</label>
                <input required placeholder="Ej: Pablo el de matematicas" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aula / Ubicación</label>
                <input required placeholder="Ej: Laboratorio 102" value={formData.room} onChange={e=>setFormData({...formData, room: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora de Inicio</label>
                  <input required type="time" value={formData.startTime} onChange={e=>setFormData({...formData, startTime: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora de Fin (Límite)</label>
                  <input required type="time" value={formData.endTime} onChange={e=>setFormData({...formData, endTime: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700">Crear y Proyectar QR</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}