# Petyra — especificação mestre

Data de consolidação: 23/10/2026. Fonte e limites: [origem](audit/SOURCE_SCOPE.md). Evidências e pendências por módulo: [matriz](SCOPE_MATRIX.json). Esta especificação descreve o produto pretendido; a [auditoria](audit/AUDIT_REPORT.md) distingue o que funciona do que ainda precisa ser feito.

## Regras de produto

1. Petyra Business Web e um único app iOS/Android compartilham backend, dados e regras. A interface muda conforme Tutor, Dono ou Funcionário.
2. O pet shop tem loja privada, sem exposição concorrencial. O tutor pode escolher entre seus vínculos autorizados; um carrinho pertence a um único estabelecimento.
3. Comissão Petyra: 0% em serviços; 8% em produtos vendidos pelo app. Taxas do meio de pagamento são contabilizadas separadamente.
4. Os planos Business são cumulativos. O núcleo do app do tutor continua gratuito. Club é opcional e distinto do clube de serviços vendido pelo pet shop.
5. Segurança e permissões devem valer no servidor, banco, mídia e sincronização. Interface escondida não é controle de acesso.
6. Cada recurso deve economizar tempo, aumentar receita ou melhorar a experiência do tutor. V1 pública depende do gate completo; não há lançamento parcial implícito.
7. IA e múltiplas unidades são evolução futura. Ofertas propostas e benefícios candidatos exigem decisão antes da ativação.

## Jornada de referência

Tutor agenda e confirma → sinal quando exigido → recepção faz check-in → funcionário registra antes → banho/secagem/tosa/finalização conforme serviço → depois → pronto e notificação → tutor paga saldo e retira pet/produtos → avaliação → pontos/retorno/CRM. Web e app consultam o mesmo estado. Etapas clínicas ou de serviços diferentes precisam de checklist próprio; a função de jornada adicionada é uma base para banho/tosa.

## Catálogo completo de módulos

### M01 — Web, app único e identidade

**Escopo:** Business Web completo; app iOS/Android com Tutor, Dono e Funcionário; alternância quando a pessoa acumula papéis; Roxo Elétrico #6D4DFF; dono acompanha os mesmos módulos em interface adaptada.

**Já existia:** Estruturas Next.js/Expo, tema e telas demonstrativas.

**Ainda implementar/configurar:** Sessões reais; navegação dos módulos; layouts responsivos; builds assinadas.

**Aceite:** Web e app exibem o mesmo dado real; nenhum indicador fixo é apresentado como dado de produção.

### M02 — Autenticação e multi-tenant

**Escopo:** Login individual, recuperação, onboarding e convites; banco único; isolamento de cada pet shop; tutor vê somente seus pets e dados compartilhados.

**Já existia:** Clientes Supabase e tabelas com RLS parcial; login visual sem envio.

**Ainda implementar/configurar:** Configurar Auth, SMTP/links, sessão web/mobile, convites e onboarding transacional.

**Aceite:** Duas organizações e dois tutores não obtêm dados alheios por API, RPC, Storage ou Realtime; trocar conta limpa o cache.

### M03 — Equipe, cargos e permissões

**Escopo:** Dono cria funcionários no web; owner, manager, reception, groomer, veterinarian e custom; permissões personalizadas; equipe acompanha agenda, produtividade, metas e comissões.

**Já existia:** Tipos e permissões padrão; vínculo de membros; sem gestão funcional.

**Ainda implementar/configurar:** Telas, convite/aceite, desativação, escopo por profissional, cálculo de produtividade e comissões.

**Aceite:** Funcionário desativado perde acesso; permissão negada prevalece sobre padrão; funcionário não eleva o próprio cargo.

### M04 — Tutores, pets, histórico e CRM

**Escopo:** Cadastro, tags, tarefas, histórico; pipeline Novo contato → Primeiro agendamento → Ativo → Próximo retorno → Atrasado → Em risco → Inativo → Recuperado; frequência média, ticket, LTV e último atendimento.

**Já existia:** Tabelas tutors/pets e crm_opportunities; sem CRUD ou CRM funcional.

**Ainda implementar/configurar:** CRUD, segmentação, critérios de risco e consultas de métricas.

**Aceite:** Receitas usam pagamentos conciliados; frequência usa atendimentos concluídos; cancelados não contam como visitas; segmentos são explicáveis.

### M05 — Central de Oportunidades

