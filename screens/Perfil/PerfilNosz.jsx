import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Estilizar } from '../../assets/EstilosGerais';

const Perfil = ({ navigation }) => {
  const estilosGerais = Estilizar();
  
  const auth = getAuth();
  const firestore = getFirestore();
  //DADOS PESSOAIS
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [telefoneUsuario, setTelefoneUsuario] = useState('');
  //ENDEREÇO USUÁRIO
  const [ruaUsuario, setRuaUsuario] = useState('');
  const [numeroUsuario, setNumeroUsuario] = useState('');
  const [bairroUsuario, setBairroUsuario] = useState('');
  const [cidadeUsuario, setCidadeUsuario] = useState('');
  const [estadoUsuario, setEstadoUsuario] = useState('');

  const [usuarioDoc, setUsuarioDoc] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  // FUNÇÃO PRA BUSCAR DADOS DO USUÁRIO
  const fetchDadosUsuario = async () => {
    try {
      const userEmail = user ? user.email : '';
      if (userEmail) {
        const q = query(collection(firestore, 'users'), where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setNomeUsuario(doc.data().nome);
          setCpfUsuario(doc.data().cpf);
          setTelefoneUsuario(doc.data().telefone);

          setRuaUsuario(doc.data().rua);
          setNumeroUsuario(doc.data().numero);
          setBairroUsuario(doc.data().bairro);
          setCidadeUsuario(doc.data().cidade);
          setEstadoUsuario(doc.data().estado);

          setUsuarioDoc(doc);
        });
      } else {
        console.log("O usuário não está autenticado ou o email está ausente.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  useEffect(() => {
    fetchDadosUsuario();
  }, [auth, firestore, user]);
  
  
  useEffect(() => {
    if (usuarioDoc) {
      setNomeUsuario(usuarioDoc.data().nome);
      setCpfUsuario(usuarioDoc.data().cpf);
      setTelefoneUsuario(usuarioDoc.data().telefone);

      setRuaUsuario(usuarioDoc.data().rua);
      setNumeroUsuario(usuarioDoc.data().numero);
      setBairroUsuario(usuarioDoc.data().bairro);
      setCidadeUsuario(usuarioDoc.data().cidade);
      setEstadoUsuario(usuarioDoc.data().estado);
    }
  }, [usuarioDoc]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDadosUsuario();
    });

    return unsubscribe;
  }, [navigation]);

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };
  
  return (
    <View style={styles.container}>
      <View style={estilosGerais.header}>
        <Image
          source={require('../../assets/images/avatar.png')}
          style={estilosGerais.avatar}
        />
        <Text style={[estilosGerais.userName, {fontFamily: 'Montserrat_700Bold',}]}>{nomeUsuario}</Text>
      </View>
      
      <View style={estilosGerais.menu}>
        {/* NAVIGATE TO NOTIFICACOES */}
        {/* <TouchableOpacity onPress={() => navigateTo('Notificacoes')} style={estilosGerais.menuItem}>
          <View style={estilosGerais.group}>
            <FontAwesome5 name="bell" size={24} color="#673d15" margin={8} />
            <View style={estilosGerais.menuItemText}>
              <Text style={[estilosGerais.menuText, {color: '#673d15', fontFamily: 'Montserrat_600SemiBold'}]}>Notificações</Text>
              <Text style={[estilosGerais.menuDescription, {fontFamily: 'Montserrat_500Medium',}]}>Central das minhas notificações</Text>
            </View>
          </View>
          <View style={styles.icon}>
            <FontAwesome5 name="angle-right" size={24} color="#333"/>
          </View>
        </TouchableOpacity> */}

        {/* NAVIGATE TO FAVORITOS */}
        {/* <TouchableOpacity onPress={() => navigateTo('Favoritos')} style={estilosGerais.menuItem}>
          <View style={estilosGerais.group}>
            <FontAwesome5 name="heart" size={24} color="#673d15" margin={8}/>
            <View style={estilosGerais.menuItemText}>
              <Text style={[estilosGerais.menuText, {color: '#673d15', fontFamily: 'Montserrat_600SemiBold'}]}>Favoritos</Text>
              <Text style={[estilosGerais.menuDescription, {fontFamily: 'Montserrat_500Medium',}]}>Meus produtos favoritos</Text>
            </View>
          </View>
          <FontAwesome5 name="angle-right" size={24} color="#333" />
        </TouchableOpacity> */}

        {/* NAVIGATE TO ENDERECO */}
        <TouchableOpacity 
          onPress={() => {
            if (usuarioDoc) {
              navigation.navigate('Endereco', { 
                user: {
                  id: usuarioDoc.id,
                  rua: ruaUsuario,
                  numero: numeroUsuario,
                  bairro: bairroUsuario,
                  cidade: cidadeUsuario,
                  estado: estadoUsuario
                } 
              });
            } else {
              Alert.alert('Erro', 'Documento do usuário não encontrado.');
            }
          }}
          style={estilosGerais.menuItem}
        >          
        <View style={estilosGerais.group}>
            <FontAwesome5 name="map-marked-alt" size={24} color="#673d15" margin={8}/>
            <View style={estilosGerais.menuItemText}>
              <Text style={[estilosGerais.menuText, {color: '#673d15', fontFamily: 'Montserrat_600SemiBold'}]}>Endereços</Text>
              <Text style={[estilosGerais.menuDescription, {fontFamily: 'Montserrat_500Medium',}]}>Minha localização</Text>
            </View>
          </View>
          <FontAwesome5 name="angle-right" size={24} color="#333" />
        </TouchableOpacity>

        {/* NAVIGATE TO DADOS CONTA */}
        <TouchableOpacity 
          onPress={() => {
            if (usuarioDoc) {
              navigation.navigate('DadosConta', { 
                user: {
                  id: usuarioDoc.id,
                  nome: nomeUsuario, 
                  cpf: cpfUsuario, 
                  telefone: telefoneUsuario 
              }});
            } else {
              Alert.alert('Erro', 'Documento do usuário não encontrado.');
            }
          }}
          style={estilosGerais.menuItem}
        >
          <View style={estilosGerais.group}>
            <FontAwesome5 name="user-alt" size={24} color="#673d15" margin={8}/>
            <View style={estilosGerais.menuItemText}>
              <Text style={[estilosGerais.menuText, {color: '#673d15', fontFamily: 'Montserrat_600SemiBold'}]}>Dados da Conta</Text>
              <Text style={[estilosGerais.menuDescription, {fontFamily: 'Montserrat_500Medium',}]}>Minhas informações da conta</Text>
            </View>
          </View>
          <FontAwesome5 name="angle-right" size={24} color="#333" />
        </TouchableOpacity>

        {/* NAVIGATE TO CONFIGURACOES */}
        <TouchableOpacity onPress={() => navigation.navigate('Configuracoes')} style={estilosGerais.menuItem}>
          <View style={estilosGerais.group}>
            <FontAwesome5 name="cog" size={24} color="#673d15" marginLeft={8} />
            <View style={estilosGerais.menuItemText}>
              <Text style={[estilosGerais.menuText, {color: '#673d15', marginLeft: 10, fontFamily: 'Montserrat_600SemiBold'}]}>Configurações</Text>
            </View>
          </View>
          <FontAwesome5 name="angle-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default Perfil;