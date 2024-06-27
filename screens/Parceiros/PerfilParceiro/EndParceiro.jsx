import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { app } from '../../../firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { Estilizar } from '../../../assets/EstilosGerais';

import ModalConfirm from '../../../components/ModalConfirm';

const firestore = getFirestore(app);

const EnderecoParceiro = ({ navigation, route }) => {
  const estilosGerais = Estilizar();
  
  const { parceiro } = route.params;

  const [id] = useState(parceiro.id);
  const [ruaParceiro, setRuaParceiro] = useState(parceiro.rua); 
  const [numeroParceiro, setNumeroParceiro] = useState(parceiro.numero);
  const [bairroParceiro, setBairroParceiro] = useState(parceiro.bairro);
  const [cidadeParceiro, setCidadeParceiro] = useState(parceiro.cidade);
  const [estadoParceiro, setEstadoParceiro] = useState(parceiro.estado);

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
    return ruaParceiro.trim() !== '' &&
           numeroParceiro.trim() !== '' &&
           bairroParceiro.trim() !== '' &&
           cidadeParceiro.trim() !== '' &&
           estadoParceiro.trim() !== '';
  };

  function altEndereco() {
    if (!id) {  
        Alert.alert("Erro", "ID do registro não encontrado. Por favor, tente novamente."); 
        return;
    }
    
    updateDoc(doc(collection(firestore, "parceiros"), id), {
        rua: ruaParceiro,
        numero: numeroParceiro,
        bairro: bairroParceiro,
        cidade: cidadeParceiro,
        estado: estadoParceiro
    })
    .then(() => {
        Alert.alert("Endereço atualizado", "Endereço atualizado com sucesso");
        navigation.navigate("HomeParceiro");
    })
    .catch((error) => {
        console.error("Erro ao atualizar endereço:", error);
        Alert.alert("Erro", "Ocorreu um erro ao atualizar o endereço. Por favor, tente novamente.");
    });
  }
  

  return (
    <SafeAreaView style={[estilosGerais.container, { justifyContent: 'flex-start', backgroundColor: '#171717' }]}>
      <View style={[estilosGerais.vheaderr, {backgroundColor: '#171717'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#479c33" />
        </TouchableOpacity>
        <Text style={[estilosGerais.headerTitle, {color: 'whitesmoke'}]}>MEU ENDEREÇO</Text>
      </View>

      <View style={estilosGerais.body}>
        {/* RUA E NUMERO */}
        <View style={estilosGerais.ruaNumero}>
        <View style={estilosGerais.inputGroupEnd}>
          <Text style={[estilosGerais.inputLabel, {color: 'white'}]}>Rua:</Text>
          <TextInput
            style={[estilosGerais.inputPrimario, {color: 'whitesmoke'}]}
            placeholder="Informe sua rua"
            placeholderTextColor="whitesmoke" 
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setRuaParceiro} 
            value={ruaParceiro}
            maxLength={50}
          /></View>
        <View style={estilosGerais.inputGroupEnd}>
          <Text style={[estilosGerais.inputLabel, {color: 'white'}]}>Número</Text>
          <TextInput
            style={[estilosGerais.inputSecundario, {color: 'whitesmoke'}]}
            placeholder="Nº"
            keyboardType="numeric"
            placeholderTextColor="whitesmoke" 
            cursorColor={'#E46216'}
            onChangeText={setNumeroParceiro}
            value={numeroParceiro}
            maxLength={4}/>
        </View></View>


        <View style={estilosGerais.inputGroupEnd}>
          <Text style={[estilosGerais.inputLabel, {color: 'white'}]}>Bairro:</Text>
          <TextInput
            style={[estilosGerais.inputEnd, {color: 'whitesmoke'}]}
            placeholder="Informe seu bairro"
            autoCapitalize="words"
            placeholderTextColor="whitesmoke" 
            cursorColor={'#E46216'}
            onChangeText={setBairroParceiro} 
            value={bairroParceiro}
            maxLength={40}/>

        </View>

        <View style={estilosGerais.cidadeEstado}>
        <View style={estilosGerais.inputGroupEnd}>
          <Text style={[estilosGerais.inputLabel, {color: 'white'}]}>Cidade:</Text>
          <TextInput
            style={[estilosGerais.inputPrimario, {color: 'whitesmoke'}]}
            placeholder="Informe sua cidade"
            autoCapitalize="words"
            placeholderTextColor="whitesmoke" 
            cursorColor={'#E46216'}
            onChangeText={setCidadeParceiro} 
            value={cidadeParceiro}
            maxLength={20}/>
        </View>

        <View style={estilosGerais.inputGroupEnd}>
          <Text style={[estilosGerais.inputLabel, {color: 'white'}]}>Estado:</Text>
          <TextInput
            style={[estilosGerais.inputSecundario, {color: 'whitesmoke'}]}
            placeholder="UF"
            autoCapitalize="words"
            onChangeText={setEstadoParceiro}
            maxLength={2} 
            placeholderTextColor="whitesmoke" 
            value={estadoParceiro} /></View></View>

      {errorMessage ? (
          <Text style={estilosGerais.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={estilosGerais.botao} onPress={handleUpdatePress}>
          <Text style={estilosGerais.txtBotaoEnd}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      <ModalConfirm
        visible={showModal}
        setVisible={setShowModal}
        action={altEndereco}
        message="Tem certeza que deseja atualizar seu endereço?"
      />
    </SafeAreaView>
  );
};



export default EnderecoParceiro;