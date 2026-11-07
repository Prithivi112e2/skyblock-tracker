import { PrismaClient } from '@prisma/client';

const DEFAULT_DB_URL =
  'postgresql://neondb_owner:npg_rjRJ8AsFT0Ke@ep-autumn-salad-bbie56hw.c-15.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DB_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
