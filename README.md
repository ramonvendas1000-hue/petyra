# Petyra

Base inicial do ecossistema Petyra.

## Estado verificado em 23/10/2026

O repositório contém protótipos web/app, fundações de banco e regras de domínio; a V1 ainda não está operacional. Dados de tela são demonstrativos. Não há autenticação funcional, PSP, envio de notificações, editor 3D ou app publicado configurados.

- [Documentação mestre de todo o escopo](docs/MASTER_SPEC.md)
- [Auditoria: o que existia, o que foi acrescentado e pendências](docs/audit/AUDIT_REPORT.md)
- [Matriz de 25 módulos e critérios de aceite](docs/SCOPE_MATRIX.json)
- [Arquitetura e contratos](docs/ARCHITECTURE.md)
- [Banco e limites das migrations](docs/DATABASE.md)
- [Preços, trials e regras de cobrança](docs/COMMERCIAL_RULES.md)
- [Backlog de implementação](docs/IMPLEMENTATION_BACKLOG.md), [decisões abertas](docs/OPEN_DECISIONS.md) e [gate de lançamento](docs/RELEASE_GATE.md)
- [Configuração e testes](docs/DEVELOPMENT_SETUP.md), [integrações externas](docs/EXTERNAL_INTEGRATIONS.md)
- [Entrar pelo grafo de conhecimento](graphify-out/wiki/index.md)

`pnpm check` valida regras, migrations, tipos e rastreabilidade. Esses checks não certificam a V1 pronta. Nenhum segredo foi incluído e nenhuma migration foi aplicada a produção.

## Estrutura

- `apps/web` — Petyra Business Web (Next.js)
- `apps/mobile` — app único Petyra para Tutor, Proprietário e Funcionários (Expo/React Native)
- `packages/shared` — tema, tipos e permissões compartilhadas
- `packages/domain` — regras de checkout/jornada/planos, contratos e interfaces de integração
- `supabase/migrations` — modelo de dados e segurança multi-tenant

## Identidade

Paleta oficial **Roxo Elétrico**:

- Principal: `#6D4DFF`
- Apoio: `#8B5CFF`
- Texto/contraste: `#171A3A`
- Fundo lavanda: `#F3EFFF`
- Destaque verde: `#54E0C7`

## Princípios de arquitetura

1. Um único backend e banco para web + app.
2. Toda informação de negócio pertence a uma organização (`organization_id`).
3. Tutor só acessa seus próprios pets/dados permitidos.
4. Funcionário só acessa módulos liberados pelo dono do pet shop.
5. Proprietário pode alternar entre modo Business e modo Tutor se possuir ambos.
6. RLS no Postgres é parte da segurança, não apenas validação no frontend.

## Próximas implementações

- autenticação real web/mobile
- onboarding de pet shop
- equipe + permissões
- agenda e jornada do pet
- CRM/oportunidades
- fotos antes/depois
- loja, estoque, checkout e split
- notificações push/WhatsApp
- assinaturas Business e Club
- PetStyle 3D
