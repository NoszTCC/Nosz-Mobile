import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import HomeNosz from "../screens/HomeNosz";
import Perfil from "../screens/PerfilNosz";
import Login from "../screens/LoginNosz";
import Cadastro from "../screens/CadastroNosz";
import Onboarding from '../screens/Onboarding/Onboarding';

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
      <Stack.Screen name="Perfil" component ={Perfil} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Inicio">
        {() => (
          <BottomTabNavigator>
            <HomeNosz />
          </BottomTabNavigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
};
