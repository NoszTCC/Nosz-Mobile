import React, { useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfig from '../../firebaseConfig';
import { Estilizar } from '../../assets/EstilosGerais';

const app = initializeApp(firebaseConfig);

export default function EsqueceuSenha({ navigation }) {

  const estilosGerais = Estilizar();
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
  
  function voltarLogin() {
    navigation.navigate('Login', { title: 'Login' })
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
              <TouchableOpacity onPress={voltarLogin}>
                <Image source={require('../../assets/images/voltar-icon.png')} style={estilosGerais.voltar} />
              </TouchableOpacity>
            </View>
            <View style={styles.vtexto}>
              <Text style={estilosGerais.t1}>Altere sua</Text>
              <Text style={estilosGerais.t2}>Senha</Text>
              <Text style={estilosGerais.txt}>Insira seu E-Mail</Text>
            </View>
          </View>
          <Image source={require('../../assets/images/nosz.png')} style={[estilosGerais.nosz, {zIndex: 999}]} />
          <View style={[estilosGerais.circulo, {backgroundColor: '#683c15'}]}></View>
        </View>
        <View style={styles.vinputs}>
          <TextInput
            style={estilosGerais.input}
            placeholder='Email'
            cursorColor={'#E46216'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            autoFocus = {true}
          />
        </View>
        <View style={estilosGerais.buttonview}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={estilosGerais.buttonLogin} onPress={handleResetPassword}>
            <Text style={estilosGerais.buttonTextLogin}> Enviar Email de Recuperação</Text>
          </TouchableOpacity>

          <View style={styles.circulo2}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    bottom: '-150%',
    right: '-4%',
    zIndex: -1,
  },
  message: {
    color: '#f89a14',
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 10,
    fontSize: 13
  },
});