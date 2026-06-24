# Liga Certa — Documentação UX/UI

> **Nota:** Esta documentação foi gerada sem acesso ao Figma MCP. Os tokens e padrões seguem as especificações do projeto e boas práticas enterprise para SaaS esportivo. Quando o Figma estiver disponível, refine cores e espaçamentos com base no design original.

## Paleta de cores

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#059669` (emerald-600) | CTAs, links, destaque da marca |
| Secondary | `#1e293b` (slate-800) | Sidebar, textos fortes |
| Accent | `#f59e0b` (amber-500) | Alertas positivos, badges |
| Success | `#22c55e` | Status ativo, vitórias |
| Warning | `#f59e0b` | Avisos |
| Danger | `#ef4444` | Erros, exclusões |
| Info | `#3b82f6` | Informações neutras |
| Neutral | escala zinc | Backgrounds, bordas |

## Tipografia

- **Família:** Inter (Google Fonts)
- **Hierarquia:** H1 2xl–3xl bold, H2 xl semibold, body sm–base, labels sm medium
- **Pesos:** 400, 500, 600, 700

## Grid e espaçamento

- Mobile first: padding base `1rem`, desktop `2rem`
- Grid de cards: 1 col (mobile) → 2 (sm) → 3–4 (lg)
- Tokens: xs 4px → 4xl 96px

## Breakpoints

- sm: 640px | md: 768px | lg: 1024px | xl: 1280px

## Componentes mapeados

Button, Input, Badge, Skeleton, LoadingState, EmptyState, PageHeader, Sidebar, Tables, Cards.

## Estados

- **Hover:** opacity/bg-muted em links e cards
- **Focus:** ring-2 ring-primary
- **Disabled:** opacity-50 pointer-events-none
- **Loading:** spinner + skeleton
- **Empty:** ícone Inbox + CTA
- **Error:** border destructive + mensagem

## Telas implementadas

1. Login | 2. Cadastro | 3. Recuperação de senha | 4. Dashboard | 5. Configurações
6. Campeonatos | 7. Criar campeonato | 8. Times | 9. Criar time | 10. Gestão do time
11. Atletas | 12. Técnicos | 13. Partidas | 14. Classificação | 15. Artilharia
16. Estatísticas | 17. Página pública

## Próximos passos com Figma

1. Conectar MCP e extrair tokens exatos
2. Ajustar cores, radius e shadows
3. Refinar layouts frame a frame
4. Adicionar componentes faltantes (Modal, Drawer, Select Radix, etc.)
