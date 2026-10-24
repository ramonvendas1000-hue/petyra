# Desenvolvimento e validação

## Preparar cópia local

Requer Node 22.16+ e pnpm 10.15.0 (packageManager na raiz).

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build:web
pnpm --filter @petyra/mobile exec expo install --check
pnpm --filter @petyra/mobile exec expo export --platform ios --platform android --output-dir dist
```

O lockfile fixa a resolução de dependências. As versões mobile foram alinhadas ao bundle do SDK Expo 57. Manter React/React Native compatíveis com esse SDK, sem atualizar uma dependência isoladamente.

Para desenvolvimento: `pnpm dev:web` e `pnpm dev:mobile`. As telas ainda são protótipos. Copiar somente variáveis públicas apropriadas de .env.example para apps/web/.env.local e apps/mobile/.env; guardar segredos dos futuros handlers no ambiente servidor. O .env da raiz não é carregado automaticamente por ambos os apps.

## Banco

`pnpm test:db` executa SQL em PostgreSQL WASM local via PGlite, com dados sintéticos e auth.uid simulado. Não precisa de chave Supabase nem toca produção.

Para Supabase real, criar projeto de staging separado, configurar Auth e aplicar migrations em ordem com ferramenta de migração controlada. Se o esquema já existe, registrar corretamente o histórico de 0001 em vez de executá-la novamente. Fazer backup e preflight descritos em DATABASE.md. Não há deploy de banco automatizado neste repositório.

## O que os comandos provam

- `pnpm test`: regras financeiras puras, permissões de contexto, planos e transições.
- `pnpm test:db`: SQL completo, integridade e casos de segurança de duas organizações/tutores.
- `pnpm typecheck`: contratos e código dos quatro pacotes (web/mobile/shared/domain).
- `pnpm audit:coverage`: rastreabilidade documental e preservação dos caminhos originais; não mede conclusão funcional.
- Build web e export mobile: compilação/bundle, não E2E nem aprovação das lojas.
- GitHub Actions repete os checks; não faz deploy, não publica app, não aplica migrations e não cria cobranças.

## Navegar pelo grafo

Começar por graphify-out/wiki/index.md. Com Graphify instalado: `graphify query "loja checkout split"`. Artefatos de grafo precisam ser regenerados quando as fontes mudam. Um nó representa evidência estática ou requisito documentado, não funcionalidade homologada.

## Referências de dependências

Next.js foi atualizado de 16.3.8 para 16.4.1 conforme o [aviso oficial de 14/10/2026](https://nextjs.org/blog/nextjs-security-update-october-14-2026). O alinhamento mobile foi obtido de expo install --fix e bundledNativeModules.json do SDK instalado; consultar a [referência Expo](https://docs.expo.dev/versions/latest/) ao atualizar.
