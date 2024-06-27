import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, StatusBar, View, Modal, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore'; 
import { getAuth } from '@firebase/auth';
import { AntDesign, Feather, Ionicons, Entypo} from '@expo/vector-icons';
import  HeaderModelo  from '../components/HeaderModelo';
import { Estilizar } from '../assets/EstilosGerais';
import Parallax from './Carrossel/Parallax';
import MaskInput, { Masks } from 'react-native-mask-input';
import Reservar from './Reservar';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const Home = () => {

  const estilosGerais = Estilizar();
  const [user, setUser] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formularioPreenchido, setFormularioPreenchido] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();

  //STATES DADOS DO USUÁRIO
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [fone, setFone] = useState('');
  const [erroM, setErroM] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);


  //CHECAR SE O USUÁRIO É/NÃO É PARCEIRO
  useEffect(() => {
    const checkUserData = async () => {
      try {
        const isParceiro = await AsyncStorage.getItem('isParceiro');
        if (isParceiro === 'true') {
        } else {
          const currentUser = auth.currentUser;
          if (currentUser) {
            setUser(currentUser);
            const firestore = getFirestore();
    
            const q = query(collection(firestore, 'users'), where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
              setFormularioPreenchido(true);
              setTimeout(() => setShowFormModal(false));
            } else {
              setShowFormModal(true);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar se o usuário é um parceiro:', error);
      }
    };

    checkUserData();
  }, [formularioPreenchido, auth]);

  //ADICIONAR DADOS DO USUÁRIO NA COLLECTION "users"
  async function addDadosConta() {
    try {
      await addDoc(collection(firestore, 'users'), {
        nome: nome,
        cpf: cpf,
        telefone: fone,
        email: user.email
      });
      setNome('');
      setCpf('');
      setFone('');
      setFormularioPreenchido(true);
      await AsyncStorage.setItem('formularioPreenchido', 'true');
      Alert.alert("Cadastro", "Dados adicionados com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar dados:", error.message);
      Alert.alert("Erro", "Ocorreu um erro ao adicionar os dados. Por favor, tente novamente.");
    }
  }

  const handleSubmitForm = async () => {
    setShowFormModal(false);
  };

  const handleEnviarPress = () => {
    if (!nome || !cpf || !fone) {
      setErroM("Por favor, preencha todos os campos.");
      return;
    }
  
    addDadosConta();
    handleSubmitForm();
  };

  //PUXAR DADOS DOS PRODUTOS
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const q = query(collection(firestore, 'produtos'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const produtosData = [];
          querySnapshot.forEach((doc) => {
            produtosData.push({ ...doc.data(), id: doc.id });
          });
          setProdutos(produtosData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, [firestore]);

  const handleReservar = (produto) => {
    setProdutoSelecionado(produto);
  };

  //SE O PRODUTO FOR SELECIONADO, COMPONENTE "Reservar.jsx" ENTRA EM AÇÃO
  if (produtoSelecionado) {
    return <Reservar produto={produtoSelecionado} setProdutoSelecionado={setProdutoSelecionado} />;
  }

  return (
    <SafeAreaView style={styles.content}>
      <StatusBar 
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <HeaderModelo/>

      {/* MODAL PARA CADASTRAR DADOS PESSOAIS DO USUÁRIO */}
      <Modal visible={showFormModal} transparent={true} animationType="slide">
        <View style={estilosGerais.overlay}>
          <View style={[styles.modalContainer, {height: windowHeight/5, alignItems: 'center', justifyContent: 'center', width: windowWidth/1.5}]}>
            <View style={[estilosGerais.modalContent, {height: windowHeight/2}]}>
              <Text style={estilosGerais.txtNegrito}>Antes de continuarmos, informe-nos alguns dados pessoais:</Text>
              <ScrollView style={estilosGerais.modalInputs}>
                <KeyboardAvoidingView style={styles.dadosView}>
                  <Text style={estilosGerais.modalText}>Nome:</Text>
                  <View style={estilosGerais.inputContainer }>
                    <AntDesign name="user" size={20} color="#e36317"  height={'70%'} style={estilosGerais.icon}/>
                    <TextInput 
                      style={estilosGerais.modalInputs}
                      placeholder="Digite seu nome:"
                      autoCapitalize="words"
                      cursorColor={'#E46216'}
                      onChangeText={setNome}
                      value={nome}
                      autoFocus={true}
                    />
                  </View>

                  <Text style={estilosGerais.modalText}>CPF:</Text>
                  <View style={estilosGerais.inputContainer}>
                    <Ionicons name="information-circle-outline" size={22} color="#E46216" style={estilosGerais.icon} />
                    <MaskInput
                      style={estilosGerais.modalInputs}
                      placeholder="XXX.XXX.XXX-XX"
                      keyboardType="numeric"
                      cursorColor={'#E46216'}
                      value={cpf}
                      onChangeText={setCpf}
                      maxLength={14}
                      mask={Masks.BRL_CPF}

                    />
                  </View>

                  <Text style={estilosGerais.modalText}>Telefone:</Text>
                  <View style={estilosGerais.inputContainer}>
                    <Feather name="phone" size={20} color="#E46216" style={estilosGerais.icon}/>
                    <MaskInput
                      style={estilosGerais.modalInputs}
                      placeholder="(XX) XXXXX-XXXX"
                      keyboardType="numeric"
                      cursorColor={'#E46216'}
                      value={fone}
                      onChangeText={setFone} 
                      maxLength={15}
                      mask={Masks.BRL_PHONE}
                    />
                  </View>

                  {erroM ? <Text style={styles.errorMessage}>{erroM}</Text> : null}

                  <TouchableOpacity style={estilosGerais.button} onPress={handleEnviarPress}>
                    <Text style={styles.buttonText}>Enviar</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <Parallax/>
      
      {/* ANUNCIOS INDIVIDUAIS */}
      <View style={styles.promo}>
          <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 17, marginHorizontal: 15}}>Nósz tá na área! {'\n'}Produtos limitados.</Text>
      </View>
      <View style={styles.containerFlat}>
      <FlatList
        data={produtos}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.touchable} onPress={() => handleReservar(item)}>
           
           <View style={styles.all}>
            {/* Separar cada produto em duas colunas (duas colunas por linha) */}
            <View style={styles.img}>
                <Image
                  style={styles.imagemFlat}
                  source={item.imagem ? { uri: item.imagem } : null}
                />
                <View style={styles.overlay}>
                  <Text style={styles.avaliacao}>
                    <Entypo name="star" size={20} color="#E46216" />
                    {item.avaliacao.toFixed(2)}
                  </Text>
                </View>
              </View>


              <View style={styles.descricao}>
                 <Image
                   style={styles.imagemLateralFlat}
                   source={item.logo ? { uri: item.logo } : null}
                 />
                  <View style={styles.texto}>
                    <Text style={styles.parceiroText}>
                     <Text style={{fontFamily: 'Montserrat_500Medium', fontSize: 13}}>{item.restaurante}</Text> -{'\n'}{item.nome}
                   </Text>
                 </View>
                </View>

              <View style={styles.precos}>
                      <Text style={styles.precoAntigo}>{item.precoantigo}</Text>
                      <Text style={styles.preco}><Text style={styles.rs}>R$ </Text>{item.preco}</Text>
              </View>

                </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        numColumns={2}
        style={{flex: 1, marginBottom: 100}}
      />
    </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content:{
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold'
  },
  errorMessage:{
    textAlign: 'center',
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: '7%',
    color: '#E46216',
    fontSize: 13
  },
  promo:{
    marginBottom: 15
  },
  //estilos do flat list
  containerFlat:{
    width: windowWidth,
    alignItems: 'center',
    flex: 1,
 },
  imagemFlat: {
    width: windowWidth * 0.40,
    height: windowHeight * 0.20,
    margin: '1%',
    borderRadius: 10,
    zIndex: -1
  },
  imagemLateralFlat: {
    width: windowWidth * 0.1,
    height: windowHeight * 0.05,
    margin: 10,
    borderRadius: windowWidth,
  }, 
  all:{
    width: windowWidth/2.2,
    alignItems: 'center',

  },
  img: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,

  },
  avaliacao: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    width: windowWidth/7,
    borderRadius: 10,
    zIndex: 1, 
    margin: 8,
    fontFamily: 'Montserrat_500Medium'
  },
  descricao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: windowWidth / 2.2,
  },

  texto: {
    flex: 1,
  },
  precos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: windowWidth/5,
    marginBottom: 20
  },
  precoAntigo: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#818181'
  },
  preco: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rs: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    marginRight: 4,
    color: '#00B20B'
  },

});
export default Home;