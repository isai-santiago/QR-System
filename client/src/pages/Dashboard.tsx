import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, CalendarCheck, Clock, AlertTriangle, Loader2, Plus, QrCode, FileDown, ListVideo } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (error) { console.error("Error cargando dashboard", error); } 
      finally { setLoading(false); }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) return <div className="flex h-64 items-center justify-center text-blue-600"><Loader2 className="animate-spin" size={40}/></div>;

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visión general del sistema en tiempo real.</p>
        </div>
      </header>

      {/* 1. Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Asistencias Totales" value={stats.totalAttendances} subtitle="Histórico general" icon={Users} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard label="Tasa de Asistencia" value={`${stats.attendanceRate}%`} subtitle="Promedio global" icon={CalendarCheck} color="text-green-600" bg="bg-green-50 dark:bg-green-900/30" />
        <StatCard label="Sesiones Activas" value={stats.activeSessions} subtitle="En curso ahora" icon={Clock} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-900/30" />
        <StatCard label="Alertas del Sistema" value="0" subtitle="Todo en orden" icon={AlertTriangle} color="text-red-600" bg="bg-red-50 dark:bg-red-900/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda (Gráfico y Actividad) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 5. Attendance Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Tendencia de Asistencias (Última Semana)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="asistencias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Recent Attendances Feed */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h3 className="font-bold text-lg text-gray-900 dark:text-white">Flujo de Asistencia Reciente</h3></div>
            <div>
              {stats.recentActivity.length === 0 ? <p className="p-8 text-gray-500 text-center">No hay asistencias recientes.</p> : 
                stats.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">{activity.student.firstName[0]}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.student.firstName} {activity.student.lastName}</p>
                      <p className="text-xs text-gray-500">Sesión: {activity.session.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Presente</span>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(activity.markedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (Quick Actions) */}
        <div className="space-y-8">
          
          {/* 4. Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h3 className="font-bold text-lg text-gray-900 dark:text-white">Acciones Rápidas</h3></div>
            <div className="p-4 grid grid-cols-1 gap-3">
              <button onClick={() => navigate('/sessions')} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-left group">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><Plus size={18}/></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-sm">Nueva Sesión</p><p className="text-xs text-gray-500">Programar una clase</p></div>
              </button>
              <button onClick={() => navigate('/sessions')} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors text-left group">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform"><QrCode size={18}/></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-sm">Proyectar QR</p><p className="text-xs text-gray-500">Abrir sesión activa</p></div>
              </button>
{/* Busca este bloque y asegúrate de que tenga el onClick */}
<button 
  onClick={() => navigate('/reports')} 
  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors text-left group"
>
  <div className="p-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg group-hover:scale-110 transition-transform">
    <FileDown size={18}/>
  </div>
  <div>
    <p className="font-bold text-gray-900 dark:text-white text-sm">Exportar Reporte</p>
    <p className="text-xs text-gray-500">Descargar CSV/PDF</p>
  </div>
</button>
              <button onClick={() => navigate('/sessions')} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors text-left group">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-110 transition-transform"><ListVideo size={18}/></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-sm">Ver Sesiones</p><p className="text-xs text-gray-500">Historial completo</p></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, subtitle, icon: Icon, color, bg }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 hover:-translate-y-1 transition-transform">
    <div className={`p-4 rounded-xl ${bg} ${color}`}><Icon size={24} /></div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{value}</h3>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{subtitle}</p>
    </div>
  </div>
);