**Escopo:** Retornos, atrasos, clientes em risco/inativos, horários vagos, cancelamentos; mostrar dinheiro potencial da base e receita recuperada.

**Já existia:** Tabela básica; métricas de exemplo na interface.

**Ainda implementar/configurar:** Jobs de detecção, deduplicação, atribuição de recuperação, interface e ações.

**Aceite:** Potencial estimado não é somado a receita realizada; uma conversão tem origem rastreável e não duplica receita.

### M06 — Agenda, sinais e lista de espera

**Escopo:** Agenda por profissional, agendamento pelo tutor, confirmação/reagendamento, lembretes, sinal, prevenção de no-show, lista de espera e preenchimento de cancelamentos.

**Já existia:** Appointments com profissional/data/sinal; nenhum fluxo interativo.

**Ainda implementar/configurar:** Disponibilidade, duração, fusos, prevenção de sobreposição, aceite de ofertas e política de cancelamento.

**Aceite:** Duas reservas simultâneas não ocupam a mesma vaga; oferta da lista expira; cancelamento devolve disponibilidade uma vez.

### M07 — Jornada ao vivo

**Escopo:** Agendamento → confirmação/sinal → check-in → foto antes → banho → secagem → tosa → finalização → foto depois → pronto → saldo → retirada → avaliação/retorno; push nas etapas pertinentes.

**Já existia:** Enums e appointment_events; telas não conectadas.

**Ainda implementar/configurar:** Persistir eventos versionados; validar serviço/checklist; sincronizar e notificar.

**Aceite:** Cada transição tem autor/horário; repetição de evento não duplica push; histórico não reabre atendimento encerrado.

### M08 — Fotos antes/depois e histórico visual

**Escopo:** Funcionário fotografa no app; vínculo pet/atendimento; before/after; galeria cronológica; observações internas separadas das compartilhadas.

**Já existia:** Tabela pet_photos e flag visible_to_tutor.

**Ainda implementar/configurar:** Câmera, upload, buckets privados, limites, validação de mídia e URLs temporárias.

**Aceite:** Tutor vê só mídia autorizada de seus pets; revogação impede novas URLs; foto não aparece em outro atendimento ou pet shop.

### M09 — PetStyle 3D

**Escopo:** Modelo 3D, cabeça/orelhas/focinho/peito/corpo/patas/cauda; comprimento, máquina/pente/tesoura, observações, referência; salvar/repetir; tutor seleciona/confirma.

**Já existia:** Tabela pet_styles com JSON livre; nenhum modelo/renderizador.

**Ainda implementar/configurar:** Assets 3D licenciados, renderizador web/mobile, editor, versionamento e confirmação.

**Aceite:** Mesmo estilo e versão em web/app; regiões persistem; repetir cria nova versão; confirmação fica registrada.

### M10 — Documentos, vacinas e passaporte

**Escopo:** Vacinas, exames, receitas, medicamentos, peso, alergias, microchip e passaporte digital; armazenamento/histórico ampliados no Club.

**Já existia:** Tabela pet_documents; dados básicos de peso/microchip.

**Ainda implementar/configurar:** Upload privado, dados estruturados, vencimentos, gráficos, quotas e compartilhamento familiar.

**Aceite:** Documento interno não fica público; lembrete respeita data e preferências; recursos básicos gratuitos não viram pagos por engano.

### M11 — Petyra ID

**Escopo:** QR de perda/emergência com dados escolhidos pelo tutor e aviso de escaneamento.

**Já existia:** Somente intenção no blueprint.

**Ainda implementar/configurar:** Geração/rotação de token, endpoint público restrito, consentimento, rate limit e aviso deduplicado.

**Aceite:** QR não expõe pet_id como autorização; token revogado deixa de funcionar; nenhum documento clínico é publicado automaticamente.

### M12 — Loja privada

**Escopo:** Loja própria por estabelecimento; sem marketplace/vitrine concorrencial; produtos, fotos, preços e estoque; tutor só vê o pet shop ao qual está vinculado.

**Já existia:** Tabela products e política baseada no vínculo por pet.

**Ainda implementar/configurar:** Catálogo, seleção de vínculo ativo, administração, disponibilidade e retirada.

**Aceite:** Vínculo inativo perde catálogo; URL/ID manipulado não acessa outra loja; custo interno não é retornado ao tutor.

### M13 — Estoque sincronizado

