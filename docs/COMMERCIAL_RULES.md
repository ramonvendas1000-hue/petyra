# Regras comerciais e decisões de cobrança

## Confirmado no escopo consolidado

| Plano Business mensal | Valor | Cumulatividade |
|---|---:|---|
| Essencial | R$ 79,90 | Clientes/pets, agenda, CRM e operação básica, app e financeiro básico |
| Pro | R$ 149,90 | Essencial + oportunidades, recorrência, CRM inteligente, WhatsApp, automações e métricas |
| Premium | R$ 249,90 | Essencial + Pro + PetStyle, equipe/gestão e relatórios avançados; IA é futura |

Serviços têm 0% de comissão Petyra. Produtos vendidos pelo app têm 8%; PSP executa split automático. Venda de balcão não recebe automaticamente a regra de 8%. Taxas Pix/cartão do provedor são adicionais à comissão e dependem do contrato com o PSP; não foram inventadas.

O app básico do tutor continua gratuito. Petyra Club (assinatura do tutor), assinatura Business (software do pet shop) e clube de banho/tosa do estabelecimento são três contratos distintos.

## Propostas preservadas, não ativadas

| Tema | Evidência | Estado |
|---|---|---|
| Essencial | 14 dias e até 3 usuários no blueprint | Sugerido; confirmar limites/condições |
| Pro | 30 dias grátis; até 8 usuários no blueprint | Estratégia discutida; confirmar oferta |
| Premium | 30 dias grátis + 50% primeiro mês pago | Oferta planejada; confirmar vigência/elegibilidade |
| Club | R$ 9,90 ou R$ 19,90; 30 dias grátis | Preço e benefícios finais pendentes |
| Club futuro | Camada em torno de R$ 49,90 com parceiros | Futuro, sem lançamento/benefícios prometidos |
| Avisos | Início, D-7, D-3, D-1 no blueprint | Cadência sugerida; confirmar inclusive trial curto |

Nenhuma proposta vira cobrança por existir em `plans.ts`. `billing_offers.approved_at`, versão da divulgação, preço de fornecedor e consentimento devem estar definidos antes da ativação. Validar público Business vs tutor no serviço de assinatura; a FK sozinha não valida a audiência da oferta.

Mostrar plano, valor, moeda/periodicidade, fim do trial, data/valor da primeira cobrança, preço após desconto, renovação automática e caminho de cancelamento. Cadastrar meio de pagamento no início sem guardar número de cartão/CVV. Cancelamento, reembolso, inadimplência, upgrade/downgrade e retomada precisam de políticas aprovadas.

## Decisões técnicas adotadas nesta base

Estes detalhes operacionais não estavam fechados na conversa e devem ser homologados com o PSP antes da produção:

- Valores em centavos inteiros. 8% calculados sobre produtos após desconto alocado à linha; arredondamento half-up por linha.
- Comissão é parte do valor pago, não acréscimo escondido ao tutor. Taxa PSP permanece desconhecida até resposta/conciliação.
- Sinal percentual incide somente em serviços; produtos do carrinho são pagos integralmente. O percentual aceito pela regra técnica é inteiro de 0 a 100; UI pode limitar às opções comerciais aprovadas.
- Sinal não é nova linha de serviço: é uma parcela do mesmo valor. Evitar cobrança dupla.
- Exemplo: serviço R$100, sinal 20%, três produtos de R$50 → total R$250, agora R$170, depois R$80; comissão R$12; parcela bruta do pet shop agora R$158 antes das taxas PSP.
- Sem frete/taxas extras na regra atual (retirada). Caso sejam adicionados, definir alocação e incidência explicitamente.
- Estorno parcial deve usar alocação/snapshot da compra e nunca devolver mais comissão ou valor do que foi capturado.

Referências de produto: [mestre](MASTER_SPEC.md), [decisões abertas](OPEN_DECISIONS.md). Políticas atuais das lojas para assinatura digital/Club ainda precisam de verificação antes do lançamento.
