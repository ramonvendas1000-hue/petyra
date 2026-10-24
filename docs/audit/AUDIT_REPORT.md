# Auditoria Petyra — 24/10/2026

## Conclusão

A base publicada existia, mas era uma fundação de produto: telas demonstrativas, tipos/permissões estáticas, clientes Supabase, documentação resumida e uma migration inicial. Nenhum módulo estava demonstrado ponta a ponta. A afirmação “quase pronto” não corresponde à evidência de código.

A auditoria preservou todos os 32 caminhos originais e a migration 0001. Acrescentou especificação mestre, rastreabilidade, arquitetura, backlog, decisões comerciais, interfaces de integração, regras executáveis e schema complementar. Isso salva o escopo e prepara desenvolvimento; não representa lançamento da V1.

## Fontes e limite de cobertura

- Branch inicial: main, commit `4b7be8dd910512912bc1f4e72950c387dca04fd0`; inventário com SHA de cada arquivo em [BASELINE_FILES.json](BASELINE_FILES.json).
- GitHub retornou somente a branch main na consulta inicial.
- Conversa recuperada: cinco turnos, incluindo resumo consolidado, sem cursor anterior e sem anexos. [Fonte preservada](SOURCE_SCOPE.md). Não foi possível comparar antigos ZIPs/anexos não disponibilizados.
- Não houve acesso a produção, Supabase externo, contas PSP, console das lojas, dados de clientes ou credenciais.

## O que já existia

| Grupo | Evidência original | Situação verificada |
|---|---|---|
| Monorepo | package.json, pnpm-workspace.yaml | Web, mobile e shared; sem lockfile/testes/CI |
| Web | apps/web/app e components/sidebar.tsx | Login sem handler, dashboard com valores fixos, menu sem navegação funcional |
| Mobile | apps/mobile/app | Entrada Tutor/Business e telas estáticas; sem sessão ou operação real |
| Compartilhado | packages/shared/src | Tema Roxo Elétrico, tipos e permissões padrão; helper sem contexto de tenant |
| Backend | clients Supabase web/mobile | Clientes instanciáveis; nenhum serviço/endpoint de negócio |
| Banco | 0001_initial.sql | 17 tabelas, 4 enums, 2 helpers, RLS parcial; ausência de CRUD e integrações |
| Produto | PRODUCT_BLUEPRINT.md e DEVELOPMENT_ROADMAP.md | Boa parte da visão, planos e gate documentados; sem rastreabilidade de implementação |
| Ambiente | .env.example e .gitignore | Quatro campos públicos vazios; sem segredos reais |

Os arquivos originais são mantidos. Mudanças em manifests/configurações e helper de permissões são explícitas no diff; os dois documentos de visão originais e as telas não foram substituídos.

## Achados e tratamento

| Achado | Evidência | Tratamento nesta auditoria | Limite restante |
|---|---|---|---|
| Login e dados não funcionais | Login sem ação; arrays fixos nos dashboards | Estado descrito no README/matriz; protótipos preservados | Implementar Auth, CRUD, navegação e E2E |
| Nota interna/custo em linha visível ao tutor | appointments.internal_notes, products.cost_cents, pets.notes + políticas de SELECT | 0002 restringe colunas e adiciona RPC Business autorizada | Ensaiar em Supabase real e revisar grants/views/Realtime existentes |
| Cargos não aplicados nas principais leituras Business | is_org_member apenas verifica vínculo ativo | has_org_permission, overrides e políticas de leitura por permissão | Completar autorização por operação/escrita |
| Vínculos cruzados possíveis no schema | FKs simples por ID em agenda/itens/mídia | FKs compostas de organização e checks | Regras de pet/tutor/atendimento ainda exigem validação semântica |
| Loja dependia de pet como vínculo implícito | Política products | organization_tutors + vínculo ativo + produtos ativos | Onboarding/CRUD de vínculo ainda ausentes |
| Comissão era somente um campo | order_items.platform_fee_cents | Regra pura 8% produto app / 0% serviço + tests e check SQL de serviço | Sem PSP, split efetivo ou reconciliação operacional |
| Módulos sem persistência | Rewards/ID/assinaturas/estoque etc. apenas em docs | 29 tabelas de fundação em 0003 e contratos TypeScript | Sem endpoint/UI; tabelas novas fechadas a clientes |
| Dependências mobile divergentes do SDK | Expo 57 com Router 6 e RN 0.82 | Versões alinhadas ao bundle oficial Expo; lockfile | Build nativo/dispositivos e revisão das lojas |
| Next.js anterior ao patch de outubro | 16.3.8 | Atualizado para 16.4.1 conforme aviso oficial | Manutenção contínua de dependências |
| Ausência de testes e CI | Inventário original | Testes domínio/SQL, typecheck, cobertura e GitHub Actions | E2E, concorrência real, cargas, backup e homologações |

## Cobertura de todo o escopo

Cada módulo possui requisitos, evidência original, pendências e aceite na [matriz](../SCOPE_MATRIX.json) e na [especificação mestre](../MASTER_SPEC.md).

