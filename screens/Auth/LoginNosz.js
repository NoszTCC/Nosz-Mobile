import React, { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { estilizar } from '../../assets/EstilosGerais';
import LoginGoogle from './LoginGoogle';


const app = initializeApp(firebaseConfig);

export default function Login({ navigation }) {

  const estilosGerais = estilizar();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);


  const handleAuthentication = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Inicio');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Email ou Senha incorretos.');
      } else if (error.code === 'auth/invalid-email'){
        setErrorMessage('Por favor, insira um email válido.');
      } 
     else if (error.code === 'auth/user-not-found'){
      setErrorMessage('Email não cadastrado.');
      }
      else if (error.code === 'auth/missing-password'){
        setErrorMessage('Por favor, insira a senha.');
        }  
      else {
        setErrorMessage(error.message);
      }
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <SafeAreaView style={estilosGerais.container}>
      <StatusBar 
       barStyle="light-content"
       translucent={true}
       backgroundColor="transparent"
       /> 
       <View style={estilosGerais.content}>
        <View style={estilosGerais.vheader}>
          <View style={styles.preheader}>
            <View style={styles.vgoback}>
              <TouchableOpacity onPress={() => navigation.navigate('Onboarding', { title: 'Onboarding', })}>
                <Image source={require('../../assets/images/voltar-icon.png')} style={estilosGerais.voltar} />
              </TouchableOpacity>
            </View>
            <View style={styles.vtexto}>
              <Text style={estilosGerais.t1}>Realize seu</Text>
              <Text style={estilosGerais.t2}>Login</Text>
              <Text style={estilosGerais.txt}>Digite seu email e senha.</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/nosz.png')} style={estilosGerais.nosz} />
          <View style={styles.circulo}></View>
        </View>
        <View style={styles.vinputs}>
          <TextInput
            style={estilosGerais.input}
            placeholder='Email'
            cursorColor={'#E46216'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
          <TextInput
            style={estilosGerais.input}
            placeholder='Senha'
            cursorColor={'#E46216'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={estilosGerais.buttonview}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleAuthentication}>
            <Text style={styles.buttonTextLogin}>Fazer Login</Text>
          </TouchableOpacity>
          
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkCadastro}>Ou ainda não é cadastrado?</Text>
          </TouchableOpacity>
          <View style={styles.vbGoogle}>
            <LoginGoogle></LoginGoogle>
          </View>
          <View style={styles.circulo2}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circulo: {
    position: 'absolute',
    backgroundColor: '#0EAA00',
    borderRadius: 360,
    width: '150%',
    height: '285%',
    right: '34%',
    bottom: '-290%',
    zIndex: -1,
  },
  vinputs:{
    flex: 1, 
    justifyContent: 'flex-end',
  },
  circulo2: {
    position: 'absolute',
    backgroundColor: '#0EAA00',
    borderRadius: 360,
    width: '150%',
    height: '285%',
    bottom: '-110%',
    right: '-4%',
    zIndex: -1,
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
    fontSize: 15,
    color: '#683C15',
    fontFamily: 'Montserrat_400Regular',
    textDecorationLine: 'underline'
  },
  linkCadastro:{
    marginTop: 7,
    fontSize: 15,
    color: '#f5f5f5',
    fontFamily: 'Montserrat_400Regular',
    textDecorationLine: 'underline'
  },
  errorMessage: {
    color: '#f89a14',
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 10,
    fontSize: 13
  },
});