import React from 'react';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function StatsCards({ summary }: { summary: any }) {
  if (!summary) return null;

  const cards = [
    { 
      title: "Sesiones Activas", 
      value: summary.activeSessions, 
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100" 
    },
    { 
      title: "Asistencias Hoy", 
      value: summary.totalAttendances, 
      icon: <Users className="w-6 h-6 text-green-600" />,
      bg: "bg-green-100"
    },
    { 
      title: "Tasa de Asistencia", 
      value: `${summary.avgAttendanceRate}%`, 
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-100"
    },
    { 
      title: "Total Sesiones", 
      value: summary.totalSessions, 
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
          </div>
          <div className={`p-3 rounded-full ${card.bg}`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}