| ID | Módulo | Antes | Depois desta auditoria |
|---|---|---|---|
| M01 | Web, app único e identidade | Estruturas Next.js/Expo, tema e telas demonstrativas. | Documentação + fundação; pendente de fluxo completo |
| M02 | Autenticação e multi-tenant | Clientes Supabase e tabelas com RLS parcial; login visual sem envio. | Documentação + fundação; pendente de fluxo completo |
| M03 | Equipe, cargos e permissões | Tipos e permissões padrão; vínculo de membros; sem gestão funcional. | Documentação + fundação; pendente de fluxo completo |
| M04 | Tutores, pets, histórico e CRM | Tabelas tutors/pets e crm_opportunities; sem CRUD ou CRM funcional. | Documentação + fundação; pendente de fluxo completo |
| M05 | Central de Oportunidades | Tabela básica; métricas de exemplo na interface. | Documentação + fundação; pendente de fluxo completo |
| M06 | Agenda, sinais e lista de espera | Appointments com profissional/data/sinal; nenhum fluxo interativo. | Documentação + fundação; pendente de fluxo completo |
| M07 | Jornada ao vivo | Enums e appointment_events; telas não conectadas. | Documentação + fundação; pendente de fluxo completo |
| M08 | Fotos antes/depois e histórico visual | Tabela pet_photos e flag visible_to_tutor. | Documentação + fundação; pendente de fluxo completo |
| M09 | PetStyle 3D | Tabela pet_styles com JSON livre; nenhum modelo/renderizador. | Documentação + fundação; pendente de fluxo completo |
| M10 | Documentos, vacinas e passaporte | Tabela pet_documents; dados básicos de peso/microchip. | Documentação + fundação; pendente de fluxo completo |
| M11 | Petyra ID | Somente intenção no blueprint. | Documentação + fundação; pendente de fluxo completo |
| M12 | Loja privada | Tabela products e política baseada no vínculo por pet. | Documentação + fundação; pendente de fluxo completo |
| M13 | Estoque sincronizado | Apenas products.stock_quantity; sem movimentação/reserva. | Documentação + fundação; pendente de fluxo completo |
| M14 | Carrinho, checkout e split | Orders/order_items com campos de taxa, sem cálculo ou gateway. | Documentação + fundação; pendente de fluxo completo |
| M15 | Pagamentos, sinal e saldo | Somente valores de sinal e pedido, sem pagamentos persistidos. | Documentação + fundação; pendente de fluxo completo |
| M16 | Clube de serviços do pet shop | Somente documentação. | Documentação + fundação; pendente de fluxo completo |
| M17 | Notificações | Tabela notifications; sem transporte, tokens ou fila. | Documentação + fundação; pendente de fluxo completo |
| M18 | Rewards, indicação e avaliações | Somente documentação. | Documentação + fundação; pendente de fluxo completo |
| M19 | Financeiro | Indicadores estáticos e campos monetários no pedido. | Documentação + fundação; pendente de fluxo completo |
| M20 | Campanhas e recomendações | Requisitos no blueprint; nenhum motor. | Documentação + fundação; pendente de fluxo completo |
| M21 | IA e expansão futura | Citada nos planos e roadmap; sem implementação. | Futuro documentado, flag desligada |
| M22 | Business: planos, preços e trials | Preços e propostas no blueprint; sem billing. | Documentação + fundação; pendente de fluxo completo |
| M23 | Tutor gratuito e Petyra Club | Benefícios/trial documentados, preço final ausente. | Documentação + fundação; pendente de fluxo completo |
| M24 | Sincronização e infraestrutura | Mesmo fornecedor Supabase, clientes ainda desconectados. | Documentação + fundação; pendente de fluxo completo |
| M25 | Lançamento completo | Gate e roadmap existentes. | Documentação + fundação; pendente de fluxo completo |

## O que foi acrescentado

- Documentação mestre completa, origem recuperada, matriz de 25 módulos, decisões abertas e backlog com dependências/aceite.
- Arquitetura de API, autorização, sincronização, mídia privada, checkout, outbox, notificações e integrações.
- Regras comerciais: preços Business, propostas de trial/Club, diferença entre três assinaturas e split de produtos.
- Pacote domain com cálculo de checkout/sinal, planos cumulativos, jornada, contratos de módulos e interfaces PSP/storage/notificação/3D.
- Complemento de permissões na UI, sem confundi-lo com segurança do servidor.
- Migration 0002 de hardening e integridade; migration 0003 com 29 tabelas novas, categoria/estoque mínimo e versão/confirmação de estilo.
- Testes de duas organizações/tutores, proteção de campos, escrita proibida, taxas, integridade, idempotência e ledger.
- Lockfile, ajustes de dependências, configuração CI e instruções de setup.
- Grafo navegável com proveniência; o grafo não certifica funcionamento de módulo.

## Pendências de implementação e credenciais

Implementação: Auth/onboarding/convites; CRUDs e telas reais; agenda concorrente; sincronização; upload/storage; renderizador/assets 3D; catálogo/carrinho/estoque transacional; webhooks/PSP; assinaturas e estornos; CRM/métricas; Rewards/ID/campanhas; workers de notificação; observabilidade/backup e E2E.

Externos: projetos Supabase; fornecedor/contas/recebedores PSP; push APNs/FCM/Expo; WhatsApp/e-mail; assets 3D licenciados; domínio/hospedagem; contas e assinaturas App Store/Google Play. Nenhuma credencial foi inventada. [Detalhes](../EXTERNAL_INTEGRATIONS.md).

Decisões: preço/benefícios Club, trials definitivos, limites de usuários, cancelamento/sinal, taxas, regras de comissão de equipe, métricas e privacidade. [Lista completa](../OPEN_DECISIONS.md).

## Validação e salvamento

Consultar [VALIDATION.md](VALIDATION.md) para comandos e resultados observados. Commit final e árvore remota devem ser conferidos por SHA antes de encerrar a entrega. O workflow valida o repositório; não publica site/app nem aplica migrations.
