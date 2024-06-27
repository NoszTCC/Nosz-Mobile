import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { app } from '../../firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { Estilizar } from '../../assets/EstilosGerais';
import MaskInput, { Masks } from 'react-native-mask-input';
import ModalConfirm from '../../components/ModalConfirm';

const firestore = getFirestore(app);

const DadosConta = ({ navigation, route }) => {
  const estilosGerais = Estilizar();
  
  const { user } = route.params;

  const [id] = useState(user.id);
  const [nome, setNome] = useState(user.nome); 
  const [cpf, setCpf] = useState(user.cpf);
  const [telefone, setTelefone] = useState(user.telefone);

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function altDados() {
    if (!id) {  
      Alert.alert("Erro", "ID do registro não encontrado. Por favor, tente novamente."); 
      return;
    }
    
    updateDoc(doc(collection(firestore, "users"), id), {
        nome: nome,
        cpf: cpf,
        telefone: telefone,
    })
    .then(() => {
        Alert.alert("Cadastro", "Registro atualizado com sucesso");
        navigation.navigate("Inicio");
    })
    .catch((error) => {
        console.error("Erro ao atualizar registro:", error);
        Alert.alert("Erro", "Ocorreu um erro ao atualizar o registro. Por favor, tente novamente.");
    });
  }

  const handleUpdatePress = () => {
    if (!nome || !cpf || !telefone) {
      setErrorMessage('Todos os campos são obrigatórios. Por favor, preencha todos os campos.');
      setShowModal(false);
      return;
    }
    setShowModal(true);
  };

  useEffect(() => {
      setNome(user.nome || '');
      setCpf(user.cpf || '');
      setTelefone(user.telefone || '');
  }, [user]);

  return (
    <SafeAreaView style={[estilosGerais.container, { justifyContent: 'flex-start', backgroundColor: '#F5F5F5' }]}>
      <View style={estilosGerais.vheaderr}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#479c33" />
        </TouchableOpacity>
        <Text style={[estilosGerais.headerTitle, {fontFamily: 'Montserrat_700Bold'}]}>INFORMAÇÕES PESSOAIS</Text>
      </View>

      <View style={estilosGerais.body}>
        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold'}]}>Nome:</Text>
          <TextInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular'}]}
            placeholder="Altere seu nome:"
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setNome} 
            value={nome}
          />
        </View>
        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold'}]}>CPF:</Text>
          <MaskInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular'}]}
            placeholder="XXX.XXX.XXX-XX"
            keyboardType="numeric"
            cursorColor={'#E46216'}
            onChangeText={setCpf}
            value={cpf}
            maxLength={14}
            mask={Masks.BRL_CPF}
          />
        </View>
        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold'}]}>Telefone:</Text>
          <MaskInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular'}]}
            placeholder="(XX) XXXXX-XXXX"
            keyboardType="numeric"
            cursorColor={'#E46216'}
            onChangeText={setTelefone} 
            value={telefone} 
            maxLength={15}
            mask={Masks.BRL_PHONE}
          />
        </View>
        {errorMessage ? (
          <Text style={estilosGerais.errorMessage}>
            {errorMessage}
          </Text>
        ) : null}
        <TouchableOpacity style={estilosGerais.botao} onPress={handleUpdatePress}>
          <Text style={[estilosGerais.txtBotao, {fontFamily: 'Montserrat_600SemiBold'}]}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <ModalConfirm
        visible={showModal}
        setVisible={setShowModal}
        action={altDados}
        message="Tem certeza que deseja atualizar seus dados?"
      />
    </SafeAreaView>
  );
};

export default DadosConta;