import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Dimensions, FlatList, RefreshControl, TouchableOpacity, Modal, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Header from '../../components/HeaderModelo';
import { FontAwesome } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProdutoReservado = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [totalGanho, setTotalGanho] = useState(0);

    const fetchReservas = async () => {
        const auth = getAuth();
        const firestore = getFirestore(app);
        const user = auth.currentUser;

        if (user) {
            const parceirosRef = collection(firestore, 'parceiros');
            const parceiroQuery = query(parceirosRef, where('email', '==', user.email));
            const parceiroSnapshot = await getDocs(parceiroQuery);
            const parceiroData = parceiroSnapshot.docs.map(doc => doc.data());

            if (parceiroData.length > 0) {
                const parceiro = parceiroData[0];
                const restauranteParceiro = parceiro.restaurante;

                const reservasRef = collection(firestore, 'reservas');
                const reservasQuery = query(reservasRef, where('restaurante', '==', restauranteParceiro));
                const reservasSnapshot = await getDocs(reservasQuery);
                const reservasData = reservasSnapshot.docs.map(doc => {
                    return { id: doc.id, ...doc.data() };
                });

                setReservas(reservasData);

                const total = reservasData.reduce((acc, reserva) => {
                    if (!reserva.pendente) {
                        return acc + reserva.precoTotal;
                    }
                    return acc;
                }, 0);

                setTotalGanho(total);
            } else {
                console.log("Nenhum dado de parceiro encontrado.");
            }
        }

        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchReservas();
    };

    const handleFinalizarReserva = async () => {
        if (selectedReserva && selectedReserva.id) {
            const firestore = getFirestore(app);
            const reservaRef = doc(firestore, 'reservas', selectedReserva.id);

            await updateDoc(reservaRef, {
                pendente: false
            });

            setSelectedReserva(prevState => ({ ...prevState, pendente: false }));

            setReservas(prevReservas => prevReservas.map(reserva => 
                reserva.id === selectedReserva.id ? { ...reserva, pendente: false } : reserva
            ));

            setModalVisible(false);
        }
    };

    const renderItem = ({ item }) => {
        const iconColor = item.pendente ? '#479c33' : '#171717';

        return (
            <TouchableOpacity style={styles.reservaItem} onPress={() => { setSelectedReserva(item); setModalVisible(true); }}>
                <FontAwesome name="bookmark" size={40} color={iconColor} style={styles.iconmarck}/>    
                <Text style={styles.reservaText}>Usuário: <Text style={{color: '#E86F29'}}>{item.usuario}</Text></Text>
                <Text style={styles.reservaText}>Produto: <Text style={{color: '#E86F29'}}>{item.produto}</Text></Text>
                <Text style={styles.reservaText}>Quantidade: <Text style={{color: '#E86F29'}}>{item.quantidade}</Text></Text>
                <Text style={styles.reservaText}>Restaurante: <Text style={{color: '#E86F29'}}>{item.restaurante}</Text></Text>
                <Text style={styles.reservaText}>Preço Total: R$ <Text style={{color: '#E86F29'}}>{item.precoTotal.toFixed(2)}</Text></Text>
                <Text style={styles.reservaText}>Momento da Reserva: <Text style={{color: '#E86F29'}}>{new Date(item.momentoReserva.seconds * 1000).toLocaleString()}</Text></Text>
                {item.pendente && <Text style={styles.pendenteText}>Pagamento pendente</Text>}
            </TouchableOpacity>
        );
    };

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
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total Ganho: <Text style={{ color: '#479c33' }}> R$ {totalGanho.toFixed(2)}</Text></Text>
                </View>
                {reservas.length === 0 ? (
                    <View>
                        <Text style={styles.semReservas}>Nenhuma reserva encontrada.</Text>
                        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                            <Text style={styles.refreshTxt}>Recarregar</Text>
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
                            <Text style={[styles.modalText, {color: '#479c33', fontSize: 20}]}>DETALHES DA RESERVA</Text>
                            <Text style={styles.modalText}>Usuário: <Text style={{color: '#E86F29'}}>{selectedReserva.usuario}</Text></Text>
                            <Text style={styles.modalText}>Produto: <Text style={{color: '#E86F29'}}>{selectedReserva.produto}</Text></Text>
                            <Text style={styles.modalText}>Quantidade: <Text style={{color: '#E86F29'}}>{selectedReserva.quantidade}</Text></Text>
                            <Text style={styles.modalText}>Restaurante: <Text style={{color: '#E86F29'}}>{selectedReserva.restaurante}</Text></Text>
                            <Text style={styles.modalText}>Preço Total: R$ <Text style={{color: '#E86F29'}}>{selectedReserva.precoTotal.toFixed(2)}</Text></Text>
                            <Text style={styles.modalText}>Momento da Reserva: <Text style={{color: '#E86F29'}}>{new Date(selectedReserva.momentoReserva.seconds * 1000).toLocaleString('pt-BR')}</Text></Text>
                            {selectedReserva.pendente && <Text style={styles.pendenteText}>Pagamento pendente</Text>}
                            {selectedReserva.pendente && (
                                <TouchableOpacity
                                    style={[styles.button, {backgroundColor: '#479c33'}]}
                                    onPress={handleFinalizarReserva}
                                >
                                    <Text style={styles.textStyle}>finalizar reserva</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>fechar</Text>
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
        backgroundColor: '#171717',
    },
    content: {
        backgroundColor: '#171717',
        margin: windowWidth / 20,
        flex: 0.9,
    },
    h1: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 20,
        color: 'white',
        marginBottom: 10
    },
    totalText:{
        color: 'white',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15
    },
    semReservas: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        color: 'white',
        marginTop: 20
    },
    reservaItem: {
        backgroundColor: '#EEEEEE',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        width: '100%',
    },
    reservaText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 14,
        color: '#171717',
        margin: 2
    },
    pendenteText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 14,
        color: 'red',
        marginTop: 5,
        alignSelf: 'center'
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
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: windowWidth / 1.2,
        padding: 30,
        height: windowHeight / 1.5,
        justifyContent: 'space-between',
    },
    modalText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#171717'
    },
    button: {
        borderRadius: 10,
        elevation: 2,
        width: windowWidth / 1.5,
        height: windowHeight / 20,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#f89a14',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat_500Medium'
    },
    refreshBtn:{
        alignItems:'center', justifyContent: 'center',
        width: windowWidth * 0.9,
        height: windowHeight * 0.05,
        backgroundColor: 'green',
        marginTop: 19,
        borderRadius: windowWidth * 0.035
    },
    refreshTxt:{
        color: 'whitesmoke',
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center'

    },iconmarck:{
        position:'absolute',
        bottom: windowHeight * 0.05,
        left: windowWidth * 0.8,
        width: windowWidth * 0.2,
        height: windowWidth * 0.19,
    }
});

export default ProdutoReservado;