import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import LiveSession from './pages/LiveSession';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { StudentDashboard } from './pages/StudentDashboard'; // Nueva importación

const PrivateRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role');
  
  // Si no hay token, lo mandamos al login directo
  if (!token) return <Navigate to="/login" replace />;
  
  // Si la ruta exige un rol y el usuario no lo tiene o no coincide
  if (allowedRole && role !== allowedRole) {
    if (role === 'student') return <Navigate to="/student" replace />;
    if (role === 'teacher') return <Navigate to="/" replace />;
    
    // Si el rol es corrupto o no existe, limpiamos la memoria y pedimos login de nuevo (¡esto evita la pantalla blanca!)
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/session/:id/live" element={<PrivateRoute allowedRole="teacher"><LiveSession /></PrivateRoute>} />
        
        {/* Ruta exclusiva del estudiante */}
        <Route path="/student" element={<PrivateRoute allowedRole="student"><StudentDashboard /></PrivateRoute>} />

        {/* Rutas exclusivas del profesor */}
        <Route path="*" element={
          <PrivateRoute allowedRole="teacher">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/students" element={<Students />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}
export default App;