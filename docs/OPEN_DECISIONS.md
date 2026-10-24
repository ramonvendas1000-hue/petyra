# Decisões ainda abertas

Nenhum item abaixo foi aprovado automaticamente pela auditoria.

| ID | Decisão | Efeito / responsável esperado |
|---|---|---|
| D01 | PSP, taxas, Pix/cartão, split, estorno, chargeback, recebedores e prazos | Dono do produto + integração; bloqueia cobranças reais |
| D02 | Oferta definitiva de trial Essencial/Pro/Premium, elegibilidade, vigência e desconto | Dono do produto; propostas em COMMERCIAL_RULES |
| D03 | Preço Club, quotas, benefícios gratuitos/pagos, compartilhamento familiar e camada de parceiros | Dono do produto; não cobrar candidatos |
| D04 | Limites de usuários (3/8 sugeridos), Premium, unidades e regras de upgrade | Dono do produto; não remover acesso por limite ainda indefinido |
| D05 | No-show, cancelamento, sinal, reagendamento, prazo de reserva e restituição | Operação + produto; aplica à agenda/PSP |
| D06 | Rounding por linha, descontos e produtos pagos integralmente em carrinho com sinal | Integração + produto; convenção técnica atual exige homologação |
| D07 | Limiares de risco/retorno, atribuição de receita recuperada, LTV e comissões da equipe | Produto + operação; evitar métricas sem definição |
| D08 | Assets 3D, espécies/modelos, licença, renderer e desempenho mínimo | Design + engenharia |
| D09 | Prestadores push/WhatsApp/e-mail, consentimentos, quotas/custos e templates | Produto + integrações |
| D10 | Retenção/exclusão/exportação, acesso familiar, conteúdo público do ID e documentação legal | Produto + revisão competente; não há parecer jurídico nesta auditoria |
| D11 | Provedor de hospedagem, domínios, contas das lojas, assinatura nativa e estratégia de billing digital | Titular das contas + engenharia |
| D12 | Recorte de IA/multiunidade futuro e eventual ativação de benefícios Premium | Produto; flags desligadas por padrão |
| D13 | Acesso do mesmo pet a múltiplos estabelecimentos sem compartilhar histórico interno | Produto + arquitetura; base preservada modela pet com organization_id; não migra para histórico global sem decisão |
| D14 | Campos de estoque mínimo/categoria e regras de promoções/recomendações | Produto + commerce; registrar antes de UI/estoque real |

Próximas decisões não bloqueiam salvar o escopo e a estrutura no GitHub; bloqueiam ativar a função correspondente em produção.
