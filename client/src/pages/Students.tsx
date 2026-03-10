import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical, GraduationCap, X, Calendar, Edit3, Trash2 } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Estados para los Modales Funcionales
  const [modalType, setModalType] = useState<'history' | 'edit' | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentHistory, setStudentHistory] = useState<any[]>([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (error) { console.error("Error", error); }
  };

  useEffect(() => { fetchStudents(); }, []);

  // --- FUNCIONES REALES DE LOS 3 PUNTOS ---

  const handleViewHistory = async (student: any) => {
    setOpenMenuId(null);
    try {
      const res = await axios.get(`/api/students/${student.studentId}/history`);
      setStudentHistory(res.data);
      setSelectedStudent(student);
      setModalType('history');
    } catch (e) { alert("Error al cargar el historial"); }
  };

  const handleEdit = (student: any) => {
    setOpenMenuId(null);
    setSelectedStudent({ ...student });
    setModalType('edit');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/students/${selectedStudent.studentId}`, selectedStudent);
      setModalType(null);
      fetchStudents(); // Recargar la tabla
    } catch (e) { alert("Error al guardar cambios"); }
  };

  const handleDelete = async (student: any) => {
    setOpenMenuId(null);
    if (window.confirm(`¿Estás seguro de que deseas dar de baja a ${student.firstName}?\nEsto borrará todo su historial de asistencias.`)) {
      try {
        await axios.delete(`/api/students/${student.studentId}`);
        fetchStudents(); // Recargar la tabla
      } catch (e) { alert("Error al eliminar"); }
    }
  };

  const filteredStudents = students.filter((s: any) => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Estudiantes</h1>
          <p className="text-gray-500 dark:text-gray-400">Directorio completo y estado académico.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar alumno..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </header>

      {/* TABLA DE ESTUDIANTES */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Programa</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No se encontraron estudiantes.</td></tr>
              ) : (
                filteredStudents.map((student: any) => (
                  <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600">{student.firstName[0]}</div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">{student.studentId}</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300"><GraduationCap size={16} className="text-gray-400"/> Semestre {student.semester}</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Activo</span></td>
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={() => setOpenMenuId(openMenuId === student.studentId ? null : student.studentId)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>

                      {/* MENÚ DESPLEGABLE */}
                      {openMenuId === student.studentId && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                          <div className="absolute right-12 top-4 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 py-2 z-20 animate-[popUp_0.2s_ease-out]">
                            <button onClick={() => handleViewHistory(student)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"><Calendar size={16}/> Ver Historial</button>
                            <button onClick={() => handleEdit(student)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"><Edit3 size={16}/> Editar Estudiante</button>
                            <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                            <button onClick={() => handleDelete(student)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"><Trash2 size={16}/> Dar de Baja</button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALES --- */}

      {/* Modal de Historial */}
      {modalType === 'history' && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-[popUp_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historial de Asistencias</h2>
                <p className="text-sm text-gray-500">{selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.studentId})</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
              {studentHistory.length === 0 ? <p className="text-center text-gray-500 py-4">No hay asistencias registradas aún.</p> :
                studentHistory.map((att: any) => (
                  <div key={att.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex justify-between items-center border border-gray-100 dark:border-gray-600">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{att.session.title}</p>
                      <p className="text-xs text-gray-500">{new Date(att.markedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Presente</span>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(att.markedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {modalType === 'edit' && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <form onSubmit={handleSaveEdit} className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-[popUp_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Estudiante</h2>
              <button type="button" onClick={() => setModalType(null)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input required value={selectedStudent.firstName} onChange={e=>setSelectedStudent({...selectedStudent, firstName: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellidos</label>
                <input required value={selectedStudent.lastName} onChange={e=>setSelectedStudent({...selectedStudent, lastName: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input required type="email" value={selectedStudent.email} onChange={e=>setSelectedStudent({...selectedStudent, email: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700">Guardar Cambios</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}