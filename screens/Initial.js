import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Initial() {
  return (
    <SafeAreaView style={styles.container}>
            <View style={styles.content}>

            <View style={styles.vtexto}>
              <Text Text style={styles.t1}>Bem-vindo à</Text>
              <Text style={styles.t2}>Nósz</Text> 
            </View>

            <View style={styles.vimg}>
              <Image source={require('../assets/nosz.png')} style={styles.nosz}/>
            </View>

            <View style={styles.buttonview}>
            <TouchableOpacity style={styles.buttonLogin}>
            <Text style={styles.buttonTextLogin}>Fazer Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCadastro}>
            <Text style={styles.buttonTextCadastro}>Cadastrar</Text>
            </TouchableOpacity>
            </View>

            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  t1:{
    textAlign: 'left',
    fontSize: 45,
    color: '#444444',
    alignSelf: 'flex-start',
    fontWeight: '600'
  },
  t2:{
    textAlign: 'left',
    fontSize: 50,
    alignSelf: 'flex-start',
    color: '#FA9914',
    fontWeight: 'bold'
  },
  content:{
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#ecf0f1',
    padding: 8,
    width: '100%',
    height: '100%',
  },
  nosz:{
    width: 340,
    height: 400,
  },
  vtexto:{

  },
  vimg:{
    alignSelf:'center'
  },
  buttonview:{
    flexDirection: 'column',
    justifyContent: 'space-between',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'center',
    width: '75%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 30,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonTextLogin: {
    color: '#E46216',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonCadastro: {
    backgroundColor: '#E46216',
    alignSelf: 'center',
    width: '75%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonTextCadastro: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
