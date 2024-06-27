import React, { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Modal, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from '@firebase/app';
import firebaseConfig from '../../firebaseConfig';
import { Estilizar } from '../../assets/EstilosGerais';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo  } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig);

export default function Cadastro({ navigation }) {
  const estilosGerais = Estilizar();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isParceiro, setIsParceiro] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentInput, setCurrentInput] = useState('email');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleCadastro = async () => {
    try {
      if (password === "" || confirmPassword === "") {
        setErrorMessage('Preencha todos os campos');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem');
        return;
      }
      await createUserWithEmailAndPassword(getAuth(app), email, password);
      await AsyncStorage.setItem('isParceiro', isParceiro.toString());
      Alert.alert('Cadastro realizado com sucesso', 'Usuário criado com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este email já está cadastrado');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('A senha deve conter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email'){
        setErrorMessage('Por favor, insira um email válido');
      } else if (error.code === 'auth/missing-email'){
        setErrorMessage('Por favor, insira um email.');
      } else if (error.code === 'auth/network-request-failed'){
        setErrorMessage('Sem conexão com internet!');
      } else{
        setErrorMessage(error.message);
      }
      console.error('Erro ao fazer cadastro:', error.message);
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

  function voltarLogin() {
    navigation.navigate('Login', { title: 'Login' });
  }

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
              <TouchableOpacity
                onPress={voltarLogin}
              >
                <Image source={require('../../assets/images/voltar-icon.png')} style={estilosGerais.voltar} />
              </TouchableOpacity>
            </View>
            <View style={styles.vtexto}>
              <Text style={estilosGerais.t1}>Realize seu</Text>
              <Text style={estilosGerais.t2}>Cadastro</Text>
              <Text style={estilosGerais.txt}>Digite seu email e senha.</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/nosz.png')} style={estilosGerais.nosz} />
          <View style={[estilosGerais.circulo, {backgroundColor: '#f89a14'}]}></View>
        </View>

        <KeyboardAvoidingView style={estilosGerais.vinputs} keyboardVerticalOffset = {40}>
          <TouchableOpacity onPress={() => openModal('email')} style={estilosGerais.input}>
            <Text style={{ fontSize: 20, color: email ? '#1B1B1B' : '#333333' }}>{email || 'E-mail'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal('password')} style={estilosGerais.input}>
            <Text style={{ fontSize: 20, color: password ? '#1B1B1B' : '#333333' }}>{password ? '********' : 'Senha'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal('confirmPassword')} style={estilosGerais.input}>
            <Text style={{ fontSize: 20, color: confirmPassword ? '#1B1B1B' : '#333333' }}>{confirmPassword ? '********' : 'Confirmar Senha'}</Text>
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
            <Text style={[estilosGerais.parcerin, {color: 'whitesmoke'}]}>Sou um parceiro (restaurante) </Text>
          </View>
        </View>
        <View style={estilosGerais.buttonview}>
          <Text style={estilosGerais.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={[estilosGerais.buttonLogin, {backgroundColor: '#479d32'}]}
            onPress={handleCadastro}
          >
            <Text style={[estilosGerais.buttonText, {backgroundColor: '#479d32'}]}>Cadastrar</Text>
          </TouchableOpacity>
          <View style={styles.circulo2}></View>
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
            ) : currentInput === 'password' ? (
              <>
                <Text style={styles.iTxt}>Qual a sua senha?</Text>
                <TextInput
                  style={[estilosGerais.input, { width: '100%', margin: 0, marginTop: 10 }]}
                  placeholder='Senha'
                  cursorColor={'#E46216'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => setCurrentInput('confirmPassword')}
                  style={styles.nextButton}
                >
                  <Text style={styles.continuar}>Continuar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.iTxt}>Confirme a sua senha</Text>
                <TextInput
                  style={[estilosGerais.input, { width: '100%', margin: 0, marginTop: 10 }]}
                  placeholder='Confirmar Senha'
                  cursorColor={'#E46216'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoFocus
                />
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
  circulo2: {
    position: 'absolute',
    backgroundColor: '#f89a14',
    borderRadius: 480,
    width: '200%',
    height: '480%',
    bottom: '-150%',
    right: '-4%',
    zIndex: -999,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 30
  },
  iTxt: {
    fontSize: 18,
    fontFamily: 'Montserrat_400Regular',
    color: '#1B1B1B',
    alignSelf: 'baseline',
    marginBottom: 30
  },
  continuar: {
    fontSize: 20,
    fontFamily: 'Montserrat_400Regular',
    color: '#ecf0f1',
    textAlign: 'center',
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
});
