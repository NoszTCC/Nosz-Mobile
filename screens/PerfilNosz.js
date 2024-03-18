import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';

const Perfil = ({ navigation }) => {
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate('Onboarding'); 
      }
    });

    return () => unsubscribe(); 
  }, [auth, navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
       barStyle="light-content"
       translucent={true}
       backgroundColor="transparent"
       />
       <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#683C15',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Perfil;
