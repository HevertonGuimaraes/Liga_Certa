/**
 * Copia .env.example → .env (API e Web) se ainda não existirem.
 * Uso: npm run setup
 */
import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const targets = [
  {
    example: join(ROOT, 'apps/api/.env.example'),
    env: join(ROOT, 'apps/api/.env'),
    label: 'API (DATABASE_URL, JWT)',
  },
  {
    example: join(ROOT, 'apps/web/.env.example'),
    env: join(ROOT, 'apps/web/.env'),
    label: 'Web (VITE_API_URL)',
  },
];

console.log('🔧 Setup Liga Certa — variáveis de ambiente\n');

for (const { example, env, label } of targets) {
  if (existsSync(env)) {
    console.log(`   ✓ ${label}: ${env} (já existe)`);
    continue;
  }

  if (!existsSync(example)) {
    console.error(`   ✗ ${label}: exemplo não encontrado em ${example}`);
    process.exit(1);
  }

  copyFileSync(example, env);
  console.log(`   + ${label}: criado ${env}`);
}

console.log('\n✅ Pronto! Próximos passos:\n');
console.log('   npm run db:setup:docker   # MySQL + schema (precisa Docker)');
console.log('   npm run dev:api           # API :3000');
console.log('   npm run dev:web           # Frontend :5173\n');
