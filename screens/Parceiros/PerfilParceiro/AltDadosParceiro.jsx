import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { app } from '../../../firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { Estilizar } from '../../../assets/EstilosGerais';
import MaskInput, { Masks } from 'react-native-mask-input';
import ModalConfirm from '../../../components/ModalConfirm';

const firestore = getFirestore(app);

const DadosParceiro = ({ navigation, route }) => {
  const estilosGerais = Estilizar();
  
  const { parceiro } = route.params;

  const [id] = useState(parceiro.id);
  const [nomeResponsavel, setNomeResponsavel] = useState(parceiro.responsavel); 
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState(parceiro.restaurante);
  const [cnpj, setCnpj] = useState(parceiro.cnpj);
  const [telefoneParceiro, setTelefoneParceiro] = useState(parceiro.telefone);

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdatePress = () => {
    if (!validateInputs()) {
      setErrorMessage('Todos os campos são obrigatórios. Por favor, preencha todos os campos.');
      setShowModal(false);
      return;
    }
    setShowModal(true);
  };

  const validateInputs = () => {
    return nomeResponsavel.trim() !== '' && 
           nomeEstabelecimento.trim() !== '' && 
           cnpj.trim() !== '' && 
           telefoneParceiro.trim() !== '';
  };

  function altDadosParceiro() {
    if (!id) {
      Alert.alert("Erro", "ID do registro não encontrado. Por favor, tente novamente.");
      return;
    }

    updateDoc(doc(collection(firestore, "parceiros"), id), {
      responsavel: nomeResponsavel,
      restaurante: nomeEstabelecimento,
      cnpj: cnpj,
      telefone: telefoneParceiro,
    })
    .then(() => {
      Alert.alert("Cadastro", "Registro atualizado com sucesso");
      navigation.navigate("HomeParceiro");
    })
    .catch((error) => {
      console.error("Erro ao atualizar registro:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o registro. Por favor, tente novamente.");
    });
  }

  useEffect(() => {
    setNomeResponsavel(parceiro.responsavel || '');
    setNomeEstabelecimento(parceiro.restaurante || '');
    setCnpj(parceiro.cnpj || '');
    setTelefoneParceiro(parceiro.telefone || '');
  }, [parceiro]);

  return (
    <SafeAreaView style={[estilosGerais.container, { justifyContent: 'flex-start', backgroundColor: '#171717' }]}>
      <View style={[estilosGerais.vheaderr, {backgroundColor: '#171717'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#479c33" />
        </TouchableOpacity>
        <Text style={[estilosGerais.headerTitle, {fontFamily: 'Montserrat_700Bold', color: 'whitesmoke'}]}>INFORMAÇÕES PESSOAIS</Text>
      </View>

      <View style={estilosGerais.body}>
        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold', color: 'white'}]}>Nome:</Text>
          <TextInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular', color: 'whitesmoke', borderBottomColor: 'white'}]}
            placeholder="Altere seu nome:"
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setNomeResponsavel} 
            value={nomeResponsavel}
          />
        </View>

        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold', color: 'white'}]}>Restaurante:</Text>
          <TextInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular', color: 'whitesmoke', borderBottomColor: 'white'}]}
            placeholder="Altere o nome do restaurante:"
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setNomeEstabelecimento} 
            value={nomeEstabelecimento}
          />
        </View>

        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold', color: 'white',}]}>CNPJ:</Text>
          <MaskInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular', color: 'whitesmoke', borderBottomColor: 'white'}]}
            placeholder="XXX.XXX.XXX-XX"
            keyboardType="numeric"
            placeholderTextColor="whitesmoke" 
            cursorColor={'#E46216'}
            onChangeText={setCnpj}
            value={cnpj}
            maxLength={18}
            mask={Masks.BRL_CNPJ}
          />
        </View>

        <View style={estilosGerais.inputGroup}>
          <Text style={[estilosGerais.inputLabel, {fontFamily: 'Montserrat_600SemiBold', color: 'white'}]}>Telefone:</Text>
          <MaskInput
            style={[estilosGerais.input, {fontFamily: 'Montserrat_400Regular', color: 'whitesmoke', borderBottomColor: 'white'}]}
            placeholder="(XX) XXXXX-XXXX"
            keyboardType="numeric"
            cursorColor={'#E46216'}
            onChangeText={setTelefoneParceiro} 
            value={telefoneParceiro} 
            maxLength={15}
            mask={Masks.BRL_PHONE}
          />
        </View>
        {errorMessage ? (
          <Text style={estilosGerais.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={estilosGerais.botao} onPress={handleUpdatePress}>
          <Text style={[estilosGerais.txtBotao, {fontFamily: 'Montserrat_600SemiBold'}]}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <ModalConfirm
        visible={showModal}
        setVisible={setShowModal}
        action={altDadosParceiro}
        message="Tem certeza que deseja atualizar seus dados?"
      />
    </SafeAreaView>
  );
};

export default DadosParceiro;
