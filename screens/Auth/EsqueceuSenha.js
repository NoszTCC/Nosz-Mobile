import React, { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { estilizar } from '../../assets/EstilosGerais';

const app = initializeApp(firebaseConfig);

export default function EsqueceuSenha({ navigation }) {

  const estilosGerais = estilizar();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      setMessage('Email enviado com sucesso!');
    } catch (error) {
      if (error.code === 'auth/missing-email') {
        setMessage('Por favor, insira um email.');
      } else if (error.code === 'auth/invalid-email'){
        setMessage('Email ainda não cadastrado');
      } 
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
              <TouchableOpacity onPress={() => navigation.navigate('Login', { title: 'Login', })}>
                <Image source={require('../../assets/images/voltar-icon.png')} style={estilosGerais.voltar} />
              </TouchableOpacity>
            </View>
            <View style={styles.vtexto}>
              <Text style={estilosGerais.t1}>Altere sua</Text>
              <Text style={estilosGerais.t2}>Senha</Text>
              <Text style={estilosGerais.txt}>Insira seu E-Mail</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/nosz.png')} style={estilosGerais.nosz} />
          <View style={styles.circulo}></View>
        </View>
        <View style={styles.vinputs}>
          <TextInput
            style={estilosGerais.input}
            placeholder='E-Mail'
            cursorColor={'#E46216'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
        </View>
        <View style={estilosGerais.buttonview}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleResetPassword}>
            <Text style={styles.buttonTextLogin}> Procurar E-Mail </Text>
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
    backgroundColor: '#683c15',
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
    backgroundColor: '#683c15',
    borderRadius: 360,
    width: '150%',
    height: '450%',
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
  message: {
    color: '#f89a14',
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 10,
    fontSize: 13
  },
});
