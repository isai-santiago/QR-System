import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'profesor@instituto.edu' },
    update: {},
    create: {
      email: 'profesor@instituto.edu',
      name: 'Profesor de Matemáticas',
      password: hashedPassword,
      role: 'teacher'
    },
  });
  console.log('✅ Usuario inicial creado: profesor@instituto.edu / admin123');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());