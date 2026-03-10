import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

export default function UpcomingSessionsList({ sessions }: { sessions: any[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Próximas Sesiones</h3>
        <div className="space-y-4">
            {sessions?.map(session => (
                <div key={session.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{session.title}</h4>
                        <p className="text-xs text-gray-500">{session.room} • {new Date(session.scheduledStart).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                    <Link to={`/session/${session.id}/live`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                        <ArrowRight size={16} />
                    </Link>
                </div>
            ))}
        </div>
    </div>
  );
}   