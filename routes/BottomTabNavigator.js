import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';

import Home from '../screens/HomeNosz';
import Perfil from '../screens/PerfilNosz';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [fontLoaded] = useFonts({
    Montserrat_400Regular,
  });

  if (!fontLoaded) {
    return null;
  }

  const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: '7%',
      margin: 15,
      borderRadius: 20,
      backgroundColor: '#683C15',
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <FontAwesome5 name="user-alt" size={25} color={focused ? '#D5965E' : '#fff'} />
              
              <Text style={styles.tabText}>Perfil</Text>
              
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIcon}>
              <Ionicons name="home" size={25} color={focused ? '#D5965E' : '#fff'} />
            
              <Text style={styles.tabText}>Início</Text>
             
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
  },
});

export default BottomTabNavigator;
