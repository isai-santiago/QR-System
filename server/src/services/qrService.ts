import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secreto-seguro';

// Generar un token que el frontend mostrará como QR
export const generateQRToken = (sessionId: string) => {
  const payload = {
    sid: sessionId,
    ts: Date.now()
  };
  
  // El token expira en 30 segundos para evitar que tomen foto y la pasen
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30s' });
};

// Validar el token cuando el estudiante lo escanea
export const verifyQRToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.sid; // Devuelve el Session ID si es válido
  } catch (error) {
    return null; // Token expirado o inválido
  }
};  