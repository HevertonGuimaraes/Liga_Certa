import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

/** Carrega .env antes do Prisma/Nest (funciona na raiz do monorepo ou em apps/api). */
const envCandidates = [
  join(process.cwd(), 'apps/api/.env'),
  join(process.cwd(), '.env'),
  join(__dirname, '..', '.env'),
];

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    config({ path: envPath });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  console.error('\n❌ DATABASE_URL não encontrada.\n');
  console.error('   1. Na raiz do projeto, execute: npm run setup');
  console.error('   2. Ou copie manualmente:');
  console.error('      copy apps\\api\\.env.example apps\\api\\.env   (Windows)');
  console.error('      cp apps/api/.env.example apps/api/.env       (Linux/macOS)');
  console.error('   3. Depois: npm run db:setup:docker\n');
  process.exit(1);
}
