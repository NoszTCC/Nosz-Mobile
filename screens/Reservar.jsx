import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Image, TouchableOpacity, Dimensions, Alert, Modal } from 'react-native';
import { Estilizar } from '../assets/EstilosGerais';
import { FontAwesome5, Entypo, AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Reservar = ({ produto, setProdutoSelecionado }) => {
    const estilosGerais = Estilizar();
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [reservaInfo, setReservaInfo] = useState(null);

    //FEATURE PARA SELECIONAR A QTD DE PRODUTOS
    const handleAumentarQuantidade = () => {
        setQuantidadeSelecionada(quantidadeSelecionada => Math.min(quantidadeSelecionada + 1, produto.quantidade));
    };
    const handleDiminuirQuantidade = () => {
        setQuantidadeSelecionada(quantidadeSelecionada => Math.max(quantidadeSelecionada - 1, 1));
    };

    
    const handleReservar = async () => {
        const auth = getAuth();
        const firestore = getFirestore(app);
        const user = auth.currentUser;

        if (!user) {
            Alert.alert("Erro", "Você precisa estar logado para fazer uma reserva.");
            return;
        }

        try {
            const reservaData = {
                usuario: user.displayName || user.email,
                produto: produto.nome,
                quantidade: quantidadeSelecionada,
                restaurante: produto.restaurante,
                rua: produto.rua,
                numero: produto.numero,
                pendente: true,
                imagem: produto.imagem,
                precoTotal: parseFloat(precoTotal),
                momentoReserva: Timestamp.now()
            };

            await addDoc(collection(firestore, 'reservas'), reservaData);

            const produtoRef = doc(firestore, 'produtos', produto.id);
            await updateDoc(produtoRef, {
                quantidade: produto.quantidade - quantidadeSelecionada
            });

            setReservaInfo(reservaData);
            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao fazer a reserva:", error);
            Alert.alert("Erro", "Ocorreu um erro ao fazer a reserva. Por favor, tente novamente.");
        }
    };

    const precoTotal = (produto.preco * quantidadeSelecionada).toFixed(2);

    return (
        <SafeAreaView style={estilosGerais.container}>
            <View style={styles.container}>
                
                <View style={styles.headerRes}>
                <TouchableOpacity onPress={() => setProdutoSelecionado(null)} style={{ height: 30 }}>
                        <FontAwesome5 name="arrow-left" size={25} color="#f89a14" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}> {produto.rua} {produto.numero}</Text>

                </View>

                <View style={styles.produtoContainer}>
                <Image source={{ uri: produto.imagem }} style={styles.imagemProduto} />

                    <View style={styles.detalhesProduto}>
                        <Text style={styles.nomeProduto}>{produto.nome}</Text>
                        <Text style={styles.descricao}>{produto.descricao}</Text>
                        <Text style={styles.preco}>R$ {produto.preco}</Text>

                    <View style={styles.Vparceiro}>
                         <Image style={styles.logorest} 
                         source={produto.logo ? { uri: produto.logo } : null}
                        />
                        <View style={styles.parceiroV}>
                            <Text style={styles.nomeRestaurante}>{produto.restaurante}</Text>
                            <Text style={styles.txtAvaliacao}>
                                Avaliação: <Entypo name="star" size={20} color="#E46216" />{produto.avaliacao.toFixed(2)}
                            </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.quantidade}>
                    <Text style={styles.txtQtd}> Quantidade {'\n'} Disponível:</Text>
                    <Text style={styles.txtQtd}>{produto.quantidade}</Text>
                </View>

                <View style={styles.footer}>

                    <TouchableOpacity onPress={handleDiminuirQuantidade}>
                        <Entypo name="minus" size={34} color="#E46216" />
                    </TouchableOpacity>
                    <Text style={styles.txtQtd}> {quantidadeSelecionada} </Text>
                    <TouchableOpacity onPress={handleAumentarQuantidade}>
                        <Entypo name="plus" size={34} color="#469c32" />
                    </TouchableOpacity>

                    {produto.quantidade > 0 ? (
                        <TouchableOpacity style={styles.botaoReservar} onPress={handleReservar}>
                            <Text style={styles.textoBotaoReservar}>Reservar</Text>
                            <Text style={styles.textoBotaoPreco}>R$ {precoTotal}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.botaoIndisponivel} disabled={true}>
                            <Text style={styles.textoBotaoIndisponivel}>Indisponível no momento</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                        setProdutoSelecionado(null);
                    }}>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                <AntDesign name="checkcircle" size={50} color="#479d32" alignSelf="center" left={windowWidth / 16} />
                                <Image
                                    source={require('../assets/images/nosz.png')}
                                    style={[estilosGerais.nosz, { width: windowWidth / 8, height: windowHeight / 16, left: windowWidth / 3.5, bottom: windowHeight / 90 }]}
                                />
                            </View>
                            <View>
                                <Text style={styles.modalText}>produto reservado com sucesso!</Text>
                            </View>
                            {reservaInfo && (
                                <View style={styles.reservaResumo}>
                                    <Text style={[styles.modalText, { fontSize: 20 }]}>resumo da reserva:</Text>
                                    <Text style={styles.txtData}>Usuário: {reservaInfo.usuario}</Text>
                                    <Text style={styles.txtData}>Produto: {reservaInfo.produto}</Text>
                                    <Text style={styles.txtData}>Quantidade: {reservaInfo.quantidade}</Text>
                                    <Text style={styles.txtData}>Restaurante: {reservaInfo.restaurante}</Text>
                                    <Text style={styles.txtData}>Preço Total: R$ {reservaInfo.precoTotal.toFixed(2)}</Text>
                                    <Text style={styles.txtData}>Momento da reserva: {new Date(reservaInfo.momentoReserva.seconds * 1000).toLocaleString('pt-BR')}</Text>
                                    {reservaInfo.pendente && <Text style={styles.pendenteText}>Pagamento pendente</Text>}
                                </View>
                            )}
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    setProdutoSelecionado(null);
                                }}>
                                <Text style={styles.textStyle}>fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    produtoContainer: {
        alignItems: 'center',
        marginBottom: 20,

    },
    headerRes: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#683c15',
        width: windowWidth * 1.01,
        height: windowHeight / 9,
        paddingHorizontal: 20,
        position: 'absolute'
      },
      headerText: {
        fontFamily: 'Montserrat_600SemiBold',
        color: 'white',
        marginLeft: 50,
      },
    imagemProduto: {
        width: windowWidth,
        height: windowHeight / 3.5,
        backgroundColor: '#ccc',
        zIndex: -1,
        resizeMode: 'stretch',
        marginTop: windowHeight / 9,
        marginBottom: 20 
    },
    detalhesProduto: {
        flex: 0.47,
        alignSelf: 'flex-start',
        gap: 10,
        paddingHorizontal: 15,
    },
    nomeRestaurante: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    nomeProduto: {
        fontSize: 24,
        marginBottom: 5,
        fontFamily: 'Montserrat_700Bold'
    },
    descricao: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium'
    },
    logorest:{
        width: windowWidth * 0.2,
        height: windowHeight * 0.1,
        borderRadius: windowWidth,
    },
    txtAvaliacao: {
        fontSize: 14,
        fontFamily: 'Montserrat_500Medium',
    },
    preco: {
        fontSize: 18,
        color: '#469c32',
        fontFamily: 'Montserrat_600SemiBold'
    },
    Vparceiro:{
        flexDirection: 'row',
        marginTop: 25
    },
    parceiroV: {
        margin: 10,
    },
    quantidade: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '3%',
        top: windowHeight/20,
    },
    txtQtd: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#EEE',
        paddingHorizontal: 5,
        position: 'absolute',
        bottom: windowHeight/9,
    },
    botaoReservar: {
        backgroundColor: '#e36216',
        borderRadius: 5,
        flexDirection: 'row',
        width: windowWidth / 1.30,
        height: windowHeight / 20,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    botaoIndisponivel: {
        backgroundColor: '#7A5330',
        width: windowWidth / 1.30,
        height: windowHeight / 20,
        borderRadius: 5,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textoBotaoIndisponivel: {
        color: '#FFDFCC',
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold'
    },
    textoBotaoReservar: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold'
    },
    textoBotaoPreco: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold'
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'whitesmoke',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: windowWidth / 1.20,
        padding: 40,
        height: windowHeight / 1.5,
        justifyContent: 'space-between',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 25,
        fontFamily: 'Montserrat_600SemiBold'
    },
    reservaResumo: {
        alignItems: 'flex-start',
        marginBottom: 15,
        width: windowWidth / 1.3,
        justifyContent: 'center',
    },
    button: {
        borderRadius: 15,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#f89a14',
        width: windowWidth / 3,
        height: windowHeight / 20,
        justifyContent: 'center'
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium'
    },
    txtData: {
        fontSize: 15,
        fontFamily: 'Montserrat_500Medium',
        marginBottom: 10
    },
    pendenteText: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: '#E46216',
        marginTop: 10
    }
});

export default Reservar;