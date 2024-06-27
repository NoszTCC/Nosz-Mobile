import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Dimensions } from 'react-native';
import { app } from '../../firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons'; 
import { Estilizar } from '../../assets/EstilosGerais';
import MaskInput, { Masks } from 'react-native-mask-input';

const firestore = getFirestore(app); 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AlterarProduto({ navigation, route }) {
    const estilosGerais = Estilizar();

    const [ProdutoNome, setProdutoNome] = useState('');
    const [DataValidade, setDataValidade] = useState('');
    const [ProdutoDescricao, setProdutoDescricao] = useState('');
    const [ProdutoPreco, setProdutoPreco] = useState('');
    const [PrecoAntigo, setPrecoAntigo] = useState('');
    const [ProdutoQtd, setProdutoQtd] = useState('');

    function altProduto() {
        const id = route.params?.id; 

        if (!id) {  
            Alert.alert("Erro", "ID do registro não encontrado. Por favor, tente novamente."); 
            return;
        }

        updateDoc(doc(collection(firestore, "produtos"), id), {
            nome: ProdutoNome,
            dtvalidade: DataValidade,
            descricao: ProdutoDescricao,
            preco: ProdutoPreco,
            precoantigo: PrecoAntigo,
            quantidade: Number(ProdutoQtd)
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
        if (route.params) {
            setProdutoNome(route.params.nome || '');
            setDataValidade(route.params.dtvalidade || '');
            setProdutoDescricao(route.params.descricao || '');
            setProdutoPreco(route.params.preco || '');
            setPrecoAntigo(route.params.precoantigo || '');
            setProdutoQtd(route.params.quantidade ? route.params.quantidade.toString() : '');
        }
    }, [route.params]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={54} color="#479c33" />
                    </TouchableOpacity>
                    <Text style={estilosGerais.modalHeaderText}>Alterar produto em {'\n'}<Text style={{ color: "#e36317", fontSize: 44 }}>N</Text><Text style={{ color: "#f89a14", fontSize: 40 }}>ósz</Text></Text>
                </View>

                <KeyboardAvoidingView style={[estilosGerais.circulo, { top: '55%', zIndex: -1 }]} behavior="padding"></KeyboardAvoidingView>
                <KeyboardAvoidingView style={styles.modalBody}>
                    <View style={{marginHorizontal: 20}}>
                    <KeyboardAvoidingView style={estilosGerais.linhasInput}>
                        <TextInput
                            style={[estilosGerais.modalInputs, { color: 'whitesmoke', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor: 'transparent', width: 260 }]}
                            placeholder="Nome do Produto"
                            value={ProdutoNome}
                            placeholderTextColor="#cacaca"
                            onChangeText={setProdutoNome}
                            cursorColor={'#E46216'}
                        />
                        <TextInput
                            style={[estilosGerais.modalInputs, { color: 'whitesmoke', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor: 'transparent', width: 100 }]}
                            placeholder="Quantidade"
                            value={ProdutoQtd}
                            placeholderTextColor="#cacaca"
                            onChangeText={(text) => setProdutoQtd(text)}
                            cursorColor={'#E46216'}
                            keyboardType="decimal-pad"
                            textAlign='center'
                        />
                    </KeyboardAvoidingView>
                    <TextInput
                        style={[estilosGerais.modalInputs, { color: 'whitesmoke', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor: 'transparent' }]}
                        placeholder="Descrição"
                        value={ProdutoDescricao}
                        placeholderTextColor="#cacaca"
                        onChangeText={setProdutoDescricao}
                        cursorColor={'#E46216'}
                    />
                    <KeyboardAvoidingView style={estilosGerais.linhasInput}>
                        <TextInput
                            style={[estilosGerais.modalInputs, { color: 'whitesmoke', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor: 'transparent', width: 110 }]}
                            placeholder="Preço App"
                            value={ProdutoPreco}
                            placeholderTextColor="#cacaca"
                            cursorColor={'#E46216'}
                            onChangeText={setProdutoPreco}
                            keyboardType="numeric"
                            textAlign='center'
                        />
                        <TextInput
                            style={[estilosGerais.modalInputs, { color: 'whitesmoke', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor: 'transparent', width: 110 }]}
                            placeholder="Preço Antigo"
                            value={PrecoAntigo}
                            placeholderTextColor="#cacaca"
                            cursorColor={'#E46216'}
                            onChangeText={setPrecoAntigo}
                            keyboardType="numeric"
                            textAlign='center'
                        />
                        <MaskInput
                            style={[estilosGerais.modalInputs, { color: 'whitesmoke', fontSize: 17, marginBottom: 35, borderBottomColor: '#683c15', borderBottomWidth: 2, backgroundColor: 'transparent', width: 110 }]}
                            placeholder="Validade:"
                            value={DataValidade}
                            placeholderTextColor="#cacaca"
                            onChangeText={setDataValidade}
                            cursorColor={'#E46216'}
                            mask={Masks.DATE_DDMMYYYY}
                            textAlign='center'
                        />
                    </KeyboardAvoidingView>
                    </View>
                    <KeyboardAvoidingView style={[estilosGerais.circulo, { zIndex: -1, left: '-47%', top: '40%' }]} behavior="padding"></KeyboardAvoidingView>
                </KeyboardAvoidingView>
                <TouchableOpacity style={styles.button} onPress={altProduto}>
                    <Text style={estilosGerais.buttonText}>Alterar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717'
    },
    content: {
        alignItems: 'center',
        padding: 20,
        flexDirection: 'column'
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20
    },
    goBackButton:{
        right: windowWidth/10
    },
    input: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 10,
        width: '80%'
    },
    button: {
        backgroundColor: '#E46216',
        height: 40,
        width: '90%',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        top: windowHeight/3.5
    },
    modalBody:{
        top: windowHeight/3.5,
        width: windowWidth
    }
});