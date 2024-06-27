import React, { useState, useEffect } from 'react';
import HeaderModelo from '../../components/HeaderModelo';
import { Text, SafeAreaView, StyleSheet, View, Modal, TextInput, KeyboardAvoidingView, Dimensions, ScrollView, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
import { AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import firebaseConfig, { storage } from '../../firebaseConfig';
import { Estilizar } from '../../assets/EstilosGerais';
import MaskInput, { Masks } from 'react-native-mask-input';
import * as ImagePicker from "expo-image-picker";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const ParceiroNosz = ({ navigation }) => {
  const estilosGerais = Estilizar();
  const [parceiro, setParceiro] = useState(null);
  const [files, setFiles] = useState([]);

  // STATE PARA OS DADOS DE PARCEIROS
  const [restaurante, setRestaurante] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logo, setLogo] = useState('');

  const [erroMe, setErroMe] = useState('');

  const [formPreenchido, setFormPreenchido] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  // STATE PARA OS DADOS DE NOVOS PRODUTOS
  const [showNovaProdutoModal, setShowNovaProdutoModal] = useState(false);
  const [ProdutoNome, setProdutoNome] = useState('');
  const [DataValidade, setDataValidade] = useState('');
  const [ProdutoDescricao, setProdutoDescricao] = useState('');
  const [ProdutoPreco, setProdutoPreco] = useState('');
  const [PrecoAntigo, setPrecoAntigo] = useState('');
  const [ProdutoQtd, setProdutoQtd] = useState('');
  const [ProdutoImagem, setProdutoImagem] = useState('');
  const [ProdutoImagemURL, setProdutoImagemURL] = useState('');


  const [produtos, setProdutos] = useState([]);
  const firestore = getFirestore();
  const auth = getAuth();

  //FUNÇÃO PARA MOSTRAR A MODAL (APENAS QUEM ACESSOU A PRIMEIRA VEZ)
  useEffect(() => {
    const checkParceiroData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setParceiro(currentUser);
          const qy = query(collection(firestore, 'parceiros'), where('email', '==', currentUser.email));
          const querySnapshoty = await getDocs(qy);
          if (!querySnapshoty.empty) {
            setFormPreenchido(true);
            setTimeout(() => setShowFormModal(false));
          } else {
            setShowFormModal(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar dados do parceiro:', error);
      }
    };

    checkParceiroData();
  }, [auth, formPreenchido]);

  //FUNÇÃO PARA CADASTRAR DADOS DO PARCEIRO
  async function addDadosParceiro() {
    try {
      const logoURL = await uploadLogo(logo);
      if (!logoURL) {
        throw new Error("Falha ao fazer upload do logotipo");
      }
      await addDoc(collection(firestore, 'parceiros'), {
        restaurante: restaurante,
        responsavel: responsavel,
        cnpj: cnpj,
        telefone: telefone,
        email: parceiro.email,
        logo: logoURL,
      });
      setRestaurante('');
      setResponsavel('');
      setCnpj('');
      setTelefone('');
      setLogo('');
      setFormPreenchido(true);
      await AsyncStorage.setItem('formPreenchido', 'true');
      Alert.alert('Registro!', 'Dados adicionados com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar os dados:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar os dados. Por favor, tente novamente mais tarde.');
    }
  }

  // FUNÇÃO PARA UPLOAD DO LOGO
  async function uploadLogo(uri) {
    if (!uri) return null;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `logos/${new Date().toISOString()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Erro ao fazer upload da imagem:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  }

  // FUNÇÃO PARA SELECIONAR UMA IMAGEM
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setLogo(uri);
      await uploadLogo(uri);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  //FECHAR A MODAL AO CLICAR EM SUBMIT
  const handleSubmitForm = async () => {
    setShowFormModal(false);
  };

  //TRATATIVA DE ERRO INPUTS DA MODAL
  const handleEnviarPress = () => {
    if (!restaurante || !responsavel || !cnpj || !telefone || !logo) {
      setErroMe('Por favor, preencha todos os campos.');
      return;
    }
    addDadosParceiro();
    handleSubmitForm();
  };

  const getNomeRestaurante = async (email) => {
    try {
      const querySnapshot = await getDocs(query(collection(firestore, 'parceiros'),
       where('email', '==', email)));
      if (!querySnapshot.empty)
         {
        const parceiroData = querySnapshot.docs[0].data();
        return parceiroData.restaurante;
      } 
      else {
        console.error('Parceiro não encontrado com o email:', email);
        return null;
      }
    } catch (error) 
    {console.error('Erro ao obter nome do restaurante:', error);
      return null;
    }
  };

  const getRuaRestaurante = async (email) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'parceiros'), 
        where('email', '==', email)));
        if 
        (!querySnapshot.empty) {
            const parceiroData = querySnapshot.docs[0].data();
            return parceiroData.rua;
        } 
        else {
            console.error('Parceiro não encontrado com o email:', email);
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter rua do restaurante:', error);
        return null;
    }
};

const getLogoRestaurante = async (email) => {
  try { const querySnapshot = await getDocs(query(collection(firestore, 'parceiros'), where('email', '==', email)));
    if (!querySnapshot.empty) { const parceiroData = querySnapshot.docs[0].data();
      return parceiroData.logo;
    } else 
    { console.error('Parceiro não encontrado com o email:', email);
      return null;}
  } catch 
  (error)
   { console.error('Erro ao obter logo do restaurante:', error); return null;
 }};


const getNumeroRestaurante = async (email) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'parceiros'), where('email', '==', email)));
        if (!querySnapshot.empty) {
            const parceiroData = querySnapshot.docs[0].data();
            return parceiroData.numero;
        } else {
            console.error('Parceiro não encontrado com o email:', email);
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter número do restaurante:', error);
        return null;
    }
};

  //FUNÇÃO PARA ADICIONAR UM NOVO PRODUTO

  async function uploadImagemProduto(uri) {
    if (!uri) return null;
  
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `produtos/${new Date().toISOString()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Erro ao fazer upload da imagem:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  }

  const pickProdutoImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProdutoImagem(uri);
      const url = await uploadImagemProduto(uri);
      setProdutoImagemURL(url);
    }
  };
  

  const handleAdicionarProduto = async () => {
    try {
      if (!ProdutoNome || !ProdutoDescricao || !ProdutoPreco || !DataValidade || !PrecoAntigo || !ProdutoQtd || !ProdutoImagemURL) {
        setErroMe('Por favor, preencha todos os campos');
        return;
      }
  
      const nomeRestaurante = await getNomeRestaurante(parceiro.email);
      const ruaRestaurante = await getRuaRestaurante(parceiro.email);
      const numeroRestaurante = await getNumeroRestaurante(parceiro.email);
      const logoRestaurante = await getLogoRestaurante(parceiro.email);
  
      if (!nomeRestaurante || !ruaRestaurante || !numeroRestaurante || !logoRestaurante) {
        Alert.alert('Erro', 'Não foi possível obter os detalhes do restaurante. Por favor, tente novamente mais tarde.');
        return;
      }
  
      const novoProduto = {
        nome: ProdutoNome,
        descricao: ProdutoDescricao,
        preco: ProdutoPreco,
        restaurante: nomeRestaurante,
        quantidade: ProdutoQtd,
        avaliacao: 0,
        dtvalidade: DataValidade,
        precoantigo: PrecoAntigo,
        rua: ruaRestaurante,
        numero: numeroRestaurante,
        imagem: ProdutoImagemURL,
        logo: logoRestaurante
      };
  
      await addDoc(collection(firestore, 'produtos'), novoProduto);
  
      setProdutoNome('');
      setProdutoDescricao('');
      setProdutoPreco('');
      setDataValidade('');
      setPrecoAntigo('');
      setProdutoImagem('');
      setProdutoImagemURL('');
  
      setShowNovaProdutoModal(false);
  
      Alert.alert('Sucesso', 'Novo produto adicionado com sucesso.');
    } catch (error) {
      console.error('Erro ao adicionar novo produto:', error.message);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o novo produto. Por favor, tente novamente mais tarde.');
    }
  };
  
  

  function deleteProduto(id) {
    if (!id) {
      console.error('ID inválido:', id);
      return;
    }
  
    deleteDoc(doc(collection(firestore, 'produtos'), id))
      .catch((error) => {
        console.error('Erro ao excluir produto:', error.message);
      });
  }

  const handleEnviarNovoProduto = async () => {
    setShowNovaProdutoModal(false);
  };


useEffect(() => {
  const fetchRestauranteLogado = async () => {
    try {
      if (parceiro && formPreenchido) {
        const nomeRestaurante = await getNomeRestaurante(parceiro.email);
        const q = query(collection(firestore, 'produtos'), where('restaurante', '==', nomeRestaurante));
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const produtos = [];
          querySnapshot.forEach((doc) => {
            produtos.push({ ...doc.data(), id: doc.id });
          });
          setProdutos(produtos);
        });
        return () => unsubscribe();
      }
    } catch (error) {
      console.error('Erro ao buscar restaurante logado:', error);
    }
  };

  fetchRestauranteLogado();
}, [firestore, parceiro, formPreenchido]);

  
  return (
    <SafeAreaView style={styles.container}>
    <HeaderModelo />

    <View style={styles.vProdutos}>
      {produtos.length === 0 ? (
        <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: 15, color: 'white' }}> Tudo vazio por aqui ainda... {'\n'} <Text style={{ fontFamily: 'Montserrat_600SemiBold', color: 'whitesmoke' }}>Adicione um novo produto em {'\n'}</Text> <Text style={{ fontFamily: 'Montserrat_800ExtraBold', color: '#e36216', fontSize: 25 }}>N</Text><Text style={{ fontFamily: 'Montserrat_700Bold', color: '#f89a14', fontSize: 22 }}>ósz</Text></Text>
      ) : (
        //FLATLIST DOS PRODUTOS CADASTRADOS
        <FlatList
        data={produtos}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AlterarProduto', {
                id: item.id,
                nome: item.nome,
                descricao: item.descricao,
                preco: item.preco,
                precoantigo: item.precoantigo,
                dtvalidade: item.dtvalidade,
                quantidade: item.quantidade,
                imagem: item.imagem
              })}
              style={{ marginTop: 40 }}>
              <View style={styles.itemRow}>
                {item.imagem && (
                  <Image
                    source={{ uri: item.imagem }}
                    style={styles.itemImagem}
                  />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                  <Text style={styles.itemDescricao}>{item.descricao}</Text>
                  <View style={styles.precoIcon}>
                    <Text style={styles.itemPreco}>R$ {item.preco}</Text>
                    <Text style={styles.itemData}>{item.dtvalidade}</Text>
                    <TouchableOpacity onPress={() => deleteProduto(item.id)}>
                      <Feather name="trash" size={24} color="#e36317" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        vertical={true}
        contentContainerStyle={styles.flatListContent}
      />      
      )}


      <TouchableOpacity style={styles.adicionarProdutoButton} onPress={() => setShowNovaProdutoModal(true)}>
        <Text style={styles.adicionarProdutoButtonText}>Adicionar Novo Produto</Text>
      </TouchableOpacity>
    </View>

    {/* Modal para adicionar um novo produto */}
    <Modal visible={showNovaProdutoModal} animationType="slide">
  <SafeAreaView style={styles.modalContainer}>
    <View style={styles.modalHeader}>
      <TouchableOpacity onPress={() => setShowNovaProdutoModal(false)}>
        <AntDesign name="close" size={54} color="#e36317" />
      </TouchableOpacity>
      <Text style={estilosGerais.modalHeaderText}>
        Adicionar produto em {'\n'}
        <Text style={{ color: "#e36317", fontSize: 44 }}>N</Text>
        <Text style={{ color: "#f89a14", fontSize: 40 }}>ósz</Text>
      </Text>
    </View>
    <KeyboardAvoidingView style={[estilosGerais.circulo, {top: '25%',zIndex: -1}]} behavior="padding"></KeyboardAvoidingView>
    <KeyboardAvoidingView style={styles.modalBody}>
      <KeyboardAvoidingView style={estilosGerais.linhasInput}>
        <TextInput
          style={[estilosGerais.modalInputs, { color: '#f5f5f5', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor:'transparent', width: 240 }]}
          placeholder="Nome do Produto"
          value={ProdutoNome}
          placeholderTextColor="#cacaca" 
          onChangeText={setProdutoNome}
          cursorColor={'#E46216'}
        />
        <TextInput
          style={[estilosGerais.modalInputs, {color: '#f5f5f5',  fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor:'transparent', width: 120 }]}
          placeholder="Quantidade"
          value={ProdutoQtd}
          placeholderTextColor="#cacaca" 
          onChangeText={setProdutoQtd}
          cursorColor={'#E46216'}
          keyboardType="numeric"
          textAlign='center'
        />
      </KeyboardAvoidingView>
      <TextInput
        style={[estilosGerais.modalInputs, { color: '#f5f5f5', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor:'transparent' }]}
        placeholder="Descrição"
        value={ProdutoDescricao}
        placeholderTextColor="#cacaca" 
        onChangeText={setProdutoDescricao}
        cursorColor={'#E46216'}
      />
      <KeyboardAvoidingView style={estilosGerais.linhasInput}>
        <TextInput
          style={[estilosGerais.modalInputs, { color: '#f5f5f5', fontSize: 17, borderBottomColor: '#683c15', borderBottomWidth: 2 , backgroundColor:'transparent', width: 110}]}
          placeholder="Preço App"
          value={ProdutoPreco}
          placeholderTextColor="#cacaca" 
          cursorColor={'#E46216'}
          onChangeText={setProdutoPreco}
          keyboardType="numeric"
          textAlign='center'
        />
        <TextInput
          style={[estilosGerais.modalInputs, { color: '#f5f5f5', fontSize: 17, borderBottomColor: '#683c15', borderBottomWidth: 2 , backgroundColor:'transparent', width: 140 }]}
          placeholder="Preço Antigo"
          value={PrecoAntigo}
          placeholderTextColor="#cacaca" 
          cursorColor={'#E46216'}
          onChangeText={setPrecoAntigo}
          keyboardType="numeric"
          textAlign='center'
        />
        <MaskInput
          style={[estilosGerais.modalInputs, { color: '#f5f5f5', fontSize: 17, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor:'transparent', width: 110 }]}
          placeholder="Validade:"
          value={DataValidade}
          placeholderTextColor="#cacaca" 
          onChangeText={setDataValidade}
          cursorColor={'#E46216'}
          mask={Masks.DATE_DDMMYYYY}
          textAlign='center'
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={[estilosGerais.circulo, {zIndex: -1, left: '-44%', top: '60%'}]} behavior="padding"></KeyboardAvoidingView>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={pickProdutoImage}>
          <Ionicons name="image-outline" size={40} color="#f89a14" />
        </TouchableOpacity>
        {ProdutoImagem ? (
          <Image source={{ uri: ProdutoImagem }} style={{ width: windowWidth/2.5, height: windowHeight/5, marginTop: 10, borderRadius: windowWidth / 36 }} />
        ) : (
          <Text style={{ color: '#cacaca' }}>Selecionar Imagem</Text>
        )}
      </View>

      <Text style={[estilosGerais.errorMessage, {fontSize: 15}]}>{erroMe}</Text>
    </KeyboardAvoidingView>
    <TouchableOpacity style={[estilosGerais.button, {height: 50, borderRadius: 16, backgroundColor: '#f89a14', alignSelf: 'center', width: '100%'}]} onPress={handleAdicionarProduto}>
      <Text style={styles.modalButtonText}>Adicionar Produto</Text>
    </TouchableOpacity>
  </SafeAreaView>
