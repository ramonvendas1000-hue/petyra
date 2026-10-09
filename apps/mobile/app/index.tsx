import { Link } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Entry() {
  return (
    <View style={styles.root}>
      <Text style={styles.brand}>🐾 Petyra</Text>
      <Text style={styles.title}>Bem-vindo à Petyra</Text>
      <Text style={styles.subtitle}>Um app. Duas experiências: Tutor e Business.</Text>
      <Link href="/(tutor)" asChild><Pressable style={styles.primary}><Text style={styles.primaryText}>Entrar como Tutor</Text></Pressable></Link>
      <Link href="/(business)" asChild><Pressable style={styles.secondary}><Text style={styles.secondaryText}>Entrar no Business</Text></Pressable></Link>
    </View>
  );
}
const styles = StyleSheet.create({
  root:{flex:1,justifyContent:'center',padding:28,backgroundColor:'#F3EFFF'},
  brand:{fontSize:28,fontWeight:'900',color:'#171A3A'},
  title:{fontSize:32,fontWeight:'800',marginTop:32,color:'#171A3A'},
  subtitle:{fontSize:16,color:'#59556A',marginTop:10,marginBottom:28},
  primary:{backgroundColor:'#6D4DFF',padding:16,borderRadius:14,alignItems:'center'},
  primaryText:{color:'#fff',fontWeight:'800'},
  secondary:{marginTop:12,borderWidth:1,borderColor:'#6D4DFF',padding:16,borderRadius:14,alignItems:'center',backgroundColor:'#fff'},
  secondaryText:{color:'#6D4DFF',fontWeight:'800'},
});
