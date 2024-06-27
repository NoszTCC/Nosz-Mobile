import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import PerfilParceiro from '../screens/Parceiros//PerfilParceiro/PerfilParceiro';
import ParceiroNosz from '../screens//Parceiros/ParceiroNosz';
import ProdutoReservado from '../screens/Parceiros/ProdutoReservado';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, icon }) => {
  const circleColor = focused ? '#282729' : 'transparent';
  const scale = useRef(new Animated.Value(1)).current;

  Animated.timing(scale, {
    toValue: focused ? 1.3 : 1,
    duration: 800,
    useNativeDriver: true,
  }).start();

  return (
    <View style={styles.tabIcon}>
      <Animated.View style={[styles.circle, { backgroundColor: circleColor, transform: [{ scale }] }]}>
        {icon}
      </Animated.View>
    </View>
  );
};

const BottomTabParceiro = () => {

  return (
    <Tab.Navigator
      initialRouteName="Parceiro"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 5,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#683c15',
          height: windowHeight / 13,
          paddingVertical: 0,
          borderRadius: 35,
          borderTopColor: '#683c15',
          borderTopWidth: 2,
          marginHorizontal: 50,
          margin: 20,
        },
      }}
    >
      <Tab.Screen
        name="Perfil"
        component={PerfilParceiro}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<AntDesign name="user" size={25} color={focused ? '#f89a14' : '#121813'} />}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Parceiro"
        component={ParceiroNosz}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<AntDesign name="home" size={24} color={focused ? '#f89a14' : '#121813'} />}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProdutoReservado"
        component={ProdutoReservado}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<Ionicons name="fast-food-outline" size={25} color={focused ? '#f89a14' : '#121813'} />}
            />
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
  circle: {
    width: windowWidth / 7,
    height: windowHeight / 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabParceiro;
