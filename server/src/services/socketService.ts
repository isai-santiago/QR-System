import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    socket.on('join_session', (sessionId) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} unido a sesión ${sessionId}`);
    });
  });

  return io;
};

// ESTA ES LA FUNCIÓN QUE TE FALTABA
export const getIO = () => {
  if (!io) throw new Error("Socket.io no inicializado");
  return io;
};