</Modal>


            {/* MODAL PARA OBTER DADOS IMPORTANTES */}
            <Modal visible={showFormModal} transparent={true} animationType="slide">
        <View style={styles.modalContainerInformacoes}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informe seus dados empresariais</Text>
            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Restaurante:</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="restaurant-outline" size={24} color="#B7773D" />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do restaurante"
                    autoCapitalize="words"
                    onChangeText={setRestaurante}
                    value={restaurante}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Responsável:</Text>
                <View style={styles.inputContainer}>
                  <AntDesign name="user" size={24} color="#B7773D" />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do responsável"
                    autoCapitalize="words"
                    onChangeText={setResponsavel}
                    value={responsavel}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CNPJ:</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="information-circle-outline" size={24} color="#B7773D" />
                  <MaskInput
                    style={styles.input}
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    keyboardType="numeric"
                    value={cnpj}
                    onChangeText={setCnpj}
                    maxLength={18}
                    mask={Masks.BRL_CNPJ}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone:</Text>
                <View style={styles.inputContainer}>
                  <Feather name="phone" size={24} color="#B7773D" />
                  <MaskInput
                    style={styles.input}
                    placeholder="(XX) XXXXX-XXXX"
                    keyboardType="phone-pad"
                    value={telefone}
                    onChangeText={setTelefone}
                    maxLength={15}
                    mask={Masks.BRL_PHONE}
                  />
                </View>
              </View>

                <View style={[styles.inputContainer, {
                  flexDirection: 'column-reverse',
                  borderBottomWidth: 0,
                  backgroundColor: '#E9E9E9',
                  borderRadius: 30, justifyContent: 'center',
                  width: windowWidth * 0.6,
                  height: windowHeight * 0.3,
                  marginBottom: 20,
                  alignSelf: 'center'
                  }]}>
                  <TouchableOpacity style={[styles.button, {backgroundColor: '#542F0D'}]} onPress={pickImage}>
                    <Text style={styles.buttonText}>Selecionar Logo</Text>
                  </TouchableOpacity>
                  {logo ? (
                    <Image source={{ uri: logo }} style={styles.logoImage} />
                  ) : null}
                </View>

              {erroMe ? <Text style={styles.errorMessage}>{erroMe}</Text> : null}
              <TouchableOpacity style={styles.button} onPress={handleEnviarPress}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainerInformacoes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    flex: 0.6
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Montserrat_800ExtraBold'
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
    fontFamily: 'Montserrat_700Bold'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    height: 40,
    fontFamily: 'Montserrat_400Regular'
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0B731C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoImage: {
    width: windowWidth * 0.35,
    height: windowHeight * 0.175,
    borderRadius: windowWidth * 1,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  vProdutos: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: windowHeight/30
  },
  adicionarProdutoButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#479c33',
    borderRadius: 5,
  },
  adicionarProdutoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    backgroundColor: '#171717'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
  },
  flatListContent: {
    flexGrow: 1,
    width: 370
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemContainer:{
    borderBottomColor: '#683c15',
    borderBottomWidth: 2,
  },
  itemNome: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  itemImagem: {
    width: windowWidth/5,
    height: windowHeight/12,
    margin: 10,
    resizeMode: 'contain',
    borderRadius: 15
  },
  itemDescricao: {
    fontSize: 16,
    color: '#B2B2B2',
    marginBottom: 5,
    fontFamily: 'Montserrat_500Medium'
  },
  itemPreco: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#479d32',
    alignSelf: 'flex-end',
    marginRight: 10
  },
  itemData:{
    fontSize: 16,
    color: '#B2B2B2',
    marginBottom: 5,
    fontFamily: 'Montserrat_500Medium'
  },
  precoIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});


export default ParceiroNosz;