import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, StatusBar, View, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

const Buscar = () => {

    const [fontLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_600SemiBold,
      });
    
      if (!fontLoaded) {
        return null;
      }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
       barStyle="light-content"
       translucent={true}
       backgroundColor="transparent"
       />  
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscar em Nósz"
            cursorColor={'#E46216'}
            autocapitalize="none"
          />
          <TouchableOpacity style={styles.botaoPesquisar}>
            <Text style={styles.botaoPesquisarText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <FlatList/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF5E5',
  },
  header: {
    backgroundColor: '#683C15',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 25,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
    marginLeft: 20,
    fontFamily: 'Montserrat_400Regular'
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
  },
  botaoPesquisar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 10
  },
  botaoPesquisarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold'
  },
});

export default Buscar;
