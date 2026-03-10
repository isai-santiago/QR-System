import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'secreto_ultra_seguro_2026'; // En producción esto va en .env

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Encriptamos la contraseña para que nadie la vea en la DB
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'teacher' }
    });
    res.json({ message: "Cuenta de profesor creada con éxito" });
  } catch (error) {
    res.status(400).json({ error: "Este correo ya está registrado." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ 
        token, 
        user: { name: user.name, email: user.email, role: user.role } 
      });
    } else {
      res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const updateData: any = { name };
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: updateData
    });
    
    res.json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
    }
    res.status(500).json({ error: "Error al actualizar" });
  }
};