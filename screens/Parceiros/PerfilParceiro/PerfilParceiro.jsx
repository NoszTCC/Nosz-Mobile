import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Estilizar } from '../../../assets/EstilosGerais';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const PerfilParceiro = ({ navigation }) => {

  const estilosGerais = Estilizar();

  const auth = getAuth();
  const firestore = getFirestore();
  //DADOS EMPRESARIAIS
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefoneParceiro, setTelefoneParceiro] = useState('');

  //ENDEREÇO
  const [ruaParceiro, setRuaParceiro] = useState('');
  const [numeroParceiro, setNumeroParceiro] = useState('');
  const [bairroParceiro, setBairroParceiro] = useState('');
  const [cidadeParceiro, setCidadeParceiro] = useState('');
  const [estadoParceiro, setEstadoParceiro] = useState('');
  const [logo, setLogo] = useState();
  const [parceiroDoc, setParceiroDoc] = useState(null);
  const [parceiro, setParceiro] = useState(auth.currentUser);

  const fetchDadosUsuario = async () => {
    try {
      const parceiroEmail = parceiro ? parceiro.email : '';
      if (parceiroEmail) {
        const q = query(collection(firestore, 'parceiros'), where('email', '==', parceiroEmail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setNomeResponsavel(doc.data().responsavel);
          setNomeEstabelecimento(doc.data().restaurante);
          setCnpj(doc.data().cnpj);
          setTelefoneParceiro(doc.data().telefone);
          setRuaParceiro(doc.data().rua);
          setNumeroParceiro(doc.data().numero);
          setBairroParceiro(doc.data().bairro);
          setCidadeParceiro(doc.data().cidade);
          setEstadoParceiro(doc.data().estado);
          
          setLogo(doc.data().logo);
          setParceiroDoc(doc);
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
  }, [auth, firestore, parceiro]);
  
  
  useEffect(() => {
    if (parceiroDoc) {
      setNomeResponsavel(parceiroDoc.data().responsavel);
      setNomeEstabelecimento(parceiroDoc.data().restaurante);
      setCnpj(parceiroDoc.data().cnpj);
      setTelefoneParceiro(parceiroDoc.data().telefone);
    }
  }, [parceiroDoc]);

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
        source={{ uri: logo }}
        style={estilosGerais.logo}
      />
      <Text style={[estilosGerais.userName, {fontFamily: 'Montserrat_700Bold', color: '#f5f5f5'}]}>{nomeEstabelecimento}</Text>      
      </View>

      <View style={estilosGerais.menu}>
        {/* NAVIGATE TO NOTIFICACOES */}
        <TouchableOpacity 
          onPress={() => {
            if (parceiroDoc) {
              navigation.navigate('DadosParceiro', { 
                parceiro: {
                  id: parceiroDoc.id,
                  responsavel: nomeResponsavel, 
                  restaurante: nomeEstabelecimento, 
                  cnpj: cnpj,
                  telefone: telefoneParceiro 
              }});
            } else {
              Alert.alert('Erro', 'Documento do usuário não encontrado.');
            }
          }}
          style={estilosGerais.menuItem}
        >          
        <View style={estilosGerais.group}>
            <FontAwesome5 name="store" size={20} color="#f99b14" margin={8} />
            <View style={estilosGerais.menuItemText}>
              <Text style={estilosGerais.menuText}>Meus dados</Text>
              <Text style={[estilosGerais.menuDescription, {fontFamily: 'Montserrat_500Medium'}]}>Informações do meu estabelecimento</Text>
            </View>
          </View>
          <View style={styles.icon}>
            <FontAwesome5 name="angle-right" size={24} color="#333" />
          </View>
        </TouchableOpacity>

        {/* NAVIGATE TO FAVORITOS */}
        <TouchableOpacity 
          onPress={() => {
            if (parceiroDoc) {
              navigation.navigate('EnderecoParceiro', { 
                parceiro: {
                  id: parceiroDoc.id,
                  rua: ruaParceiro,
                  numero: numeroParceiro,
                  bairro: bairroParceiro,
                  cidade: cidadeParceiro,
                  estado: estadoParceiro
                } 
              });
            } else {
              Alert.alert('Erro', 'Documento do usuário não encontrado.');
            }
          }}
          style={estilosGerais.menuItem}

          >
          <View style={estilosGerais.group}>
            <FontAwesome5 name="map-marked-alt" size={23} color="#f99b14" margin={8} />
            <View style={estilosGerais.menuItemText}>
              <Text style={estilosGerais.menuText}>Endereço</Text>
              <Text style={[estilosGerais.menuDescription, {fontFamily: 'Montserrat_500Medium'}]}>Local do meu estabelecimento</Text>
            </View>
          </View>
          <FontAwesome5 name="angle-right" size={24} color="#333" />
        </TouchableOpacity>


           {/* NAVIGATE TO CONFIGURACOES */}
           <TouchableOpacity onPress={() => navigation.navigate('ConfiguracoesParceiro')} style={estilosGerais.menuItem}>
          <View style={estilosGerais.group}>
            <FontAwesome5 name="cog" size={24} color="#f99b14" marginLeft={8} />
            <View style={estilosGerais.menuItemText}>
              <Text style={[estilosGerais.menuText, { marginLeft: 12 }]}>Configurações</Text>
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
    backgroundColor: '#171717'
  },
});

export default PerfilParceiro;