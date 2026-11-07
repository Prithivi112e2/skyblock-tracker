import { execSync } from 'child_process';

const DEFAULT_DB_URL =
  'postgresql://neondb_owner:npg_rjRJ8AsFT0Ke@ep-autumn-salad-bbie56hw.c-15.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30';
const DEFAULT_HYPIXEL_KEY = 'a93589d2-67f9-407b-9c96-6b4e35be483f';

process.env.DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DB_URL;
process.env.HYPIXEL_API_KEY = process.env.HYPIXEL_API_KEY || DEFAULT_HYPIXEL_KEY;

console.log('==> [Build] Neon PostgreSQL & Hypixel credentials resolved.');

console.log('==> [Build] Running prisma generate...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

try {
  console.log('==> [Build] Verifying database schema with prisma db push...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.warn('==> [Build] Note: prisma db push warning (continuing build):', err.message);
}

try {
  console.log('==> [Build] Seeding default verified profile...');
  execSync('node scripts/seed.mjs', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.warn('==> [Build] Note: database seed warning (continuing build):', err.message);
}

console.log('==> [Build] Running next build...');
execSync('npx next build', { stdio: 'inherit', env: process.env });

console.log('==> [Build] Build finished successfully!');
