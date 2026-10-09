import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function TutorHome() {
  return <View style={s.root}>
    <Text style={s.hello}>Olá, Ana! 👋</Text><Text style={s.muted}>Que bom ter você por aqui.</Text>
    <View style={s.pet}><View style={s.avatar}><Text style={{fontSize:34}}>🐶</Text></View><View><Text style={s.petName}>Luna</Text><Text style={s.muted}>Golden Retriever</Text></View></View>
    <View style={s.card}><Text style={s.cardLabel}>Próximo agendamento</Text><Text style={s.cardTitle}>Banho e Tosa</Text><Text>24 mai • 10:00</Text><Pressable style={s.primary}><Text style={s.primaryText}>Confirmar presença</Text></Pressable></View>
    <Text style={s.section}>Atalhos</Text><View style={s.row}>{['Agenda','Vacinas','Histórico','Loja'].map(x=><View style={s.shortcut} key={x}><Text style={{fontSize:22}}>•</Text><Text>{x}</Text></View>)}</View>
  </View>;
}
const s=StyleSheet.create({root:{flex:1,padding:24,paddingTop:72,backgroundColor:'#fff'},hello:{fontSize:28,fontWeight:'900',color:'#171A3A'},muted:{color:'#6B6677'},pet:{marginTop:26,backgroundColor:'#F3EFFF',padding:16,borderRadius:20,flexDirection:'row',gap:14,alignItems:'center'},avatar:{width:64,height:64,borderRadius:18,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},petName:{fontSize:20,fontWeight:'800',color:'#171A3A'},card:{marginTop:16,backgroundColor:'#6D4DFF',padding:18,borderRadius:20,color:'#fff'},cardLabel:{color:'#EDE8FF'},cardTitle:{fontSize:22,fontWeight:'800',color:'#fff',marginTop:8},primary:{backgroundColor:'#fff',padding:13,borderRadius:12,alignItems:'center',marginTop:16},primaryText:{color:'#6D4DFF',fontWeight:'900'},section:{fontSize:20,fontWeight:'800',marginTop:26,color:'#171A3A'},row:{flexDirection:'row',gap:10,marginTop:12},shortcut:{flex:1,backgroundColor:'#F8F7FC',borderRadius:16,padding:12,alignItems:'center'}});
