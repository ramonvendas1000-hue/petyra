import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BusinessHome() {
  const metrics=[['Atendimentos','24'],['Receita','R$ 2.180'],['Oportunidades','14'],['Pedidos','4']];
  return <ScrollView style={s.root} contentContainerStyle={s.content}>
    <Text style={s.brand}>🐾 Petyra Business</Text><Text style={s.hello}>Boa tarde, Ricardo 👋</Text><Text style={s.muted}>Pet Anjo • visão de hoje</Text>
    <View style={s.grid}>{metrics.map(([l,v])=><View style={s.metric} key={l}><Text style={s.label}>{l}</Text><Text style={s.value}>{v}</Text></View>)}</View>
    <Text style={s.section}>Precisa da sua atenção</Text>
    {['2 pagamentos pendentes','3 cancelamentos amanhã','14 clientes para recuperar','4 pedidos para separar'].map(x=><View style={s.item} key={x}><Text style={s.bullet}>•</Text><Text style={s.itemText}>{x}</Text></View>)}
  </ScrollView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#FAF9FF'},content:{padding:24,paddingTop:64},brand:{fontSize:22,fontWeight:'900',color:'#6D4DFF'},hello:{fontSize:28,fontWeight:'900',color:'#171A3A',marginTop:26},muted:{color:'#6B6677',marginTop:4},grid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:24},metric:{width:'48%',backgroundColor:'#fff',padding:16,borderRadius:18,borderWidth:1,borderColor:'#E7E3FA'},label:{color:'#6B6677'},value:{fontSize:22,fontWeight:'900',color:'#171A3A',marginTop:8},section:{fontSize:20,fontWeight:'900',marginTop:28,color:'#171A3A'},item:{backgroundColor:'#fff',borderRadius:16,padding:16,marginTop:10,flexDirection:'row',alignItems:'center',gap:12},bullet:{color:'#6D4DFF',fontSize:28},itemText:{fontWeight:'700',color:'#171A3A'}});
