import React, { useState, useEffect } from 'react';
import { StyleSheet } from "react-native";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

export const estilizar = () => {

    let [ fontsLoaded, fontError ] = useFonts(( Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black ));

    useEffect(() => {

        async function loadResourcesAndDataAsync() {

            try { SplashScreen.preventAutoHideAsync(); } 
            catch (e) { console.warn(e); } 
            finally { await SplashScreen.hideAsync(); }

        }

        if ( !fontsLoaded && !fontError ) { loadResourcesAndDataAsync(); }

    }, [fontsLoaded]);

    return StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        },
        vheader: {
          flexDirection: 'row',
          justifyContent: 'space-between'
        },
        voltar: {
          width: 34,
          height: 40,
          margin: 10
        },
        nosz: {
          width: 170,
          height: 170,
          alignSelf: 'flex-end',
          zIndex: -1
        },
        t1: {
          fontFamily: 'Montserrat_600SemiBold',
          textAlign: 'left',
          fontSize: 35,
          fontWeight: 'bold',
          color: '#000',
          alignSelf: 'flex-start'
        },
        t2: {
          fontFamily: 'Montserrat_700Bold',
          textAlign: 'left',
          fontSize: 35,
          alignSelf: 'flex-start',
          color: '#e36216'
        },
        txt: {
            fontFamily: 'Montserrat_600SemiBold',
            textAlign: 'left',
            fontSize: 18,
            color: '#565656',
            alignSelf: 'flex-start'
        },
        input: {
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            color: '#131313',
            height: 35,
            fontSize: 19,
            margin: 20
        },
        content: {
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: '#ecf0f1',
            margin: 10,
            padding: 18,
            width: '100%',
            height: '100%'
        },
        buttonview: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

}