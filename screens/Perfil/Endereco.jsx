import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { app } from '../../firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { Estilizar } from '../../assets/EstilosGerais';

import ModalConfirm from '../../components/ModalConfirm';

const firestore = getFirestore(app);

const Endereco = ({ navigation, route }) => {
  const estilosGerais = Estilizar();
  
  const { user } = route.params;

  const [id] = useState(user.id);
  const [rua, setRua] = useState(user.rua); 
  const [numero, setNumero] = useState(user.numero);
  const [bairro, setBairro] = useState(user.bairro);
  const [cidade, setCidade] = useState(user.cidade);
  const [estado, setEstado] = useState(user.estado);

  const [showModal, setShowModal] = useState(false);

  function altEndereco() {
    if (!id) {  
        Alert.alert("Erro", "ID do registro não encontrado. Por favor, tente novamente."); 
        return;
    }
    
    updateDoc(doc(collection(firestore, "users"), id), {
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado
    })
    .then(() => {
        Alert.alert("Endereço atualizado", "Endereço atualizado com sucesso");
        navigation.navigate("Inicio");
    })
    .catch((error) => {
        console.error("Erro ao atualizar endereço:", error);
        Alert.alert("Erro", "Ocorreu um erro ao atualizar o endereço. Por favor, tente novamente.");
    });
  }
  

  return (
    <SafeAreaView style={[estilosGerais.container, { justifyContent: 'flex-start', backgroundColor: '#F5F5F5' }]}>
      <View style={estilosGerais.vheaderr}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#479c33" />
        </TouchableOpacity>
        <Text style={estilosGerais.headerTitle}>MEU ENDEREÇO</Text>
      </View>

      <View style={estilosGerais.body}>
        {/* RUA E NUMERO */}
        <View style={estilosGerais.ruaNumero}>
        <View style={estilosGerais.inputGroupEnd}>
          <Text style={estilosGerais.inputLabel}>Rua:</Text>
          <TextInput
            style={[estilosGerais.inputPrimario, {fontFamily: 'Montserrat_500Medium', fontSize: 15}]}
            placeholder="Informe sua rua"
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setRua} 
            value={rua}
            maxLength={50}
          /></View>
        <View style={estilosGerais.inputGroupEnd}>
          <Text style={estilosGerais.inputLabel}>Número</Text>
          <TextInput
            style={[estilosGerais.inputSecundario, {fontFamily: 'Montserrat_500Medium', fontSize: 15}]}
            placeholder="Nº"
            keyboardType="numeric"
            cursorColor={'#E46216'}
            onChangeText={setNumero}
            value={numero}
            maxLength={4}/>
        </View></View>


        <View style={estilosGerais.inputGroupEnd}>
          <Text style={estilosGerais.inputLabel}>Bairro:</Text>
          <TextInput
            style={[estilosGerais.inputPrimario, {fontFamily: 'Montserrat_500Medium', fontSize: 15}]}
            placeholder="Informe seu bairro"
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setBairro} 
            value={bairro}
            maxLength={40}/>

        </View>

        <View style={estilosGerais.cidadeEstado}>
        <View style={estilosGerais.inputGroupEnd}>
          <Text style={estilosGerais.inputLabel}>Cidade:</Text>
          <TextInput
            style={[estilosGerais.inputPrimario, {fontFamily: 'Montserrat_500Medium', fontSize: 15}]}
            placeholder="Informe sua cidade"
            autoCapitalize="words"
            cursorColor={'#E46216'}
            onChangeText={setCidade} 
            value={cidade}
            maxLength={20}/>
        </View>

        <View style={estilosGerais.inputGroupEnd}>
          <Text style={estilosGerais.inputLabel}>Estado:</Text>
          <TextInput
            style={[estilosGerais.inputSecundario, {fontFamily: 'Montserrat_500Medium', fontSize: 15}]}
            placeholder="UF"
            autoCapitalize="characters"
            onChangeText={setEstado}
            maxLength={2} 
            value={estado} /></View></View>

        <TouchableOpacity style={estilosGerais.botao} onPress={() => setShowModal(true)}>
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

export default Endereco;