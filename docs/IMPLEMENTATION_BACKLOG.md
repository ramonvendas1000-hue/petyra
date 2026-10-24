# Backlog até a V1

Os marcos originais de DEVELOPMENT_ROADMAP.md foram preservados. Esta ordem adiciona dependências e definição de pronto. Tabela ou contrato TypeScript é fundação, não entrega funcional.

| Ordem | Fatia de trabalho | Depende de | Evidência para encerrar |
|---|---|---|---|
| B01 | Auth web/mobile, onboarding, convites, alternância e permissões | Supabase/staging e e-mail | E2E com dono, funcionário e tutor em duas organizações |
| B02 | CRUD tutores/pets, vínculo privado, serviços e disponibilidade | B01 | Persistência cruzada web/app e isolamento API/Storage |
| B03 | Agenda, sinais, jornada, fotos e galeria | B02, integração pagamento para sinal | Concorrência, eventos, upload, push e saldo testados |
| B04 | CRM, tarefas, oportunidades, retorno, waitlist | B02/B03, definições de métricas | Casos de atraso/risco/recuperação e oferta expirada |
| B05 | Catálogo, estoque, carrinho, pedidos e retirada | B02 | Reserva concorrente, preço autoritativo, mesma loja |
| B06 | PSP, split, Pix/cartão, sinais/saldos, estornos e ledger | B03/B05, D01/D05/D06 | Sandbox + cobrança real controlada aprovada, conciliação |
| B07 | Clube de serviços, franquias e assinatura do pet shop | B06 | Renovação/consumo/cancelamento sem duplicação |
| B08 | Saúde/documentos/passaporte, ID e Club | B01/B06, D03/D10/D11 | Privacidade, QR revogado, quotas, trial e cancelamento |
| B09 | Rewards, indicação, avaliações, campanhas e recomendações | B03/B05/B06, D07/D09 | Pontos consistentes e envio consentido/deduplicado |
| B10 | PetStyle 3D, equipe avançada e relatórios | B03, assets D08, métricas D07 | Web/app no dispositivo real, versões e confirmação |
| B11 | Business billing, ofertas, limites e renovação | B01/B06, D02/D04 | Avisos, consentimento, mudança/cancelamento e cobrança correta |
| B12 | Operação, backups, observabilidade, acessibilidade, QA e lojas | Todas as fatias V1 | Gate integral assinado e evidências anexadas |
| Futuro | Copiloto IA, múltiplas unidades e Club com parceiros | Decisão de expansão | Avaliação/segurança e escopo próprio; não vender como pronto |

Todo item deve atualizar SCOPE_MATRIX.json, testes e grafo. Não marcar como pronto apenas porque compila.

Para cada endpoint: contrato de entrada/saída, identidade validada, política de tenant, idempotência quando necessário, erros, teste negativo de acesso, integração real em staging e UI acessível. Implementar verticalmente, sem expor endpoints que retornem sucesso fictício.
