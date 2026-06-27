# Conectar Figma — Liga Certa

Para replicar **fielmente** o layout do Figma (`PROJETO — LIGA CERTA`), é necessário liberar acesso ao arquivo.

**Arquivo:** https://www.figma.com/design/rIdD4kxCwOwptXyIJgLXUI/PROJETO---LIGA-CERTA  
**Node de referência:** `221-12` (Login ou tela principal)

---

## Opção A — MCP no Cursor (recomendado)

1. Abra o Cursor neste projeto
2. No chat do Agent, digite: `/add-plugin figma`
3. Autorize sua conta Figma
4. Confirme em **Settings → Features → MCP Servers** que o Figma está verde
5. Avise no chat: **"MCP Figma conectado"**

---

## Opção B — Token + script de sync

1. Figma → **Settings** → **Security** → **Personal access tokens**
2. **Generate new token** (escopo: leitura de arquivos)
3. Crie `.env` na raiz do projeto:

```env
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxx
```

4. Execute:

```bash
npm run figma:sync
```

5. Isso gera `docs/figma-export.json` com páginas, frames, cores e tipografia
6. Avise no chat: **"Figma sync concluído"**

---

## O que acontece depois

Com MCP ou `figma-export.json`, o Agent irá:

1. Mapear **todas as telas** do arquivo
2. Atualizar **tokens** (cores, fontes, radius, spacing)
3. Refazer **layouts** (Login, Dashboard, Sidebar, etc.) pixel a pixel
4. Ajustar **componentes** do design system

---

## Por que o layout atual não bate com o Figma?

O frontend foi criado **sem acesso ao Figma** (você confirmou que não tinha MCP). O layout atual usa um template genérico (sidebar verde + Inter). **Não reflete seu design original.**

Após conectar Figma, todas as telas serão refeitas conforme o arquivo.
