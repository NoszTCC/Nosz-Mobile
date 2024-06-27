import { useEffect } from 'react';
import { StyleSheet, Dimensions  } from "react-native";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const Estilizar = () => {

    let [ fontsLoaded, fontError ] = useFonts({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black });

    useEffect(() => {

        async function loadResourcesAndDataAsync() {
            try { 
                await SplashScreen.preventAutoHideAsync(); 
            } catch (e) { 
                console.warn(e); 
            } finally { 
                await SplashScreen.hideAsync(); 
            }
        }

        if ( !fontsLoaded && !fontError ) { 
            loadResourcesAndDataAsync(); 
        }

    }, [fontsLoaded]);

    return StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        },
        txtNegrito:{
          fontSize: 16,
          marginBottom: 20,
          fontFamily: 'Montserrat_700Bold',
          color: '#787878'
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
        circulo: {
          position: 'absolute',
          backgroundColor: '#0EAA00',
          borderRadius: 360,
          width: '150%',
          height: '285%',
          right: '34%',
          bottom: '-290%',
          zIndex: -1,
        },
        buttonLogin: {
          backgroundColor: '#E46216',
          alignSelf: 'center',
          width: '75%',
          paddingVertical: 15,
          paddingHorizontal: 30,
          margin: 13,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 10 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 5,
        },
        buttonTextLogin: {
          fontFamily: 'Montserrat_600SemiBold',
          color: '#f5f5f5',
          fontSize: 16,
          textAlign: 'center',
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
          fontFamily: 'Montserrat_800ExtraBold',
          textAlign: 'left',
          fontSize: 35,
          alignSelf: 'flex-start',
          color: '#479d32'
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
            margin: 15
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
            justifyContent: 'center',
            alignItems: 'center'
        },
        vinputs:{
          flex: 1, 
          justifyContent: 'flex-end',
          marginBottom: 10
        },
        errorMessage: {
          color: '#e36216',
          textAlign: 'center',
          fontFamily: 'Montserrat_600SemiBold',
          margin: 5,
          fontSize: 13
        },
        checkboxContainer: {
          alignItems: 'center',
          marginVertical: 10,
        },
        checkboxWrapper: {
          flexDirection: 'row',
          justifyContent: 'center',
        },
        parcerin:{
          alignSelf: 'center',
          fontFamily: "Montserrat_600SemiBold", color: '#f89a14', textDecorationLine: 'none', fontSize: 15
        },
        buttonText: {
          fontFamily: 'Montserrat_600SemiBold',
          color: '#f5f5f5',
          fontSize: 18,
          textAlign: 'center',
        },
        modalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
        },
        modalText: {
          fontSize: 16,
          fontFamily: 'Montserrat_700Bold',
          color: '#787878'
        },
        modalContent: {
          backgroundColor: '#f5f5f5',
          borderRadius: 10,
          padding: 20,
          margin: 40,
          marginTop: windowHeight / 25,
          height: windowHeight / 1.8,
          borderWidth: 2,
          borderColor: '#693d15',
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalInputs:{
          backgroundColor:'#fff',
          color: '#131313',
          fontSize: 14,
          padding: 4,
          borderRadius: 5,
          fontFamily: 'Montserrat_500Medium',
          width: '100%',
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor:'#fff',
          margin: 10,
        },
        button: {
          backgroundColor: '#469c32',
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          width: windowWidth / 1.9,
          height: windowHeight / 20,
          margin: 10
        },
          icon: {
          marginRight: 10,
        },
        group:{
          flexDirection: 'row',
        },
        menu: {
          marginTop: 20,
        },
        menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 10,
          padding: 15,
          borderBottomColor: '#DADADA',
          borderBottomWidth: 1,
        },
        menuItemText: {
          marginLeft: 10,
        },
        menuText: {
          fontSize: 16,
          color: '#469c33',
          fontFamily: 'Montserrat_600SemiBold'
        },
        menuDescription: {
          fontSize: 14,
          color: '#666',
        },
        userName: {
          fontSize: 18,
          color: '#333',
        },
        avatar: {
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 10,
        },
        logo:{
          width: windowWidth * 0.18,
          height: windowHeight * 0.09,
          borderRadius: windowWidth * 0.2,
          marginRight: 20
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          padding: 10,
          marginTop: 25
        },
        vheaderr: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          paddingVertical: 45,
          paddingHorizontal: 20,
        },
        headerTitle: {
          flex: 1,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#131313',
        },
        body: {
          paddingTop: 20,
          paddingHorizontal: 20,
          width: '100%'
        },
        inputGroup: {
          marginBottom: 20,
        },
        inputLabel: {
          fontSize: 16,
          marginBottom: 5,
          color: '#333',
          fontFamily: 'Montserrat_600SemiBold'
        },
        botao: {
          backgroundColor: '#F15A29',
          height: 40,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        txtBotao: {
          color: '#fff',
          fontSize: 18,
        },
        txtBotaoEnd: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          fontFamily: 'Montserrat_600SemiBold'
        },
        ruaNumero: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          alignItems: 'center',
        },
        cidadeEstado:{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
          marginTop: 10,
          alignItems: 'center',
        },
        inputPrimario: {
          width: 220, 
          height: 40,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 20,
          marginRight: 10,
        },
        inputSecundario: {
          width: 54,
          height: 40,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 5,
        },
        inputGroupEnd: {
          marginBottom: 10,
        },
        inputEnd: {
          height: 40,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
          fontFamily: 'Montserrat_400Regular'
        },
        linhasInput:{
          flexDirection: 'row',
          justifyContent: 'space-between'
        },
        modalHeaderText: {
          fontSize: 22,
          fontFamily: 'Montserrat_800ExtraBold',
          marginLeft: 10,
          color: '#735439',
        },
    });

}
