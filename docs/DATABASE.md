# Banco e segurança

## Migrations preservadas e adicionadas

- 0001_initial.sql: original, 17 tabelas, 4 enums e 2 funções auxiliares. RLS habilitada, mas poucas políticas e quase nenhuma escrita autorizada. Não era um backend funcional.
- 0002_access_and_integrity.sql: permission_overrides, has_org_permission, vínculo explícito organization_tutors, grants por coluna, RPCs Business para notas/custos, FKs compostas de tenant, checks e índices. Dados antigos permanecem.
- 0003_v1_module_foundations.sql: 29 tabelas de apoio para CRM, waitlist, estoque, pagamentos/ledger, ofertas/assinaturas, clubes, Rewards, campanhas, saúde/ID, notificações, equipe e auditoria. RLS ativada e acesso de anon/authenticated revogado por padrão.

Total após as migrations: 47 tabelas públicas. Novas tabelas não possuem políticas de CRUD para usuários; implementá-las junto dos respectivos endpoints e testes. service_role pode operar tabelas internas e deve ficar restrito a processos de confiança.

## Relações e invariantes

Organizações têm membros e vínculos de tutor. Pets pertencem ao modelo existente de uma organização opcional; pet_tutors dá propriedade ao tutor. Agendamentos, mídia, estilos, pedidos e itens referenciam registros da mesma organização por FK composta.

O backfill de organization_tutors usa pets/pet_tutors legados. Se houver pedido antigo com tutor sem vínculo, registro cruzado de organizações, valor negativo ou item inválido, 0002 aborta e reverte a transação. Fazer preflight em cópia do banco; corrigir a origem com decisão explícita, sem apagar dados para forçar a migration.

Ainda exigir no serviço: pet da foto corresponde ao pet do atendimento (FK de tenant não prova isso), tutor do pedido possui o pet do atendimento, disponibilidade de profissional, membership ativo na escrita, limites de reembolso/franquia/pontos, audiência da oferta, validade do consentimento e verificação do webhook. Essas regras não são prometidas como prontas.

Ledger financeiro e de pontos é append-only: UPDATE/DELETE falham. Usar compensações. IDs de webhook e chaves idempotentes têm unicidade, mas o worker transacional ainda precisa ser escrito.

## Acesso e testes

RLS não esconde colunas. 0002 retira SELECT de tabela de appointments/products/pets e concede apenas colunas seguras; não usar SELECT *. Notas/custos retornam somente pelas funções autorizadas. Campos originais não foram apagados nem deslocados.

Os testes PGlite executam os três arquivos SQL completos com pgcrypto. O harness cria apenas auth.users, auth.uid e papéis/grants equivalentes necessários para simular chamadas autenticadas. Não substitui Supabase Auth, PostgREST, Storage, Realtime ou concorrência real de múltiplas conexões.

Rodar `pnpm test:db`. Antes de produção: aplicar em Supabase staging, verificar grants reais (inclusive grants preexistentes de coluna), políticas de Storage/Realtime, índices, transações concorrentes e restauração. Políticas/RPCs existentes fora deste GitHub não foram auditadas.

Referências técnicas: [RLS no Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security), [segurança por coluna](https://supabase.com/docs/guides/database/postgres/column-level-security), [PGlite](https://pglite.dev/docs/). As regras específicas da Petyra são decisões de implementação descritas aqui.
