import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Calendar, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/api/reports');
        setReportData(res.data);
      } catch (error) { console.error("Error", error); }
      finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  // Función nativa para exportar a CSV
  const exportToCSV = () => {
    if (reportData.length === 0) return alert("No hay datos para exportar");

    // 1. Crear las cabeceras del Excel
    const headers = ['Fecha', 'Hora', 'Clase', 'Matricula', 'Nombre', 'Apellidos', 'Estado'];
    
    // 2. Mapear los datos de la base de datos a filas de texto
    const csvRows = reportData.map((row: any) => {
      const date = new Date(row.markedAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        `"${row.session.title}"`, // Comillas por si el título tiene comas
        row.student.studentId,
        row.student.firstName,
        row.student.lastName,
        'Presente'
      ].join(','); // Separador de columnas
    });

    // 3. Unir cabeceras y datos
    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    // 4. Crear el archivo descargable mágicamente
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Asistencias_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex h-64 items-center justify-center text-blue-600"><Loader2 className="animate-spin" size={40}/></div>;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics y Reportes</h1>
          <p className="text-gray-500 dark:text-gray-400">Exporta datos de asistencia para control escolar.</p>
        </div>
      </header>

      {/* Panel de Filtros y Exportación */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Calendar size={16}/> Rango de Fechas</label>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none">
            <option value="all">Todo el histórico</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Filter size={16}/> Filtrar por Clase</label>
          <select className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none">
            <option>Todas las clases</option>
            {/* Aquí se podrían listar las clases dinámicamente */}
          </select>
        </div>

        <div className="lg:col-span-2 flex gap-3 justify-end h-full items-end mt-4 lg:mt-0">
          <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
            <FileText size={18} className="text-red-500"/> PDF
          </button>
          <button onClick={exportToCSV} className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all active:scale-95">
            <FileSpreadsheet size={18} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Vista Previa de Datos */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Vista Previa de Datos ({reportData.length} registros)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Fecha/Hora</th>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Clase</th>
                <th className="px-6 py-4 text-right">Método</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {reportData.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No hay asistencias registradas.</td></tr>
              ) : (
                reportData.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{new Date(row.markedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(row.markedAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{row.student.firstName} {row.student.lastName}</p>
                      <p className="text-xs text-gray-500 font-mono">{row.student.studentId}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{row.session.title}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                        Código QR
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}