import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, FlatList, Animated, StatusBar } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Paginador from "./Paginador";
import NextButton from "./NextButton";
import OnboardingItem from "./OnboardingItem";
import slides from './slides';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding() {

    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const viewableItemChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1){
            slidesRef.current.scrollToIndex({ index: currentIndex + 1});
        } else {
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        async function checkParceiro() {
            try {
                const isParceiro = await AsyncStorage.getItem('isParceiro');
                if (isParceiro === 'true') {
                    navigation.navigate('HomeParceiro');
                } else {
                    navigation.navigate('Inicio');
                }
            } catch (error) {
                console.error('Erro ao verificar se é parceiro:', error);
            }
        }
    
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                checkParceiro();
            }
        });
    
        return unsubscribe;
    }, []);

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
            
        }

        if (!fontsLoaded) {
            loadResourcesAndDataAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <StatusBar 
            barStyle="light-content"
            translucent={true}
            backgroundColor="transparent"
            /> 
            <View style={{flex: 3}}>
            <FlatList data={slides} renderItem={({ item }) => <OnboardingItem item={item} />} 
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX }}}], {
              useNativeDriver: false,   
            })}
            scrollEventThrottle={10}
            onViewableItemsChanged={viewableItemChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            ref={slidesRef}
            />
            </View>
            <Paginador data={slides} scrollX={scrollX}/>
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1 ) * (100 / slides.length)}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', 
    }
});
