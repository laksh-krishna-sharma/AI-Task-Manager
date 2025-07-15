import { PrismaClient } from '../../generated/prisma';

declare global {
  // prevent multiple instantiations in hot reload
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: ['query', 'info', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma;
}
