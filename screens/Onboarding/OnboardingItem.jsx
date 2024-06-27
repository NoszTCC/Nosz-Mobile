import React from 'react';
import {View, Text, StyleSheet, Image, useWindowDimensions} from "react-native";

export default function OnboardingItem({ item }) {
    const {width} = useWindowDimensions(); 

    return(
        <View style={[styles.container, {width}]}>
            <Image source={item.imagem} style={[styles.image, {width, resizeMode: 'contain' }]}/>
            <View style={{ flex: 0.3}}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.descricao}>{item.descricao}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    image:{
        flex: 0.7,
        justifyContent: 'center'
    }, 
    titulo:{
        fontFamily: 'Montserrat_800ExtraBold',
        fontSize: 28,
        marginBottom: 10,
        color: '#E46216',
        textAlign: 'center'
    }, 
    descricao:{
        fontFamily: 'Montserrat_400Regular',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 64
    }
});
