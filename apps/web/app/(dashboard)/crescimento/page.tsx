'use client';

import { FormEvent, useState } from 'react';
import styles from './growth.module.css';

type Tab = 'overview' | 'plans' | 'loyalty' | 'marketing';

type Plan = {
  name: string;
  service: string;
  visits: number;
  price: number;
  members: number;
};

const initialPlans: Plan[] = [
  { name: 'Banho em dia', service: 'Banho', visits: 4, price: 189, members: 18 },
  { name: 'Rotina completa', service: 'Banho + tosa', visits: 2, price: 249, members: 9 },
  { name: 'Filhote feliz', service: 'Banho + higiene', visits: 3, price: 159, members: 5 },
];

const subscribers = [
  { initials: 'LM', name: 'Larissa Mendes', pet: 'Luna', plan: 'Banho em dia', renewal: 'Hoje', status: 'Em dia' },
  { initials: 'RC', name: 'Rafael Costa', pet: 'Thor', plan: 'Rotina completa', renewal: 'Amanhã', status: 'Em dia' },
  { initials: 'AS', name: 'Ana Souza', pet: 'Mel', plan: 'Filhote feliz', renewal: '28 out', status: 'Cartão atualizado' },
];

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function GrowthPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [plans, setPlans] = useState(initialPlans);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [notice, setNotice] = useState('');
  const [stamps, setStamps] = useState(5);
  const [campaigns, setCampaigns] = useState<string[]>([]);

  function addPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const service = String(form.get('service') || '').trim();
    const visits = Number(form.get('visits') || 0);
    const price = Number(form.get('price') || 0);
    if (!name || !service || visits < 1 || price < 1) return;
    setPlans((current) => [...current, { name, service, visits, price, members: 0 }]);
    setShowPlanForm(false);
    setNotice('Plano criado nesta demonstração. Para cobrar, será necessário conectar o provedor de pagamento.');
    event.currentTarget.reset();
  }

  function launchCampaign(label: string) {
    setCampaigns((current) => current.includes(label) ? current : [...current, label]);
    setNotice('Ação preparada na demonstração. O envio real depende da integração e do consentimento dos clientes.');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>CRESCIMENTO DO PET SHOP <span>DEMONSTRAÇÃO</span></div>
          <h1>Receita previsível. Clientes mais fiéis.</h1>
          <p>Planos recorrentes, visitas avulsas e ações simples para manter a agenda em movimento.</p>
        </div>
        <button className={styles.primaryButton} onClick={() => { setTab('plans'); setShowPlanForm(true); }}>＋ Criar plano</button>
      </header>

      <nav className={styles.tabs} aria-label="Seções de crescimento">
        {([
          ['overview', 'Visão geral'],
          ['plans', 'Planos e assinaturas'],
          ['loyalty', 'Fidelidade'],
          ['marketing', 'Marketing e previsão'],
        ] as [Tab, string][]).map(([id, label]) => (
          <button key={id} className={tab === id ? styles.activeTab : styles.tab} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      {notice && <div className={styles.notice} role="status"><span>✓</span>{notice}<button onClick={() => setNotice('')} aria-label="Fechar aviso">×</button></div>}

      {tab === 'overview' && (
        <>
          <section className={styles.metricGrid}>
            <Metric label="Receita recorrente mensal" value="R$ 4.860" detail="+12% neste mês" icon="↗" />
            <Metric label="Assinaturas ativas" value="32" detail="3 renovações em 7 dias" icon="◷" />
            <Metric label="Visitas avulsas no mês" value="86" detail="Sem compromisso mensal" icon="＋" />
            <Metric label="Clientes que voltaram" value="76%" detail="+8 p.p. com fidelidade" icon="♡" />
          </section>

          <section className={styles.mainGrid}>
            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><span className={styles.kicker}>PREVISÃO DE RECEITA</span><h2>Os próximos 30 dias</h2></div><span className={styles.pill}>Estimativa</span></div>
              <div className={styles.forecastTotal}>R$ 12.480 <span>previstos</span></div>
              <div className={styles.chart} aria-label="Gráfico de previsão mensal">
                {[38, 48, 44, 62, 57, 72, 68, 84, 76, 95, 88, 100].map((height, index) => <div className={styles.barWrap} key={index}><div className={styles.bar} style={{ height: height + '%' }} /></div>)}
              </div>
              <div className={styles.chartLabels}><span>Hoje</span><span>+10 dias</span><span>+20 dias</span><span>30 dias</span></div>
              <div className={styles.forecastFoot}><span><i className={styles.legendPurple} />Assinaturas <b>R$ 4.860</b></span><span><i className={styles.legendMint} />Avulsos e retornos <b>R$ 7.620</b></span></div>
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><span className={styles.kicker}>PRÓXIMOS CICLOS</span><h2>Renovações chegando</h2></div><button className={styles.textButton} onClick={() => setTab('plans')}>Ver assinaturas →</button></div>
              <div className={styles.renewalList}>
                {subscribers.map((person) => <div className={styles.renewal} key={person.name}><div className={styles.avatar}>{person.initials}</div><div className={styles.personInfo}><strong>{person.name}</strong><span>{person.pet} · {person.plan}</span></div><div className={styles.renewalDate}>{person.renewal}<small>{person.status}</small></div></div>)}
              </div>
              <div className={styles.tip}><span>✦</span><div><strong>Uma oportunidade esta semana</strong><p>Há 6 horários de banho livres na próxima semana. Convide clientes inativos antes de abrir mais horários.</p><button onClick={() => { setTab('marketing'); launchCampaign('Clientes sem retorno'); }}>Preparar convite</button></div></div>
            </article>
          </section>

          <section className={styles.bottomGrid}>
            <button className={styles.choiceCard} onClick={() => setTab('plans')}><span className={styles.choiceIcon}>↻</span><span><strong>Receber todo mês</strong><small>Planos com visitas incluídas e renovação recorrente.</small></span><b>Explorar →</b></button>
            <button className={styles.choiceCard} onClick={() => setTab('plans')}><span className={styles.choiceIconAlt}>✂</span><span><strong>Pagar por visita</strong><small>O tutor agenda e paga cada atendimento separadamente.</small></span><b>Ver opções →</b></button>
          </section>
        </>
      )}

      {tab === 'plans' && (
        <>
          <section className={styles.sectionIntro}>
            <div><span className={styles.kicker}>ESCOLHA DO TUTOR</span><h2>Recorrência ou atendimento avulso</h2><p>O pet shop define os pacotes. O cliente escolhe o que faz sentido para a rotina do pet.</p></div>
            <button className={styles.primaryButton} onClick={() => setShowPlanForm(true)}>＋ Novo plano mensal</button>
          </section>
          <section className={styles.planGrid}>
            {plans.map((plan, index) => <article className={styles.planCard} key={plan.name}>
              <div className={styles.planTop}><span className={index === 0 ? styles.planBadge : styles.planBadgeSoft}>{index === 0 ? 'MAIS ESCOLHIDO' : 'MENSAL'}</span><button className={styles.moreButton} aria-label={'Opções de ' + plan.name}>•••</button></div>
              <h3>{plan.name}</h3><p className={styles.serviceName}>{plan.service}</p>
              <div className={styles.price}>{money(plan.price)}<small>/ mês</small></div>
              <div className={styles.visits}><strong>{plan.visits} visitas</strong> incluídas a cada ciclo</div>
              <div className={styles.planDivider} />
              <div className={styles.planMeta}><span>Assinantes ativos</span><strong>{plan.members}</strong></div>
              <div className={styles.planMeta}><span>Receita mensal deste plano</span><strong>{money(plan.price * plan.members)}</strong></div>
              <button className={styles.outlineButton} onClick={() => setNotice('O fluxo de edição do plano ficará disponível na etapa de CRUD e cobrança real.')}>Gerenciar plano</button>
            </article>)}
            <article className={styles.avulsoCard}>
              <div className={styles.avulsoIcon}>＋</div><span className={styles.kicker}>SEM MENSALIDADE</span><h3>Atendimento avulso</h3>
              <p>O cliente agenda quando precisar e paga somente por aquela visita.</p>
              <div className={styles.avulsoExample}><span>Banho tradicional</span><strong>R$ 75</strong></div>
              <div className={styles.avulsoExample}><span>Banho + tosa</span><strong>R$ 120</strong></div>
              <button className={styles.outlineButton} onClick={() => setNotice('O agendamento avulso será conectado ao catálogo de serviços e ao checkout.')}>Configurar serviços</button>
            </article>
          </section>
          <section className={styles.panel + ' ' + styles.subscriberPanel}>
            <div className={styles.panelHeading}><div><span className={styles.kicker}>BASE RECORRENTE</span><h2>Assinantes recentes</h2></div><span className={styles.pill}>32 ativos</span></div>
            <div className={styles.table}>
              <div className={styles.tableHead}><span>TUTOR E PET</span><span>PLANO</span><span>RENOVAÇÃO</span><span>STATUS</span></div>
              {subscribers.map((person) => <div className={styles.tableRow} key={person.name}><div className={styles.tablePerson}><div className={styles.avatar}>{person.initials}</div><span><strong>{person.name}</strong><small>{person.pet}</small></span></div><span>{person.plan}</span><span>{person.renewal}</span><span className={styles.statusGood}>● {person.status}</span></div>)}
            </div>
          </section>
          {showPlanForm && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setShowPlanForm(false); }}><form className={styles.modal} onSubmit={addPlan}>
            <button type="button" className={styles.closeModal} onClick={() => setShowPlanForm(false)} aria-label="Fechar">×</button>
            <span className={styles.kicker}>NOVO PLANO RECORRENTE</span><h2>Monte um pacote mensal</h2><p>Defina as visitas e o valor que serão renovados a cada ciclo.</p>
            <label>Nome do plano<input name="name" required placeholder="Ex.: Banho em dia" /></label>
            <label>Serviço incluído<input name="service" required placeholder="Ex.: Banho" /></label>
            <div className={styles.formRow}><label>Visitas por mês<input name="visits" type="number" min="1" defaultValue="4" required /></label><label>Valor mensal (R$)<input name="price" type="number" min="1" step="0.01" placeholder="189,00" required /></label></div>
            <div className={styles.modalInfo}>A cobrança recorrente será ativada quando um provedor de pagamento for conectado.</div>
            <button className={styles.primaryButton} type="submit">Salvar plano de demonstração</button>
          </form></div>}
        </>
      )}

      {tab === 'loyalty' && (
        <>
          <section className={styles.sectionIntro}><div><span className={styles.kicker}>FIDELIDADE SEM COMPLICAÇÃO</span><h2>Um cartão que todo mundo entende</h2><p>O pet shop configura a recompensa. O tutor acompanha o progresso pelo app, junto do perfil do pet.</p></div><button className={styles.primaryButton} onClick={() => setNotice('A configuração de regras e recompensas será persistida no cadastro do pet shop.')}>Configurar programa</button></section>
          <section className={styles.loyaltyGrid}>
            <article className={styles.loyaltyConfig}>
              <div className={styles.panelHeading}><div><span className={styles.kicker}>SEU PROGRAMA</span><h2>Banho que rende carinho</h2></div><span className={styles.statusLive}>● Ativo</span></div>
              <p>Um carimbo por banho concluído. Com 8 carimbos, o próximo banho é por conta da casa.</p>
              <div className={styles.ruleList}><div><span>✂</span><div><strong>Como acumular</strong><small>1 carimbo por banho pago e concluído</small></div></div><div><span>🎁</span><div><strong>Recompensa</strong><small>1 banho tradicional gratuito</small></div></div><div><span>⌛</span><div><strong>Validade</strong><small>12 meses depois do último carimbo</small></div></div></div>
              <div className={styles.loyaltyStats}><div><strong>124</strong><span>tutores participando</span></div><div><strong>18</strong><span>recompensas resgatadas</span></div><div><strong>+21%</strong><span>retorno dos participantes</span></div></div>
            </article>
            <article className={styles.phonePanel}>
              <span className={styles.kicker}>VISÃO DO TUTOR</span><h2>O cartão do pet</h2>
              <div className={styles.phone}>
                <div className={styles.phoneHeader}><span>9:41</span><span>•••</span></div>
                <div className={styles.phoneBrand}>🐾 <strong>Petyra</strong><span>Luna ▾</span></div>
                <div className={styles.tutorCard}>
                  <div className={styles.cardBrand}>PET ANJO <span>FIDELIDADE</span></div>
                  <h3>Banho que rende carinho</h3><p>Mais 3 banhos para ganhar o próximo ✨</p>
                  <div className={styles.stampGrid}>{Array.from({ length: 8 }, (_, index) => <button key={index} className={index < stamps ? styles.stampFilled : styles.stampEmpty} onClick={() => setStamps((value) => value === 8 ? 0 : value + 1)} aria-label={index < stamps ? 'Carimbo conquistado' : 'Próximo carimbo'}>{index < stamps ? '🐾' : index + 1}</button>)}</div>
                  <div className={styles.stampProgress}><span style={{ width: ((stamps / 8) * 100) + '%' }} /></div>
                  <div className={styles.cardReward}><span>🎁</span><div><strong>Seu próximo mimo</strong><small>1 banho tradicional gratuito</small></div></div>
                </div>
                <button className={styles.phoneButton} onClick={() => setNotice('O tutor poderá abrir o agendamento e escolher usar a recompensa no checkout.')}>Ver horários</button>
                <div className={styles.phoneNav}><span>⌂<small>Início</small></span><span>▣<small>Agenda</small></span><span>♡<small>Fidelidade</small></span><span>◉<small>Perfil</small></span></div>
              </div>
            </article>
          </section>
        </>
      )}

      {tab === 'marketing' && (
        <>
          <section className={styles.sectionIntro}><div><span className={styles.kicker}>PLANEJAMENTO COM DADOS</span><h2>Enxergue a agenda antes de ficar vazia</h2><p>Use renovações, horários livres e clientes sem retorno para escolher a próxima ação.</p></div><span className={styles.pill}>Próximos 30 dias</span></section>
          <section className={styles.metricGrid}>
            <Metric label="Receita recorrente confirmada" value="R$ 4.860" detail="32 assinaturas ativas" icon="↻" />
            <Metric label="Receita provável" value="R$ 12.480" detail="Assinaturas + agenda atual" icon="◷" />
            <Metric label="Horários disponíveis" value="18" detail="6 em banho na próxima semana" icon="▦" />
            <Metric label="Clientes para reativar" value="24" detail="Sem retorno há 45+ dias" icon="♡" />
          </section>
          <section className={styles.mainGrid}>
            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><span className={styles.kicker}>ENTRADAS ESTIMADAS</span><h2>De onde pode vir a receita</h2></div></div>
              <div className={styles.sourceRow}><span className={styles.sourceIcon}>↻</span><div><strong>Assinaturas previstas</strong><small>Renovações com pagamento ativo</small></div><b>R$ 4.860</b></div>
              <div className={styles.sourceRow}><span className={styles.sourceIconMint}>＋</span><div><strong>Agendamentos confirmados</strong><small>Serviços já marcados</small></div><b>R$ 5.220</b></div>
              <div className={styles.sourceRow}><span className={styles.sourceIconPeach}>✦</span><div><strong>Oportunidade de retorno</strong><small>Estimativa de horários vagos × ticket médio</small></div><b>R$ 2.400</b></div>
              <div className={styles.totalRow}><span>Previsão total</span><strong>R$ 12.480</strong></div>
              <small className={styles.disclaimer}>Estimativas não são receita garantida. O sistema deve separar valores confirmados de oportunidades.</small>
            </article>
            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><span className={styles.kicker}>AÇÕES SUGERIDAS</span><h2>Próximos passos para esta semana</h2></div></div>
              <Campaign title="Preencher horários de banho" detail="Convide 24 clientes sem retorno há 45 dias." tag="6 horários livres" done={campaigns.includes('Reativar clientes')} onClick={() => launchCampaign('Reativar clientes')} />
              <Campaign title="Lembrar renovação" detail="Avise 3 tutores antes do próximo ciclo." tag="3 renovações" done={campaigns.includes('Avisar renovações')} onClick={() => launchCampaign('Avisar renovações')} />
              <Campaign title="Oferecer plano mensal" detail="Sugira recorrência para clientes com 3+ visitas." tag="12 clientes" done={campaigns.includes('Oferecer plano mensal')} onClick={() => launchCampaign('Oferecer plano mensal')} />
            </article>
          </section>
          <div className={styles.privacyNote}><span>💡</span><p><strong>Marketing com cuidado:</strong> as recomendações usam somente dados do próprio pet shop. Mensagens reais devem respeitar consentimento, preferências e limites de contato.</p></div>
        </>
      )}
      <footer className={styles.footer}>Protótipo visual · números e clientes fictícios · nenhum pagamento ou mensagem é enviado</footer>
    </div>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: string }) {
  return <article className={styles.metric}><span className={styles.metricIcon}>{icon}</span><span className={styles.metricLabel}>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function Campaign({ title, detail, tag, done, onClick }: { title: string; detail: string; tag: string; done: boolean; onClick: () => void }) {
  return <div className={styles.campaign}><div className={styles.campaignIcon}>✦</div><div className={styles.campaignText}><strong>{title}</strong><small>{detail}</small><span>{tag}</span></div><button className={done ? styles.doneButton : styles.outlineButton} onClick={onClick}>{done ? 'Preparada ✓' : 'Preparar'}</button></div>;
}
