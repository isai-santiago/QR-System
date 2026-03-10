import React, { useState } from 'react';
import axios from 'axios';
import { User, Shield, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [name, setName] = useState(localStorage.getItem('user_name') || '');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const email = localStorage.getItem('user_email');

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus('loading');
  try {
    // 1. Enviamos el nuevo nombre "alfonzo" al servidor
    await axios.put('/api/auth/profile', { email, name, password });
    
    // 2. ¡IMPORTANTE! Actualizamos la memoria del navegador
    localStorage.setItem('user_name', name); 
    
    setStatus('success');
    // Forzamos un refresco rápido para que el nombre cambie en el menú lateral
    setTimeout(() => window.location.reload(), 1000); 
  } catch (error) {
    setStatus('error');
    console.error("Error al guardar:", error);
  }
};

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración de Cuenta</h1>
      </header>

      <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 space-y-6">
          <section className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><User size={20} className="text-blue-500"/> Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre para mostrar</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email institucional (No editable)</label>
                <input disabled value={email || ''} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed border border-transparent" />
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-700">
            <h3 className="text-lg font-bold flex items-center gap-2"><Shield size={20} className="text-red-500"/> Seguridad</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-400 mb-1">Nueva Contraseña (dejar en blanco para mantener actual)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </section>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center gap-4">
          {status === 'success' && <span className="text-green-500 flex items-center gap-1 text-sm"><CheckCircle size={16}/> Cambios guardados</span>}
          {status === 'error' && <span className="text-red-500 flex items-center gap-1 text-sm"><AlertCircle size={16}/> Error al actualizar</span>}
          <button type="submit" disabled={status === 'loading'} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            <Save size={20}/> {status === 'loading' ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}