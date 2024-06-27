import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { Estilizar } from '../../../assets/EstilosGerais';
import Config from '../../Perfil/Config';

const ConfigParceiro = ({ navigation }) => {
    const estilosGerais = Estilizar();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigation.navigate('Onboarding');
            }
        });

        return () => unsubscribe();
    }, [auth, navigation]);


    return (
        <SafeAreaView style={[estilosGerais.container, { backgroundColor: '#171717' }]}>
            <Config navigation={navigation} backgroundColor="#171717" color="#fff" /> 
        </SafeAreaView>
    );
};

export default ConfigParceiro;
