import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Dimensions, FlatList, RefreshControl, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import Header from '../components/HeaderModelo';
import { FontAwesome } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Historico = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [avaliarModalVisible, setAvaliarModalVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);

    //PUXAR TODOS OS DADOS DA RESERVA DE ACORCO COM CADA USUÁRIO LOGADO
    const fetchReservas = async () => {
        const auth = getAuth();
        const firestore = getFirestore(app);
        const user = auth.currentUser;

        if (user) {
            const reservasRef = collection(firestore, 'reservas');
            const q = query(reservasRef, where('usuario', '==', user.email));
            const querySnapshot = await getDocs(q);
            let reservasList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            reservasList = reservasList.sort((a, b) => b.momentoReserva.seconds - a.momentoReserva.seconds);

            setReservas(reservasList);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    //ATUALIZAR RESERVAS
    const onRefresh = () => {
        setRefreshing(true);
        fetchReservas();
    };

    const handleAvaliarProduto = async (reserva) => {
        const firestore = getFirestore(app);

        const produtosRef = collection(firestore, 'produtos');
        const produtoQuery = query(produtosRef, where('nome', '==', reserva.produto));
        const produtoSnapshot = await getDocs(produtoQuery);

        if (!produtoSnapshot.empty) {
            const produtoDoc = produtoSnapshot.docs[0];
            const produtoId = produtoDoc.id;
            setSelectedReserva({ ...reserva, produtoId });
            setSelectedRating(reserva.avaliacao || 0);
            setAvaliarModalVisible(true);
        } else {
            console.error('Produto não encontrado:', reserva.produto);
            return;
        }
    };

    const handleEnviarAvaliacao = async () => {
        if (selectedRating === 0) {
            alert('Por favor, selecione uma avaliação.');
            return;
        }

        const firestore = getFirestore(app);
        const reservaRef = doc(firestore, 'reservas', selectedReserva.id);

        const produtoId = selectedReserva.produtoId;
        const produtoRef = doc(firestore, 'produtos', produtoId);

        await updateDoc(reservaRef, {
            avaliado: true,
            avaliacao: selectedRating
        });

        const produtoDoc = await getDoc(produtoRef);
        if (produtoDoc.exists()) {
            const produtoData = produtoDoc.data();
            const totalAvaliacoes = produtoData.totalAvaliacoes || 0;
            const somaAvaliacoes = produtoData.somaAvaliacoes || 0;

            const novaTotalAvaliacoes = totalAvaliacoes + 1;
            const novaSomaAvaliacoes = somaAvaliacoes + selectedRating;
            const novaMediaAvaliacoes = novaSomaAvaliacoes / novaTotalAvaliacoes;

            await updateDoc(produtoRef, {
                totalAvaliacoes: novaTotalAvaliacoes,
                somaAvaliacoes: novaSomaAvaliacoes,
                avaliacao: novaMediaAvaliacoes > 5 ? 5 : novaMediaAvaliacoes
            });
        }

        setAvaliarModalVisible(false);
        await fetchReservas();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.reservaItem} onPress={() => { setSelectedReserva(item); setModalVisible(true); }}>
            <View style={styles.circulo2}></View>
            <Text style={styles.reservaText}>Usuário: {item.usuario}</Text>
            <Text style={styles.reservaText}>Produto: {item.produto}</Text>
            <Text style={styles.reservaText}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.reservaText}>Restaurante: {item.restaurante}</Text>
            <Text style={styles.reservaText}>Preço Total: R$ {item.precoTotal.toFixed(2)}</Text>
            <Text style={styles.reservaText}>Momento da Reserva: {new Date(item.momentoReserva.seconds * 1000).toLocaleString()}</Text>
            {item.pendente && <Text style={styles.pendenteText}>Pagamento pendente, vá buscar sua encomenda em: {item.rua} {item.numero}</Text>}
            {!item.pendente && !item.avaliado && (
                <TouchableOpacity style={styles.avaliarButton} onPress={() => handleAvaliarProduto(item)}>
                    <Text style={styles.avaliarButtonText}>Avaliar Produto</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header />
                <View style={styles.content}>
                    <Text style={styles.h1}>Carregando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.content}>
                <Text style={styles.h1}>Histórico de Reservas</Text>
                {reservas.length === 0 ? (
                    <View>
                        <Text style={styles.semReservas}>Nenhuma reserva encontrada.</Text>
                        <TouchableOpacity style={styles.reloadButton} onPress={onRefresh}>
                            <Text style={styles.reloadButtonText}>Recarregar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={reservas}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#f89a14"
                                colors={['#f89a14']}
                            />
                        }
                    />
                )}
            </View>

            {selectedReserva && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../assets/images/nosz.png')}
                                    style={[styles.nosz, { width: windowWidth / 8, height: windowHeight / 16 }]}
                                />
                                <Text style={[styles.modalText, {color: '#683C15'}]}>detalhes{'\n'}da reserva</Text>
                            </View>
                            <ScrollView style={styles.reservaResumo}>
                                {selectedReserva.pendente && (
                                    <Text style={[styles.txtData, {color: 'red'}]}>Pagamento pendente, vá buscar sua encomenda em: {selectedReserva.rua} {selectedReserva.numero}</Text>
                                )}
                                <Text style={styles.txtData}>Usuário: {selectedReserva.usuario}</Text>
                                <Text style={styles.txtData}>Produto: {selectedReserva.produto}</Text>
                                <Text style={styles.txtData}>Quantidade: {selectedReserva.quantidade}</Text>
                                <Text style={styles.txtData}>Restaurante: {selectedReserva.restaurante}</Text>
                                <Text style={styles.txtData}>Preço Total: R$ {selectedReserva.precoTotal.toFixed(2)}</Text>
                                <Text style={styles.txtData}>Momento da Reserva: {new Date(selectedReserva.momentoReserva.seconds * 1000).toLocaleString('pt-BR')}</Text>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.textStyle}>Fechar</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}

            {/* MODAL PARA AVALIAR PRODUTOS */}
            {avaliarModalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={avaliarModalVisible}
                    onRequestClose={() => setAvaliarModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <View style={[styles.modalContent, {height: windowHeight/3}]}>
                            <Text style={[styles.modalText, {color: '#683C15'}]}>Avalie o produto{'\n'}de 1 a 5 estrelas </Text>
                            <View style={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => setSelectedRating(star)}
                                        style={styles.starIcon}
                                    >
                                        <FontAwesome
                                            name={star <= selectedRating ? 'star' : 'star-o'}
                                            size={32}
                                            color="#ffd700"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose, {width: windowWidth/1.8}]}
                                onPress={handleEnviarAvaliacao}
                            >
                                <Text style={styles.textStyle}>Enviar Avaliação</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        backgroundColor: '#f5f5f5',
        margin: windowWidth / 20,
        flex: 0.9,
    },
    h1: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 20,
        color: '#683c15',
        marginBottom: 10
    },
    semReservas: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        color: '#683c15',
        marginTop: 20
    },
    reservaItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        width: '100%',
    },
    reservaText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#171717'
    },
    pendenteText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: 'red',
        marginBottom: 15
    },
    circulo2: {
        position: 'absolute',
        bottom: windowHeight * 0.05,
        left: windowWidth * 0.8,
        width: windowWidth * 0.2,
        height: windowWidth * 0.2,
        borderRadius: windowWidth * 0.1,
        backgroundColor: '#683c15',
        zIndex: -1,
    },
    flatListContent: {
        paddingBottom: 20
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
        elevation: 15,
        width: windowWidth / 1.3,
        padding: 40,
        height: windowHeight / 2,
        justifyContent: 'space-between'
    },
    modalText: {
        fontSize: 25,
        fontFamily: 'Montserrat_600SemiBold'
    },
    reservaResumo: {
        width: windowWidth/1.4,
        marginTop: 40
    },
    button: {
        borderRadius: 15,
        padding: 10,
        elevation: 3,
    },
    buttonClose: {
        backgroundColor: '#479d32',
        width: windowWidth / 3,
        height: windowHeight / 20,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 50
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
    reloadButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#683c15',
        borderRadius: 5,
        alignItems: 'center',
    },
    reloadButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold'
    },
    avaliarButton: {
        marginTop: 10,
        backgroundColor: '#469c32',
        padding: 10,
        borderRadius: 5
    },
    avaliarButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 20
    },
    starIcon: {
        marginHorizontal: 5
    }
});

export default Historico;
