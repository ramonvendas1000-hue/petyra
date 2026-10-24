# Verificação da base — 24/10/2026

- `pnpm check`: passou. Inclui 8 testes de regras, 9 testes de migrations/RLS no PostgreSQL WASM, typecheck dos quatro pacotes e checagem de 25 módulos/32 caminhos originais.
- `pnpm build:web`: passou com Next.js 16.4.1; rotas estáticas `/`, `/login` e `/_not-found` geradas.
- `expo install --check`: dependências reportadas compatíveis pelo SDK antes da última correção de peer dependency; depois foi adicionado `react-native-reanimated` compatível e a exportação completa confirmou resolução/bundling.
- `expo export --platform ios --platform android`: passou; bundle iOS e Android gerados (1.104 e 1.241 módulos). Isso não é build assinado, teste em aparelho ou aprovação/publicação nas lojas.
- `git diff --check`: passou antes das últimas inclusões documentais.

Limites: os testes de banco usam PGlite, Auth sintético e papéis locais; não são uma verificação de projeto Supabase remoto. As migrations não foram aplicadas a produção/staging. Não há teste E2E web/app, cobrança PSP real, envio de push/WhatsApp ou restauração de backup.
