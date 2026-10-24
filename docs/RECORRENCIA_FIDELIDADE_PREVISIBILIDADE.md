# Petyra — recorrência, fidelidade e previsibilidade

## Objetivo

Ajudar cada pet shop a aumentar a frequência de retorno e organizar a receita futura sem obrigar o tutor a assinar. O tutor pode manter o pagamento por atendimento ou escolher um pacote mensal do estabelecimento.

Este escopo pertence ao **clube de serviços do pet shop**. Ele é separado do Petyra Club, que é a assinatura opcional da plataforma para o tutor.

## 1. Plano mensal de serviços do estabelecimento

O pet shop poderá criar pacotes recorrentes com:

- Nome, serviços incluídos, visitas por ciclo, preço, regras de uso e validade.
- Renovação mensal e próxima data de cobrança.
- Exemplo: quatro banhos por mês por R$ 189.
- Saldo de visitas do ciclo, visitas usadas, histórico e regra de expiração ou transferência.
- Pausa, cancelamento, falha de pagamento, reativação e avisos ao tutor.
- Indicadores de assinantes ativos, receita recorrente, renovações próximas e cancelamentos.

No app do tutor, o plano aparece na página do estabelecimento e no perfil do pet. Antes de aderir, o tutor vê preço, frequência, quantidade de visitas, serviços, validade e regra de cancelamento. Após confirmar, acompanha cobranças, saldo e uso.

### Compra avulsa continua disponível

O estabelecimento também cadastra serviços com preço unitário. O tutor pode marcar e pagar somente o atendimento que deseja, sem assinatura. O checkout distingue:

- Serviço avulso.
- Visita consumida de um plano mensal.
- Produto vendido no app.

Regras de comissão da Petyra para serviços e produtos permanecem as documentadas em COMMERCIAL_RULES.md; cobrança recorrente não deve mudar essa regra sem aprovação.

## 2. Cartão fidelidade intuitivo

O pet shop configura um programa curto e explicável: ação que gera crédito, quantidade necessária e recompensa. Exemplos:

- Um carimbo por banho concluído e pago.
- Oito carimbos liberam um banho tradicional.
- Pontos por atendimento, compra ou indicação convertida.

### Experiência do pet shop

- Ativar ou pausar o programa.
- Definir como acumula, quantos créditos faltam e qual é a recompensa.
- Ver cartões dos tutores, resgates, validade e histórico.
- Confirmar crédito ou resgate somente após a operação elegível.
- Ver resultados: participação, retornos e recompensas resgatadas.

### Experiência do tutor

- Cartão visual no perfil do pet, com progresso destacado e recompensa escrita sem ambiguidades.
- Histórico de créditos e resgates; validade e regras visíveis.
- Ação para agendar o serviço e aplicar a recompensa.
- Nenhuma surpresa no checkout: saldo restante e benefício aparecem antes de confirmar.

Créditos e resgates precisam de ledger idempotente, transação atômica, trilha de auditoria e isolamento por pet shop. Estornos e cancelamentos revertem o crédito ligado à operação original.

## 3. Previsibilidade e marketing

Painel Business com:

- Receita recorrente confirmada por renovações válidas.
- Receita provável separada de oportunidades, com janela de 30/60/90 dias.
- Agendamentos confirmados, horários livres, ciclos e risco de cancelamento.
- Clientes próximos do retorno e clientes inativos, com motivo e critério visíveis.
- Campanhas sugeridas para preencher horários, lembrar renovações, reativar clientes ou oferecer plano mensal.
- Resultado por campanha: destinatários elegíveis, envio, resposta, agendamento e receita atribuída.
- Comparativo entre recorrência, vendas avulsas e retorno da base.

O painel não deve apresentar estimativa como faturamento garantido nem contar uma mesma venda como retorno e como campanha. Recomendações devem usar apenas dados do estabelecimento ativo. O envio real deve respeitar consentimento, preferências, limite de frequência e canal autorizado. A primeira etapa pode apenas preparar uma lista/mensagem para aprovação do dono; envio automático exige configuração e aprovação explícitas.

## Protótipo web

A tela `/crescimento` contém demonstração navegável para visão geral, planos e assinaturas, fidelidade e marketing/previsão. O formulário cria planos apenas no estado local da tela, e as ações de campanha são simuladas. Números e clientes são fictícios. O protótipo não autentica usuários, não persiste dados, não cobra nem envia mensagens.

## Integrações e critérios para ativar em produção

- Escolher e configurar PSP com cobrança recorrente, cancelamento, reembolso, webhooks assinados e idempotência.
- Definir política de visitas: validade, saldo não utilizado, pausa, reajuste, cancelamento, no-show e reembolso.
- Decidir acúmulo, validade, estorno e resgate de fidelidade.
- Implementar schema, permissões/RLS, serviços/API, telas web e app do tutor.
- Integrar agenda e checkout para consumir uma visita ou receber pagamento avulso uma única vez.
- Configurar canais de e-mail/push/WhatsApp, opt-in, preferência, frequência, retry e auditoria.
- Testar concorrência, falha e duplicidade de cobrança, estoque/agenda, acesso entre organizações, campanha duplicada e conciliação.
- Publicar apenas após os critérios do RELEASE_GATE.md serem aprovados.

## Decisões de produto ainda necessárias

1. Quais métodos e PSP suportam assinatura e repasse para cada estabelecimento.
2. Regras para visitas não usadas, cancelamento, pausa, faltas e alteração de preço.
3. Se o cartão fidelidade será por pet shop ou um cartão do tutor compartilhado; a proposta inicial é por pet shop.
4. Como o programa trata estorno, validade, recompensas parciais e campanhas simultâneas.
5. Canais de marketing, custos, consentimento e se a primeira versão enviará ou só preparará mensagens.
6. Definições de risco de churn, previsão, receita atribuída e janela de retorno.

Nenhum preço, cobrança, política, fornecedor ou envio real é ativado por este protótipo.
