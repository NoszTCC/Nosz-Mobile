import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, signOut, deleteUser } from '@firebase/auth';
import { Estilizar } from '../../assets/EstilosGerais';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalConfirm from '../../components/ModalConfirm';

const Config = ({ navigation, backgroundColor, color }) => {
  const estilosGerais = Estilizar();
  const auth = getAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate('Onboarding'); 
      }
    });

    return () => unsubscribe(); 
  }, [auth, navigation]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        await AsyncStorage.clear();
        navigation.navigate('Onboarding'); 
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error.message);
    }
  };

  return (
    <SafeAreaView style={[estilosGerais.container, { justifyContent: 'flex-start', backgroundColor }]}>
      <View style={[styles.vheader, {backgroundColor}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={24} color="#479c33" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color}]}>CONFIGURAÇÕES</Text>
      </View>

      <View style={styles.body}>
        
        <TouchableOpacity style={styles.menuItem}>
        <Text style={[estilosGerais.menuText, styles.logout, {color}]}>Sobre esta versão</Text>
        <Text style={[estilosGerais.menuText, {color}, {marginLeft: -30}]}>1.0</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
        <MaterialIcons name="logout" size={24} color="#f89a14" />
          <Text style={[estilosGerais.menuText, styles.logout]}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.menuItem}>
        <Feather name="trash" size={24} color="#e36317" />
          <Text style={[estilosGerais.menuText, styles.deleteAccount]}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>

      <ModalConfirm
        visible={showLogoutModal}
        setVisible={setShowLogoutModal}
        action={confirmLogout}
        message="Tem certeza que deseja sair?"
      />

      <ModalConfirm
        visible={showDeleteAccountModal}
        setVisible={setShowDeleteAccountModal}
        action={confirmDeleteAccount}
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  vheader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 45,
    paddingHorizontal: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    color: '#131313',
    fontFamily: 'Montserrat_700Bold'
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 30,
    width: '100%'
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 15,
    width: '100%',
    gap: 10
  },
  menuText: {
    fontSize: 16,
    color: '#171717',
    fontFamily: 'Montserrat_500Medium'
  },
  logout: {
    color: '#f89a14',
    width: '100%'
  },
  deleteAccount: {
    color: '#e36317',
    width: '100%'
  },
  backButton: {
    marginRight: 20,
  }
});

export default Config;