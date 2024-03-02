import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

export default function Initial({navigation}) {
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
        <View style={styles.vtexto}>
          <Text style={styles.t1}>Bem-vindo à</Text>
          <Text style={styles.t2}>Nósz</Text> 
        </View>
        <View style={styles.vimg}>
          <Image source={require('../assets/images/nosz.png')} style={styles.nosz}/>
        </View>
        <View style={styles.buttonview}>
          <TouchableOpacity style={styles.buttonLogin}
          onPress={() => navigation.navigate('Login', { title: 'Login',})}
          >
            <Text style={styles.buttonTextLogin}>Fazer Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCadastro}
          onPress={() => navigation.navigate('Cadastro', { title: 'Cadastro',})}
          >
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
    backgroundColor: '#FFE9C0'
    },
  t1:{
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'left',
    fontSize: 45,
    color: '#444444',
    alignSelf: 'flex-start',
  },
  t2:{
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'left',
    fontSize: 50,
    alignSelf: 'flex-start',
    color: '#FA9914',
  },
  content:{
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFE9C0',
    margin: 10,
    padding: 18,
    width: '100%',
    height: '100%',
  },
  nosz:{
    width: 320,
    height: 360,
  },
  vtexto:{},
  vimg:{
    alignSelf:'center'
  },
  buttonview:{
    flexDirection: 'column',
    justifyContent: 'space-between',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
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
    fontFamily: 'Montserrat_500Medium',
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});