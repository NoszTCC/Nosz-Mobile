import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

import Login from "../screens/Auth/LoginNosz";
import Cadastro from "../screens/Auth/CadastroNosz";
import Onboarding from '../screens/Onboarding/Onboarding';
import Home from '../screens/HomeNosz';

const Stack = createNativeStackNavigator()

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName='Onboarding'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Inicio">
        {() => (
          <BottomTabNavigator>
            <Home />
          </BottomTabNavigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
};