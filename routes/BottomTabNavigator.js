import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated } from 'react-native';
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
  const TabBarIcon = ({ focused, icon, label }) => {
    const translateY = focused ? -20 : 0;

    return (
      <View style={styles.tabIcon}>
        <Animated.View style={[styles.circle, { transform: [{ translateY }] }]}>
          {icon}
        </Animated.View>
        <Animated.Text style={[styles.tabText, { color: focused ? '#e36216' : '#fff', transform: [{ translateY }] }]}>
          {label}
        </Animated.Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#683C15',
          borderRadius: 15,
          height: 65,
          margin: 10,
          paddingVertical: 0
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={<FontAwesome5 name="user-alt" size={25} color="#fff" />}
              label="Perfil"
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
              icon={<Ionicons name="home" size={25} color="#fff" />}
              label="Início"
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
    backgroundColor: '#e36216',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 5,
  },
});

export default BottomTabNavigator;