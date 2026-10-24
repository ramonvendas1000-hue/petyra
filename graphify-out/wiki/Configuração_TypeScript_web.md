# Configuração TypeScript web

> 18 nodes · cohesion 0.12

## Key Concepts

- **0002_access_and_integrity.sql** (8 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **Princípio — organization_id e isolamento multi-tenant** (7 connections) — `README.md`
- **README — base inicial declarada** (5 connections) — `README.md`
- **security.test.mjs** (5 connections) — `supabase/tests/security.test.mjs`
- **SQL table — organization_tutors** (4 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL function — read_business_pet_notes** (2 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **asUser()** (2 connections) — `supabase/tests/security.test.mjs`
- **q()** (2 connections) — `supabase/tests/security.test.mjs`
- **Identidade — Roxo Elétrico** (2 connections) — `README.md`
- **SQL function — has_org_permission** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL function — is_org_member** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL function — is_pet_tutor** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL function — read_business_appointment_private** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL function — read_business_product_cost** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL policy — business client links** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **SQL policy — own active business links** (1 connections) — `supabase/migrations/0002_access_and_integrity.sql`
- **db** (1 connections) — `supabase/tests/security.test.mjs`
- **id()** (1 connections) — `supabase/tests/security.test.mjs`

## Relationships

- [Escopo e regras planejadas](Escopo_e_regras_planejadas.md) (4 shared connections)
- [Telas e cliente web](Telas_e_cliente_web.md) (1 shared connections)
- [Pacote compartilhado](Pacote_compartilhado.md) (1 shared connections)
- [Migração SQL inicial](Migra%C3%A7%C3%A3o_SQL_inicial.md) (1 shared connections)
- [Tipos tema e permissões](Tipos_tema_e_permiss%C3%B5es.md) (1 shared connections)

## Source Files

- `README.md`
- `supabase/migrations/0002_access_and_integrity.sql`
- `supabase/tests/security.test.mjs`

## Audit Trail

- EXTRACTED: 39 (85%)
- INFERRED: 7 (15%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*