**Escopo:** SKU, categoria, custo, preço, quantidade, mínimo, foto/status; estoque web/app/loja/balcão; baixa, retorno e ajuste.

**Já existia:** Apenas products.stock_quantity; sem movimentação/reserva.

**Ainda implementar/configurar:** Interface de catálogo, transações atômicas, reserva com TTL e reconciliação. Categoria e estoque mínimo já têm colunas na fundação.

**Aceite:** Última unidade só é vendida uma vez; pagamento duplicado não baixa novamente; expiração/cancelamento libera reserva.

### M14 — Carrinho, checkout e split

**Escopo:** Carrinho com serviços e produtos; retirada junto do pet; 8% somente em produtos vendidos pelo app; 0% serviços; PSP divide automaticamente; taxas do PSP separadas.

**Já existia:** Orders/order_items com campos de taxa, sem cálculo ou gateway.

**Ainda implementar/configurar:** Adaptador PSP, checkout web/app, confirmação por webhook, estoque transacional, estorno e homologação.

**Aceite:** Serviço R$100 + 3 produtos de R$50 gera taxa Petyra R$12; serviço sozinho e venda balcão não geram 8%; conciliação fecha centavos.

### M15 — Pagamentos, sinal e saldo

**Escopo:** Pix/cartão; sem sinal, 10/20/30/50% ou integral; saldo depois; financeiro automático.

**Já existia:** Somente valores de sinal e pedido, sem pagamentos persistidos.

**Ainda implementar/configurar:** Escolher PSP, KYC/recebedores, tokenização hospedada, webhooks assinados, tentativas, reembolso e disputa.

**Aceite:** Pedido só é pago após confirmação confiável; sinal não quita o total; duplicata/fora de ordem não duplica receita ou repasse.

### M16 — Clube de serviços do pet shop

**Escopo:** Pet shop cria planos mensais de serviços com preço, visitas por ciclo, validade e regras. O tutor escolhe entre aderir ao pacote (ex.: quatro banhos/mês) ou pagar cada atendimento avulso; acompanha cobranças e visitas no app. O clube de serviços do estabelecimento é distinto do Petyra Club. Cobrança pertence ao estabelecimento; serviços sem 8% de comissão de produto.

**Já existia:** Somente documentação.

**Ainda implementar/configurar:** Planos, PSP recorrente, ciclo, franquias, saldo de visitas, consumo idempotente, política de visitas não usadas, pausa/cancelamento/falha de cobrança e checkout avulso.

**Aceite:** Cada atendimento consome a franquia uma vez; renovação reinicia o ciclo; plano e avulso podem ser usados sem dupla cobrança; tutor vê preço, saldo, validade e cancelamento; serviços não recebem comissão de produto.

### M17 — Notificações

**Escopo:** Push e WhatsApp conforme necessidade, e-mail quando útil; confirmação, lembrete, jornada, pet/pedido pronto, retorno, vacinas, campanhas, pagamento, trial/renovação.

**Já existia:** Tabela notifications; sem transporte, tokens ou fila.

**Ainda implementar/configurar:** APNs/FCM/Expo, WhatsApp, e-mail, consentimento, preferências, retry, recibos e tokens inválidos.

**Aceite:** Evento idempotente por destinatário/canal; ausência de consentimento bloqueia campanha; falha externa não perde evento.

### M18 — Rewards, indicação e avaliações

**Escopo:** Cartão fidelidade simples por pet shop, configurável por atendimento/compra/indicação convertida. Ex.: um carimbo por banho pago e concluído, oito carimbos liberam um banho; tutor vê progresso, recompensa, validade e histórico no perfil do pet. Inclui promoções e solicitação de avaliação após atendimento.

**Já existia:** Somente documentação.

**Ainda implementar/configurar:** Configuração, ledger, regras, crédito após evento elegível, resgate atômico, validade, estorno, antifraude de indicação e avaliação vinculada.

**Aceite:** Tutor entende como ganhar e resgatar; resgate concorrente não gera saldo negativo; estorno compensa créditos; o pet shop só credita operação concluída; autoindicação não recebe benefício.

### M19 — Financeiro

**Escopo:** Faturamento, sinais, pendências, serviços/produtos/app, ticket médio, comissões da equipe, receita recuperada e relatórios; separar receita recorrente confirmada de receita provável e oportunidades em previsão de 30/60/90 dias.

**Já existia:** Indicadores estáticos e campos monetários no pedido.

