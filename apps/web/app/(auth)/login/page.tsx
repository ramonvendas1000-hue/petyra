export default function LoginPage() {
  return (
    <main style={{minHeight:'100vh', display:'grid', placeItems:'center', background:'radial-gradient(circle at top,#F3EFFF,#fff 58%)'}}>
      <section style={{width:'min(420px,92vw)', background:'#fff', border:'1px solid #E7E3FA', borderRadius:24, padding:32, boxShadow:'0 20px 60px rgba(23,26,58,.08)'}}>
        <div style={{fontWeight:900,fontSize:30,color:'#171A3A'}}>🐾 Petyra</div>
        <h1 style={{marginTop:28}}>Acesse sua conta</h1>
        <p style={{color:'#71717A'}}>Entre para gerenciar seu negócio ou acessar sua conta Petyra.</p>
        <label style={{display:'grid',gap:8,marginTop:20}}>E-mail<input type="email" placeholder="voce@empresa.com" style={{padding:14,borderRadius:12,border:'1px solid #DED9F4'}} /></label>
        <label style={{display:'grid',gap:8,marginTop:14}}>Senha<input type="password" placeholder="••••••••" style={{padding:14,borderRadius:12,border:'1px solid #DED9F4'}} /></label>
        <button style={{width:'100%',marginTop:22,padding:14,borderRadius:12,border:0,background:'#6D4DFF',color:'#fff',fontWeight:800}}>Entrar</button>
      </section>
    </main>
  );
}
