# Petyra

Base inicial do ecossistema Petyra.

## Estrutura

- `apps/web` — Petyra Business Web (Next.js)
- `apps/mobile` — app único Petyra para Tutor, Proprietário e Funcionários (Expo/React Native)
- `packages/shared` — tema, tipos e permissões compartilhadas
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
