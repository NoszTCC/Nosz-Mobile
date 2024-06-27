import React, { useState, useRef } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Modal } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { Estilizar } from '../../assets/EstilosGerais';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';


const app = initializeApp(firebaseConfig);

export default function Login({ navigation }) {
  const estilosGerais = Estilizar();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorMessageRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isParceiro, setIsParceiro] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentInput, setCurrentInput] = useState('email');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthentication = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('isParceiro', isParceiro.toString());
      if (isParceiro) {
        navigation.navigate('HomeParceiro');
      } else {
        navigation.navigate('Inicio');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      let errorMessage = 'Ocorreu um erro ao fazer login.';
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Email ou senha incorretos.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Por favor, insira um email válido.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Email não cadastrado.';
          break;
        case 'auth/missing-password':
          errorMessage = 'Por favor, insira a senha.';
          break;
        default:
          errorMessage = error.message;
          break;
      }
      setErrorMessage(errorMessage);
      if (errorMessageRef.current) {
        errorMessageRef.current.fadeIn(700);
      }
    }
  };

  const openModal = (input) => {
    setCurrentInput(input);
    setModalVisible(true);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    setIsEmailValid(validateEmail(email));
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
              <Text style={[estilosGerais.t2, {color: '#F15A29'}]}>Login</Text>
              <Text style={estilosGerais.txt}>Digite seu email e senha.</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/nosz.png')} style={estilosGerais.nosz} />
          <KeyboardAvoidingView style={[estilosGerais.circulo, {top: '110%'}]} behavior="padding"></KeyboardAvoidingView>
        </View>
        <KeyboardAvoidingView style={estilosGerais.vinputs} keyboardVerticalOffset={40}>
          <TouchableOpacity onPress={() => openModal('email')} style={estilosGerais.input}>
            <Text style={{ fontSize: 20, color: email ? '#1B1B1B' : '#333333' }}>{email || 'E-mail'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal('password')} style={estilosGerais.input}>
            <Text style={{ fontSize: 20, color: password ? '#1B1B1B' : '#333333' }}>{password ? '********' : 'Senha'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <View style={estilosGerais.checkboxContainer}>
          <View style={estilosGerais.checkboxWrapper}>
            <BouncyCheckbox
              isChecked={isParceiro}
              fillColor="#683c15"
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "#479d32" }}
              textStyle={{ fontFamily: "Montserrat_600SemiBold", color: '#f89a14', textDecorationLine: 'none' }}
              onPress={() => setIsParceiro(!isParceiro)} 
            />
            <Text style={estilosGerais.parcerin}>Sou um parceiro (restaurante) </Text>
          </View>
        </View>
        <View style={estilosGerais.buttonview}>
        <Animatable.Text ref={errorMessageRef} style={estilosGerais.errorMessage}>{errorMessage}</Animatable.Text>
          <TouchableOpacity style={estilosGerais.buttonLogin} onPress={handleAuthentication}>
            <Text style={estilosGerais.buttonText}>Fazer Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenha')}>
            <Text style={styles.forgot}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkCadastro}>Ou ainda não é cadastrado?</Text>
          </TouchableOpacity>
          <KeyboardAvoidingView style={styles.circulo2} behavior="padding"></KeyboardAvoidingView>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Entypo name="chevron-thin-left" size={30} color="#479d32" />
            </TouchableOpacity>
            {currentInput === 'email' ? (
              <>
                <Text style={styles.iTxt}>Qual o seu e-mail?</Text>
                <TextInput
                  style={[estilosGerais.input, { width: '100%', margin: 0, marginTop: 10 }]}
                  placeholder='E-mail'
                  cursorColor={'#E46216'}
                  value={email}
                  onChangeText={handleEmailChange}
                  autoCapitalize='none'
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => setCurrentInput('password')}
                  style={[
                    styles.nextButton,
                    { backgroundColor: isEmailValid ? '#E46216' : '#ccc' },
                  ]}
                  disabled={!isEmailValid}
                >
                  <Text style={styles.continuar}>Continuar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.iTxt}>Qual a sua senha?</Text>
                <View style={[estilosGerais.input, styles.passwordContainer]}>
                  <TextInput
                    style={{ flex: 1, fontSize: 20, color: '#1B1B1B' }}
                    placeholder='Senha'
                    cursorColor={'#E46216'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoFocus
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.nextButton}>
                  <AntDesign name="check" size={44} color="#ecf0f1" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  vinputs: {
    flex: 1, 
    justifyContent: 'flex-end',
  },
  circulo2: {
    position: 'absolute',
    backgroundColor: '#0EAA00',
    borderRadius: 360,
    width: '160%',
    height: '350%',
    bottom: '-120%',
    right: '-4%',
    zIndex: -1,
  },
  forgot: {
    fontSize: 15,
    color: '#683C15',
    fontFamily: 'Montserrat_400Regular',
    textDecorationLine: 'underline'
  },
  linkCadastro: {
    marginTop: 7,
    fontSize: 15,
    color: '#f5f5f5',
    fontFamily: 'Montserrat_400Regular',
    textDecorationLine: 'underline'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ecf0f1',
    padding: 30,
    flex: 1,
    justifyContent: 'flex-start',
  },
  closeButton: {
    marginBottom: 30
  },
  nextButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E46216',
    justifyContent: 'center',
    alignItems: 'center',
    height: 65
  },
  iTxt: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 17,
    marginBottom: 30
  },
  continuar: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
    color: 'whitesmoke',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  eyeIcon: {
    padding: 10,
  },
});
