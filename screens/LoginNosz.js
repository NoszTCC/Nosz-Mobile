import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

export default function Login({navigation}) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync(); // Evitar que a tela de splash seja ocultada automaticamente
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync(); // Ocultar a tela de splash quando os recursos forem carregados
      }
    }

    if (!fontsLoaded) {
      loadResourcesAndDataAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      <View style={styles.vheader}>
        
        <Image source={require('../assets/images/voltar-icon.png')} style={styles.voltar}/>
        <Image source={require('../assets/images/nosz.png')} style={styles.nosz}/>

      </View>

      <View style={styles.vtexto}>
          <Text style={styles.t1}>Realize seu</Text>
          <Text style={styles.t2}>Login</Text> 
          <Text style={styles.txt}>Digite seu email e senha.</Text>
      </View>
      
      <View style={styles.inputs}>
      <TextInput style={styles.input} placeholder='Email'/>

      </View>



      <View style={styles.buttonview}>
        <TouchableOpacity style={styles.buttonLogin}
          onPress={() => navigation.navigate('Login', { title: 'Login',})}
          >
          <Text style={styles.buttonTextLogin}>Fazer Login</Text>
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
  },
  vheader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voltar:{
    width: 34,
    height: 40,
    margin:10
  },
  nosz:{
    width: 170,
    height: 170,
    alignSelf:'flex-end',
    zIndex:-1
  },
  t1:{
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'left',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
  },
  t2:{
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'left',
    fontSize: 35,
    alignSelf: 'flex-start',
    color: '#FA9914',
  }, 
  txt:{
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'left',
    fontSize: 18,
    color: '#565656',
    alignSelf: 'flex-start',
  },
  input:{
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    height: 45,
    placeholder: "Email",
},
  content:{
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#ecf0f1',
    margin: 10,
    padding: 18,
    width: '100%',
    height: '100%',
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
    fontFamily: 'Montserrat_500Medium',
    color: '#E46216',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  
});