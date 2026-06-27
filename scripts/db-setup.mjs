/**
 * Cria o banco MySQL e aplica o schema (Prisma migrations).
 *
 * Uso:
 *   npm run db:setup
 *   npm run db:setup -- --docker   # sobe o MySQL via docker compose antes
 *
 * Requer DATABASE_URL em apps/api/.env (ou variável de ambiente).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const API_DIR = join(ROOT, 'apps', 'api');

const DEFAULTS = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'liga_certa',
};

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const envPath = join(API_DIR, '.env');
  if (!existsSync(envPath)) {
    console.error('\n❌ DATABASE_URL não encontrada.');
    console.error('   Crie apps/api/.env a partir de apps/api/.env.example\n');
    process.exit(1);
  }

  const match = readFileSync(envPath, 'utf8').match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\n]+)["']?\s*$/m);
  if (!match) {
    console.error('\n❌ DATABASE_URL ausente em apps/api/.env\n');
    process.exit(1);
  }

  return match[1].trim();
}

function parseDatabaseUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    console.error('\n❌ DATABASE_URL inválida:', rawUrl, '\n');
    process.exit(1);
  }

  if (url.protocol !== 'mysql:') {
    console.error('\n❌ DATABASE_URL deve usar o protocolo mysql://\n');
    process.exit(1);
  }

  return {
    host: url.hostname || DEFAULTS.host,
    port: url.port ? Number(url.port) : DEFAULTS.port,
    user: decodeURIComponent(url.username || DEFAULTS.user),
    password: decodeURIComponent(url.password || DEFAULTS.password),
    database: url.pathname.replace(/^\//, '') || DEFAULTS.database,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    ...options,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startDockerMysql() {
  console.log('🐳 Subindo MySQL via docker compose...');
  run('docker', ['compose', 'up', '-d', 'mysql'], { cwd: ROOT });
  console.log('⏳ Aguardando MySQL ficar pronto...');

  for (let attempt = 1; attempt <= 30; attempt++) {
    const health = runCapture('docker', ['compose', 'ps', '--format', 'json', 'mysql'], { cwd: ROOT });
    if (health.stdout?.includes('"Health":"healthy"') || health.stdout?.includes('"State":"running"')) {
      const ping = runCapture('docker', [
        'compose',
        'exec',
        '-T',
        'mysql',
        'mysqladmin',
        'ping',
        '-h',
        'localhost',
        '-uroot',
        '-ppassword',
        '--silent',
      ], { cwd: ROOT });

      if (ping.status === 0) {
        console.log('   MySQL pronto.\n');
        return;
      }
    }

    await sleep(2000);
  }

  console.error('\n❌ MySQL não respondeu a tempo. Verifique: docker compose logs mysql\n');
  process.exit(1);
}

async function createDatabaseWithMysql2(config) {
  let mysql;
  try {
    mysql = await import('mysql2/promise');
  } catch {
    return false;
  }

  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    return true;
  } finally {
    await connection.end();
  }
}

function createDatabaseViaDocker(config) {
  const sql = `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  const result = runCapture('docker', [
    'compose',
    'exec',
    '-T',
    'mysql',
    'mysql',
    `-u${config.user}`,
    `-p${config.password}`,
    '-e',
    sql,
  ], { cwd: ROOT });

  return result.status === 0;
}

function createDatabaseViaCli(config) {
  const sql = `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
  const result = runCapture('mysql', [
    `-h${config.host}`,
    `-P${config.port}`,
    `-u${config.user}`,
    `-p${config.password}`,
    '-e',
    sql,
  ]);

  return result.status === 0;
}

async function createDatabase(config) {
  console.log(`🔄 Criando banco "${config.database}" (se não existir)...`);

  if (await createDatabaseWithMysql2(config)) {
    console.log('   Banco garantido via mysql2.\n');
    return;
  }

  if (createDatabaseViaDocker(config)) {
    console.log('   Banco garantido via docker compose.\n');
    return;
  }

  if (createDatabaseViaCli(config)) {
    console.log('   Banco garantido via cliente mysql.\n');
    return;
  }

  console.error('\n❌ Não foi possível criar o banco automaticamente.');
  console.error('   Opções:');
  console.error('   1. npm run db:setup -- --docker');
  console.error('   2. Instale mysql2: npm install -D mysql2');
  console.error('   3. Crie manualmente no MySQL:');
  console.error(
    `      CREATE DATABASE \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`,
  );
  process.exit(1);
}

function applySchema() {
  console.log('🔄 Gerando Prisma Client...');
  run('npx', ['prisma', 'generate'], { cwd: API_DIR, env: process.env });

  console.log('🔄 Aplicando migrations (schema)...');
  run('npx', ['prisma', 'migrate', 'deploy'], { cwd: API_DIR, env: process.env });

  console.log('\n✅ Banco e schema prontos.');
  console.log(`   Database: ${process.env.DATABASE_URL?.replace(/:([^:@/]+)@/, ':***@') ?? '(apps/api/.env)'}`);
  console.log('   Próximo passo: npm run dev:api\n');
}

async function main() {
  const useDocker = process.argv.includes('--docker');

  if (useDocker) {
    await startDockerMysql();
  }

  const databaseUrl = loadDatabaseUrl();
  const config = parseDatabaseUrl(databaseUrl);

  process.env.DATABASE_URL = databaseUrl;

  await createDatabase(config);
  applySchema();
}

main().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
