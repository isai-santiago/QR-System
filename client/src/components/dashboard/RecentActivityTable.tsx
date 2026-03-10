import React from 'react';

export default function RecentActivityTable({ attendances }: { attendances: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
                <th className="p-3">Estudiante</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Hora</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {attendances?.map((att) => (
            <tr key={att.id} className="hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-900">{att.studentName || att.studentId}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    att.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {att.status}
                </span>
              </td>
              <td className="p-3 text-gray-500 text-sm">
                {new Date(att.markedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}