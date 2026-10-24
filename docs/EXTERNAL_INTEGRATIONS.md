# Integrações, credenciais e operação

Nenhuma credencial foi criada ou adicionada. As variáveis em .env.example são vazias; nomes não selecionam fornecedor.

| Integração | O que obter/configurar | Trabalho pendente |
|---|---|---|
| Supabase | Projetos separados dev/staging/prod, URL e chave pública; segredo servidor no cofre | Auth, redirects, SMTP, RLS por operação, Storage, Realtime, backups e logs |
| PSP | Conta comercial, recebedores verificados, API e segredo de webhook por ambiente | Escolha, KYC, adaptador, split, Pix/cartão, assinatura, estorno e conciliação |
| Push | Projeto Expo/EAS e APNs/FCM com contas autorizadas | Registrar token, permissões, envio, recibos e revogação |
| WhatsApp | Conta/integração aprovada, templates e credenciais do provedor escolhido | Opt-in, quotas, custo, fila e medição |
| E-mail | Domínio validado e fornecedor SMTP/API | Convites, recuperação, avisos de trial/renovação e entregabilidade |
| Storage | Buckets privados, políticas, retenção, limites e URLs assinadas | Upload real, validação, galeria e documentos |
| App Store / Google Play | Contas de desenvolvedor, assinatura e metadados | Identificadores existentes em app.json ainda precisam de comprovação de titularidade; builds/revisão |
| Hospedagem | Projeto, domínio, certificados e segredos server-side | Ambientes, CI/CD, observabilidade e deploy |
| PetStyle | Assets/modelos licenciados e decisão de renderer | Editor, região/técnica, persistência e teste visual |
| IA futura | Decisão de produto, provedor e orçamento | Mantida desligada; não há chave nem integração presumida |

Variáveis públicas só podem conter URL/chave pública do Supabase. Nunca colocar service_role, PSP, webhook, push ou SMTP em NEXT_PUBLIC_* ou EXPO_PUBLIC_*.

Adaptadores de packages/domain/src/ports.ts são interfaces sem implementação. Ausência de integração deve produzir erro explícito, jamais pagamento aprovado, push entregue ou dado clínico inventado.

Operação futura: outbox com retry/backoff, fila de falhas, dashboards de reconciliação e alerta sem payloads sensíveis. Guardar apenas códigos sanitizados de erro. Definir retenção e executar restauração de backup em staging antes do lançamento.
