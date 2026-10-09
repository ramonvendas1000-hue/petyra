# Petyra — Product Blueprint V1

## Visão

Petyra é uma plataforma de duas pontas para negócios pet e tutores.

- **Petyra Business Web**: gestão completa do pet shop pelo navegador.
- **Petyra App**: um único app iOS/Android com modos Tutor, Proprietário e Funcionário.
- **Petyra Core**: autenticação, banco, pagamentos, notificações, permissões e integrações.

Identidade oficial: **Roxo Elétrico**.

## Perfis

### Tutor
- vê apenas seus pets e dados compartilhados;
- agenda/reagenda/confirma;
- acompanha atendimento ao vivo;
- recebe push;
- compra produtos do pet shop vinculado;
- paga serviços/produtos/sinais;
- vê fotos, documentos e histórico;
- acessa PetStyle quando disponível;
- pode assinar PetFlow/Petyra Club.

### Proprietário
- acesso integral ao Business Web e modo Business Mobile;
- cria funcionários e define permissões;
- visualiza indicadores, agenda, CRM, loja, financeiro, equipe, estoque e relatórios.

### Funcionários
Criados pelo proprietário no Business Web.
Perfis padrão: gerente, recepção, tosador/banhista, veterinário e personalizado.

## Experiência do atendimento

Fluxo oficial:

1. Agendamento
2. Confirmação / sinal
3. Check-in
4. Foto antes
5. Banho
6. Secagem
7. Tosa
8. Finalização
9. Foto depois
10. Pronto para buscar
11. Pagamento do saldo
12. Retirada
13. Avaliação
14. Próxima recorrência / oportunidade CRM

Tutor recebe atualizações da jornada em push, conforme configuração do pet shop.

## Antes e depois

- funcionário fotografa no app Business;
- foto classificada como `before` ou `after`;
- associada ao pet + atendimento;
- tutor recebe notificação e vê galeria;
- histórico visual fica disponível por data;
- observações internas podem ser separadas das compartilhadas.

## CRM

Pipeline específico para pet shop:

Novo contato → Primeiro agendamento → Cliente ativo → Próximo retorno → Atrasado → Em risco → Inativo → Recuperado.

Métricas:
- frequência média;
- ticket médio;
- LTV;
- último atendimento;
- retorno previsto;
- clientes em risco;
- receita potencial;
- receita recuperada.

## Central de Oportunidades

Detecta:
- pets na hora de voltar;
- clientes atrasados;
- clientes em risco;
- inativos;
- cancelamentos e horários vagos;
- lista de espera elegível.

## Loja privada por pet shop

Cada organização publica apenas seus próprios produtos. Não existe vitrine global concorrencial.

Tutor vinculado ao pet shop pode:
- navegar na loja;
- adicionar produtos ao atendimento;
- comprar separadamente;
- selecionar retirada junto com o pet;
- pagar pelo app.

### Comissão
- Serviços: **0% de comissão Petyra** (fora taxas do PSP).
- Produtos vendidos pelo app: **8% de comissão Petyra**.
- Split deve ser realizado pelo PSP, sem repasse manual.

## Checkout unificado

Um carrinho pode conter:
- serviços;
- produtos;
- sinal de agendamento.

Política de sinal configurável pelo pet shop:
- sem sinal;
- 10%;
- 20%;
- 30%;
- 50%;
- pagamento integral.

## Estoque

Sincronizado entre:
- Business Web;
- Business Mobile;
- loja do Tutor;
- venda no balcão.

Campos mínimos: SKU, nome, categoria, preço, custo, quantidade, mínimo, imagem e status.

## Planos B2B

### Essencial — R$ 79,90/mês
- CRM básico;
- clientes e pets;
- agenda;
- histórico;
- pacotes;
- tarefas;
- financeiro básico;
- app Petyra;
- até 3 usuários.

Trial sugerido: 14 dias, meio de pagamento previamente cadastrado.

### Pro — R$ 149,90/mês
Tudo do Essencial +
- Central de Oportunidades;
- CRM inteligente;
- recorrência;
- clientes em risco/inativos;
- automações;
- métricas avançadas;
- campanhas;
- WhatsApp integrado;
- até 8 usuários.

Trial sugerido: 30 dias, meio de pagamento previamente cadastrado.

### Premium — R$ 249,90/mês
Tudo do Essencial + Pro +
- PetStyle 3D;
- IA/copiloto;
- automações avançadas;
- equipe/comissões/produtividade;
- dashboards avançados;
- múltiplas unidades futuramente;
- integrações/API;
- suporte prioritário.

Oferta de lançamento planejada: 30 dias grátis + 50% no primeiro mês pago.

## PetStyle 3D

Modelo visual do pet com regiões editáveis:
- cabeça;
- orelhas;
- focinho;
- peito;
- corpo;
- patas;
- cauda.

Permite:
- comprimento;
- máquina/pente;
- tesoura;
- instruções;
- foto de referência;
- salvar estilo;
- repetir tosa anterior;
- tutor visualizar/selecionar quando habilitado.

## Petyra Club (Tutor)

O app básico permanece gratuito.

Assinatura opcional do tutor:
- 30 dias grátis;
- forma de pagamento cadastrada na ativação;
- renovação automática;
- lembretes antes da cobrança.

Benefícios candidatos:
- passaporte digital avançado;
- documentos e vacinas;
- medicamentos;
- peso/evolução;
- controle de gastos;
- compartilhamento familiar;
- PetFlow/Petyra ID;
- benefícios de parceiros/pet shops.

## Passaporte & Petyra ID

- vacinas;
- exames;
- receitas;
- alergias;
- medicamentos;
- microchip;
- peso;
- contatos;
- QR de emergência com dados públicos controlados pelo tutor.

## Rewards & indicação

Pet shop configura regras e recompensas.
Exemplos de pontos:
- atendimento;
- compra;
- indicação convertida;
- avaliação.

## Planos recorrentes do próprio pet shop

Pet shop pode criar assinatura de serviços, ex.:
- 4 banhos/mês;
- desconto em hidratação;
- prioridade na agenda;
- benefícios em produtos.

A cobrança recorrente pertence ao pet shop; Petyra não cobra 8% sobre serviços.

## Notificações

Canais:
- push;
- WhatsApp;
- e-mail quando necessário.

Eventos principais:
- confirmação;
- lembrete;
- mudança de etapa do atendimento;
- pet pronto;
- pedido pronto;
- pagamento;
- recorrência;
- vacina/documento;
- trial/renovação.

## Assinaturas e transparência

Sempre mostrar:
- plano;
- valor;
- fim do trial;
- data prevista da primeira/próxima cobrança;
- renovação automática;
- caminho para gerenciar/cancelar.

Sequência sugerida de aviso: início, D-7, D-3, D-1.

## Gate de lançamento

A Petyra só entra no mercado público quando a V1 estiver:
- funcional web + iOS + Android;
- autenticação/permissões testadas;
- pagamentos/split homologados;
- push estável;
- fotos/storage testados;
- RLS auditada;
- backups configurados;
- observabilidade ativa;
- testes E2E dos fluxos críticos;
- revisão App Store / Google Play concluída;
- termos, privacidade e LGPD prontos;
- ambiente de produção separado de staging.
