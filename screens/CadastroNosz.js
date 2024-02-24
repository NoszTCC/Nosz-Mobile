import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

export default function Cadastro({navigation}) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync(); // Evitar que a tela de splash seja ocultada automaticamente
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync(); // Ocultar a tela de splash quando os recursos forem carregados
      }
    }

    if (!fontsLoaded) {
      loadResourcesAndDataAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.paragraph}>
            Cadastro
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    fontFamily: 'Montserrat_900Black',
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
