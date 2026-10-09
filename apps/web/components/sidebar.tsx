const items = ['Início', 'Agenda', 'Clientes', 'Pets', 'Loja', 'Oportunidades', 'Financeiro', 'Equipe', 'Relatórios'];

export function Sidebar() {
  return (
    <aside style={{width:260, minHeight:'100vh', background:'#171A3A', color:'#fff', padding:24, display:'flex', flexDirection:'column', gap:24}}>
      <div style={{fontSize:26, fontWeight:900}}>🐾 Petyra</div>
      <nav style={{display:'grid', gap:8}}>
        {items.map((item, i) => (
          <button key={item} style={{border:0, textAlign:'left', padding:'12px 14px', borderRadius:12, color:'#fff', background:i===0?'#6D4DFF':'transparent', cursor:'pointer'}}>{item}</button>
        ))}
      </nav>
      <div style={{marginTop:'auto', background:'linear-gradient(135deg,#6D4DFF,#8B5CFF)', padding:16, borderRadius:18}}>
        <strong>Seu pet shop mais longe.</strong>
        <p style={{fontSize:13, opacity:.9}}>Tecnologia para organizar, vender e fidelizar.</p>
      </div>
    </aside>
  );
}
