import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Mail, Lock, ArrowRight, GraduationCap, Presentation, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('teacher'); // Profesor predefinido por defecto
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar errores si el usuario cambia de rol
  useEffect(() => {
    setError('');
    setPassword('');
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1. Validación de campos vacíos
    if (!email.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos requeridos.');
      setIsLoading(false);
      return;
    }

    // Simulamos un pequeño retraso de red para dar realismo a la carga
    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Validación de credenciales del Profesor (Seguridad Simulada)
    if (role === 'teacher') {
      if (email !== 'profesor@instituto.edu' || password !== 'admin123') {
        setError('Credenciales de profesor incorrectas. Use: profesor@instituto.edu / admin123');
        setIsLoading(false);
        return;
      }
    }

    // 3. Validación de credenciales del Alumno (Cualquier contraseña es válida para este demo, pero exige correo)
    if (role === 'student') {
      if (!email.includes('@')) {
        setError('Por favor, ingrese un correo institucional válido.');
        setIsLoading(false);
        return;
      }
    }

    // 4. Creación de la sesión autenticada
    localStorage.setItem('auth_token', 'token_seguro_v1');
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_email', email.toLowerCase());
    
    // 5. Redirección al Dashboard correspondiente
    if (role === 'teacher') {
      navigate('/');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 transition-colors duration-300">
      {/* Panel Izquierdo - Branding Institucional */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 font-bold text-3xl mb-6">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><QrCode size={32} /></div>
            AttendSys
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            El futuro de la gestión <br /> de asistencias.
          </h1>
          <p className="text-blue-200 text-lg max-w-md">
            Controla las asistencias en tiempo real usando tecnología QR y WebSockets. Rápido, seguro y sin contacto.
          </p>
        </div>
        <div className="text-sm text-blue-300">
          © 2026 AttendSys. Todos los derechos reservados.
        </div>
      </div>

      {/* Panel Derecho - Formulario Interactivo */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          
          <div className="lg:hidden flex items-center gap-2 font-bold text-2xl text-blue-600 mb-8">
            <QrCode size={28} /> AttendSys
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h2>
          <p className="text-gray-500 mb-6">Seleccione su perfil para continuar</p>
          
          {/* Selector de Rol */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              type="button" 
              onClick={() => setRole('teacher')} 
              className={`flex-1 py-2.5 font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${role === 'teacher' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Presentation size={18}/> Profesor
            </button>
            <button 
              type="button" 
              onClick={() => setRole('student')} 
              className={`flex-1 py-2.5 font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <GraduationCap size={18}/> Alumno
            </button>
          </div>

          {/* Mensaje de Error (Feedback visual) */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-[popUp_0.3s_ease-out]">
              <AlertCircle className="text-red-500 mt-0.5" size={18} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900" 
                  placeholder={role === 'teacher' ? "profesor@instituto.edu" : "alumno@instituto.edu"} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 mt-4 transition-all disabled:opacity-70"
            >
              {isLoading ? 'Autenticando...' : 'Ingresar al Sistema'} 
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          {role === 'teacher' && (
            <p className="text-xs text-center text-gray-400 mt-6">
              Credenciales de prueba: profesor@instituto.edu / admin123
            </p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes popUp {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}