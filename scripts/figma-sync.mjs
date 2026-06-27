/**
 * Sincroniza tokens e estrutura do Figma para docs/figma-export.json
 * Requer: FIGMA_ACCESS_TOKEN no .env ou variável de ambiente
 *
 * Uso: npm run figma:sync
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FILE_KEY = 'rIdD4kxCwOwptXyIJgLXUI';
const FOCUS_NODE = '221:12';

function loadToken() {
  const envPaths = [
    join(ROOT, '.env'),
    join(ROOT, 'apps/web/.env'),
    join(ROOT, 'apps/api/.env'),
  ];
  for (const p of envPaths) {
    if (!existsSync(p)) continue;
    const match = readFileSync(p, 'utf8').match(/FIGMA_ACCESS_TOKEN=(.+)/);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return process.env.FIGMA_ACCESS_TOKEN;
}

async function figmaFetch(path) {
  const token = loadToken();
  if (!token) {
    console.error('\n❌ FIGMA_ACCESS_TOKEN não encontrado.');
    console.error('   1. Figma → Settings → Personal access tokens → Generate');
    console.error('   2. Adicione em .env na raiz: FIGMA_ACCESS_TOKEN=seu_token\n');
    process.exit(1);
  }

  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': token },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

function rgbToHex({ r, g, b, a = 1 }) {
  const to255 = (v) => Math.round(v * 255);
  const hex = [r, g, b].map((v) => to255(v).toString(16).padStart(2, '0')).join('');
  return a < 1 ? `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${a.toFixed(2)})` : `#${hex}`;
}

function extractFills(node) {
  return (node.fills ?? [])
    .filter((f) => f.type === 'SOLID' && f.visible !== false)
    .map((f) => ({ color: rgbToHex(f.color), opacity: f.opacity ?? 1 }));
}

function extractTypography(node) {
  const s = node.style;
  if (!s) return null;
  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeightPx ?? s.lineHeightPercentFontSize,
    letterSpacing: s.letterSpacing,
  };
}

function walkFrames(node, path = [], acc = []) {
  if (!node) return acc;
  const currentPath = [...path, node.name];
  const isFrame = ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'SECTION'].includes(node.type);

  if (isFrame && node.absoluteBoundingBox) {
    acc.push({
      id: node.id,
      name: node.name,
      type: node.type,
      path: currentPath.join(' / '),
      width: Math.round(node.absoluteBoundingBox.width),
      height: Math.round(node.absoluteBoundingBox.height),
      fills: extractFills(node),
      layoutMode: node.layoutMode,
      padding: {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft,
      },
      itemSpacing: node.itemSpacing,
      cornerRadius: node.cornerRadius,
    });
  }

  for (const child of node.children ?? []) {
    walkFrames(child, currentPath, acc);
  }
  return acc;
}

function extractTextStyles(node, acc = []) {
  if (node.type === 'TEXT') {
    acc.push({
      id: node.id,
      name: node.name,
      characters: (node.characters ?? '').slice(0, 80),
      typography: extractTypography(node),
      fills: extractFills(node),
    });
  }
  for (const child of node.children ?? []) {
    extractTextStyles(child, acc);
  }
  return acc;
}

async function main() {
  console.log('🔄 Buscando arquivo Figma...');
  const file = await figmaFetch(`/files/${FILE_KEY}?depth=2`);
  console.log(`   Arquivo: ${file.name}`);

  console.log('🔄 Buscando node foco 221-12...');
  const nodes = await figmaFetch(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(FOCUS_NODE)}`);
  const focusNode = nodes.nodes[FOCUS_NODE]?.document;

  console.log('🔄 Buscando estilos publicados...');
  let styles = { meta: {}, styles: [] };
  try {
    styles = await figmaFetch(`/files/${FILE_KEY}/styles`);
  } catch {
    console.warn('   Estilos não disponíveis (arquivo pode não ter styles publicados)');
  }

  const allFrames = [];
  for (const page of file.document.children ?? []) {
    walkFrames(page, [page.name], allFrames);
  }

  const focusFrames = focusNode ? walkFrames(focusNode, ['FOCUS']) : [];
  const focusTexts = focusNode ? extractTextStyles(focusNode) : [];

  const exportData = {
    syncedAt: new Date().toISOString(),
    fileKey: FILE_KEY,
    fileName: file.name,
    focusNodeId: FOCUS_NODE,
    focusNodeName: focusNode?.name ?? null,
    pages: (file.document.children ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      frameCount: walkFrames(p, [p.name], []).length,
    })),
    frames: allFrames,
    focusFrame: focusFrames[0] ?? null,
    focusTexts,
    styles: styles.styles ?? [],
    lastModified: file.lastModified,
  };

  const outDir = join(ROOT, 'docs');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'figma-export.json');
  writeFileSync(outPath, JSON.stringify(exportData, null, 2), 'utf8');

  console.log(`\n✅ Export salvo em docs/figma-export.json`);
  console.log(`   Páginas: ${exportData.pages.length}`);
  console.log(`   Frames: ${allFrames.length}`);
  console.log(`   Node foco: ${exportData.focusNodeName ?? 'não encontrado'}`);
}

main().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
