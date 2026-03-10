import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Simularemos datos globales aquí
  activeSessions: number;
  totalStudents: number;
}

export const useStore = create<AppState>((set) => {
  // Leer preferencia guardada
  const savedMode = localStorage.getItem('darkMode') === 'true';
  if (savedMode) document.documentElement.classList.add('dark');

  return {
    isDarkMode: savedMode,
    toggleDarkMode: () => set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newMode));
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: newMode };
    }),
    activeSessions: 2,
    totalStudents: 156,
  };
});