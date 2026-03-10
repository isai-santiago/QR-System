import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Attendance } from '../types';

const SOCKET_URL = 'http://localhost:3000'; // Tu URL de backend

export const useSessionSocket = (sessionId: string, initialData: Attendance[]) => {
  const [attendances, setAttendances] = useState<Attendance[]>(initialData);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Unirse a la sala de esta clase específica
    newSocket.emit('join_session', sessionId);

    // Escuchar cuando un alumno escanea
    newSocket.on('new_attendee', (newRecord: Attendance) => {
      setAttendances((prev) => [newRecord, ...prev]);
      // Aquí podrías disparar un sonido de "bip" exitoso
    });

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  return { attendances, socket };
};