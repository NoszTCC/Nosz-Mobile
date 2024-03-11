import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    if (!fontsLoaded) {
      loadResourcesAndDataAsync();
    }
  }, [fontsLoaded]);

  const handleAuthentication = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Pagina Inicial');
    } catch (error) {
      Alert.alert('Erro ao fazer login', error.message);
      console.error('Erro ao fazer login:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.vheader}>
          <View style={styles.preheader}>
            <View style={styles.vgoback}>
              <TouchableOpacity onPress={() => navigation.navigate('Inicial', { title: 'Início', })}>
                <Image source={require('../assets/images/voltar-icon.png')} style={styles.voltar} />
              </TouchableOpacity>
            </View>
            <View style={styles.vtexto}>
              <Text style={styles.t1}>Realize seu</Text>
              <Text style={styles.t2}>Login</Text>
              <Text style={styles.txt}>Digite seu email e senha.</Text>
            </View>
          </View>
          <Image source={require('../assets/images/nosz.png')} style={styles.nosz} />
          <View style={styles.circulo}></View>
        </View>
        <View style={styles.vinputs}>
          <TextInput
            style={styles.input}
            placeholder='Email'
            cursorColor={'#E46216'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
          <TextInput
            style={styles.input}
            placeholder='Senha'
            cursorColor={'#E46216'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.buttonview}>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleAuthentication}>
            <Text style={styles.buttonTextLogin}>Fazer Login</Text>
          </TouchableOpacity>
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
          <TouchableOpacity style={styles.buttonGoogle}>
            <View style={styles.vbGoogle}>
              <Image source={require('../assets/images/google.png')} style={styles.google} />
              <Text style={styles.buttonTextGoogle}>Continuar com Google</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.circulo2}></View>
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
  vheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voltar: {
    width: 34,
    height: 40,
    margin: 10
  },
  nosz: {
    width: 170,
    height: 170,
    alignSelf: 'flex-end',
    zIndex: -1
  },
  t1: {
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'left',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
  },
  t2: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'left',
    fontSize: 35,
    alignSelf: 'flex-start',
    color: '#FA9914',
  },
  txt: {
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'left',
    fontSize: 18,
    color: '#565656',
    alignSelf: 'flex-start',
  },
  circulo: {
    position: 'absolute',
    backgroundColor: '#0EAA00',
    borderRadius: 360,
    width: '130%',
    height: '285%',
    right: '34%',
    bottom: '-290%',
    zIndex: -1,
  },
  vinputs:{
    flex: 1, 
    justifyContent: 'flex-end', 
  },
  input: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    color: '#131313',
    height: 35,
    fontSize: 19,
    margin: 20
  },
  circulo2: {
    position: 'absolute',
    backgroundColor: '#0EAA00',
    borderRadius: 360,
    width: '120%',
    height: '264%',
    bottom: '-90%',
    right: '-4%',
    zIndex: -999,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#ecf0f1',
    margin: 10,
    padding: 18,
    width: '100%',
    height: '100%',
  },
  buttonview: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor: '#E46216',
    alignSelf: 'center',
    width: '75%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    margin: 13,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonTextLogin: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonGoogle: {
    backgroundColor: '#6098F3',
    alignSelf: 'center',
    width: '75%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    margin: 13,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 10 },
  },
  vbGoogle:{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  google:{
    width: 30,
    height: 30,
  },
  buttonTextGoogle: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 5
  },
  forgot:{
    color: '#683C15',
    fontFamily: 'Montserrat_400Regular',
    textDecorationLine: 'underline'
  }
});