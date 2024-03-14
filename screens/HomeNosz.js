import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';

const Home = () => {
  const [user, setUser] = useState(null); 

  const auth = getAuth(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); 
  }, [auth]); 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
       barStyle="light-content"
       translucent={true}
       backgroundColor="transparent"
       />  
      {user ? ( 
        <Text style={styles.paragraph}>Bem-vindo, {user.email}!</Text> 
      ) : (
        <Text style={styles.paragraph}>Bem-vindo à Home!</Text>
      )}
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
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;