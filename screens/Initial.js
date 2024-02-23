import { Text, SafeAreaView, View, StyleSheet, Image } from 'react-native';

export default function Initial() {
  return (
    <SafeAreaView style={styles.container}>
            <View style={styles.content}>

              

              <Text style={styles.t1}>Bem vindo à</Text>
              <Text style={styles.t2}>Nósz</Text>

              <Image source={require('../assets/nosz.png')} style={styles.nosz}/>
            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20
  },
  t1:{
    textAlign: 'left',
    fontSize: 45,
    alignSelf: 'flex-start'
  },
  t2:{
    textAlign: 'left',
    fontSize: 50,
    alignSelf: 'flex-start'
  },
  content:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    height: '100%',
  },
  nosz:{
    width: 170,
    height: 200,
  }
});
