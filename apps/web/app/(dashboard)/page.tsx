const stats = [
  ['Atendimentos esta semana', '48', '+12%'],
  ['Faturamento esta semana', 'R$ 6.230', '+18%'],
  ['Novos clientes este mês', '32', '+28%'],
  ['Taxa de retorno', '87%', '+6%'],
];

export default function DashboardPage() {
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div><h1 style={{margin:0, fontSize:34}}>Bom dia, Carla! 👋</h1><p style={{color:'#71717A'}}>Seu pet shop está indo muito bem hoje.</p></div>
        <button style={{background:'#6D4DFF', color:'#fff', border:0, borderRadius:14, padding:'12px 18px', fontWeight:700}}>+ Novo agendamento</button>
      </div>
      <section style={{display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:16}}>
        {stats.map(([label,value,delta]) => <article key={label} style={{background:'#fff', border:'1px solid #E7E3FA', borderRadius:18, padding:20}}><div style={{color:'#71717A', fontSize:13}}>{label}</div><div style={{fontSize:28, fontWeight:800, margin:'8px 0'}}>{value}</div><div style={{color:'#22A06B', fontWeight:700}}>{delta}</div></article>)}
      </section>
      <section style={{display:'grid', gridTemplateColumns:'1.35fr 1fr', gap:16, marginTop:16}}>
        <article style={{background:'#fff', border:'1px solid #E7E3FA', borderRadius:18, padding:20, minHeight:320}}>
          <h3>Faturamento</h3>
          <div style={{height:210, display:'flex', alignItems:'end', gap:16, padding:'24px 8px 0'}}>{[34,46,58,69,76,88].map((h,i)=><div key={i} style={{flex:1, height:`${h}%`, minWidth:24, background:'linear-gradient(#8B5CFF,#6D4DFF)', borderRadius:'10px 10px 4px 4px'}} />)}</div>
        </article>
        <article style={{background:'#fff', border:'1px solid #E7E3FA', borderRadius:18, padding:20}}>
          <h3>Próximos agendamentos</h3>
          {[['09:00','Luna','Banho e tosa'],['10:30','Thor','Consulta'],['14:00','Mel','Banho e tosa'],['16:30','Pipoca','Vacina']].map(([time,pet,service])=><div key={time} style={{display:'grid',gridTemplateColumns:'64px 1fr auto',alignItems:'center',padding:'14px 0',borderBottom:'1px solid #F0EDF8'}}><strong>{time}</strong><div><strong>{pet}</strong><div style={{fontSize:13,color:'#71717A'}}>{service}</div></div><span style={{background:'#F3EFFF',color:'#6D4DFF',padding:'6px 10px',borderRadius:999,fontSize:12,fontWeight:700}}>Confirmado</span></div>)}
        </article>
      </section>
    </div>
  );
}
