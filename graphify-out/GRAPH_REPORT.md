# Graph Report - .  (2026-10-24)

## Corpus Check
- 57 files · ~20,209 words
- Verdict: corpus is large enough that graph structure adds value.

## Evidence boundary

Documented features remain requirements or plans unless separately verified. AST and SQL nodes establish source presence only. SQL DDL was enumerated deterministically because this graphify installation skips SQL AST extraction. This graph does not certify migrations have run, secure policies, working payments, or release readiness.

## Summary
- 398 nodes · 564 edges · 26 communities (18 shown, 8 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.92)
- Token usage/cost: unavailable; this runtime exposes no agent token counts. No external LLM/API call was used. Unknown is not zero.

## Community Hubs (Navigation)

Use [wiki/index.md](wiki/index.md) for working agent navigation. Names below identify communities; no Obsidian vault was generated.
- Escopo e regras planejadas
- Migração SQL inicial
- Arquitetura e aplicativo móvel
- Dependências do aplicativo móvel
- Tipos tema e permissões
- Dependências da aplicação web
- Telas e cliente web
- Configuração do monorepo
- Configuração TypeScript web
- Configuração Expo nativa
- Pacote compartilhado
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25

## God Nodes (most connected - your core abstractions)
1. `Product Blueprint V1 — escopo planejado` - 40 edges
2. `Arquitetura declarada — app único Tutor e Business` - 16 edges
3. `compilerOptions` - 15 edges
4. `Arquitetura declarada — Business Web / Next.js` - 14 edges
5. `SQL table — organizations` - 13 edges
6. `SQL table — appointments` - 12 edges
7. `TenantEntity` - 11 edges
8. `SQL table — profiles` - 11 edges
9. `expo` - 10 edges
10. `SQL table — pets` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Perfil planejado — Funcionários e permissões` --conceptually_related_to--> `SQL table — organization_members`  [INFERRED]
  docs/PRODUCT_BLUEPRINT.md → supabase/migrations/0001_initial.sql
- `Perfil planejado — Tutor e privacidade dos pets` --conceptually_related_to--> `SQL table — tutors`  [INFERRED]
  docs/PRODUCT_BLUEPRINT.md → supabase/migrations/0001_initial.sql
- `Planejado — Agenda e confirmação` --conceptually_related_to--> `SQL table — appointments`  [INFERRED]
  docs/PRODUCT_BLUEPRINT.md → supabase/migrations/0001_initial.sql
- `Planejado — Jornada do pet em 14 etapas` --conceptually_related_to--> `SQL table — appointment_events`  [INFERRED]
  docs/PRODUCT_BLUEPRINT.md → supabase/migrations/0001_initial.sql
- `Planejado — Fotos antes/depois e histórico` --conceptually_related_to--> `SQL table — pet_photos`  [INFERRED]
  docs/PRODUCT_BLUEPRINT.md → supabase/migrations/0001_initial.sql

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Arquitetura planejada — backend único web/app** — web, app, core, tenant [EXTRACTED 1.00]
- **Política planejada — checkout, sinal e comissão por tipo** — checkout, deposit, commission, psp_split [EXTRACTED 1.00]
- **Gate conjunto de lançamento público** — launch_gate, rls_gate, release_qa, privacy_gate [EXTRACTED 1.00]

## Communities (26 total, 8 thin omitted)

### Community 0 - "Escopo e regras planejadas"
Cohesion: 0.09
Nodes (51): Futuro — IA / copiloto, Arquitetura declarada — app único Tutor e Business, Planejado — Agenda e confirmação, Planejado — Checkout unificado, Planejado — Petyra Club opcional, Regra declarada — Club 30 dias e renovação, Regra — comissão 8% produtos / 0% serviços, Arquitetura declarada — backend Core compartilhado (+43 more)

### Community 1 - "Migração SQL inicial"
Cohesion: 0.10
Nodes (37): SQL function — is_org_member, SQL function — is_pet_tutor, SQL table — appointment_events, SQL table — appointments, SQL table — crm_opportunities, SQL table — notifications, SQL table — order_items, SQL table — orders (+29 more)

### Community 2 - "Arquitetura e aplicativo móvel"
Cohesion: 0.08
Nodes (34): AppointmentRequest, Campaign, CrmTask, CustomerMetrics, CustomerRecord, CustomerStage, EmployeePerformance, HealthRecord (+26 more)

### Community 3 - "Dependências do aplicativo móvel"
Cohesion: 0.06
Nodes (30): dependencies, expo, expo-constants, expo-linking, @expo/metro-runtime, expo-router, expo-status-bar, @petyra/shared (+22 more)

### Community 4 - "Tipos tema e permissões"
Cohesion: 0.08
Nodes (30): SQL function — reject_ledger_mutation, SQL table — audit_events, SQL table — billing_offers, SQL table — campaigns, SQL table — commission_entries, SQL table — crm_tasks, SQL table — customer_crm, SQL table — finance_ledger (+22 more)

### Community 5 - "Dependências da aplicação web"
Cohesion: 0.09
Nodes (18): CheckoutLine, integer(), MAX, quoteCheckout(), QuotedLine, SalesChannel, assertTenantPermission(), canAdvanceJourney() (+10 more)

### Community 6 - "Telas e cliente web"
Cohesion: 0.12
Nodes (17): Arquitetura declarada — tema, tipos e permissões compartilhadas, compilerOptions, module, moduleResolution, noEmit, strict, target, include (+9 more)

### Community 7 - "Configuração do monorepo"
Cohesion: 0.10
Nodes (20): dependencies, next, @petyra/shared, react, react-dom, @supabase/ssr, @supabase/supabase-js, devDependencies (+12 more)

### Community 8 - "Configuração TypeScript web"
Cohesion: 0.12
Nodes (15): README — base inicial declarada, SQL function — has_org_permission, SQL function — is_org_member, SQL function — is_pet_tutor, SQL function — read_business_appointment_private, SQL function — read_business_pet_notes, SQL function — read_business_product_cost, SQL table — organization_tutors (+7 more)

### Community 9 - "Configuração Expo nativa"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 10 - "Pacote compartilhado"
Cohesion: 0.13
Nodes (5): metadata, items, Sidebar(), stats, Arquitetura declarada — Business Web / Next.js

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (16): devDependencies, @electric-sql/pglite, engines, node, name, packageManager, private, scripts (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): package, expo, android, ios, name, orientation, plugins, scheme (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): compilerOptions, allowImportingTsExtensions, module, moduleResolution, noEmit, noUncheckedIndexedAccess, skipLibCheck, strict (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (9): devDependencies, typescript, exports, name, private, scripts, typecheck, type (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (9): devDependencies, typescript, exports, name, private, scripts, typecheck, type (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, include

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): baseline, ids, matrix

## Knowledge Gaps
- **209 isolated node(s):** `name`, `slug`, `scheme`, `version`, `orientation` (+204 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Arquitetura declarada — tema, tipos e permissões compartilhadas` connect `Telas e cliente web` to `Configuração TypeScript web`, `Escopo e regras planejadas`, `Community 14`?**
  _High betweenness centrality (0.325) - this node is a cross-community bridge._
- **Why does `README — base inicial declarada` connect `Configuração TypeScript web` to `Escopo e regras planejadas`, `Pacote compartilhado`, `Telas e cliente web`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Why does `Arquitetura declarada — app único Tutor e Business` connect `Escopo e regras planejadas` to `Dependências do aplicativo móvel`, `Configuração TypeScript web`, `Community 12`, `Community 16`, `Community 18`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.279) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Arquitetura declarada — app único Tutor e Business` (e.g. with `index.tsx` and `_layout.tsx`) actually correct?**
  _`Arquitetura declarada — app único Tutor e Business` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `Arquitetura declarada — Business Web / Next.js` (e.g. with `layout.tsx` and `sidebar.tsx`) actually correct?**
  _`Arquitetura declarada — Business Web / Next.js` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `slug`, `scheme` to the rest of the system?**
  _209 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Escopo e regras planejadas` be split into smaller, more focused modules?**
  _Cohesion score 0.09084556254367575 - nodes in this community are weakly interconnected._