**Ainda implementar/configurar:** Conciliação, livro de lançamentos, saldo, filtros, exportação, métricas e previsão auditável sem dupla contagem.

**Aceite:** Separar recebido/a receber, taxa Petyra/taxa PSP/comissão de funcionário; devoluções geram compensação rastreável.

### M20 — Campanhas e recomendações

**Escopo:** Campanhas segmentadas, promoções da loja, sugestões de produtos conforme pet/atendimento e pós-venda; prever renovações, identificar horários livres e clientes próximos do retorno, sugerindo reativação, lembrete de ciclo ou plano mensal.

**Já existia:** Requisitos no blueprint; nenhum motor.

**Ainda implementar/configurar:** Segmentação, regras de previsão, aprovação, canais, consentimentos/preferências, frequência, mensuração e atribuição sem dupla contagem.

**Aceite:** Receita realizada, confirmada e estimada ficam separadas; recomendações usam somente dados do pet shop ativo; campanha respeita consentimento/frequência e sua conversão tem origem rastreável.

### M21 — IA e expansão futura

**Escopo:** Copiloto: quem chamar, explicar queda de receita e propor campanhas/ações; múltiplas unidades futuras.

**Já existia:** Citada nos planos e roadmap; sem implementação.

**Ainda implementar/configurar:** Produto futuro: provedor/modelo, avaliação, acesso mínimo, custos, supervisão humana e políticas de dados.

**Aceite:** Desabilitado até decisão explícita; não prometer IA disponível no Premium; nenhuma campanha/cobrança autônoma sem autorização.

### M22 — Business: planos, preços e trials

**Escopo:** Essencial R$79,90; Pro R$149,90 cumulativo; Premium R$249,90 cumulativo; pagamento cadastrado, renovação e avisos; Pro 30 dias, Premium 30 dias + 50% no primeiro mês foram discutidos.

**Já existia:** Preços e propostas no blueprint; sem billing.

**Ainda implementar/configurar:** Aprovar ofertas/datas/limites, criar preços no PSP, consentimento, mudança de plano e cancelamento.

**Aceite:** Preço e primeira cobrança claramente exibidos; desconto só no primeiro mês pago; propostas não ativam cobrança automaticamente.

### M23 — Tutor gratuito e Petyra Club

**Escopo:** App básico gratuito para agenda, confirmações, notificações, pagamentos, loja e pets; Club opcional com documentos/gastos/histórico/ID/benefícios; candidatos R$9,90/R$19,90; camada futura ~R$49,90.

**Já existia:** Benefícios/trial documentados, preço final ausente.

**Ainda implementar/configurar:** Decidir preço, quotas, benefícios por nível, billing digital e políticas das lojas; trial proposto de 30 dias.

**Aceite:** Recusar Club mantém núcleo gratuito; cancelamento impede próxima renovação; lembretes precedem cobrança.

### M24 — Sincronização e infraestrutura

**Escopo:** Backend/banco únicos, quase tempo real; ambiente de staging separado; web/app consistentes.

**Já existia:** Mesmo fornecedor Supabase, clientes ainda desconectados.

**Ainda implementar/configurar:** API, RLS por operação, Realtime, cache por tenant, retomada offline, Storage, backups e observabilidade.

**Aceite:** Reconnect recupera eventos perdidos; eventos não são fonte de verdade de pagamento; restauração de backup comprovada.

### M25 — Lançamento completo

**Escopo:** Não lançar pela metade: módulos V1 integrados, testados; web no ar e app aprovado App Store/Google Play; cada recurso economiza tempo, aumenta receita ou melhora experiência.

**Já existia:** Gate e roadmap existentes.

**Ainda implementar/configurar:** Executar backlog e critérios de aceite; resolver decisões e dependências; homologar segurança/cobranças; publicar depois de aprovação.

**Aceite:** Nenhum item V1 é considerado entregue só por existir doc/tabela; IA/multiunidade futuras não são vendidas como prontas.

## Decisões e linguagem comercial

A fonte consolidada contém preços fixos Business e propostas de trial/Club. O blueprint acrescenta limites sugeridos de 3/8 usuários e trial Essencial de 14 dias. Preserve essas propostas sem tratá-las como aprovação final. Consulte [regras comerciais](COMMERCIAL_RULES.md) e [decisões abertas](OPEN_DECISIONS.md). O termo antigo “PetFlow” aparece no blueprint preservado; o nome de referência desta consolidação é Petyra.
