import { PrismaClient } from '@prisma/client';

// Factory function to create a new Prisma client instance
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declare global variable to store Prisma instance across hot reloads in development
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Singleton pattern: Reuse existing instance or create new one
// Prevents "too many clients" errors during Next.js hot reloads
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

// In development, store instance globally so it survives hot reloads
// In production, this is skipped (new instance per deployment is fine)
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
