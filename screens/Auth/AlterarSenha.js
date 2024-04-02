import React, { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { initializeApp } from '@firebase/app';
import { confirmPasswordReset, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { estilizar } from '../../assets/EstilosGerais';
import { useRoute } from '@react-navigation/native';

const app = initializeApp(firebaseConfig);

export default function EsqueceuSenha({ navigation }) {

  const estilosGerais = estilizar();

  const route = useRoute();
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleResetPassword = async () => {
    try {
      const auth = getAuth(app);
      await confirmPasswordReset(auth, email, password);
      navigation.navigate('AlterarSenha');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
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
              <Text style={estilosGerais.t1}>Altere sua</Text>
              <Text style={estilosGerais.t2}>Senha</Text>
              <Text style={estilosGerais.txt}>Mude sua senha</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/nosz.png')} style={estilosGerais.nosz} />
          <View style={styles.circulo}></View>
        </View>
        <View style={styles.vinputs}>
          <TextInput
            style={estilosGerais.input}
            placeholder='Senha'
            cursorColor={'#E46216'}
            value={password}
            onChangeText={setPassword}
            autoCapitalize='none'
            secureTextEntry
          />
        </View>
        <View style={estilosGerais.buttonview}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleResetPassword}>
            <Text style={styles.buttonTextLogin}>Confirmar Senha</Text>
          </TouchableOpacity>

          <View style={styles.circulo2}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    circulo: {
      position: 'absolute',
      backgroundColor: '#e36216',
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
      backgroundColor: '#e36216',
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