import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import Home from '../screens/HomeNosz';
import Perfil from '../screens/Perfil/PerfilNosz';
import Historico from '../screens/Historico';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, icon }) => {
  const circleColor = focused ? '#EBEBEB' : 'transparent';
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

const BottomTabNavigator = () => {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 5,
          backgroundColor: '#f5f5f5',
          borderWidth: 1,
          borderTopWidth: 2,
          borderColor: '#683c15',
          height: windowHeight / 13,
          paddingVertical: 0,
          borderRadius: 35,
          marginHorizontal: 50,
          margin: 20,
        },
      }}
    >
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<AntDesign name="user" size={25} color={focused ? '#CD4C00' : '#151515'} />}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<AntDesign name="home" size={24} color={focused ? '#CD4C00' : '#151515'} />}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Historico"
        component={Historico}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<MaterialIcons name="history" size={24} color={focused ? '#CD4C00' : '#151515'} />}
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

export default BottomTabNavigator;